ObjectUtilClass = function() {
}
ObjectUtilClass.prototype.toArray = function(data, fn) {
	var list = [];
	for (var i = 0; i < data.length; i++) {
		list[i] = new fn(data[i]);
	}
	return list;
}
ObjectUtilClass.prototype.toObject = function(data, fn) {
	if ($.isArray(data)) {
		var list = [];
		for (var i = 0; i < data.length; i++) {
			list[i] = new fn(data[i]);
		}
		return list;
	} else {
		return new fn(data);
	}
}
var ObjectUtil = new ObjectUtilClass();

function HttpResponse(code, msg) {
	this.status = code;
	this.statusText = msg;
}
HttpResponse.prototype.is2xxSuccessful = function() {
	return '2' === this.status[0];
}
function Principal(data) {
	$.extend(true, this, data);
}
Principal.prototype.hasAnyAuthority = function(authorities) {
	for (i = 0; i < authorities.length; i++) {
		var role = _.findWhere(this.authorities, {
			authority : authorities[i]
		});
		if (role != null) {
			return true;
		}
	}
	return false;

}
Principal.prototype.isCSR = function() {
	if (this.authorities == null)
		return false;

	var role = _.findWhere(this.authorities, {
		authority : 'CSR'
	});
	return (role != null);
}
Principal.prototype.isOwner = function() {
	if (this.authorities == null)
		return false;

	var role = _.findWhere(this.authorities, {
		authority : 'Owner'
	});
	return (role != null);
}
Principal.prototype.isPropertyOwner = function() {
	if (this.authorities == null)
		return false;

	var role = _.findWhere(this.authorities, {
		authority : 'PropertyOwner'
	});
	return (role != null);
}
Principal.prototype.isDelegate = function() {
	if (this.authorities == null)
		return false;

	var role = _.findWhere(this.authorities, {
		authority : 'Delegate'
	});
	return (role != null);
}
Principal.prototype.isPropertyDelegate = function() {
	if (this.authorities == null)
		return false;

	var role = _.findWhere(this.authorities, {
		authority : 'PropertyDelegate'
	});
	return (role != null);
}

function User(data) {
	$.extend(true, this, data);
	if (this.lastLoginDate) {
		this.lastLoginDate = new Date(this.lastLoginDate);
	}
}
User.prototype.getFullName = function() {
	if (this.firstName != null && this.lastName != null) {
		return this.firstName + ' ' + this.lastName;
	}else if(this.firstName != null){
		return this.firstName;
	}else if(this.lastName != null){
		return this.lastName;
	}
	return null;
}
User.prototype.isRegistrationPending = function() {
	return this.status.value === 'Pending';
}
User.prototype.isCSR = function() {
	return this.hasAuthority('CSR');
}
User.prototype.isUserOnly = function() {
	return this.hasAuthority('User', true);
}
User.prototype.isOwner = function() {
	return this.hasAuthority('Owner');
}
User.prototype.isPropertyOwner = function() {
	return this.hasAuthority('PropertyOwner');
}
User.prototype.isPropertyManager = function() {
	return this.hasAuthority('PropertyManager');
}
User.prototype.isDelegate = function() {
	return this.hasAuthority('Delegate');
}
User.prototype.isPropertyDelegate = function() {
	return this.hasAuthority('PropertyDelegate');
}
User.prototype.hasPMPAccess = function() {
	return (this.isPropertyOwner() || this.isPropertyDelegate() || this.isPropertyManager());
}

User.prototype.hasAuthority = function(authorityName, onlyflag) {
	if (this.authorities == null)
		return false;
	if (onlyflag == true) {
		if (this.authorities.length > 1) {
			return false;
		}
	}
	var role = _.findWhere(this.authorities, {
		authority : authorityName
	});
	return (role != null);
}
User.prototype.hasAnyAuthority = function(authorities) {
	for (i = 0; i < authorities.length; i++) {
		var role = _.findWhere(this.authorities, {
			authority : authorities[i]
		});
		if (role != null) {
			return true;
		}
	}
	return false;
}
User.prototype.isPending = function() {
	return this.status.value == 'Pending';
}
User.prototype.isDeactivated = function() {
	return this.status.value == 'Deactivate';
}
app.service('IAMService', [ '$q', '$http', '$rootScope','$filter', $$IAMService ]);
function $$IAMService($q, $http, $rootScope,$filter) {
	this.registerUser = function(user) {
		console.log(":::::::::inside IAMService registerUser() method::::::", user);
		iamRegisterUserCSR = true;
		var deferred = $q.defer();
		$http.post(IAMConfig.apiEndpoint + '/user/register', user).success(function(data) {
			deferred.resolve(new User(data));
		}).error(function(error, code) {
			console.log('err ', error, error.statusText, code);
			deferred.reject(new HttpResponse(code, error.statusText));
		});
		return deferred.promise;
	};
	this.addUser = function(user) {
		var deferred = $q.defer();
		$http.post('/Registration', user).success(function(data) {
			deferred.resolve(new User(data));
			$rootScope.newDelegateType = (user.defaultProfile).toString();
			$rootScope.editPopupData = user;
		}).error(function(error, code) {
			console.log('err ', error, error.statusText, code);
			deferred.reject(new HttpResponse(code, error.message));
		});
		return deferred.promise;

	};

	this.updateUserNameAndContact = function(userId, userform) {
		var deferred = $q.defer();
		$http.post(IAMConfig.apiEndpoint + '/user/' + userId, userform).success(function(data) {
			deferred.resolve(new User(data));
		}).error(function(error, code) {
			deferred.reject(new HttpResponse(code, error.statusText));
		});
		return deferred.promise;

	};

	this.updateUserRole = function(userId, userform) {
		var deferred = $q.defer();
		$http.put(IAMConfig.apiEndpoint + '/user/' + userId + '/update', userform).success(function(data) {
			deferred.resolve(new User(data));
		}).error(function(error, code) {
			deferred.reject(new HttpResponse(code, error.statusText));
		});
		return deferred.promise;
	};

	this.requestForChangeEmail = function(userId, requestform) {
		var deferred = $q.defer();
		$http.put(IAMConfig.apiEndpoint + '/user/' + userId + '/requestForChangeEmail', requestform).success(
				function(data) {
					deferred.resolve(new User(data));
				}).error(function(error, code) {
			deferred.reject(new HttpResponse(code, error.statusText == 'changeemail.error.email.registered' ? 'Email address entered is already registered with us. Please try with another email address.' : error.statusText));
		});
		return deferred.promise;

	};
	this.changePassword = function(userId, requestform) {
		var deferred = $q.defer();
		$http.post(IAMConfig.apiEndpoint + '/user/' + userId + '/changePassword', requestform).success(function(data) {
			deferred.resolve(new User(data));
		}).error(function(error, code) {
			deferred.reject(new HttpResponse(code, error.statusText == 'changepassword.error.oldpassword.invalid' ? 'Current password does not match. Please try again.' : error.statusText));
		});
		return deferred.promise;

	};
	this.resendRegistrationMail = function(userId) {
		var deferred = $q.defer();
		$http.get(IAMConfig.apiEndpoint + '/registration/' + userId + '/resendRegistrationMail').success(
				function(data) {
					deferred.resolve(true);
				}).error(function(error, code) {
			deferred.reject(new HttpResponse(code, error.statusText));
		});
		return deferred.promise;

	};
	this.resetPassword = function(userId, userName) {
		var userView = {
			username : userName
		};
		var deferred = $q.defer();
		$http.post(IAMConfig.apiEndpoint + '/forgotPassword', userView).success(function(data) {
			deferred.resolve(true);
		}).error(function(error, code) {
			deferred.reject(new HttpResponse(code, error.statusText));
		});
		return deferred.promise;

	};
	this.deactivateUser = function(userId, requestform) {
		var deferred = $q.defer();
		$http.put(IAMConfig.apiEndpoint + '/user/' + userId + '/deactivate', requestform).success(function(data) {
			deferred.resolve(new User(data));
		}).error(function(error, code) {
			deferred.reject(new HttpResponse(code, error.statusText));
		});
		return deferred.promise;

	};
	this.findUserByStatusAndRole = function(requestParam) {
		var deferred = $q.defer();
		$http.get(IAMConfig.apiEndpoint + '/user', {
			params : requestParam
		}).success(function(data) {
			deferred.resolve(ObjectUtil.toArray(data, User));
		}).error(function(error, code) {
			deferred.reject(new HttpResponse(code, error.statusText));
		});
		return deferred.promise;

	};
	this.findUserById = function(userId) {
		var deferred = $q.defer();
		$http.get(IAMConfig.apiEndpoint + '/user/' + userId).success(function(data) {
			deferred.resolve(new User(data));
		}).error(function(error, code) {
			deferred.reject(new HttpResponse(code, error.statusText));
		});
		return deferred.promise;
	};
	this.getAuditEventsList = function(userId) {
		console.log("getAuditEventsList ", userId);
		var deferred = $q.defer();
		httpPromise = $http.get(IAMConfig.apiEndpoint + '/user/'
				+ userId + "/events?" + $.param({
					startTime : $filter('date')((Date.today().addMonths(-12)), "yyyy-MM-dd'T'HH:mm:ssZ", 'UTC-5'),
					endTime :$filter('date')((Date.today()), "yyyy-MM-dd'T'HH:mm:ssZ", 'UTC-5')
				}));

		httpPromise.then(function(response) {
			console.log("getAuditEventsList------------", response.data);
			/*var _usage = new PremisesElectricityUsage(response.data);
			console.log("getBillingEnergyUsage------------", _usage);*/
			
			$.each(response.data,function(index,event){
				if((event.createdBy != event.userId) && (event.createdBy != 1)){
					event.modifiedByCSR = true;
				}
				else{
					event.modifiedByCSR = false;
				}
			});
			$rootScope.accountEventData = response.data;
			deferred.resolve(response.data);
		}, function(error) {
			console.error(error);
		});

		return deferred.promise;
	};
};
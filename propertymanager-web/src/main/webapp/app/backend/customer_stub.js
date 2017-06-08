function Customer(data) {
	$.extend(true, this, data);
	this.primaryEmail = this.getPrimaryEmail();
	this.primaryPhone = this.getPrimaryPhone();
}
Customer.prototype.getPrimaryEmail = function() {
	var _c = null;
	_.each(this.customerEmails, function(value, index) {
		if (value.standard) {
			_c = value;
			return;
		}
	});
	return _c;
}
Customer.prototype.getPrimaryPhone = function() {
	var _c = null;
	_.each(this.phoneNumbers, function(value, index) {
		if (value.standard) {
			_c = value;
			return;
		}
	});
	return _c;
}
Customer.prototype.hasWebAccount = function() {
	return (this.user != null);
}
Customer.prototype.hasPMPAccess = function() {
	pmpAccess = false;
	if (this.user && this.user.authorities) {
		for (i = 0; i < this.user.authorities.length; i++) {
			if (this.user.authorities[i].roleCode == 'PropertyOwner') {
				pmpAccess = true;
			}
		}
	}
	return pmpAccess;
}

Customer.prototype.hasMyLHAccess = function() {
	myLHAccess = false;
	if (this.user && this.user.authorities) {
		for (i = 0; i < this.user.authorities.length; i++) {
			if (this.user.authorities[i].roleCode == 'Owner') {
				myLHAccess = true;
			}
		}
	}
	return myLHAccess;
}

Customer.prototype.hasPrimaryEmail = function() {
	return (this.primaryEmail != null && this.primaryEmail.emailAddress != null);
}
Customer.prototype.isPMPAccessAllowed = function(counts) {
	// return (counts.unitCount > 1 && counts.tenantCount > 0);
	return (counts.propertyCnt > 0);
}

app.factory('CustomerRepo', [ '$resource', function($resource) {
	return $resource('/Customer/:customerId', {
		customerId : '@id'
	});
} ]);

app.service('CustomerService', [ '$q', '$http', '$resource', '$rootScope', $$CustomerService ]);
function $$CustomerService($q, $http, $resource, $rootScope) {
	this.findCustomerUnitAndTenantCounts = function(customerId) {
		if (customerId == null) {
			customerId = "-1";
		}
		var _endPoint = $http.get('/Customer/' + customerId + '/unitAndTenantCounts');
		var result = $q.defer();
		$q.all([ _endPoint ]).then(function(responses) {
			console.log('Unit & Tenant Counts ', responses[0].data);
			if (responses[0].data == null) {
				result.resolve(0);
			} else {
				result.resolve(responses[0].data);
			}
		}, function(error) {
			console.warn("findCustomerUnitAndTenantCounts error::", error);
			if (error.status == 404) {
				result.reject('Failed to fetch the unit and tenant counts for the given customer id.');
			}
		});
		return result.promise;
	};

	this.findCustomerById = function(customerId) {
		if (customerId == null) {
			customerId = "-1";
		}
		var _endPoint = $http.get('/Customer/' + customerId);
		var result = $q.defer();
		$q.all([ _endPoint ]).then(function(responses) {
			console.log('responses[0].data ', responses[0].data);
			if (responses[0].data == null) {
				result.resolve(null);
			} else {
				result.resolve(new Customer(responses[0].data));
			}
		}, function(error) {
			console.warn("findCustomerById error::", error);
			if (error.status == 404) {
				result.reject('Customer details not found for the provided Business Partner number.');
			}
		});
		return result.promise;
	};
	this.findCustomersByQuery = function(q) {
		console.log('qqq', q);
		var _endPoint = $http.get('/Customer?' + $.param({
			searchText : q,
			include : 'MailingAddress'
		}));

		var result = $q.defer();
		$q.all([ _endPoint ]).then(function(responses) {
			result.resolve(ObjectUtil.toArray(responses[0].data, Customer));
		});
		return result.promise;
	};
	this.findCustomersByUser = function(userId) {

		var _endPoint = $http.get('/Customer/user?' + $.param({
			userId : userId
		}));

		var result = $q.defer();
		$q.all([ _endPoint ]).then(function(responses) {
			// result.resolve(responses[0].data);
			result.resolve(ObjectUtil.toArray(responses[0].data, Customer));
		}, function(error) {
			console.warn("findCustomersByUser error::", error);
			if (error.status == 404) {
				result.resolve([]);
			}
		});
		return result.promise;
	};

	this.findCustomersByUserNCustomer = function(userId, customerId) {
		var reqs = [];
		reqs.push('/Customer/user?' + $.param({
			userId : userId
		}));
		reqs.push('/Customer/' + customerId);

		var result = $q.defer();
		$http.get('/Batch', {
			params : {
				uri : reqs
			}
		}).then(function(responses) {
			var _list = [];
			if (responses.data[1]) {
				_list.push(new Customer(responses.data[1]));
			}
			if ($.isArray(responses.data[0]) && responses.data[0].length >= 1) {
				_list = _list.concat(ObjectUtil.toArray(responses.data[0], Customer));
			}
			console.warn("findCustomersByUser _list::", _list);
			result.resolve(_list);
		}, function(error) {
			console.warn("findCustomersByUser error::", error);
			if (error.status == 500) {
				result.resolve([]);
			}
		});
		return result.promise;
	};
	
	this.notifyUserForPMPAccess = function(userId, username, firstName) {
		var userData = {};
		userData["id"] = userId;
		userData["username"] = username;
		userData["firstName"] = firstName;
		
		var data = $http({
			method : 'POST',
			url : '/Customer/notifyUserForPMPAccess',
			data : userData
		});
		var result = $q.defer();
		$q.all([ data ]).then(function(responses) {
			
		});
		return result.promise;
	};
};
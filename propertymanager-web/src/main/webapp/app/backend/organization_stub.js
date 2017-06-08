app.factory('OrganizationResource', function() {
	return new OrganizationResource();
});
function OrganizationResource() {

	this.lovRoles = [ {
		value : 'EnergyDelegate',
		text : 'Energy Delegate' // 'Energy Manager'
	}, {
		value : 'AccountDelegate',
		text : 'Account Delegate' // 'Billing Specialist'
	} ];

	this.lovAccessControl = [ {
		value : 'Property',
		text : 'Property'
	}, {
		value : 'All',
		text : 'All'
	} ];
}

function Organization(data) {
	$.extend(true, this, data);
	this.$resolved = true;
	var _parent = this;
	if (this.members != null) {
		_.each(this.members, function(item, index) {
			_parent.members[index] = new Member(item);
		});
	}
}
function Member(data) {
	$.extend(true, this, data);
	if (this.user != null) {
		this.user = new User(this.user);
	}
}
Member.prototype.commitAccessProfile = function(form) {
	this.defaultProfile = form.defaultProfile;
	this.accessLevel = form.accessLevel;
}
Member.prototype.commitUserDetails = function(form) {
	this.user.firstName = form.firstName;
	this.user.lastName = form.lastName;
	this.user.phoneNumber = form.phoneNumber;
}
Member.prototype.form = function() {
	var _userform = new Member(this);
	_userform.firstName = this.user.firstName;
	_userform.lastName = this.user.lastName;
	_userform.phoneNumber = this.user.phoneNumber;
	return _userform;
}
Member.prototype.isDelegateEquivalent = function() {
	return (this.defaultProfile == 'EnergyDelegate' || this.defaultProfile == 'AccountDelegate');
}

app.service('OrganizationService', [ '$q', '$http', '$rootScope',  $$OrganizationService ]);
function $$OrganizationService($q, $http, $rootScope) {
	console.log(":::::::::inside OrganizationService");
	//var cache = $cacheFactory('Organization');
	this.findOrganizationById = function(id) {
		//console.log('cahche data', id, cache.get(id))
		console.log('org empty');
	}
	this.findOrganizationByQuery = function(userId) {

		console.log(":::::::::inside delegate method");
		var request = $http.get('/Organization?' + $.param({
			userId : userId
		}));

		var result = $q.defer();
		$q.all([ request ]).then(function(responses) {
			console.log('service ', responses[0].data);
			var _org = responses[0].data;
			if ($.isArray(_org)) {
				_org = _org[0];
			}
			_org = new Organization(_org);
			//cache.put(_org.id, _org);
			result.resolve(_org);
		});
		return result.promise;
	};

	this.findUserById = function(userId) {
		console.log(":::::::::inside delegate method");
		var request = $http.get('/Organization/user?' + $.param({
			userId : userId
		}));

		var result = $q.defer();
		$q.all([ request ]).then(function(responses) {
			result.resolve(responses[0].data);
			$rootScope.userDetails = responses[0].data;
		});
		return result.promise;
	};
	this.updateAccessProfile = function(orgId, userId, memberform) {
		console.log("updateAccessProfile");
		var request = $http({
			method : 'PATCH',
			url : "/Organization/" + orgId + "/Member/" + userId + "/profile",
			data : memberform
		});

		var result = $q.defer();
		$q.all([ request ]).then(function(responses) {
			result.resolve(responses[0].data);

		});
		return result.promise;
	};
	this.updateUserDetails = function(orgId, userId, userDetails) {
		console.log(":::::::::inside delegate method");
		var request = $http({
			method : 'PATCH',
			url : "/Organization/" + orgId + "/Member/" + userId + "/status",
			data : userDetails
		});

		var result = $q.defer();
		$q.all([ request ]).then(function(responses) {
			result.resolve(responses[0].data);

		});
		return result.promise;
	};
};

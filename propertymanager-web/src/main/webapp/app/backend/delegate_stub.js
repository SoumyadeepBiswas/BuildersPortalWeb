function UserWithAccessibleProperty(data) {
	$.extend(true, this, data);
	this.$resolved = true;
}
function PropertyAccess(data) {
	$.extend(true, this, data);
	this.$resolved = true;
}
// overloading with properties
function PropertyAccess(data, p) {
	$.extend(true, this, data);
	this.$resolved = true;

	// from property
	if (p) {
		this.propertyId = p.propertyId;
		this.propertyName = p.propertyName;
		this.address = p.address;
		this.selected = false;
		this.userAccessDetails = [];
	}
}
function UserResourcesAccess(data) {
	$.extend(true, this, data);
	this.$resolved = true;

	if (this.user) {
		this.userName = this.user.username;
	}
}
app.service('DelegateService', [ '$q', '$http', '$rootScope', $$DelegateService ]);
function $$DelegateService($q, $http, $rootScope) {
	console.log(":::::::::inside delegate service");
	this.getPropertyAccessList = function(customerId) {
		console.log(":::::::::inside delegate method");
		var delegateData = $http.get('/Customer/' + customerId + '/ResourceAccess');
		var result = $q.defer();
		$q.all([ delegateData ]).then(function(responses) {
			var resultset = responses[0].data;
			if ($.isArray(resultset)) {
				for (i = 0; i < resultset.length; i++) {
					resultset[i] = new PropertyAccess(resultset[i]);
				}
			}
			result.resolve(resultset);
		}, function(error) {
			console.warn("getPropertyAccessList error::", error);
			if (error.status == 404) {
				result.resolve([]);
			}
		});
		return result.promise;
	};

	this.getUsers = function(filter) {
		console.log(":::::::::inside delegate method");
		var delegateData = $http.get('/User?' + $.param({
			userName : filter
		}));

		var result = $q.defer();
		$q.all([ delegateData ]).then(function(responses) {
			var delegateDataOutput = responses[0].data;
			result.resolve(delegateDataOutput);
		});
		return result.promise;
	};

	this.addPropertyAccess = function(propertyAccessList) {
		var delegateDataPost = $http({
			method : 'POST',
			url : '/Property/ResourceAccess',
			data : propertyAccessList
		});
		var result = $q.defer();
		$q.all([ delegateDataPost ]).then(function(responses) {
			var delegateDataOutput = responses[0].data;
			var resultset = responses[0].data;
			if ($.isArray(resultset)) {
				for (i = 0; i < resultset.length; i++) {
					resultset[i] = new UserResourcesAccess(resultset[i]);
				}
			}
			$rootScope.status = responses[0].status;
			result.resolve(delegateDataOutput);
		});
		return result.promise;

	};

	this.removePorpertyAccess = function(propertyAccessList) {
		var delegateDataPatchRequest = $http({
			method : 'PATCH',
			url : '/Property/ResourceAccess',
			data : propertyAccessList
		});
		var result = $q.defer();
		$q.all([ delegateDataPatchRequest ]).then(function(responses) {
			var delegateDataOutput = responses[0].data;

			$rootScope.status = responses[0].status;

			result.resolve(delegateDataOutput);
		});
		return result.promise;

	};

	this.reSendActivationEmail = function(user, propertyId) {
		var propertyAccess = {};
		propertyAccess["userId"] = user.user.userId;
		propertyAccess["resourceId"] = propertyId;

		var delegateDataPatchRequest = $http({
			method : 'PATCH',
			url : '/ResourceAccess/ReSendMail',
			data : propertyAccess
		});
		var result = $q.defer();
		$q.all([ delegateDataPatchRequest ]).then(function(responses) {
			result.resolve(responses);
		});
		return result.promise;
	};

	this.updatePropertyAccessProfile = function(selectedDelegate, property) {
		console.log(":::::: single delegate :::::: ", selectedDelegate);
		console.log(":::::: single property :::::: ", property);
		console.log(":::::: single property :::::: ", property.userAccessDetails.accessProfile);

		var delegateData = [];

		$.each(property.userAccessDetails, function(index, value) {
			delegateData.push({
				userId : selectedDelegate.userId,
				resourceId : property.propertyId,
				delegatorUserId : selectedDelegate.delegatorUserId,
				accessProfile : selectedDelegate.accessProfile
			});

		});

		var delegateDataPatchRequest = $http({
			method : 'PATCH',
			url : '/Property/ResourceAccess',
			data : delegateData
		});
		var result = $q.defer();
		$q.all([ delegateDataPatchRequest ]).then(function(responses) {
			var delegateDataOutput = responses[0].data;

			$rootScope.status = responses[0].status;

			result.resolve(delegateDataOutput);
		});
		return result.promise;

	};
};
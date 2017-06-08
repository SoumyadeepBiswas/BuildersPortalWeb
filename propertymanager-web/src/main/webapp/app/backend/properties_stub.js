app.factory('PropertyResource', function() {
	return new PropertyResource();
});
function PropertyResource() {
	this.classificationList = [ {
		value : 'House',
		text : 'House',
		color : '#5DB04B',
		ngColor : {
			backgroundColor : '#5DB04B'
		},
		legend : 'img/house.png'
	}, {
		value : 'Town House',
		text : 'Town House',
		color : '#EEAC4C',
		ngColor : {
			backgroundColor : '#EEAC4C'
		},
		legend : 'img/townhouse.png'
	}, {
		value : 'Multi-Unit',
		text : 'Multi-Unit (2-6)',
		color : '#396999',
		ngColor : {
			backgroundColor : '#396999'
		},
		legend : 'img/multi.png'
	}, {
		value : 'High Rise',
		text : 'High Rise',
		color : '#1FA8B0',
		ngColor : {
			backgroundColor : '#1FA8B0'
		},
		legend : 'img/highrise.png'
	}, {
		value : 'Commercial',
		text : 'Commercial',
		color : '#9683BF',
		ngColor : {
			backgroundColor : '#9683BF'
		},
		legend : 'img/commercial.png'
	}, {
		value : 'Not Classified',
		text : 'Not Classified',
		color : '#d7d7d7',
		ngColor : {
			backgroundColor : '#d7d7d7'
		},
		legend : 'img/notclassified.png'
	} ];

}
app.factory('AccessControl', function() {
	return new AccessControl();
});
function AccessControl() {

}
AccessControl.prototype.hasAccess = function(data, resource) {
	// console.log("AccessControl for....", resource);
	var className = data.constructor.name;
	if (resource == "cost") {
		if (className === 'Property') {
			return (data.accessProfile == null || data.accessProfile == 'AccountDelegate');
		}
		if (className === 'Customer') {
			return (data.accessProfile == null || data.accessProfile == 'AccountDelegate');
		}
	} else if (resource == "movein") {
		if (className === 'Property') {
			return (data.accessProfile == null);
		}
	} else if (resource == "owner") {
		if (className === 'Property') {
			return (data.accessProfile != 'EnergyDelegate' && data.accessProfile != 'AccountDelegate');
		}
	}
	return false;
}
PropertyResource.prototype.getColor = function(type) {
	for (i = 0; i < this.classificationList.length; i++) {
		if (this.classificationList[i].value == type || this.classificationList[i].text == type) {
			return this.classificationList[i].ngColor.backgroundColor;
		}
	}
}
function Property(data) {
	this.version = 1;
	$.extend(true, this, data);
	if (this.accessProfile == 'Delegate') {
		this.accessProfile = 'AccountDelegate';
	}
	if (this.noOfUnits == 1) {
		this.singleUnit = new Premise();
		this.singleUnit.premiseId = this.premiseId;
		if (this.propertySummary) {
			this.singleUnit.services = this.propertySummary.services;
		}
	}
	var _parent = this;
	this.$resolved = true;
}
Property.prototype.imageURL = function() {
}
Property.prototype.mergeClassification = function(_p) {
	this.propertyClassification = _p.propertyClassification;
}
Property.prototype.hasText = function(text) {
	return (this.propertyId == text || this.propertyName != null && this.propertyName.contains(text) || (this.address != null && ((this.address.streetNumber != null && this.address.streetNumber
			.contains(text))
			|| (this.address.streetName != null && this.address.streetName.contains(text))
			|| (this.address.postalCode != null && this.address.postalCode.contains(text))
			|| (this.address.province != null && this.address.province.contains(text)) || (this.address.city != null && this.address.city
			.contains(text)))));

}
function Premise(data) {
	$.extend(true, this, data);
	var _parent = this;
	if (this.premiseAddress != null && this.premiseAddress.streetUnit == null) {
		this.premiseAddress.streetUnit = 'Unlabeled';
	}
	this.$resolved = true;
}
Premise.prototype.isCommonInstallation = function() {
	if (this.premiseAddress.streetUnit == null) {
		return false;
	}
	return this.premiseAddress.streetUnit.indexOf('Unlabeled') >= 0
			|| this.premiseAddress.streetUnit.indexOf('ELECTRIC') >= 0
			|| this.premiseAddress.streetUnit.indexOf('ELEC') >= 0
			|| this.premiseAddress.streetUnit.indexOf('MAIN') >= 0
			|| this.premiseAddress.streetUnit.indexOf('WATER') >= 0
			|| this.premiseAddress.streetUnit.indexOf('WTR') >= 0 || this.premiseAddress.streetUnit.indexOf('LF') >= 0
			|| this.premiseAddress.streetUnit.indexOf('FIRE') >= 0
			|| this.premiseAddress.streetUnit.indexOf('REAR') >= 0
			|| this.premiseAddress.streetUnit.indexOf('BOILER') >= 0
			|| this.premiseAddress.streetUnit.indexOf('FLOOR') >= 0
			|| this.premiseAddress.streetUnit.indexOf('HALL') >= 0 || this.premiseAddress.streetUnit.indexOf('GM') >= 0
			|| this.premiseAddress.streetUnit.indexOf('POOL') >= 0;

}
Premise.prototype.isPendingMove = function() {
	return this.isPendingMoveIn() || this.isPendingMoveOut();
}
Premise.prototype.isPendingMoveIn = function() {
	var now = new Date().getTime();
	return (this.moveinDate > now);
}
Premise.prototype.isPendingMoveOut = function() {
	var now = new Date().getTime();
	return (this.moveoutDate > now && this.moveoutDate < 95634964390000);
}

app.service('PropertyService', [ '$q', '$http', '$rootScope', '$apiRegistry', 'PropertyCache', $$PropertyService ]);
function $$PropertyService($q, $http, $rootScope, $apiRegistry, PropertyCache) {
	$apiRegistry.add({
		data : 'aaa'
	});
	this.findPropertiesByCustomer = function(customerId) {
		console.log("findPropertiesByCustomer");
		var result = $q.defer();
		var endPoint = '/Customer/' + customerId + '/Property';

		var _properties = PropertyCache.findPropertiesByCustomer(endPoint);
		if (_properties != null) {
			console.log("result for cache...");
			result.resolve(_properties);
			return result.promise;
		}
		var propertyData = $http.get(endPoint);
		$q.all([ propertyData ]).then(function(responses) {
			var resultset = responses[0].data;
			if ($.isArray(resultset)) {
				for (i = 0; i < resultset.length; i++) {
					resultset[i] = new Property(resultset[i]);
				}
			}
			console.log('resultset', resultset);
			PropertyCache.updatePropertiesByCustomer(customerId, 'Property', resultset);
			result.resolve(resultset);
		});
		return result.promise;
	};
	this.findPropertiesViewByCustomer = function(customerId) {
		console.log("findPropertiesViewByCustomer");

		var result = $q.defer();
		var endPoint = '/Customer/' + customerId + '/PropertyView';
		var _properties = PropertyCache.findPropertiesByCustomer(endPoint);
		if (_properties != null) {
			console.log("result for cache...");
			result.resolve(_properties);
			return result.promise;
		}
		var propertyData = $http.get(endPoint);
		$q.all([ propertyData ]).then(function(responses) {
			var resultset = responses[0].data;
			if ($.isArray(resultset)) {
				for (i = 0; i < resultset.length; i++) {
					resultset[i] = new Property(resultset[i]);
				}
			}
			console.log('resultset', resultset);
			PropertyCache.updatePropertiesByCustomer(customerId, 'PropertyView', resultset);
			result.resolve(resultset);
		});
		return result.promise;
	};
	this.findPropertiesViewByUser = function(userId) {
		console.log("findPropertiesViewByUser");
		var propertyData = $http.get('/User/' + userId + '/PropertyView');

		var result = $q.defer();
		$q.all([ propertyData ]).then(function(responses) {
			var resultset = responses[0].data;
			if ($.isArray(resultset)) {
				for (i = 0; i < resultset.length; i++) {
					resultset[i] = new Property(resultset[i]);
				}
			}
			console.log('resultset', resultset);
			result.resolve(resultset);
		}, function(error) {
			console.warn("findPropertiesByUser error::", error);
			if (error.status == 404) {
				result.resolve([]);
			}
		});
		return result.promise;
	};

	this.findUserPropertyCounts = function() {
		console.log("findUserPropertyCounts");

		var userPropertyCntData = $http.get('/UserPropertyCounts');
		var result = $q.defer();
		$q.all([ userPropertyCntData ]).then(function(responses) {
			var resultset = responses[0].data;
			result.resolve(resultset);
		});
		return result.promise;
	};
	this.findUnitsByProperty = function(property) {
		console.log("findUnitsByProperty");

		var unitData = $http.get('/Customer/' + property.customerId + '/Property/' + property.propertyId + '/Premise');
		$rootScope.selectedProperty = property;
		var result = $q.defer();
		$q.all([ unitData ]).then(function(responses) {
			var resultset = responses[0].data;
			if ($.isArray(resultset)) {
				for (i = 0; i < resultset.length; i++) {
					resultset[i] = new Premise(resultset[i]);
				}
			}
			console.log('resultset', resultset);
			result.resolve(resultset);
		});
		return result.promise;
	};
	this.patchDetails = function(property, nickname) {
		console.log(":::::::::patchDetails");
		var nicknameData = $http({
			method : 'PATCH',
			url : '/Property/' + property.propertyId,
			data : nickname
		});
		var result = $q.defer();
		$q.all([ nicknameData ]).then(function(responses) {
			var nicknameDataOutput = responses[0].data;
			result.resolve(nicknameDataOutput);
		});
		return result.promise;
	};

	this.patchClassificationDetails = function(property, propertyClassification) {
		console.log(":::::::::patchClassificationDetails");
		var propertyTypeData = $http({
			method : 'PATCH',
			url : '/Property/' + property.propertyId,
			data : propertyClassification
		});
		var result = $q.defer();
		$q.all([ propertyTypeData ]).then(
				function(responses) {
					var _property = responses[0].data;
					console.log(
							":::::::::patchClassificationDetails Response :::: _property.propertyClassification :: ",
							_property.propertyClassification);
					result.resolve(new Property(_property));
				});
		return result.promise;
	};

	this.postUploadImage = function(propertyId, file) {
		console.log(":::::::::postUploadImage");
		var uploadImageData = $http.post('/Property/' + propertyId + '/uploadImage', file, {
			lhContentTypeOverride : false,
			headers : {
				'Content-Type' : undefined
			},
		});
		var result = $q.defer();
		$q.all([ uploadImageData ]).then(function(responses) {
			var uploadImageData = responses[0].status;
			result.resolve(uploadImageData);
		}, function(error) {
			console.warn("postUploadImage error::", error);
			if (error.status == 500) {
				result.reject('Error on Image Upload');
			}

			if (error.status == 413) {
				// "Request Entity Too Large"
				result.reject('Failed to upload the image since it exceeds 500 KB.');
			}
			if (error.status == 415) {
				result.reject('Please upload a image with the following extensions .jpg , .png , .gif.');
			}
		});
		return result.promise;
	};
	this.emailPremiseConsumption = function(property, content) {
		console.log(":::::::::postEmailCostAndConsumption");
		var processedData = {};
		processedData["content"] = content;
		var propertyTypeData = $http({
			method : 'POST',
			url : '/emailPremiseConsumption',
			data : processedData
		});
		var result = $q.defer();
		$q.all([ propertyTypeData ]).then(function(responses) {
			var _property = responses[0].data;
			result.resolve(_property);
		});
		return result.promise;
	};
};
app.factory("PropertyCache", function() {
	var propertyCache = [];
	propertyCache.findPropertiesByCustomer = function(key) {
		return propertyCache[key];
	};
	propertyCache.updatePropertiesByCustomer = function(key, properties) {
		propertyCache[key] = properties;
	};
	return propertyCache

})

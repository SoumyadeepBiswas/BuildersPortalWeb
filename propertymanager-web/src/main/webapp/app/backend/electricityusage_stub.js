function PropertyElectricityUsage(data) {
	$.extend(true, this, data);
	if (this.usageSummary != null) {
		var _list = [];
		_.each(this.usageSummary, function(value, index) {
			_list.push(new ElectricityUsage(value));
		});
		this.usageSummary = _list;
	}
	this.$resolved = true;
}
PropertyElectricityUsage.prototype.addPropertyDetails = function() {
	var superthis = this;
	if (this.usageSummary != null) {
		var _list = [];
		_.each(this.usageSummary, function(value, index) {
			superthis.propertyId = value.propertyId;
			superthis.propertyType = value.propertyType;
			superthis.ownerOccupied = value.ownerOccupied;
			superthis.addressStreetName = value.addressStreetName;
			superthis.addressStreetNumber = value.addressStreetNumber;
		});
	}
}
function PremisesElectricityUsage(data) {
	$.extend(true, this, data);
	if (this.usageSummary != null) {
		var _list = [];
		_.each(this.usageSummary, function(value, index) {
			_list.push(new ElectricityUsage(value));
		});
		this.usageSummary = _list;
	}
	this.$resolved = true;
}
function ElectricityUsage(data) {
	$.extend(true, this, data);
	this.billPeriodMonth = new Date(this.billPeriodMonth);
	this.billPeriodFrom = new Date(this.billPeriodFrom);
	this.billPeriodTo = new Date(this.billPeriodTo);
	if (this.address) {
		this.propertyAddress = this.address.streetNumber + "<br/>" + this.address.streetName;
	} else if (this.propertyAddress) {
		this.propertyAddress = this.premiseAddress.streetNumber + "<br/>" + this.premiseAddress.streetName;
	}

	this.$resolved = true;
}
app.service('ElectricityConsumptionService', [ '$q', '$http', $$ElectricityConsumptionService ]);
function $$ElectricityConsumptionService($q, $http) {
	console.log(":::::::::inside service");
	this.getEnergyUsage = function() {
		console.log(":::::::::inside method");
		var config = {};
		config.headers = config.headers || {};
		config.withCredentials = true;
		config.headers['Authorization'] = 'Bearer cf7d67c1-175a-4242-a3a3-f4837276bcbe';
		var electricityData = $http.get(
				'https://pmp-dot-api-dot-lh-myaccount-dev.appspot.com/api/v1/services/1478/billingChartData?'
						+ $.param({
							src : "pmp",
							accountId : "50732356",
							serviceId : 1478,
							chartType : "SMART",
							meterId : "E430831",
							view : "billing",
							startDate : 1437897600000,
							endDate : 1469520000000
						}), config);
		var result = $q.defer();
		$q.all([ electricityData ]).then(function(responses) {
			console.log('service res', responses[0]);
			var apiResponse = responses[0].data;
			var billPeriods = [];
			_.each(apiResponse.chartLabels, function(monthValue, index) {
				var usage = 0;
				var cost = 0;

				$.each(apiResponse.series, function(seriesIndex, singleSeries) {
					cost += singleSeries.cost[index];
					usage += singleSeries.data[index];
				});
				billPeriods.push({
					startTime : Date.parse(monthValue),
					value : usage,
					cost : cost
				});
			});
			var _usage = new ElectricityUsage({
				billPeriods : billPeriods
			});
			console.log('_usage', _usage);
			result.resolve(_usage);
		});
		return result.promise;
	};
	this.getBillingEnergyUsage = function(search) {
		console.log("getBillingEnergyUsage ", search);
		var deferred = $q.defer();
		httpPromise = $http.get("/Customer/" + search.customerId + "/Property/" + search.propertyId + "/Premise/"
				+ search.premiseId + "/ElectricityUsage?" + $.param({
					fromDate : Date.today().addMonths(-14).YYYYMMDD(),
					toDate : Date.today().YYYYMMDD()
				}));

		httpPromise.then(function(response) {
			console.log("getBillingEnergyUsage------------", response.data);
			var _usage = new PremisesElectricityUsage(response.data);
			console.log("getBillingEnergyUsage------------", _usage);
			deferred.resolve(_usage);
		}, function(error) {
			console.error(error);
		});

		return deferred.promise;
	};
	this.findElectricityUsageByPropertyId = function(search) {
		console.log("findElectricityUsageByPropertyId ", search);
		var deferred = $q.defer();
		httpPromise = $http.get("/Customer/" + search.customerId + "/Property/" + search.propertyId
				+ "/ElectricityUsage?" + $.param({
					fromDate : Date.today().addMonths(-14).YYYYMMDD(),
					toDate : Date.today().YYYYMMDD()
				}));

		httpPromise.then(function(response) {
			var resultset = response.data;
			if ($.isArray(resultset)) {
				for (i = 0; i < resultset.length; i++) {
					resultset[i] = new PropertyElectricityUsage(resultset[i]);
				}
			}
			console.log("findElectricityUsageByPropertyId------------", resultset);
			deferred.resolve(resultset);
		}, function(error) {
			console.error(error);
		});

		return deferred.promise;
	};
	this.findElectricityUsageByUser = function(search) {
		console.log("findElectricityUsageByUser ", search);
		var deferred = $q.defer();
		httpPromise = $http.get("/Customer/" + search.customerId + "/User/" + search.userId + "/ElectricityUsage?"
				+ $.param({
					fromDate : Date.today().addMonths(-14).YYYYMMDD(),
					toDate : Date.today().YYYYMMDD()
				}));

		httpPromise.then(function(response) {
			var resultset = response.data;
			if ($.isArray(resultset)) {
				for (i = 0; i < resultset.length; i++) {
					resultset[i] = new ElectricityUsage(resultset[i]);
				}
			}
			console.log("findElectricityUsageByUser------------", resultset);
			deferred.resolve(resultset);
		}, function(error) {
			console.error(error);
		});

		return deferred.promise;
	};
};

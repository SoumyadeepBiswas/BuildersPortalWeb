function WaterUsage(data) {
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

function PremisesWaterUsage(data) {
	$.extend(true, this, data);

	if (this.usageSummary != null) {
		_.each(this.usageSummary, function(value, index) {
			value.billPeriodMonth = new Date(value.billPeriodMonth);
			value.billPeriodFrom = new Date(value.billPeriodFrom);
			value.billPeriodTo = new Date(value.billPeriodTo);
		});
	}
	this.$resolved = true;
}
app.service('WaterConsumptionService', [ '$q', '$http', $$WaterConsumptionService ]);
function $$WaterConsumptionService($q, $http) {
	this.getWaterData = function(search) {
		var deferred = $q.defer();
		httpPromise = $http.get("/Customer/" + search.customerId + "/Property/" + search.propertyId + "/Premise/"
				+ search.premiseId + "/WaterUsage?" + $.param({
					fromDate : Date.today().addMonths(-14).YYYYMMDD(),
					toDate : Date.today().YYYYMMDD()
				}));
		httpPromise.then(function(response) {
			var _usage = new PremisesWaterUsage(response.data);
			console.log("getWaterData------------", _usage);
			deferred.resolve(_usage);
		}, function(error) {
			console.error(error);
		});

		return deferred.promise;
	};
	this.findWaterUsageByUser = function(search) {
		console.log("findWaterUsageByUser ", search);
		var deferred = $q.defer();
		httpPromise = $http.get("/Customer/" + search.customerId + "/User/" + search.userId + "/WaterUsage?"
				+ $.param({
					fromDate : Date.today().addMonths(-14).YYYYMMDD(),
					toDate : Date.today().YYYYMMDD()
				}));

		httpPromise.then(function(response) {
			var resultset = response.data;
			if ($.isArray(resultset)) {
				for (i = 0; i < resultset.length; i++) {
					resultset[i] = new WaterUsage(resultset[i]);
				}
			}
			console.log("findWaterUsageByUser------------", resultset);
			deferred.resolve(resultset);
		}, function(error) {
			console.error(error);
		});

		return deferred.promise;
	};

};
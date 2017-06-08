function HttpResponse(code, msg) {
	this.status = code;
	this.statusText = msg;
}
HttpResponse.prototype.is2xxSuccessful = function() {
	return '2' === this.status[0];
}
app.service('ReportService', [ '$q', '$http', '$rootScope', $$ReportService ]);
function $$ReportService($q, $http, $rootScope) {

	this.downloadReport = function(report) {
		var deferred = $q.defer();
		$http.get(report.action).success(function(data) {
			deferred.resolve(data);
		}).error(function(error, code) {
			deferred.reject(new HttpResponse(code, error.message));
		});
		return deferred.promise;
	};
};
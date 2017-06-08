function HttpResponse(code, msg) {
	this.status = code;
	this.statusText = msg;
}
HttpResponse.prototype.is2xxSuccessful = function() {
	return '2' === this.status[0];
}
app.service('ContactUSService', [ '$q', '$http', '$rootScope', $$ContactUSService ]);
function $$ContactUSService($q, $http, $rootScope) {

	this.sendUserMessage = function(customerId, requestform) {
		var deferred = $q.defer();
		$http.post('/CustomerSupport/' + customerId + '/Message', requestform).success(function(data) {
			deferred.resolve(new User(data));
		}).error(function(error, code) {
			deferred.reject(new HttpResponse(code, error.message));
		});
		return deferred.promise;
	};
};
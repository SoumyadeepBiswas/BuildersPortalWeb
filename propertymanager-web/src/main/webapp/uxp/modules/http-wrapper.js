if (typeof __staticfilev == 'undefined') {
	__staticfilev = (new Date()).getTime();
}

var numLoadings = 0;
(function(window, angular) {
	'use strict';
	var uxpHttp = angular.module('uxpHttp', [ 'ngRoute' ]);
	uxpHttp.config([ '$httpProvider', function($httpProvider) {
		console.log("uxpHttp moduled initialize");
		$httpProvider.interceptors.push('HttpIntercepter');
	} ]);
	uxpHttp.factory('$apiRegistry', function() {
		return new API()
	});
	uxpHttp.service('pendingRequests', function() {
		var pending = [];
		this.get = function() {
			return pending;
		};
		this.add = function(request) {
			pending.push(request);
		};
		this.remove = function(request) {
			pending = _.filter(pending, function(p) {
				return p.url !== request;
			});
		};
		this.cancelAll = function() {
			angular.forEach(pending, function(p, index) {
				console.log(index + ". Cencel Request..." + p.url);
				p.canceller.resolve();
			});
			pending.length = 0;
		};
		this.log = function() {
			angular.forEach(pending, function(p, index) {
				console.log(index + ". Pending Request..." + p.url)
			});
		}
	});

	uxpHttp.service('HttpIntercepter', [
			'$q',
			'$cookies',
			'$rootScope',
			'$apiRegistry',
			'pendingRequests',
			function HttpIntercepter($q, $cookies, $rootScope, $apiRegistry, pendingRequests) {
				return {
					request : function(config) {
						numLoadings++;
						if (config.url.indexOf('html') >= 0 || config.url.indexOf('js') >= 0
								|| config.url.indexOf('css') >= 0) {
							config.url = config.url + "?v=" + __staticfilev;
						}
						if (config.url.indexOf('html') == -1 && config.url.indexOf('http') == -1) {
							config.url = ApplConfig.apiServerEndpoint + config.url;
						}

						config.headers = config.headers || {};
						var ut = $cookies.get(ApplConfig.getTokenKey());

						if (ut) {
							config.headers['Authorization'] = 'Bearer' + ' ' + ut;
						}
						if (!config.headers['Content-Type']) {
							if (config.lhContentTypeOverride == false) {
								// bypass
							} else {
								config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
							}
						}
						if (iamEmailChange == true) {
							config.withCredentials = false;
						}
						if (iamRegisterUserCSR == true) {
							config.withCredentials = false;
						}
						if (config.method == 'POST' || config.method == 'PUT' || config.method == 'DELETE'
								|| config.method == 'PATCH') {
							pageLoader.show(config.url);
						}
						var canceller = $q.defer();
						pendingRequests.add({
							url : config.url,
							canceller : canceller
						});
						config.timeout = canceller.promise;

						// return promise.then(hide, hide);
						return config;
					},
					response : function(response) {
						pendingRequests.remove(response.config.url);
						if (response.config) {
							if (response.config.method == 'POST' || response.config.method == 'PUT'
									|| response.config.method == 'DELETE' || response.config.method == 'PATCH') {
								pageLoader.hide(response.config.url);
							}
						}

						pendingRequests.log();
						--numLoadings;
						return response;
					},
					responseError : function(rejection) {
						pendingRequests.remove(rejection.config.url);
						if (rejection.config) {
							if (rejection.config.method == 'POST' || rejection.config.method == 'PUT'
									|| rejection.config.method == 'DELETE' || rejection.config.method == 'PATCH') {
								pageLoader.hide(rejection.config.url);
							}
						}
						if (rejection.status == 401) {
							$rootScope.$emit("unauthorized");
						} else if (rejection.status == 403) {
							$rootScope.$emit("accessdenied");
						} else if (rejection.status >= 500) {
							alert(rejection.status);
							$rootScope.$emit("50xerror");
						}
						--numLoadings
						return $q.reject(rejection);
						// return rejection;
					}
				}
			} ]);

	function API() {
		this.registry = [];
		this.add = function(obj) {
			this.registry.push(obj);
			return this;
		};
		this.log = function() {
			_.each(this.registry, function(item, index) {
				console.log('registry', index, item);
			});
		}
	}
	console.log("module uxpHttp::initialized");
})(window, window.angular);
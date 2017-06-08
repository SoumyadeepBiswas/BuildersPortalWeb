(function(window, angular) {
	'use strict';
	var app = angular.module('app');
	app.config([ '$stateProvider', function($stateProvider) {
		$stateProvider.state('app.public.login', {
			url : '/login',
			templateUrl : 'uxp/modules/login/views/login.html',
			controller : 'LoginController',
			resolve : {
				deps : [ '$ocLazyLoad', function($ocLazyLoad) {
					$ocLazyLoad.load({
						serie : true,
						files : [ ApplConfig.iam.pluginURL() ]
					});
				} ]
			}
		})
	} ]);
	console.log('login config loaded');
})(window, window.angular);
(function(window, angular) {
	'use strict';
	var app = angular.module('app');
	app.config([ '$stateProvider', $$appConfigLinkAccount ]);
	function $$appConfigLinkAccount($stateProvider) {
		$stateProvider.state('app.secure.linkaccount', {
			url : '/{userId}/link',
			templateUrl : 'app/views/partials/linkaccount/linkaccount.html' + "?v=" + Date.UTC(),
			controller : 'LinkAccountController',
			resolve : {
				deps : [ '$ocLazyLoad', 'isCoreLibraryLoaded', function($ocLazyLoad, isCoreLibraryLoaded) {
					return $ocLazyLoad.load('toaster').then(function() {
						return true;
					});
				} ]
			}
		})
	}
	console.log('linkaccount config loaded');
})(window, window.angular);
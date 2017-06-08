(function(window, angular) {
	'use strict';
	var app = angular.module('app');
	app.config([ '$stateProvider', $$appConfigReport ]);
	function $$appConfigReport($stateProvider) {
		$stateProvider.state('app.secure.reports', {
			url : '/{userId}/reports',
			templateUrl : 'app/views/partials/reports/reports.html',
			ncyBreadcrumb : {
				label : 'Reports',
				description : ''
			},
			controller : 'ReportController',
			data : {
				roles : []
			},
			resolve : {
				deps : [ '$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load('toaster').then(function() {
						return true;
					});
				} ]
			}
		})
	}
	console.log('report config loaded');
})(window, window.angular);
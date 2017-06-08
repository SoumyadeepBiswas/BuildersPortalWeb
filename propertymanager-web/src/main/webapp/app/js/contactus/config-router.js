(function(window, angular) {
	'use strict';
	var app = angular.module('app');
	app.config([ '$stateProvider', $$appConfigContactUs ]);
	function $$appConfigContactUs($stateProvider) {
		$stateProvider.state('app.secure.contactus', {
			url : '/{userId}/contactUs',
			templateUrl : 'app/views/partials/contactus/contactus.html',
			controller : 'ContactUsController',
			ncyBreadcrumb : {
				label : 'Contact Us',
				description : ''
			},
			data : {
				customerChange : false,
				roles : []
			},
			views : {
				"" : {
					templateUrl : 'app/views/partials/contactus/contactus.html'
				},
				"contactUs_back@app.secure.contactus" : {
					templateUrl : 'app/views/partials/contactus/contactus.html'
				},
				"callUs@app.secure.contactus" : {
					templateUrl : 'app/views/partials/contactus/callus.html'
				},
			},

			resolve : {
				isLibraryLoaded : [ '$ocLazyLoad', 'isCoreLibraryLoaded', 'isChartLibraryLoaded',
						function($ocLazyLoad, isCoreLibraryLoaded, isChartLibraryLoaded) {
							return true;
						} ],
				workingCustomer : [ 'isLibraryLoaded', '$rootScope', function(isLibraryLoaded, $rootScope) {
					console.log('app.dashboard::workingCustomer', $rootScope.workingCustomer);
					return $rootScope.workingCustomer;
				} ]
			}
		});
	}
	console.log('contactus config loaded');
})(window, window.angular);
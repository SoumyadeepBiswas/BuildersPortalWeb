(function(window, angular) {
	'use strict';
	var app = angular.module('app');
	app.config([ '$stateProvider', $$appConfigDashboardExt ]);
	function $$appConfigDashboardExt($stateProvider) {
		$stateProvider.state('app.secure.dashboard2', {
			url : '/{userId}/dashboard2',
			templateUrl : 'app/views/partials/dashboard/dashboard2.html',
			controller : 'PropertySummaryController',
			ncyBreadcrumb : {
				label : 'Dashboard',
				description : ''
			},
			data : {
				customerChange : true,
				roles : []
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
		$stateProvider.state('app.secure.dashboard2customer', {
			url : '/{userId}/{customerId}/dashboard2',
			templateUrl : 'app/views/partials/dashboard/dashboard2.html',
			controller : 'PropertySummaryController',
			ncyBreadcrumb : {
				label : 'Dashboard',
				description : ''
			},
			data : {
				customerChange : true,
				roles : []
			},
			resolve : {
				isLibraryLoaded : [ '$ocLazyLoad', 'isCoreLibraryLoaded', function($ocLazyLoad, isCoreLibraryLoaded) {
					return true;
				} ],
				workingCustomer : [ 'isLibraryLoaded', '$rootScope', function(isLibraryLoaded, $rootScope) {
					console.log('app.secure.delegatedashboard::workingCustomer', $rootScope.workingCustomer);
					return $rootScope.workingCustomer;
				} ]
			}
		});

		$stateProvider.state('app.secure.dashboard3', {
			url : '/{userId}/dashboard3',
			templateUrl : 'app/views/partials/dashboard/dashboard3.html',
			controller : 'PropertySummaryController',
			ncyBreadcrumb : {
				label : 'Dashboard',
				description : ''
			},
			data : {
				customerChange : true,
				roles : []
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
		$stateProvider.state('app.secure.dashboard3customer', {
			url : '/{userId}/{customerId}/dashboard3',
			templateUrl : 'app/views/partials/dashboard/dashboard3.html',
			controller : 'PropertySummaryController',
			ncyBreadcrumb : {
				label : 'Dashboard',
				description : ''
			},
			data : {
				customerChange : true,
				roles : []
			},
			resolve : {
				isLibraryLoaded : [ '$ocLazyLoad', 'isCoreLibraryLoaded', function($ocLazyLoad, isCoreLibraryLoaded) {
					return true;
				} ],
				workingCustomer : [ 'isLibraryLoaded', '$rootScope', function(isLibraryLoaded, $rootScope) {
					console.log('app.secure.delegatedashboard::workingCustomer', $rootScope.workingCustomer);
					return $rootScope.workingCustomer;
				} ]
			}
		});

		$stateProvider.state('app.secure.dashboard4', {
			url : '/{userId}/dashboard4',
			templateUrl : 'app/views/partials/dashboard/dashboard4.html',
			controller : 'PropertySummaryController',
			ncyBreadcrumb : {
				label : 'Dashboard',
				description : ''
			},
			data : {
				customerChange : true,
				roles : []
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
		$stateProvider.state('app.secure.dashboard4customer', {
			url : '/{userId}/{customerId}/dashboard4',
			templateUrl : 'app/views/partials/dashboard/dashboard4.html',
			controller : 'PropertySummaryController',
			ncyBreadcrumb : {
				label : 'Dashboard',
				description : ''
			},
			data : {
				customerChange : true,
				roles : []
			},
			resolve : {
				isLibraryLoaded : [ '$ocLazyLoad', 'isCoreLibraryLoaded', function($ocLazyLoad, isCoreLibraryLoaded) {
					return true;
				} ],
				workingCustomer : [ 'isLibraryLoaded', '$rootScope', function(isLibraryLoaded, $rootScope) {
					console.log('app.secure.delegatedashboard::workingCustomer', $rootScope.workingCustomer);
					return $rootScope.workingCustomer;
				} ]
			}
		});

		$stateProvider.state('app.secure.dashboard5', {
			url : '/{userId}/dashboard5',
			templateUrl : 'app/views/partials/dashboard/dashboard5.html',
			controller : 'PropertySummaryController',
			ncyBreadcrumb : {
				label : 'Dashboard',
				description : ''
			},
			data : {
				customerChange : true,
				roles : []
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
		$stateProvider.state('app.secure.dashboard5customer', {
			url : '/{userId}/{customerId}/dashboard5',
			templateUrl : 'app/views/partials/dashboard/dashboard5.html',
			controller : 'PropertySummaryController',
			ncyBreadcrumb : {
				label : 'Dashboard',
				description : ''
			},
			data : {
				customerChange : true,
				roles : []
			},
			resolve : {
				isLibraryLoaded : [ '$ocLazyLoad', 'isCoreLibraryLoaded', function($ocLazyLoad, isCoreLibraryLoaded) {
					return true;
				} ],
				workingCustomer : [ 'isLibraryLoaded', '$rootScope', function(isLibraryLoaded, $rootScope) {
					console.log('app.secure.delegatedashboard::workingCustomer', $rootScope.workingCustomer);
					return $rootScope.workingCustomer;
				} ]
			}
		});
	}
	console.log('dashboard config loaded');
})(window, window.angular);
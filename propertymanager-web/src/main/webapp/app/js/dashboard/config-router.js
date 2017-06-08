(function(window, angular) {
	'use strict';
	var app = angular.module('app');
	app.config([ '$stateProvider', $$appConfigDashboard ]);
	function $$appConfigDashboard($stateProvider) {
		$stateProvider.state('app.secure.dashboardnocustomer', {
			url : '/{userId}/dashboardnocustomer',
			templateUrl : 'app/views/partials/dashboard/dashboardnocustomer.html',
			ncyBreadcrumb : {
				label : 'Dashboard',
				description : ''
			},
			data : {
				customerChange : false,
				roles : []
			},
			resolve : {
				isLibraryLoaded : [ '$ocLazyLoad', 'isCoreLibraryLoaded', 'isChartLibraryLoaded',
						function($ocLazyLoad, isCoreLibraryLoaded, isChartLibraryLoaded) {
							return $ocLazyLoad.load([ LazyLoadConfig.googlemap ]);
						} ]
			}
		});
		$stateProvider.state('app.secure.dashboard', {
			url : '/{userId}/dashboard',
			templateUrl : 'app/views/partials/dashboard/dashboard.html',
			controller : 'PropertySummaryController',
			ncyBreadcrumb : {
				label : 'Dashboard',
				description : ''
			},
			data : {
				customerChange : true,
				roles : []
			},
			views : {
				"" : {
					templateUrl : 'app/views/partials/dashboard/dashboard.html',
					controller : 'PropertySummaryController',
				},
				"notification_preference@app.secure.dashboard" : {
					templateUrl : 'app/views/partials/dashboard/notification-preference2.html',
					controller : 'NotificationController'
				},
				"property_summary@app.secure.dashboard" : {
					templateUrl : 'app/views/partials/dashboard/property_summary.html'
				},
				"map@app.secure.dashboard" : {
					templateUrl : 'app/views/partials/myproperties/map.html',
					controller : "MapCtrl",
					resolve : {
						properties : [ 'isLibraryLoaded', '$rootScope', 'PropertyService',
								function(isLibraryLoaded, $rootScope, PropertyService) {
									if ($rootScope.contextParams.userId == null) {
										return null;
									}
									return PropertyService.findPropertiesViewByUser($rootScope.contextParams.userId);
								} ],
						source : function() {
							return 'dashboard';
						}
					}

				}
			},
			resolve : {
				isLibraryLoaded : [ '$ocLazyLoad', 'isCoreLibraryLoaded', 'isChartLibraryLoaded',
						function($ocLazyLoad, isCoreLibraryLoaded, isChartLibraryLoaded) {
							return $ocLazyLoad.load([ LazyLoadConfig.googlemap ]);
						} ],
				workingCustomer : [ 'isLibraryLoaded', '$rootScope', function(isLibraryLoaded, $rootScope) {
					console.log('app.dashboard::workingCustomer', $rootScope.workingCustomer);
					return $rootScope.workingCustomer;
				} ]
			}
		});
		$stateProvider.state('app.secure.dashboardcustomer', {
			url : '/{userId}/{customerId}/dashboard',
			templateUrl : 'app/views/partials/dashboard/dashboard.html',
			controller : 'PropertySummaryController',
			ncyBreadcrumb : {
				label : 'Dashboard',
				description : ''
			},
			data : {
				customerChange : true,
				roles : []
			},
			views : {
				"" : {
					templateUrl : 'app/views/partials/dashboard/dashboard.html',
					controller : 'PropertySummaryController',
				},
				"notification_preference@app.secure.dashboardcustomer" : {
					templateUrl : 'app/views/partials/dashboard/notification-preference2.html',
					controller : 'NotificationController'
				},
				"property_summary@app.secure.dashboardcustomer" : {
					templateUrl : 'app/views/partials/dashboard/property_summary.html'
				},
				"aggregated_consumption@app.secure.dashboardcustomer" : {
					templateUrl : 'app/views/partials/dashboard/dashboard-consumption-propertytype.html',
					controller : "ConsumptionController"
				},
				"map@app.secure.dashboardcustomer" : {
					templateUrl : 'app/views/partials/myproperties/map.html',
					controller : "MapCtrl",
					resolve : {
						properties : [
								'isLibraryLoaded',
								'$rootScope',
								'PropertyService',
								function(isLibraryLoaded, $rootScope, PropertyService) {
									if ($rootScope.contextParams.customerId == null) {
										return PropertyService
												.findPropertiesViewByUser($rootScope.contextParams.userId);
									}
									return PropertyService
											.findPropertiesViewByCustomer($rootScope.contextParams.customerId);
								} ],
						source : function() {
							return 'dashboard';
						}
					}

				}
			},
			resolve : {
				isLibraryLoaded : [ '$ocLazyLoad', 'isCoreLibraryLoaded', function($ocLazyLoad, isCoreLibraryLoaded) {
					return $ocLazyLoad.load([ LazyLoadConfig.googlemap ]);
				} ],
				workingCustomer : [ 'isLibraryLoaded', '$rootScope', function(isLibraryLoaded, $rootScope) {
					console.log('app.secure.delegatedashboard::workingCustomer', $rootScope.workingCustomer);
					return $rootScope.workingCustomer;
				} ]
			}
		});
		$stateProvider.state('app.secure.customer', {
			url : '/{userId}/customer',
			templateUrl : 'app/views/partials/customer/customer.html',

			ncyBreadcrumb : {
				label : 'Customer',
				description : ''
			},
			data : {
				roles : []
			},
			resolve : {
				isLibraryLoaded : [ 'isCoreLibraryLoaded', '$ocLazyLoad', function(isCoreLibraryLoaded, $ocLazyLoad) {
					return true;
				} ],
				workingCustomer : [ 'isLibraryLoaded', '$rootScope', function(isLibraryLoaded, $rootScope) {
					return $rootScope.workingCustomer;
				} ]
			}
		})
	}
	console.log('dashboard config loaded');
})(window, window.angular);
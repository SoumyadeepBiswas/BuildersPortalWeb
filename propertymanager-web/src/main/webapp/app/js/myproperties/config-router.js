(function(window, angular) {
	'use strict';
	var app = angular.module('app');
	app.config([ '$stateProvider', $$appConfigProperty ]);
	function $$appConfigProperty($stateProvider) {
		$stateProvider.state('app.secure.properties', {
			url : '/{userId}/property?disconnected&pendingMoves&propertyId',
			params : {
				propertyId : null,
				disconnected : null,
				pendingMoves : null
			},
			templateUrl : 'app/views/partials/myproperties/properties.html',
			controller : 'PropertiesController',
			ncyBreadcrumb : {
				label : 'My Properties',
				description : ''
			},
			data : {
				customerChange : true,
				roles : []
			},
			resolve : {
				isLibraryLoaded : [ '$ocLazyLoad', 'isCoreLibraryLoaded', 'isDataTableLoaded',
						function($ocLazyLoad, isCoreLibraryLoaded, isDataTableLoaded) {
							return $ocLazyLoad.load([ LazyLoadConfig.googlemap ]);
						} ],
				properties : [ 'isLibraryLoaded', '$rootScope', 'PropertyService',
						function(isLibraryLoaded, $rootScope, PropertyService) {
							if ($rootScope.contextParams.userId == null) {
								return null;
							}
							return PropertyService.findPropertiesViewByUser($rootScope.contextParams.userId);
						} ]
			}
		});
		$stateProvider.state('app.secure.propertiescustomer', {
			url : '/{userId}/{customerId}/property?disconnected&pendingMoves&propertyId',
			params : {
				propertyId : null,
				disconnected : null,
				pendingMoves : null
			},
			templateUrl : 'app/views/partials/myproperties/properties.html',
			controller : 'PropertiesController',
			ncyBreadcrumb : {
				label : 'My Properties',
				description : ''
			},
			data : {
				customerChange : true,
				roles : []
			},
			resolve : {
				isLibraryLoaded : [ '$ocLazyLoad', 'isCoreLibraryLoaded', 'isDataTableLoaded',
						function($ocLazyLoad, isCoreLibraryLoaded, isDataTableLoaded) {
							return $ocLazyLoad.load([ LazyLoadConfig.googlemap ]);
						} ],
				properties : [ 'isLibraryLoaded', '$rootScope', 'PropertyService',
						function(isLibraryLoaded, $rootScope, PropertyService) {
							if ($rootScope.contextParams.customerId == null) {
								return null;
							}
							return PropertyService.findPropertiesViewByCustomer($rootScope.contextParams.customerId);
						} ]
			}
		});
		$stateProvider.state('app.secure.properties.map', {
			url : '/map',
			resolve : {
				properties : [ 'properties', function(properties) {
					return properties;
				} ],
				source : function() {
					return 'properties';
				}
			},
			views : {
				"child" : {
					templateUrl : 'app/views/partials/myproperties/map.html',
					controller : 'MapCtrl'
				}
			},
			ncyBreadcrumb : {
				label : 'Map View',
				description : ''
			}

		});
		$stateProvider.state('app.secure.propertiescustomer.map', {
			url : '/map',
			resolve : {
				properties : [ 'properties', function(properties) {
					return properties;
				} ],
				source : function() {
					return 'properties';
				}
			},
			views : {
				"child" : {
					templateUrl : 'app/views/partials/myproperties/map.html',
					controller : 'MapCtrl'
				}
			},
			ncyBreadcrumb : {
				label : 'Map View',
				description : ''
			}

		});
		$stateProvider.state('app.secure.properties.detail', {
			url : '/{propertyId}',
			views : {
				"child" : {
					templateUrl : "app/views/partials/myproperties/details.html",
					controller : 'PropertyDetailsCtrl'
				}
			},

			ncyBreadcrumb : {
				label : 'Property Details',
				description : 'Property Details'
			},
			data : {
				roles : []
			}
		});
		$stateProvider.state('app.secure.propertiescustomer.detail', {
			url : '/{propertyId}',
			views : {
				"child" : {
					templateUrl : "app/views/partials/myproperties/details.html",
					controller : 'PropertyDetailsCtrl'
				}
			},

			ncyBreadcrumb : {
				label : 'Property Details',
				description : 'Property Details'
			},
			data : {
				roles : []
			}
		});
		$stateProvider.state('app.secure.delegated-properties', {
			url : '/{userId}/{customerId}/delegatedproperty',
			params : {

			},
			templateUrl : 'app/views/partials/myproperties/delegated-properties.html',
			ncyBreadcrumb : {
				label : 'Manage Properties',
				description : ''
			},
			data : {
				roles : []
			}
		});
	}
	console.log('property config loaded');

})(window, window.angular);
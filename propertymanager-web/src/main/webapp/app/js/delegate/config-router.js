(function(window, angular) {
	'use strict';
	var app = angular.module('app');
	app.config([ '$stateProvider', $$appConfigDelegate ]);

	function $$appConfigDelegate($stateProvider) {
		$stateProvider.state('app.secure.delegates', {
			url : '/{userId}/delegate',
			templateUrl : 'app/views/partials/delegate/delegate.html',
			controller : 'DelegateController',
			ncyBreadcrumb : {
				label : 'Delegate Property',
				description : ''
			},
			data : {
				customerChange : false, // Since Manage Delegate
				// functionality will be
				// available only to the
				// Property Owners for their own
				// properties.
				roles : []
			},
			resolve : {
				isLibraryLoaded : [ '$ocLazyLoad', 'isCoreLibraryLoaded', 'isDataTableLoaded',
						function($ocLazyLoad, isCoreLibraryLoaded, isDataTableLoaded) {
							return $ocLazyLoad.load([ 'angucomplete' ]);

						} ]
				// ,
				// properties : [ 'isLibraryLoaded', '$rootScope',
				// 'PropertyService',
				// function(isLibraryLoaded, $rootScope, PropertyService) {
				// if ($rootScope.workingCustomer == null) {
				// return null;
				// }
				// return
				// PropertyService.findPropertiesByCustomer($rootScope.workingCustomer.customerId);
				// } ]
				,
				organization : [ 'isLibraryLoaded', '$rootScope', 'OrganizationService',
						function(isLibraryLoaded, $rootScope, OrganizationService) {
							if ($rootScope.contextParams.userId == null) {
								return null;
							}
							return OrganizationService.findOrganizationByQuery($rootScope.contextParams.userId);
						} ]
			}
		});
		$stateProvider.state('app.secure.delegatescustomer', {
			url : '/{userId}/{customerId}/delegate',
			templateUrl : 'app/views/partials/delegate/delegate.html',
			controller : 'DelegateController',
			ncyBreadcrumb : {
				label : 'Delegate Property',
				description : ''
			},
			data : {
				customerChange : false, // Since Manage Delegate
				// functionality will be
				// available only to the
				// Property Owners for their own
				// properties.
				roles : []
			},
			resolve : {
				isLibraryLoaded : [ '$ocLazyLoad', 'isCoreLibraryLoaded', 'isDataTableLoaded',
						function($ocLazyLoad, isCoreLibraryLoaded, isDataTableLoaded) {
							return $ocLazyLoad.load([ 'angucomplete' ]);

						} ]
			// ,
			// properties : [ 'isLibraryLoaded', '$rootScope',
			// 'PropertyService',
			// function(isLibraryLoaded, $rootScope, PropertyService) {
			// if ($rootScope.workingCustomer == null) {
			// return null;
			// }
			// return
			// PropertyService.findPropertiesByCustomer($rootScope.workingCustomer.customerId);
			// } ]
			}
		});
		$stateProvider.state('app.secure.delegates.adduser', {
			url : '/{userId}/delegate/adduser',
			templateUrl : 'app/views/partials/delegate/delegate.html',
			ncyBreadcrumb : {
				label : 'Delegate Property',
				description : ''
			},
			data : {
				roles : []
			},
			resolve : {
				isLibraryLoaded : [ '$ocLazyLoad', 'isCoreLibraryLoaded', 'isDataTableLoaded',
						function($ocLazyLoad, isCoreLibraryLoaded, isDataTableLoaded) {
							return $ocLazyLoad.load([ 'angucomplete' ]);

						} ]
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource',
					function($stateParams, $state, $uibModal, $resource) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/delegate/delegate_add_user.html',
							controller : 'ManageDelegatedUserController',
							resolve : {
								modalData : function() {
									return {

									}
								}
							},
							size : 'md'
						});
						modalInstance.result.then(function(newuser) {
							console.log('newuser', newuser);
							/*
							 * if (organization == null) { organization = {};
							 * organization.members = []; }
							 * organization.members.push({ user : newuser });
							 */
						});
						modalInstance.result.finally(function() {
							$state.go('^');
						});
					} ]
		});

	}
	console.log('delegate config loaded');
})(window, window.angular);
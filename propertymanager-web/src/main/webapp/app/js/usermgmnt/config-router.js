(function(window, angular) {
	'use strict';
	var app = angular.module('app');
	app.config([ '$stateProvider', $$appConfigUsermgmnt ]);
	function $$appConfigUsermgmnt($stateProvider) {
		$stateProvider.state('app.secure.usermgmnt', {
			url : '/{userId}/users',
			templateUrl : 'app/views/partials/usermgmnt/users.html',
			controller : 'UserController',
			ncyBreadcrumb : {
				label : 'Manage Users',
				description : ''
			},
			data : {
				roles : []
			},
			resolve : {
				deps : [ '$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load('toaster').then(function() {
						return true;
					});
				} ],
			}
		});
		$stateProvider.state('app.secure.usermgmnt.manage', {
			"abstract" : true,
			resolve : {
				user : ['$rootScope', 'IAMService', function($rootScope, IAMService) {
					return IAMService.findUserById($rootScope.contextParams.muserId);
				}]
			}
		});
		$stateProvider.state('app.secure.usermgmnt.manage.editprofile', {
			url : '/{muserId}/editprofile',
			ncyBreadcrumb : {
				label : 'Manage Team',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource', 'user',
					function($stateParams, $state, $uibModal, $resource, user) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/organization/organization_edit_member.html',
							controller : 'ManageOrganizationController',
							resolve : {
								modalData : function() {
									return {
										user : user
									}
								}
							},
							size : 'md'
						});
						modalInstance.result.finally(function() {
							$state.go('^.^');
						});
					} ]
		});
		$stateProvider.state('app.secure.usermgmnt.manage.sendmail', {
			url : '/{muserId}/sendmail',
			ncyBreadcrumb : {
				label : 'Manage Users',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource', 'user',
					function($stateParams, $state, $uibModal, $resource, user) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/usermgmnt/user_send_registration_email.html',
							controller : 'UserMgmntController',
							resolve : {
								modalData : function() {
									return {
										user : user
									}
								}
							},
							size : 'lg'
						});
						modalInstance.result.finally(function() {
							$state.go('^.^');
						});
					} ]
		});

		$stateProvider.state('app.secure.usermgmnt.manage.resetPassword', {
			url : '/{muserId}/resetPassword',
			ncyBreadcrumb : {
				label : 'Manage Users',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource', 'user',
					function($stateParams, $state, $uibModal, $resource, user) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/usermgmnt/user_reset_password.html',
							controller : 'UserMgmntController',
							resolve : {
								modalData : function() {
									return {
										user : user
									}
								}
							},
							size : 'lg'
						});
						modalInstance.result.finally(function() {
							$state.go('^.^');
						});
					} ]
		});

		$stateProvider.state('app.secure.usermgmnt.manage.deactivate', {
			url : '/{muserId}/deactivate',
			ncyBreadcrumb : {
				label : 'Manage Users',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource', 'user',
					function($stateParams, $state, $uibModal, $resource, user) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/myprofile/myprofile_close_account.html',
							controller : 'ManageProfileController',
							resolve : {
								modalData : function() {
									return {
										user : user,
										manageAccess : true
									}
								}
							},
							size : 'lg'
						});
						modalInstance.result.finally(function() {
							$state.go('^.^');
						});
					} ]
		});
		$stateProvider.state('app.secure.usermgmnt.editProfileCSR', {
			url : '/editProfile',
			ncyBreadcrumb : {
				label : 'Manage Users',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource',
					function($stateParams, $state, $uibModal, $resource) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/myprofile/myprofile_edit_profile.html',
							controller : 'ManageProfileController',
							resolve : {
								modalData : function() {
									return {}
								}
							},
							size : 'md'
						});
						modalInstance.result.finally(function() {
							$state.go('^');
						});
					} ]
		});
		$stateProvider.state('app.secure.usermgmnt.manage.accountEvents', {
			url : '/{muserId}/accountEvents',
			ncyBreadcrumb : {
				label : 'Manage Users',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource', 'user','$rootScope', 'IAMService',
					function($stateParams, $state, $uibModal, $resource, user,$rootScope, IAMService) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/usermgmnt/user_account_event.html',
							controller : 'UserMgmntController',
							resolve : {
								modalData : function() {
									return {
										user : user,
										accountEventList :IAMService.getAuditEventsList($rootScope.contextParams.muserId).then(function(response) {
											console.log(response);
											$rootScope.accountEventData = response;
											return ($rootScope.accountEventData);
											
										}, function(httpresponse) {
											console.log('fail', httpresponse);
										})
										 ,
										manageAccess : true
									}
								}
							},
							size : 'md'
						});
						modalInstance.result.finally(function() {
							$state.go('^.^');
						});
					} ]
		});
	}
	console.log('usermgmnt config loaded');
})(window, window.angular);
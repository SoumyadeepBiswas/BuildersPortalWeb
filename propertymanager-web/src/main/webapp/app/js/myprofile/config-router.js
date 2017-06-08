(function(window, angular) {
	'use strict';
	var app = angular.module('app');
	app.config([ '$stateProvider', $$appConfigProfile ]);
	function $$appConfigProfile($stateProvider) {
		$stateProvider.state('app.secure.myprofile', {
			url : '/{userId}/profile',
			templateUrl : 'app/views/partials/myprofile/myprofile.html',
			ncyBreadcrumb : {
				label : 'My Profile',
				description : ''
			},
			data : {
				roles : []
			},
			views : {
				"" : {
					templateUrl : 'app/views/partials/myprofile/myprofile.html'
				},
				"notification_preference@app.secure.myprofile" : {
					templateUrl : 'app/views/partials/dashboard/notification-preference2.html',
					controller : 'NotificationController'
				}
			},
			resolve : {
				isResourceLoaded : [ 'isCoreLibraryLoaded', '$ocLazyLoad', function(isCoreLibraryLoaded, $ocLazyLoad) {
					return true;
				} ]
			}

		});
		$stateProvider.state('app.secure.myprofile.editProfile', {
			url : '/editProfile',
			ncyBreadcrumb : {
				label : 'Edit Profile',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$rootScope', '$stateParams', '$state', '$uibModal', '$resource',
					function($rootScope, $stateParams, $state, $uibModal, $resource) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/myprofile/myprofile_edit_profile.html',
							controller : 'ManageProfileController',
							resolve : {
								modalData : function() {
									return {
										user : $rootScope.workingUser
									}
								}
							},
							size : 'md'
						});
						modalInstance.result.finally(function() {
							$state.go('^');
						});
					} ]
		});
		$stateProvider.state('app.secure.myprofile.changePassword', {
			url : '/changePassword',
			ncyBreadcrumb : {
				label : 'Change Password',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$rootScope', '$stateParams', '$state', '$uibModal', '$resource',
					function($rootScope, $stateParams, $state, $uibModal, $resource) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/myprofile/myprofile_change_password.html',
							controller : 'ManageProfileController',
							resolve : {
								modalData : function() {
									return {
										user : $rootScope.workingUser

									}
								}
							},
							size : 'lg'
						});
						modalInstance.result.finally(function() {
							$state.go('^');
						});
					} ]
		});
		$stateProvider.state('app.secure.myprofile.changeEmail', {
			url : '/changeEmail',
			ncyBreadcrumb : {
				label : 'Change Login Email',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$rootScope', '$stateParams', '$state', '$uibModal', '$resource',
					function($rootScope, $stateParams, $state, $uibModal, $resource) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/myprofile/myprofile_change_email.html',
							controller : 'ManageProfileController',
							resolve : {
								modalData : function() {
									return {
										user : $rootScope.workingUser

									}
								}
							},
							size : 'lg'
						});
						modalInstance.result.finally(function() {
							$state.go('^');
						});
					} ]
		});
		$stateProvider.state('app.secure.myprofile.closeAccount', {
			url : '/closeAccount',
			ncyBreadcrumb : {
				label : 'Close Web Account',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$rootScope', '$stateParams', '$state', '$uibModal', '$resource',
					function($rootScope, $stateParams, $state, $uibModal, $resource) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/myprofile/myprofile_close_account.html',
							controller : 'ManageProfileController',
							resolve : {
								modalData : function() {
									return {
										user : $rootScope.workingUser
									}
								}
							},
							size : 'lg'
						});
						modalInstance.result.finally(function() {
							$state.go('^');
						});
					} ]
		})
	}
	console.log('myprofile config loaded');
})(window, window.angular);
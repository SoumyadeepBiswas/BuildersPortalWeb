(function(window, angular) {
	'use strict';
	var app = angular.module('app');
	app.config([ '$stateProvider', $$appConfigOrginization ]);
	function $$appConfigOrginization($stateProvider) {
		$stateProvider.state('app.secure.organization', {
			url : '/{userId}/organization',
			templateUrl : 'app/views/partials/organization/organization.html',
			controller : 'OrganizationController',
			ncyBreadcrumb : {
				label : 'Manage Team',
				description : ''
			},
			data : {
				roles : []
			},
			resolve : {
				isLibraryLoaded : [ '$ocLazyLoad', 'isDataTableLoaded', function($ocLazyLoad, isDataTableLoaded) {
					return true;
				} ],
				organization : [ 'isLibraryLoaded', '$rootScope', 'OrganizationService',
						function(isLibraryLoaded, $rootScope, OrganizationService) {
							return OrganizationService.findOrganizationByQuery($rootScope.contextParams.userId);
						} ]
			}

		});
		$stateProvider.state('app.secure.organization.addmember', {
			url : '/member',
			ncyBreadcrumb : {
				label : 'Manage Team',
				description : ''
			},
			data : {
				roles : []
			},
			resolve : {
				organization : [ 'organization', function(organization) {
					return organization;
				} ]
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource', 'organization',
					function($stateParams, $state, $uibModal, $resource, organization) {

						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/organization/organization_add_member.html',
							controller : 'ManageOrganizationController',
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
							if (organization == null) {
								organization = {};
								organization.members = [];
							}
							organization.members.push({
								user : newuser
							});
						});
						modalInstance.result.fin_(function() {
							$state.go('^');
						});
					} ]
		});
		$stateProvider.state('app.secure.organization.manage', {
			"abstract" : true,
			resolve : {
				member : [ 'organization', '$rootScope', function(organization, $rootScope) {
					if (organization == null || organization.members == null) {
						return null;
					}
					return _.find(organization.members, function(mem) {
						return mem.id == $rootScope.contextParams.memberId;
					});
				} ]
			}
		});
		$stateProvider.state('app.secure.organization.manage.editmember', {
			url : '/member/{memberId}/edit',
			ncyBreadcrumb : {
				label : 'Manage Team',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource', 'organization', 'member',
					function($stateParams, $state, $uibModal, $resource, organization, member) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/organization/organization_edit_member.html',
							controller : 'ManageOrganizationController',
							resolve : {
								modalData : function() {
									return {
										organization : organization,
										member : member
									}
								}
							},
							size : 'md'
						});
						modalInstance.result.fin_(function() {
							$state.go('^.^');
						});
					} ]
		});
		$stateProvider.state('app.secure.organization.manage.useraccess', {
			url : '/member/{memberId}/access',
			ncyBreadcrumb : {
				label : 'Manage Team',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource', 'organization', 'member',
					function($stateParams, $state, $uibModal, $resource, organization, member) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/organization/organization_edit_member_access.html',
							controller : 'ManageOrganizationController',
							resolve : {
								modalData : function() {
									return {
										organization : organization,
										member : member
									}
								}
							},
							size : 'md'
						});
						modalInstance.result.fin_(function() {
							$state.go('^.^');
						});
					} ]
		});
		$stateProvider.state('app.secure.organization.manage.deactivate', {
			url : '/member/{memberId}/deactivate',
			ncyBreadcrumb : {
				label : 'Manage Team',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource', 'organization', 'member',
					function($stateParams, $state, $uibModal, $resource, organization, member) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/organization/organization_deactivate_member.html',
							controller : 'ManageOrganizationController',
							resolve : {
								modalData : function() {
									return {
										organization : organization,
										member : member
									}
								}
							},
							size : 'md'
						});
						modalInstance.result.fin_(function() {
							$state.go('^.^');
						});
					} ]
		});
		$stateProvider.state('app.secure.organization.manage.remove', {
			url : '/member/{memberId}/remove',
			ncyBreadcrumb : {
				label : 'Manage Team',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource', 'organization', 'member',
					function($stateParams, $state, $uibModal, $resource, organization, member) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/organization/organization_remove_member.html',
							controller : 'ManageOrganizationController',
							resolve : {
								modalData : function() {
									return {
										organization : organization,
										member : member
									}
								}
							},
							size : 'md'
						});
						modalInstance.result.fin_(function() {
							$state.go('^.^');
						});
					} ]
		});

	}
	console.log('org config loaded');
})(window, window.angular);
(function(window, angular) {
	'use strict';
	var app = angular.module('app');
	app.config([ '$stateProvider', $$appConfigCsr ]);
	function $$appConfigCsr($stateProvider) {
		$stateProvider.state('app.secure.csr', {
			url : '/{userId}/csr',
			templateUrl : 'app/views/partials/csr/csr.html',
			controller : 'CSRController',
			ncyBreadcrumb : {
				label : 'Home',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : ['$rootScope',function($rootScope) {
				$rootScope.workingUser = new User($rootScope.principal.user);
			}],
			resolve : {
				isResourceLoaded : [ 'isCoreLibraryLoaded', '$ocLazyLoad', function(isCoreLibraryLoaded, $ocLazyLoad) {
					return true;
				} ]
			}
		});
		$stateProvider.state('app.secure.csr.adduser', {
			url : '/user',
			ncyBreadcrumb : {
				label : 'Manage Team',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource',
					function($stateParams, $state, $uibModal, $resource) {

						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/iam/register_user_form.html',
							controller : 'RegistrationController',
							size : 'lg'
						});

						modalInstance.result.finally(function() {
							$state.go('^');
						});
					} ]
		});
		$stateProvider.state('app.secure.csr.switchcustomer', {
			url : '/{customerId}',
			ncyBreadcrumb : {
				label : 'Manage Customer',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource', '$rootScope', 'IAMService',
					function($stateParams, $state, $uibModal, $resource, $rootScope, IAMService) {
						if ($stateParams.userId || $stateParams.userId != 0) {
							IAMService.findUserById($stateParams.userId).then(function(user) {
								console.log("Got new ueser...", user);
								$rootScope.workingUser = user;
								if(!(_.findWhere($rootScope.workingUser.authorities,{'authority':'PropertyOwner'}))){
									$rootScope.workingUser.authorities.push({id: 0, roleCode: "PropertyOwner", authority: "PropertyOwner"});
								}
								$state.go('app.secure.dashboardcustomer', {
									userId : $stateParams.userId,
									customerId : $stateParams.customerId
								});
							});
						} else {
							$rootScope.workingUser = new User({
								id : 0,
								customerId : $stateParams.customerId,
								authorities : [ {
									authority : "PropertyOwner",
									id : 0,
									roleCode : "PropertyOwner"
								} ]
							});
							$state.go('app.secure.dashboardcustomer', {
								userId : 0,
								customerId : $stateParams.customerId
							});
						}

					} ]
		});
	}
	console.log('csr config loaded');
})(window, window.angular);
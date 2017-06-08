function ServerObject() {
	this.$resolved = false;
}
var ServerObject = new ServerObject();

'use strict';
var principal = null;
(function(window, angular) {
	console.log("config-router:init");
	app.run([ '$rootScope', '$state', '$stateParams', 'authorization', 'principal', '$timeout', 'Transaction',
			'pendingRequests', $$appRun ]);
	function $$appRun($rootScope, $state, $stateParams, authorization, principal, $timeout, Transaction,
			pendingRequests) {
		$rootScope.ApplConfig = ApplConfig;
		$rootScope.appData = {};
		$rootScope.global = {};
		$rootScope.global.transaction = Transaction;
		console.log('$rootScope.global.transaction ', $rootScope.global.transaction);

		$rootScope
				.$on(
						'$stateChangeStart',
						function(event, toState, toStateParams) {

							pageLoader.show('statestart', true);
							pendingRequests.cancelAll();

							$rootScope.$state = $state;
							$rootScope.$toState = toState;
							$rootScope.$toStateParams = toStateParams;

							// keep all route params
							if ($rootScope.contextParams == null) {
								$rootScope.contextParams = {};
							}
							// customer change or customer id
							// not present
							if ($rootScope.contextParams) {
								console.log("check workingcustomer***************", $rootScope.$state,
										$rootScope.contextParams, toStateParams);
								if (toStateParams.customerId == "0") {
									delete $rootScope.contextParams.customerId;
									$rootScope.workingCustomer = null;
								} else if ((toStateParams.customerId && $rootScope.workingCustomer != null && $rootScope.workingCustomer.customerId != toStateParams.customerId)
										|| ($rootScope.workingCustomer == null)) {
									console.log("*************** Customer change...set customer id to ", toStateParams);
									$rootScope.workingCustomer = _.findWhere($rootScope.accessibleCustomers, {
										customerId : toStateParams.customerId
									});
								}
							}
							$rootScope.contextParams = $.extend($rootScope.contextParams, toStateParams);
							console.log('Navigating to', toState, $rootScope.contextParams);
							if (toState.name.indexOf("secure") >= 0) {
								console.log('principal.isIdentityResolved()', principal.isIdentityResolved());
								if (principal.isIdentityResolved()) {
									authorization.authorize();
								}
							}
						});
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toStateParams) {
			console.log('Navigating completed', toState, $rootScope.contextParams);
			pageLoader.hide('statesuccess');
		});
		$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
			pageLoader.hide('stateerror');
			console.log('error', error);
			// event.preventDefault();
		});
		$rootScope.$on('notlogin', function() {
			$timeout(function() {
				$state.go('app.public.login');
			}, 200);
		});
		$rootScope.$on('unauthorized', function() {
			$rootScope.ApplConfig.appInitialize = true;
			$timeout(function() {
				$state.go('app.error.unauthorized');
			}, 200);
		});
		$rootScope.$on('50xerror', function() {
			$rootScope.ApplConfig.appInitialize = true;
			$timeout(function() {
				$state.go('app.error.50xerror');
			}, 200);
		});
	}

	app.config([ '$stateProvider', '$urlRouterProvider', $$appConfig ]);
	function $$appConfig($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise(function($injector, $location) {
			var url = $location.url();
			var state = $injector.get('$state');
			var $rootScope = $injector.get("$rootScope");
			console.log('**** I am going to url********* with home', url, $rootScope.contextParams);
			state.go("app.secure.home");
		});
		$stateProvider.state('app', {
			'abstract' : true,
			url : '',
			templateUrl : 'uxp/layout/baselayout.html',
		});
		$stateProvider.state('app.public', {
			'abstract' : true,
			templateUrl : 'uxp/layout/public/layout.html',
		});
		$stateProvider.state('app.secure', {
			'abstract' : true,
			url : '/app',
			templateUrl : 'uxp/layout/layout.html',
			controller : 'RootController',
			resolve : {
				authorize : [ 'authorization', '$state', function(authorization, $state) {
					console.log('resolve authorize::$state -> ', $state);
					var _auth = authorization.authorize();
					console.log('resolve authorize ::_auth-> ', _auth);
					return _auth;
				} ],
				isCoreLibraryLoaded : [ '$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load([ 'highcharts-ng', 'toaster', 'xeditable' ]);
				} ],
				isDataTableLoaded : [ '$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load('datatables').then(function() {
						return $ocLazyLoad.load('datatables.bootstrap');
					});
				} ],
				isChartLibraryLoaded : [ '$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load([ 'highcharts-ng' ]);
				} ],
				accessibleCustomers : [ '$rootScope', 'authorize', 'principal', 'AccessibleCustomerFactory',
						'isCoreLibraryLoaded',
						function($rootScope, authorize, principal, AccessibleCustomerFactory, isCoreLibraryLoaded) {
							console.log('base::accessibleCustomers', $rootScope.workingUser);
							$rootScope.roleText = "";
							if((_.findWhere($rootScope.principal.authorities,{'authority':'PropertyDelegate'})))
								$rootScope.roleText =  $rootScope.roleText + 'Property Delegate' + ', ';
							if((_.findWhere($rootScope.principal.authorities,{'authority':'PropertyOwner'})))
								$rootScope.roleText =  $rootScope.roleText + 'Property Owner' + ', ';
							if((_.findWhere($rootScope.principal.authorities,{'authority':'CSR'})))
								$rootScope.roleText =  $rootScope.roleText + 'CSR' + ', ';
							$rootScope.roleText = ($rootScope.roleText).substring(0,($rootScope.roleText.length -2));
							
							if (!$rootScope.workingUser.hasAnyAuthority(ApplConfig.allowedRoles)) {
								return [];
							}
							return AccessibleCustomerFactory.accessibleCustomers();
						} ],
				initDone : [ 'isCoreLibraryLoaded', 'authorize', function(isCoreLibraryLoaded, authorize) {
					return true;
				} ]

			}
		});
		
		
		
		$stateProvider.state('app.secure.home', {
			url : '/home',
			templateUrl : 'app/views/landing.html',
			ncyBreadcrumb : {
				label : 'Home',
				description : ''
			},
			data : {
				roles : []
			},
			controller : [ '$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {
				console.log('home routing..', $rootScope.workingUser);
				if (!$rootScope.workingUser.hasAnyAuthority(ApplConfig.allowedRoles)) {
					console.log('app.noaccess...');
					if ($rootScope.workingUser.isUserOnly()) {
						$state.transitionTo("app.secure.serviceRequest");
						/*$state.transitionTo("app.error.noaccess");*/
					} else {
						$state.transitionTo("app.error.nopmpaccess");
					}
					return;
				}
				if (principal.isCSR()) {
					$state.go('app.secure.csr', {
						userId : $rootScope.contextParams.userId
					});
				} else if ($rootScope.accessibleCustomers.length == 0) {
					$state.go('app.secure.dashboardnocustomer', {
						userId : $rootScope.contextParams.userId
					});
				} else if ($rootScope.workingCustomer != null && $rootScope.workingCustomer.customerId != null) {
					$state.go('app.secure.dashboardcustomer', {
						userId : $rootScope.contextParams.userId,
						customerId : $rootScope.workingCustomer.customerId
					});
				} else {
					$state.go('app.secure.dashboard', {
						userId : $rootScope.contextParams.userId
					});
				}
			} ],
			resolve : {
				isLibraryLoaded : function() {
					return true
				}
			}

		});

		$stateProvider.state('app.secure.myaccount', {
			url : '/{userId}/myaccount',
			onEnter : [ '$rootScope', '$stateParams', '$state', '$cookies',
					function($rootScope, $stateParams, $state, $cookies) {
						document.location = ApplConfig.myAccountUrl;
					} ]
		});
		$stateProvider.state('app.secure.userroute', {
			url : '/{userId}/route?state',
			params : {
				state : null
			},
			onEnter : [ '$rootScope', '$stateParams', '$state', '$cookies',
					function($rootScope, $stateParams, $state, $cookies) {
						console.log("app.secure.userroute....routing..", $stateParams);
						var newstate = $stateParams.state;
						newstate = newstate.replace("customer", "");

						console.log("app.secure.userroute....newstate..", newstate);

						delete $rootScope.contextParams.customerId;
						$rootScope.workingCustomer = null;

						$state.go(newstate, {
							userId : $stateParams.userId
						});
					} ]
		});
		$stateProvider.state('app.secure.customerroute', {
			url : '/{userId}/{customerId}/route?state',
			params : {
				state : null
			},
			onEnter : [ '$stateParams', '$state', '$cookies', function($stateParams, $state, $cookies) {
				console.log("app.secure.customerroute....routing..", $stateParams);
				var newstate = $stateParams.state;
				newstate = newstate.replace("customer", "") + "customer";
				$state.go(newstate, {
					userId : $stateParams.userId,
					customerId : $stateParams.customerId
				});
			} ]
		});
		$stateProvider.state('app.logout', {
			url:'/logout',
			templateUrl : 'uxp/layout/logout.html',
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$cookies','$timeout', function($stateParams, $state, $cookies,$timeout) {
				console.log('logout state enter.. moving to::', ApplConfig);
				var _logouturl = ApplConfig.iam.logoutURL() + "?redirectUrl=" + ApplConfig.homeurl;
				console.log('logout state enter.. moving to::' + _logouturl);
				$timeout(function() {
					window.location = _logouturl;
				},100);
			} ]
		});
		$stateProvider.state('app.error', {
			'abstract' : true,
			templateUrl : 'uxp/layout/layout.html'
		});
		$stateProvider.state('app.error.noaccess', {
			url : '/app/noaccess',
			templateUrl : 'app/views/partials/error/noaccess.html',
			onEnter : [ '$stateParams', '$state', '$cookies', '$uibModal',
					function($stateParams, $state, $cookies, $uibModal) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/linkaccount/linkaccount_redirect.html',
							controller : [ '$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
								$scope.close = function() {
									$uibModalInstance.dismiss('cancel');
								}
							} ],
							resolve : {
								modalData : function() {
									return {

									}
								}
							},
							size : 'md'
						});
						modalInstance.result.finally(function() {
							console.log("going to myaccount");
							document.location = ApplConfig.myAccountActivateUrl;
						});

					} ]
		});
		$stateProvider.state('app.error.nopmpaccess', {
			url : '/app/nopmpaccess',
			templateUrl : 'app/views/partials/error/noaccess.html',
			onEnter : [ '$rootScope', '$stateParams', '$state', '$cookies', '$uibModal',
					function($rootScope, $stateParams, $state, $cookies, $uibModal) {
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/linkaccount/no_pmp_access.html',
							controller : [ '$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
								$scope.close = function() {
									$uibModalInstance.dismiss('cancel');
								}
							} ],
							resolve : {
								modalData : function() {
									return {

									}
								}
							},
							size : 'md'
						});
						modalInstance.result.finally(function() {
							console.log("going to logout");
							$state.go("app.logout");
						});

					} ]
		});
		$stateProvider.state('app.error.unauthorized', {
			url : '/app/unauthorized',
			templateUrl : 'app/views/landing.html',
			ncyBreadcrumb : {
				label : 'Error',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource', '$cookies',
					function($stateParams, $state, $uibModal, $resource, $cookies) {
						console.log('app.unauthorized');
						// clean the session cookie
						$cookies.remove(ApplConfig.iam.getTokenKey(), {
							domain : ApplConfig.iam.domain(),
							path : '/'
						});
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/error/unauthorized.html',
							controller : [ '$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
								$scope.close = function() {
									$uibModalInstance.dismiss('cancel');
								}
							} ],
							resolve : {
								modalData : function() {
									return {

									}
								}
							},
							size : 'md'
						});
						modalInstance.result.then(function() {
							$state.go('app.public.login');
						});
						modalInstance.result.finally(function() {
							$state.go('app.public.login');
						});
					} ]

		});
		$stateProvider.state('app.error.50xerror', {
			url : '/app/error',
			templateUrl : 'app/views/landing.html',
			ncyBreadcrumb : {
				label : 'Error',
				description : ''
			},
			data : {
				roles : []
			},
			onEnter : [ '$stateParams', '$state', '$uibModal', '$resource', '$cookies',
					function($stateParams, $state, $uibModal, $resource, $cookies) {
						console.log('app.40xerror');
						var modalInstance = $uibModal.open({
							windowClass : '',
							templateUrl : 'app/views/partials/error/50xerror.html',
							controller : [ '$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
								$scope.close = function() {
									$uibModalInstance.dismiss('cancel');
								}
							} ],
							resolve : {
								modalData : function() {
									return {

									}
								}
							},
							size : 'md'
						});
						modalInstance.result.then(function() {
							$state.go('app.public.login');
						});
						modalInstance.result.finally(function() {
							$state.go('app.public.login');
						});
					} ]

		});
		$stateProvider.state('app.error404', {
			url : '/error404',
			templateUrl : 'app/views/error-404.html',
			ncyBreadcrumb : {
				label : 'Error 404 - The page not found'
			}
		});
		$stateProvider.state('app.error500', {
			url : '/error500',
			templateUrl : 'app/views/error-500.html',
			ncyBreadcrumb : {
				label : 'Error 500 - something went wrong'
			}
		});
		$stateProvider.state('app.blank', {
			url : '/blank',
			templateUrl : 'app/views/blank.html',
			ncyBreadcrumb : {
				label : 'Blank Page'
			}
		});
		
		/*Service Request Page*/
		
		$stateProvider.state('app.secure.serviceRequest',{
			url:'/serviceRequest',
			templateUrl : 'app/views/partials/servicerequest/service-request.html',
			ncyBreadcrumb : {
				label : 'Service Request'
			}
		})
		
		$stateProvider.state('app.secure.accountView',{
			url: '/accountView',
			templateUrl: 'app/views/partials/accountview/account-view.html',
			ncyBreadcrumb: {
				label: 'Account View',
				description: 'Service Request Summary'
			}
		})
		
		$stateProvider.state('app.secure.wizard',{
			url:'/XRTT1111',
			templateUrl: 'app/views/partials/servicerequest/servicerequestdetail/service-request-wizard.html',
			ncyBreadcrumb: {
				label: 'XRTT1111',
				description: 'Permit Number'
			},
			resolve : {
				deps : [ '$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load('wizard').then(function() {
						return true;
					});
				} ]
			}

			/*deps: [
				'$ocLazyLoad',
				function($ocLazyLoad) {
					return $ocLazyLoad.load({
						serie: true,
						files: [
							'lib/jquery/fuelux/wizard/wizard-custom.js'
							]
					});
				}
				]*/
		})
		
		
		$stateProvider.state('app.secure.serviceRequestDetail',{
			url: '/XRTT1112',
			templateUrl: 'app/views/partials/servicerequest/servicerequestdetail/serviceRequestDetails.html',
			ncyBreadcrumb: {
				label: 'XRTT1111',
				description: 'Service Request Detail'
			}
		})
		

	}

	app.controller('RootController', [ '$rootScope', '$scope', '$compile', '$timeout', '$filter',
			'accessibleCustomers', 'editableOptions', '$uibModal', $$RootController ]);
	function $$RootController($rootScope, $scope, $compile, $timeout, $filter, accessibleCustomers, editableOptions,
			$uibModal) {
		$rootScope.ApplConfig.appInitialize = true;
		// $rootScope.workingCustomer = workingCustomer;
		$rootScope.accessibleCustomers = accessibleCustomers;
		console.log('*********************CustomerFactory***************', $rootScope.accessibleCustomers);
		if ($rootScope.accessibleCustomers != null && $rootScope.accessibleCustomers.length == 1) {
			$rootScope.workingCustomer = $rootScope.accessibleCustomers[0];
		}
		editableOptions.theme = 'bs3';

		/* close handler for confirmation */
		$scope._popelement = null;
		$scope.setPopover = function($event) {
			console.log("RootController::setPopover ");
			$scope._popelement = $event.target;

		}
		$scope.closePopover = function($event) {
			console.log('RootController::close');
			$timeout(function() {
				if ($scope._popelement) {
					$scope._popelement.click();
				}
			}, 100);
		};

		$rootScope.selectAll = function(items, isSelected) {
			if (isSelected === undefined) {
				isSelected = true;
			}
			if ($.isArray(items)) {
				_.each(items, function(item, index) {
					item.selected = isSelected;
				});
			}
		};
		$rootScope.unSelectAll = function(items, isSelected) {
			if (isSelected === undefined) {
				isSelected = false;
			}
			if ($.isArray(items)) {
				_.each(items, function(item, index) {
					item.selected = isSelected;
				});
			}
		};
		$rootScope.countChecked = function(items) {
			var count = 0;
			if ($.isArray(items)) {
				$.each(items, function(index, item) {
					if (item.selected) {
						count++;
					}
				});
			}
			return count;
		};

		$rootScope.$on("user", function(event, newuser, olduser) {
			console.log("User data change", newuser);
			// need validation here
			$rootScope.workingUser = newuser;
			if ($rootScope.workingUser.id == $rootScope.principal.user.id) {
				$rootScope.principal.user = newuser;
			}
			$timeout(function() {
				$rootScope.$apply()
			}, 50);
		});
		$rootScope.$on('accessdenied', function() {
			var modalInstance = $uibModal.open({
				windowClass : '',
				templateUrl : 'app/views/partials/error/accessdenied.html',
				controller : [ '$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
					$scope.close = function() {
						$uibModalInstance.dismiss('cancel');
					}
				} ],
				size : 'md'
			});
		});
		$rootScope.$isResolved=function(obj) {
			if ($.isArray(obj)) {
				if(obj.length>0 && obj[0]) {
					return obj[0].$resolved;
				}
			}else if(obj) {
				return obj.$resolved;
			}
			return true;
		}
		$rootScope.$isNotResolved=function(obj) {
			return $rootScope.$isResolved(obj)==false;
		}
	}

	app.factory('AccessibleCustomerFactory', [
			'$rootScope',
			'principal',
			'CustomerService',
			function($rootScope, principal, CustomerService) {
				return {
					accessibleCustomers : function() {
						if ($rootScope.contextParams.customerId == null) {
							return CustomerService.findCustomersByUser($rootScope.contextParams.userId);
						} else {
							return CustomerService.findCustomersByUserNCustomer($rootScope.contextParams.userId,
									$rootScope.contextParams.customerId);
						}
					}
				}

			} ]);
})(window, window.angular);

var pageLoader = {
	triggercount : 0,
	timeoutID : null,
	timeinms : 0,
	interval : 200,
	show : function(msg, force) {
		if (force) {
			this.triggercount = 0;
		}
		if (this.triggercount == 0) {
			this.timeinms = 0;
			this.timeoutID = window.setInterval(function() {
				pageLoader.timeinms += pageLoader.interval;
				//$('#pageLoader').find('.loader-img').html("<span>" + pageLoader.timeinms + " ms.<span>");
			}, this.interval);
		}
		;
		this.triggercount++;
		$('#pageLoader').show();
		console.log("pageLoader:triggercount show " + this.triggercount + " " + msg);
	},
	hide : function(msg) {
		this.triggercount--;
		if (this.triggercount <= 0) {
			this.triggercount = 0;
			if (this.timeoutID) {
				window.clearInterval(this.timeoutID);
				this.timeoutID = null;
			}

			$('#pageLoader').hide();
		}
		console.log("pageLoader:triggercount hide " + this.triggercount + " " + msg);
	}
};
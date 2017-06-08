/*******************************************************************************
 * * Copyright (c) 2012-2013 London Hydro * ALL RIGHTS RESERVED * *
 * ****************************************************************************
 * 
 * File Name: session.js
 * 
 * Facility: London Hydro UI Client
 * 
 * Author: Affinity Systems
 * 
 * Revision History
 * 
 * Date Author Description ------- ------------------
 * ----------------------------------------- 24Jul13 Affinity Systems Original
 * version
 */
(function(window, angular) {
	'use strict';
	var uxpSession = angular.module('uxpSession', [ 'ngRoute', 'ngResource' ]);

	uxpSession.config([ '$httpProvider', '$rootScopeProvider', function($httpProvider, $rootScopeProvider) {
	} ]);

	uxpSession.run([ '$rootScope', 'Transaction', function($rootScope, Transaction) {
		$rootScope.appData = {};
		$rootScope.global = {};
		$rootScope.global.transaction = Transaction;
		console.log('$rootScope.global.transaction ', $rootScope.global.transaction);
	} ]);

	uxpSession.factory('principal', [
			'$rootScope',
			'$q',
			'$http',
			'$timeout',
			'$cookies',
			function($rootScope, $q, $http, $timeout, $cookies) {
				var _identity = undefined, _authenticated = false;
				console.log('user...', $cookies.get(ApplConfig.getTokenKey()));
				return {
					isIdentityResolved : function() {
						return angular.isDefined(_identity);
					},
					isAuthenticated : function() {
						return _authenticated && _identity != null;
					},
					hasApplicationRoles : function() {
						if (!_authenticated || !_identity.authorities)
							return false;
						for (var i = 0; i < _identity.authorities.length; i++) {
							for (var j = 0; j < ApplConfig.allowedRoles.length; j++) {
								if (_identity.authorities[i].authority == ApplConfig.allowedRoles[j]) {
									return true;
								}
							}
						}
						return false;
					},
					isInRole : function(role) {
						if (!_authenticated || !_identity.authorities)
							return false;

						return _identity.authorities.indexOf(role) != -1;
					},
					isInAnyRole : function(roles) {
						if (!_authenticated || !_identity.authorities)
							return false;

						for (var i = 0; i < _identity.authorities.length; i++) {
							if (this.isInRole(_identity.authorities[i]))
								return true;
						}

						return false;
					},
					authenticate : function(identity) {
						_identity = identity;
						_authenticated = identity != null;
					},
					identity : function(force) {
						var deferred = $q.defer();

						if (force === true)
							_identity = undefined;

						// check and see if we have retrieved the
						// identity data from the server. if we have,
						// reuse it by immediately resolving
						if (angular.isDefined(_identity)) {
							deferred.resolve(_identity);

							return deferred.promise;
						}
						var _authtoken = $cookies.get(ApplConfig.getTokenKey());
						if (_authtoken) {
							_identity = new Principal();
							var userMe = $http.get(ApplConfig.iam.whoamiURL()).then(
									function(res) {
										console.log("IAM................ME.....", res);
										_identity.user = res.data;
										_identity.authorities = _identity.user.authorities;
										$rootScope.principal = _identity;
										if ($rootScope.contextParams == null) {
											$rootScope.contextParams = {};
										}
										console.log("IAM................_identity.....", _identity);
										$rootScope.contextParams.userId = _identity.user.id;
										$rootScope.contextParams.customerId = _identity.user.customerId;
										$rootScope.workingUser = new User(_identity.user);
										console.log("IAM................workingUser.....", $rootScope.workingUser
												.isCSR(), $rootScope.workingUser);
										_authenticated = true;
										principal = _identity;
										console.log('_identity i userhash', _identity);
										deferred.resolve(_identity)
									});
						}
						return deferred.promise;
					}
				};
			} ]);

	uxpSession.factory('authorization', [
			'$rootScope',
			'$cookies',
			'$state',
			'principal',
			function($rootScope, $cookies, $state, principal) {
				return {
					authorize : function() {
						console.log('authorize cookie...',ApplConfig.getTokenKey(), $cookies.get(ApplConfig.getTokenKey()));
						var _loginCookie = $cookies.get(ApplConfig.getTokenKey());
						if (!_loginCookie) {
							$rootScope.$emit("notlogin");
						}
						return principal.identity().then(
								function() {
									var isAuthenticated = principal.isAuthenticated();
									console.log('isAuthenticated ', isAuthenticated);
									if (!isAuthenticated) {
										$rootScope.$emit("notlogin");
									}
									if ($rootScope.$toState.data && $rootScope.$toState.data.roles
											&& $rootScope.$toState.data.roles.length > 0
											&& !principal.isInAnyRole($rootScope.toState.data.roles)) {
										if (isAuthenticated) {
											// user is signed in but not
											// authorized
											// for desired state
											$state.transitionTo('accessdenied');
										} else {
											// user is not authenticated. Stow
											// the
											// state they wanted before you send
											// them to the sign-in state, so you
											// can
											// return them when you're done
											$rootScope.returnToState = $rootScope.toState;
											$rootScope.returnToStateParams = $rootScope.toStateParams;

											// now, send them to the signin
											// state
											// so they can log in
											$state.transitionTo('signin');
										}
									}
								}, function() {
									console.log('principal.identity() NOT ');
								});
					}
				};
			} ]);
	console.log("module uxpSession::initialized");
})(window, window.angular);
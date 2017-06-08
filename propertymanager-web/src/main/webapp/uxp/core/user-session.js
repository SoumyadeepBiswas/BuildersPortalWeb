(function(window, angular) {
	var uxpSession = angular.module('uxpSession');
	uxpSession.factory('UserSession', [ '$rootScope', function($rootScope) {
		function UserSession() {
			this.user = {};
		}
		UserSession.prototype.setUser = function(u) {
			this.user = u;
			$rootScope.isCsrUser = this.isCsrUser();
			$rootScope.isDeletageUser = this.isDeletageUser();
		}
		UserSession.prototype.getUser = function(u) {
			return this.user;
		}
		UserSession.prototype.resolveUser = function(userId) {
			return ($rootScope.csrUserId == 'undefined') ? userId : $rootScope.csrUserId;
		};

		UserSession.prototype.resolveCustomer = function(customerId) {
			return ($rootScope.csrCustomerId == 'undefined') ? customerId : $rootScope.csrCustomerId;
		};

		UserSession.prototype.isCsrUser = function() {
			if (_.isEmpty(this.user.roles)) {
				return false;
			}
			role = _.findWhere(this.user.roles, {
				roleName : "CSR"
			});
			return role != null;
		};
		UserSession.prototype.isDeletageUser = function() {
			if (_.isEmpty(this.user.roles)) {
				return false;
			}
			role = _.findWhere(this.user.roles, {
				roleName : "Billing"
			});
			return role != null;
		};

		UserSession.prototype.isCsrCustomer = function() {
			return ($rootScope.csrCustomerId == 'undefined') ? false : true;
		};

		UserSession.prototype.getCsrUser = function() {
			return $rootScope.csrUserId;
		};

		UserSession.prototype.getCsrCustomer = function() {
			return $rootScope.csrCustomerId;
		};

		UserSession.prototype.getCurrentUser = function() {
			return user.id;
		};

		UserSession.prototype.getCurrentCustomer = function() {
			return user.customerID;
		};

		UserSession.prototype.isUserHasRole = function() {
			return (user && user.roles && user.roles.length > 0 ? true : false);
		};
		UserSession.prototype.isLegacyMyAccount = function() {
			if (_.isEmpty(this.user.roles)) {
				return false;
			}
			role = _.findWhere(this.user.roles, {
				roleName : "Owner"
			});
			if (role == null) {
				role = _.findWhere(this.user.roles, {
					roleName : "Billing"
				});
			}
			console.log('isLegacyMyAccount::role', role, this.user.roles);
			return role != null;
		}

		return new UserSession();

	} ]);
})(window, window.angular);
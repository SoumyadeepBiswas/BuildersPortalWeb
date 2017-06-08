(function(window, angular) {
	var app = angular.module('app');
	app.factory('Transaction', [ '$rootScope', function($rootScope) {
		function Transaction() {
			this.scope = null;
			this.status = null;
			this.message = null;
			this.$resolved = true;
		}
		Transaction.prototype.$for = function(s) {
			this.scope = s;
			return this;
		}
		Transaction.prototype.error = function(msg, helpmsg) {
			if (msg != null) {
				this.status = 'E';
				this.message = msg;
			}
			return this;
		};
		Transaction.prototype.success = function(msg, helpmsg) {
			if (msg != null) {
				this.status = 'S';
				this.message = msg;
			}
			return this;
		};
		Transaction.prototype.clear = function() {
			this.status = null;
			this.message = null;

		};
		txn = new Transaction();

		Object.defineProperty(txn, 'isError', {
			get : function() {
				return this.status == 'E';
			}
		});

		Object.defineProperty(txn, 'isSuccess', {
			get : function() {
				return this.status == 'S';
			}
		});
		return txn;

	} ]);
})(window, window.angular);
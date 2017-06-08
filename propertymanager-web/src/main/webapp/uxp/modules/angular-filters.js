(function(window, angular) {
	var uxpSession = angular.module('uxpSession');
	uxpSession.filter('notResponded', function() {
		return function(list) {
			result = [];
			for (i = 0; i < list.length; i++) {
				if (list[i].response == '-1') {
					result.push(list[i]);
				}
			}
			return result;
		}
	});
})(window, window.angular);
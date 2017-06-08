app.service('UserAccountService', [ '$q', '$http', $$UserAccountService ]);
function $$UserAccountService($q, $http) {
	this.linkAccount = function(user, grantedApps, successCallback, errorCallback) {
		var config = {};
		config.headers = {};
		config.headers['Content-Type'] = 'application/json';

		var userView = {};
		userView.customerId = user.customerId;
		userView.grantedApps = grantedApps;

		$http.post('https://iam-dot-lh-platform-dev.appspot.com/user/linkAccount', userView, config).then(
				function(response) {
					console.debug(response.status + ':success data', response.data);
					successCallback(response.data);
				}, function(errResponse) {
					console.debug(errResponse.status + ':error data', errResponse.data);
					var error = errResponse.data;
					errorCallback(error.message ? error.message : "linkAccount.error.other");
				});
	};
};

app.controller('LinkAccountController', [ '$scope', '$log', '$location', '$cookies', '$rootScope', '$window',
		'UserAccountService', $$LinkAccountController ]);
function $$LinkAccountController($scope, $log, $location, $cookies, $rootScope, $window, UserAccountService) {

	$scope.hostedApps = [ {
		"code" : "PMP",
		"label" : "Property Management Portal",
		"selected" : true
	} ];
	$scope.selectedapp;

	$scope.linkAccount = function() {
		$log.info("user:" + $scope.user);

		var selectedApps = _.filter($scope.hostedApps, function(app, index) {
			return app.selected == true;
		});
		var grantedApps = _.pluck(selectedApps, 'code');
		$log.info("selectedApps:::", grantedApps);

		UserAccountService.linkAccount($scope.user, grantedApps, function(data) {
			$log.debug(':success data', data);
			$rootScope.global.transaction.success("link.account.successful");
			$("#linkaccount").hide();
		}, function(errorMessage) {
			$log.error('service errorMessage...', errorMessage);
			$rootScope.global.transaction.error(errorMessage);
		});
	};

	$scope.goToLogin = function() {
		$window.location.href = ApplConfig.loginUrl;
	};

	$scope.reset = function() {
		$rootScope.global.transaction.clear();
	};

};

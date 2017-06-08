app.controller('NotificationController', [ '$rootScope', '$scope', 'toaster', 'NotificationService',
		$$NotificationController ]);
function $$NotificationController($rootScope, $scope, toaster, NotificationService) {
	console.log("NotificationController::init");
	$scope.me = $rootScope.workingUser;

	$scope.notificationSubscription = new NotificationSubscription({
		notificationEmail : $scope.me.username
	});
	$scope.notificationSubscription.$resolved = false;
	$scope.$on('notificationChange', function(e, data) {
		console.log('notificationChange new data: ' + data);
		$scope.notificationSubscription = data;
		$scope.showNotificationSubscriptions();
	});
	$scope.showNotificationSubscriptions = function() {
		if ($scope.notificationSubscription) {
			$scope.notificationSubscription.matchEmail($scope.me.username);
			console.log('notificationSubscription', $scope.notificationSubscription, $scope.me);
			if ($scope.notificationSubscription.notificationEmail == null) {
				$scope.notificationSubscription.notificationEmail = $scope.me.username;
			}
		}
	};
	$scope.findNotificationSubscriptions = function() {
		if ($rootScope.workingUser == null || $rootScope.workingUser.id == null) {
			console.log("no workingUser!!");
			return;
		}
		NotificationService.findNotificationSubscriptions($rootScope.workingUser.id, {
			notifier : 'notificationChange',
			className : NotificationSubscription
		}).then(function(response) {
			// $scope.notificationSubscription = response;
		});
	};
	$scope.saveNotificationSubscription = function(data) {
		NotificationService
				.saveNotificationSubscription($rootScope.workingUser.id, data)
				.then(
						function(response) {
							toaster
									.pop({
										type : 'success',
										title : "Confirmation",
										body : data.notificationType == "Moves" ? "Notification subscription for Moves set successfully."
												: "Notification subscription for Disconnections set successfully.",

									});
						}, function(httpresponse) {
							toaster.pop({
								type : 'warning',
								title : "Error",
								body : httpresponse.statusText,

							});
						});
	}

	$scope.deleteNotificationSubscription = function(data) {
		NotificationService
				.deleteNotificationSubscription($rootScope.workingUser.id, data)
				.then(
						function(response) {
							toaster
									.pop({
										type : 'success',
										title : "Confirmation",
										body : data.notificationType == "Moves" ? "Notification subscription for Moves removed successfully."
												: "Notification subscription for Disconnections removed successfully.",

									});
						}, function(httpresponse) {
							toaster.pop({
								type : 'warning',
								title : "Error",
								body : httpresponse.statusText,
							});
						});

	}
	$scope.actionSubscriptionChanged = function() {
		if ($scope.notificationSubscription.isMoveEnable) {
			$scope.actionMovesSubsciptionChanged();
		}
		if ($scope.notificationSubscription.isDisconnectionEnable) {
			$scope.actionDisconnectionSubsciptionChanged();
		}
	}
	$scope.actionMovesSubsciptionChanged = function() {
		console.log("actionMovesSubsciptionChanged", $scope.notificationSubscription);
		if ($scope.notificationSubscription.notificationEmail == null) {
			console.warn("actionMovesSubsciptionChanged:: No notification email");
			return;
		}
		if ($scope.notificationSubscription.isMoveEnable) {
			$scope
					.saveNotificationSubscription($scope.notificationSubscription
							.toServerMove($rootScope.workingUser.id));

		} else {
			$scope.deleteNotificationSubscription($scope.notificationSubscription
					.toServerMoveDelete($rootScope.workingUser.id));
		}
	}
	$scope.actionDisconnectionSubsciptionChanged = function() {
		console.log("actionDisconnectionSubsciptionChanged", $scope.notificationSubscription);
		if ($scope.notificationSubscription.notificationEmail == null) {
			console.warn("actionDisconnectionSubsciptionChanged:: No notification email");
			return;
		}
		if ($scope.notificationSubscription.isDisconnectionEnable) {
			$scope.saveNotificationSubscription($scope.notificationSubscription
					.toServerDisconnection($rootScope.workingUser.id));
		} else {
			$scope.deleteNotificationSubscription($scope.notificationSubscription
					.toServerDisconnectionDelete($rootScope.workingUser.id));
		}
	}

	$scope.updateSameAsLogin = function() {
		if ($scope.notificationSubscription.notificationEmailIsLoginEmail == true) {
			$scope.notificationSubscription.notificationEmail = $scope.me.username;
			$scope.actionSubscriptionChanged();
			console.log($scope.notificationSubscription);
		} else {
			$scope.notificationSubscription.notificationEmail = null;
		}
	}
	$scope.findNotificationSubscriptions();
};

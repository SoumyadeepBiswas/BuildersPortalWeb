function NotificationSubscription(data) {
	if ($.isArray(data)) {
		var _parent = this;
		_.each(data, function(value, index) {
			_parent.notificationEmail = value.notificationAddress;
			_parent.isMoveEnable = _parent.isMoveEnable || (value.notificationType == "Moves");
			_parent.isDisconnectionEnable = _parent.isDisconnectionEnable || (value.notificationType == "Disconnected")
		});
	} else {
		$.extend(true, this, data);
		this.notificationEmailIsLoginEmail = false;
		this.notificationEmail = this.notificationAddress;
		this.isMoveEnable = (this.notificationType == "Moves");
		this.isDisconnectionEnable = (this.notificationType == "Disconnected")
	}
	this.$resolved = true;
}
NotificationSubscription.prototype.matchEmail = function(userEmail) {
	if (this.notificationEmailIsLoginEmail == null) {
		this.notificationEmailIsLoginEmail = userEmail;
	}
	this.notificationEmailIsLoginEmail = (this.notificationEmail == userEmail);
}
NotificationSubscription.prototype.toServerMove = function(userId) {
	return {
		userId : userId,
		notificationType : "Moves",
		notificationMethod : "Email",
		notificationAddress : this.notificationEmail
	}
}
NotificationSubscription.prototype.toServerMoveDelete = function(userId) {
	return {
		userId : userId,
		notificationType : "Moves"
	}
}
NotificationSubscription.prototype.toServerDisconnection = function(userId) {
	return {
		userId : userId,
		notificationType : "Disconnected",
		notificationMethod : "Email",
		notificationAddress : this.notificationEmail
	}
}
NotificationSubscription.prototype.toServerDisconnectionDelete = function(userId) {
	return {
		userId : userId,
		notificationType : "Disconnected"
	}
}

app.service('NotificationService',
		[ '$q', '$http', '$rootScope', '$apiRegistry', 'AsyncBatchService', $$NotificationService ]);
function $$NotificationService($q, $http, $rootScope, $apiRegistry, AsyncBatchService) {
	$apiRegistry.add({
		name : 'getDashboardDetails',
		url : '/Customer/:customerId/Dashboard',
		method : 'get'
	}).add({
		name : 'getNotificationDetails',
		url : '/User/:userId/Notification',
		method : 'get'
	}).add({
		name : 'getNotificationDetails',
		url : '/User/:userId/Notification',
		method : 'post'
	}).add({
		name : 'getNotificationDetails',
		url : '/User/:userId/Notification',
		method : 'delete'
	});

	this.findNotificationSubscriptions = function(userId, batch) {
		var result = $q.defer();
		if (batch) {
			AsyncBatchService.submit({
				notifier : batch.notifier,
				className : batch.className,
				uri : '/User/' + userId + '/Notification'
			});
		} else {
			var dashboardNotificationData = $http.get('/User/' + userId + '/Notification');
			$q.all([ dashboardNotificationData ]).then(function(responses) {
				result.resolve(new NotificationSubscription(responses[0].data));
			}, function(error) {
				console.warn("findNotificationSubscriptions error::", error);
				if (error.status == 404) {
					result.resolve(new NotificationSubscription());
				}
			});
		}
		return result.promise;
	};

	this.saveNotificationSubscription = function(userId, data) {
		var dashboardNotificationPostData = $http({
			method : 'POST',
			url : '/User/' + userId + '/Notification',
			data : data
		});

		var result = $q.defer();
		$q.all([ dashboardNotificationPostData ]).then(function(responses) {
			var dashboardNotificationPostDataOutput = responses[0].data;
			result.resolve(dashboardNotificationPostDataOutput);
		});
		return result.promise;
	};
	this.deleteNotificationSubscription = function(userId, data) {
		var dashboardNotificationDeleteData = $http({
			method : 'DELETE',
			url : '/User/' + userId + '/Notification',
			headers : {
				'Content-Type' : 'application/json;charset=utf-8;'
			},
			data : data
		});
		var result = $q.defer();
		$q.all([ dashboardNotificationDeleteData ]).then(function(responses) {
			var dashboardNotificationDeleteDataOutput = responses[0].data;
			result.resolve(dashboardNotificationDeleteDataOutput);
		});
		return result.promise;
	};
};
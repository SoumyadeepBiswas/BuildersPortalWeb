app.controller('PropertySummaryController', [ '$rootScope', '$scope', 'DashboardService', 'workingCustomer',
		'PropertyResource', PropertySummaryController ]);
function PropertySummaryController($rootScope, $scope, DashboardService, workingCustomer, PropertyResource) {
	$scope.workingCustomer = workingCustomer;
	$scope.PropertyResource = PropertyResource;
	$scope.propertySummary = null;
	$scope.serviceDisconectSummary = null;
	$scope.dashboardData = {};

	$scope.$on('dashboardDataChange', function(e, data) {
		console.log('new data: ' + data);
		$scope.dashboardData = data;
		$scope.updateDashboardDetails();
	});
	$scope.getDashboardDetails = function() {
		DashboardService.getDashboardDetails($rootScope.workingUser.id,
				$scope.workingCustomer == null ? null : $scope.workingCustomer.customerId, {
					notifier : 'dashboardDataChange',
					className : PropertyDashboard
				}).then(function(response) {
			console.log("submited....");
		});
	}
	$scope.updateDashboardDetails = function() {
		var defOptProperties = {
			classificationList : PropertyResource.classificationList
		}
		var defOptDisconnected = {
			nodataText : '<div><div class="text-center pie-title-2lines"><b>All<br> Connected</b></div><div>',
			classificationList : PropertyResource.classificationList
		};
		var defOptMove = {
			nodataText : '<div><div class="text-center  pie-title-2lines"><b>No<br> Pending Moves</b></div><div>',
			classificationList : PropertyResource.classificationList
		};

		_.each($scope.dashboardData, function(value, index) {
			console.log('getDashboardDetails:: ', index, value);
			if (value.parameterName == 'properties') {
				$scope.propertySummary = str2KeyValue(value.stringValue);
				new donut('donut-chart-property', $scope.propertySummary, defOptProperties);

			} else if (value.parameterName == 'disconnected') {
				$scope.serviceDisconectSummary = str2KeyValue(value.stringValue);
				new donut('donut-chart-disconnected', $scope.serviceDisconectSummary, defOptDisconnected);

			} else if (value.parameterName == 'pendingMove') {
				$scope.pendingMoveSummary = str2KeyValue(value.stringValue);
				new donut('donut-chart-moves', $scope.pendingMoveSummary, defOptMove);
			}
		});
	};
	$scope.getPropertyCount = function(type) {
		var count = 0;
		_.each($scope.propertySummary, function(value, index) {
			var _p = _.pairs(value)
			if (_p[0][0] == type) {
				count = _p[0][1];
				return;
			}
		});
		return count;
	}
	$scope.getPropertyCountLabel = function(type) {
		var count = 0;
		_.each($scope.propertySummary, function(value, index) {
			var _p = _.pairs(value)
			if (_p[0][0] == type) {
				count = _p[0][1];
				return;
			}
		});
		if (count > 0 && (type == "High Rise" || type == "Multi-Unit")) {
			return count + " ( 99 units)"
		}
		return count;
	}
	$scope.getDashboardDetails();
};

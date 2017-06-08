function PropertyDashboard(data) {
	this.version = 1;
	$.extend(true, this, data);
	var _parent = this;
	this.$resolved = true;
}
var queue = [];
app.service('AsyncBatchService', [ '$q', '$interval', '$http', '$rootScope', '$apiRegistry', $$AsyncBatchService ]);
function $$AsyncBatchService($q, $interval, $http, $rootScope, $apiRegistry) {

	this.submit = function(req) {
		queue.push(req);
	}
	$interval(function() {
		if (queue.length > 0) {
			console.log("check pending req...", queue.length);
			var reqs = [];
			var _notifier = [];
			_.each(queue, function(item) {
				reqs.push(item.uri);
				_notifier.push(item);
			});
			queue = [];
			$http.get('/Batch', {
				params : {
					uri : reqs
				}
			}).then(function(response) {
				console.log("batch.... response.....", _notifier, response.data);
				var _data = response.data;
				_.each(_notifier, function(item, idx) {
					var _object = new item.className(_data[idx]);
					console.log("notify....... response.....", item.notifier, _object);
					$rootScope.$broadcast(item.notifier, _object);
				});
			});
		}
	}, 2000);
}
app.service('BatchService', [ '$q', '$interval', '$http', '$rootScope', '$apiRegistry', $$BatchService ]);
function $$BatchService($q, $interval, $http, $rootScope, $apiRegistry) {
	this.all = function(multireqs) {
		var result = $q.defer();
		var reqs = [];
		_.each(multireqs, function(item) {
			reqs.push(item.uri);
		});
		queue = [];
		$http.get('/Batch', {
			params : {
				uri : reqs
			}
		}).then(function(response) {
			console.log("batch.... response.....", response.data);
			var _r = [];
			var _data = response.data;
			_.each(multireqs, function(item, idx) {
				_r.push(ObjectUtil.toObject(_data[idx], item.className));
			});
			result.resolve(_r);
		});
		return result.promise;
	}
}
app.service('DashboardService',
		[ '$q', '$http', '$rootScope', '$apiRegistry', 'AsyncBatchService', $$DashboardService ]);
function $$DashboardService($q, $http, $rootScope, $apiRegistry, AsyncBatchService) {
	$apiRegistry.add({
		name : 'getDashboardDetails',
		url : '/User/:userId/Customer/:customerId/Dashboard',
		method : 'get'
	});
	this.getDashboardDetails = function(userId, customerId, batch) {
		console.log('getDashboardDetails :::: userId ::: ', userId);
		var dashboardData;
		if (customerId == null) {
			customerId = 0;
		}
		var result = $q.defer();
		if (batch) {
			AsyncBatchService.submit({
				notifier : batch.notifier,
				className : batch.className,
				uri : '/User/' + userId + '/Customer/' + customerId + '/Dashboard'
			});
			result.resolve("pending");
		} else {
			dashboardData = $http.get('/User/' + userId + '/Customer/' + customerId + '/Dashboard');
			$q.all([ dashboardData ]).then(function(responses) {
				var dashboardDataOutput = new PropertyDashboard(responses[0].data);
				result.resolve(dashboardDataOutput);
			});
		}
		return result.promise;
	};
};
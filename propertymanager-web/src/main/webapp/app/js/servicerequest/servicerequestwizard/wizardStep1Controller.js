app.controller('wizardStep1Controller',['$scope', '$rootScope','$state',function($scope,$rootScope, $state){
	
	$scope.hasStandardMeterLocation= true;
	console.log("The Value of hasStandardMeterLocation "+$scope.hasStandardMeterLocation);
	
	$scope.permitNumbers = $rootScope.permitNumberName;
	$scope.doorPoint= $rootScope.doorPointNumber;
	$scope.lot= $rootScope.lotNumber;
	
	$scope.goToHome= function(){
		$state.go('app.secure.serviceRequest')
	}
	
}]);

app.directive('tooltip', function() {
	return {
	restrict : 'A',
	link : function(scope, element, attrs) {
	$(element).hover(function() {
	// on mouseenter
	$(element).tooltip('show');
	}, function() {
	// on mouseleave
	$(element).tooltip('hide');
	});
	}
	};
	});
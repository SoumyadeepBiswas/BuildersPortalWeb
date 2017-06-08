'use strict';

app.controller('wizardController',['$scope','$rootScope','$state', function($scope, $rootScope,$state){
	$scope.step = 1;
	$scope.enable = {val:true};
	
	$scope.stepCheck = function(_step){
		$scope.step = _step;
		if(_step==2 || _step==4) $scope.enable.val = false;
		else $scope.enable.val = true;
	}
	
	$scope.checkButtonText = function(){
		var elem = document.getElementById('wizardButton');
		var txt = elem.textContent ;
		console.log($scope.step);
		$scope.serviceDetailsConfirmed = false;
		if(txt=='Submit')
			{
				$state.go('app.secure.serviceRequestDetail');
			}		
	}	
	
	/*$scope.permitNumber = $rootScope.permit;
	$scope.doorPoint= $rootScope.doorPointNumber;
	$scope.lot= $rootScope.lotNumber;*/
	
	
}]);
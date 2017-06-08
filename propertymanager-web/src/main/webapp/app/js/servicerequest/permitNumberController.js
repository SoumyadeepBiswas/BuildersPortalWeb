'use strict';

app.controller('permitNumberController' ,['$scope','$state','$rootScope',function($scope,$state, $rootScope){
	 $scope.pageToBeLanded= function()
	{
		/*$scope.check= loginService.checkFirstTimeUser();*/
		$state.go('app.secure.wizard');
		/*if($scope.check)
			{
				$state.go('app.wizard');
			}
		else
			{
				$state.go('app.serviceRequestDetail');
			}*/
	}
	 
	console.log("Inside Permit Number Controller"); 
	 
	$rootScope.permitNumberName;
	$rootScope.doorPointNumber="";
	$rootScope.lotNumber="";
	
	$scope.setPermitDetail= function(_permit,_doorPointNumber,_lotNumber){
		$rootScope.permitNumberName= _permit;
		$rootScope.doorPointNumber= _doorPointNumber;
		$rootScope.lotNumber= _lotNumber;
	}
	
	/*$scope.user = {
			date: null
	}*/
	
	$scope.landingPage1113 = function()
	{
				$state.go('app.secure.wizard');
			
	}
	
	$scope.landingPage = function(){
		$state.go('app.secure.serviceRequestDetail');
	}
	
	/*$.fn.editable.defaults.mode = 'inline';
	$(document).ready(function() {
	    $('#username').editable();
	});*/
	
	$scope.user = {
			dob: new Date(2017, 5, 11)
		};
		console.log($scope.user.dob);
		$scope.opened = [];
		
		$scope.open = function($event, elementOpened) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.opened[elementOpened] = !$scope.opened[elementOpened];
		};
	
}]);
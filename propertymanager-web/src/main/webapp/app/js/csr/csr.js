app.controller('CSRController', [ '$rootScope', '$scope', '$timeout', $$CSRController ]);
function $$CSRController($rootScope, $scope, $timeout) {

	$scope.fnRegisterUser = function() {
		var modalInstance = $uibModal.open({
			windowClass : '',
			templateUrl : 'app/views/partials/iam/register_user_form.html',
			controller : 'RegistrationController',
			size : 'lg'
		});
	};

};
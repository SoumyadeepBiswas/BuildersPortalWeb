'use strict';

app.controller('ManageProfileController', [ '$controller', '$rootScope', '$scope', '$uibModalInstance', 'toaster',
		'IAMService', 'modalData', $$ManageProfileController ]);
function $$ManageProfileController($controller, $rootScope, $scope, $uibModalInstance, toaster, IAMService, modalData) {

	$scope.user = modalData.user;
	console.log("ManageProfileController ", $scope.user);

	$scope.maxLengthRemark = 500;
	$scope.userform = {};
	$scope.userform.password = '';
	$scope.userform.firstName = $scope.user.firstName;
	$scope.userform.lastName = $scope.user.lastName;
	$scope.userform.phoneNumber = $scope.user.phoneNumber;

	$scope.remarkStatement = '';
	$scope.confirmAccountClosing = false;

	$scope.close = function() {
		if ($scope.newuser == null) {
			$scope.cancel();
		} else {
			$uibModalInstance.close($scope.newuser);
		}
	};
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.actionUpdateUser = function() {

		if ($scope.uiform.$invalid) {
			return;
		}

		IAMService.updateUserNameAndContact($scope.user.id, $scope.userform).then(function(response) {
			$rootScope.$broadcast("user", response);
			$rootScope.workingUser.firstName = $scope.userform.firstName;
			$rootScope.workingUser.lastName = $scope.userform.lastName;
			$rootScope.workingUser.phoneNumber = $scope.userform.phoneNumber;
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "Profile updated."

			});
			$scope.close();
		}, function(httpresponse) {
			console.log('fail', httpresponse);
			toaster.pop({
				type : 'warning',
				title : "Error",
				body : httpresponse.statusText,
				timeout : 300000
			});
		});

	}
	$scope.actionUpdatePassword = function() {
		if ($scope.uiform.$invalid) {
			return;
		}
		if (($scope.userform.password).trim() == "" || $scope.userform.password.indexOf(" ") >= 0) {
			toaster.pop({
				type : 'info',
				title : "Information",
				body : "Password field must not contain spaces."

			});
			return;
		}
		if ($scope.userform.password != $scope.userform.passwordConfirm) {
			toaster.pop({
				type : 'info',
				title : "Information",
				body : "Please match both the fields new password and confirm password."

			});
			return;
		}
		var requestform = {
			oldPassword : $scope.userform.oldpassword,
			password : $scope.userform.password
		}
		IAMService.changePassword($scope.user.id, requestform).then(function(response) {
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "Change password done."
			});
			$scope.close();
		}, function(httpresponse) {
			console.log('fail', httpresponse);
			toaster.pop({
				type : 'warning',
				title : "Error",
				body : httpresponse.statusText,
				timeout : 300000
			});
		});
	}

	$scope.actionUpdateEmail = function() {
		if ($scope.uiform.$invalid) {
			return;
		}
		if ($scope.userform.username != $scope.userform.usernameConfirm) {

			toaster.pop({
				type : 'info',
				title : "Information",
				body : "Email id provided in Confirm email should match with the email id provided in New email."

			});
			return;
		}
		var requestform = {
			email : $scope.userform.username,
			applicationName: ApplConfig.applicationName,
			applicationUrl: ApplConfig.homeurl
			
		};

		IAMService.requestForChangeEmail($scope.user.id, requestform).then(function(response) {
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "An Email has been sent to your new email address with a link for activation."
			});
			$scope.close();
		}, function(httpresponse) {
			console.log('fail', httpresponse);
			toaster.pop({
				type : 'warning',
				title : "Error",
				body : httpresponse.statusText,
				timeout : 300000
			});
		});
	}

	$scope.actionCloseAccount = function() {
		
		if($scope.user.status.value == 'Deactivate'){
			toaster.pop({
				type : 'warning',
				title : "Error",
				body : "Users account has already been closed."
			});
			return;
		}

		var requestform = {
			remark : $scope.userform.remark
		};
		IAMService.deactivateUser($scope.user.id, requestform).then(function(response) {
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "User Deactivated successfully."
			});
			$scope.close();
			if (modalData.manageAccess) {
				$rootScope.populatePreSearchedUser();
			}
		}, function(httpresponse) {
			console.log('fail', httpresponse);
			toaster.pop({
				type : 'warning',
				title : "Error",
				body : httpresponse.statusText,
				timeout : 300000
			});
		});

	}
};

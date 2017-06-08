function DataTableOrgMemembers(DTOptionsBuilder, DTColumnDefBuilder) {

	this.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(10);

	this.dtOptions = DTOptionsBuilder.newOptions().withDisplayLength(10);
	this.dtOptions.sDom = "t<'row DTTTFooter'<'col-sm-6'i><'col-sm-6'p>>";
	this.dtOptions.lengthMenu = [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ];
	this.dtOptions.sPageButton__ = "button";

	this.dtOptions.language = {
		lengthMenu : "Display _MENU_ users",
		zeroRecords : "No user to display",
		emptyTable : "No user to display",
		info : "Showing _START_ to _END_ of _TOTAL_ user(s)"

	};
	this.dtColumnDefs = [ DTColumnDefBuilder.newColumnDef(0).notSortable(), DTColumnDefBuilder.newColumnDef(1),
			DTColumnDefBuilder.newColumnDef(4).notSortable(), DTColumnDefBuilder.newColumnDef(5).notSortable(),
			DTColumnDefBuilder.newColumnDef(6).notSortable(), DTColumnDefBuilder.newColumnDef(7).notSortable(),
			DTColumnDefBuilder.newColumnDef(8).notSortable() ];
}

app.controller('OrganizationController', [ '$rootScope', '$scope', '$uibModal', '$window', '$timeout',
		'DTOptionsBuilder', 'DTColumnDefBuilder', 'organization', 'toaster','IAMService', $$OrganizationController ]);
function $$OrganizationController($rootScope, $scope, $uibModal, $window, $timeout, DTOptionsBuilder,
		DTColumnDefBuilder, organization, toaster,IAMService) {
	console.log("OrganizationController::init");
	$rootScope.showRoles = {};
	$rootScope.showRoles["EnergyDelegate"] = "Energy Delegate";
	$rootScope.showRoles["AccountDelegate"] = "Account Delegate";
	$rootScope.showRoles["PropertyOwner"] = "Property Owner";
	$rootScope.organization = organization;
	$scope.dtOrgMember = new DataTableOrgMemembers(DTOptionsBuilder, DTColumnDefBuilder);

	$scope.setNewDelegateData = function(member) {
		$rootScope.editMemberData = member;
	}
	$scope.resendEmail = function(userId) {
		IAMService.resendRegistrationMail(userId).then(function(response) {
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "Invitation sent successfully."

			});
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

app.controller('ManageOrganizationController', [ '$rootScope', '$scope', '$uibModalInstance', 'toaster',
		'OrganizationService', 'OrganizationResource', 'IAMService', 'modalData', $$ManageOrganizationController ]);
function $$ManageOrganizationController($rootScope, $scope, $uibModalInstance, toaster, OrganizationService,
		OrganizationResource, IAMService, modalData) {
	$scope.OrganizationResource = OrganizationResource;
	$scope.memberform = {
		customerId : 0
	};

	$scope.memberform.defaultProfile = $scope.OrganizationResource.lovRoles[0].value;

	$scope.newuser = null;
	$scope.member = modalData.member;
	$scope.organization = modalData.organization;
	if ($scope.member) {
		$scope.memberform = $scope.member.form();
		$rootScope.member = $scope.member;
	} else if ($rootScope.editPopupData) {
		$scope.memberform.firstName = $rootScope.editPopupData.firstName;
		$scope.memberform.lastName = $rootScope.editPopupData.lastName;
		$scope.memberform.phoneNumber = $rootScope.editPopupData.phoneNumber;
		$scope.memberform.userName = $rootScope.editPopupData.username;
	}

	console.log('ManageOrganizationController', $scope.memberform);

	$scope.actionAddUser = function() {
		console.log("memberform", $scope.memberform);
		$scope.memberform.createdBy = $rootScope.principal.user.id;
		IAMService.addUser($scope.memberform).then(function(newuser) {
			$scope.newuser = newuser;
			if (!$scope.member) {
				$scope.member = {};
				$scope.member["defaultProfile"] = $rootScope.newDelegateType;
				$scope.member["user"] = newuser;
				$rootScope.member = $scope.member;
				$rootScope.editMemberAccessPopup = $scope.member;
			}
			console.log("newuserb", $scope.newuser);
			console.log('toaster', toaster);
			if (newuser && newuser.authorities) {
				$scope.setRole = false;
				for (i = 0; i < newuser.authorities.length; i++) {
					if (newuser.authorities[i].roleCode != "PropertyDelegate") {
						$scope.setRole = true;
					}
				}
			}
			if ($scope.setRole) {
				var userform = {
					username : $scope.newuser.username,
					userRoles : [ 'PropertyDelegate' ]
				};
				IAMService.updateUserRole($scope.newuser.id, userform).then(function(newuser) {
					console.log('toaster', toaster);
					toaster.pop({
						type : 'success',
						title : "Confirmation",
						body : "Delegate user added.",
						onHideCallback : function() {
							$scope.close();
						}
					});
					$scope.memberform.username="";
					$scope.memberform.firstName="";
					$scope.memberform.lastName="";
					$scope.memberform.phoneNumber="";
					$scope.memberform.defaultProfile="";
					$scope.close();
				}, function(httpresponse) {
					console.log('fail', httpresponse);
					toaster.pop({
						type : 'warning',
						title : "Error occured while adding delegate access.",
						body : httpresponse.statusText,
						timeout : 300000
					});
				});
				return;
			}
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "Delegate user added."

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
	$scope.actionEditMemeber = function() {
		$rootScope.userId = userId;
		OrganizationService.findUserById(userId).then(function(data) {
			console.log($rootScope.userDetails);
		});
	};
	$scope.actionUpdateAccessControl = function() {
		console.log('$scope.member', $scope.organization.id, $scope.member);
		OrganizationService.updateAccessProfile($scope.organization.id, $rootScope.member.user.id, $scope.memberform)
				.then(function(response) {
					if ($scope.member) {
						$scope.member.commitAccessProfile($scope.memberform);
					}
					$rootScope.newDelegateType = $scope.memberform.defaultProfile;
					toaster.pop({
						type : 'success',
						title : "Confirmation",
						body : "Access updated."

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
	$scope.userDetailsForm = {};
	$scope.actionPatchFName = function(userId, userDetails) {
		var firstNameJSON = {
			"firstName" : userDetails.firstName
		};
		$scope.userDetailsForm["firstName"] = userDetails.firstName;
		console.log(firstNameJSON);
	};
	$scope.actionPatchLName = function(userId, userDetails) {
		var lastNameJSON = {
			"lastName" : userDetails.lastName
		};
		$scope.userDetailsForm["lastName"] = userDetails.lastName;
		console.log(lastNameJSON);
	};
	$scope.actionPatchUName = function(userId, userDetails) {
		var userNameJSON = {
			"userName" : userDetails.userName
		};
		$scope.userDetailsForm["userName"] = userDetails.userName;
		console.log(userNameJSON);
	};

	$scope.actionUpdateUser = function() {
		console.log('$scope.member', $scope.organization.id, $scope.member);
		if ($scope.formmember.$valid) {
			$scope.userDetailsForm["firstName"] = $scope.memberform.firstName;
			$scope.userDetailsForm["lastName"] = $scope.memberform.lastName;
			$scope.userDetailsForm["userName"] = $scope.memberform.user == null ? $scope.memberform.userName
					: $scope.memberform.user.userName;
			$scope.userDetailsForm["phoneNumber"] = $scope.memberform.phoneNumber;
			$scope.userDetailsForm["defaultProfile"] = $scope.memberform.defaultProfile;
			
			IAMService.updateUserNameAndContact($rootScope.member.user.id, $scope.userDetailsForm).then(
					function(response) {
						if ($scope.member)
							$scope.member.commitUserDetails($scope.memberform);
						else {
							$rootScope.editMemberData.user.firstName = $scope.memberform.firstName;
							$rootScope.editMemberData.user.lastName = $scope.memberform.lastName;
							$rootScope.editMemberData.user.phoneNumber = $scope.memberform.phoneNumber;
						}
						OrganizationService.updateAccessProfile($scope.organization.id, $rootScope.member.user.id, $scope.memberform)
						.then(function(response) {
							if ($scope.member) {
								$scope.member.commitAccessProfile($scope.memberform);
							}
							$rootScope.newDelegateType = $scope.memberform.defaultProfile;
						}, function(httpresponse) {
							console.log('fail', httpresponse);
							toaster.pop({
								type : 'warning',
								title : "Error",
								body : httpresponse.statusText,
								timeout : 300000
							});
							return;
						});
						toaster.pop({
							type : 'success',
							title : "Confirmation",
							body : "User details updated successfully."
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
	}

	$scope.actionDeactivate = function(userId) {
		var requestform = {
			remark : "Deactivated from USER control page"
		};
		IAMService.deactivateUser(userId, requestform).then(function(response) {
			$scope.member.user.status.value = 'Deactivate';
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "User deactivated."
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

	$scope.actionRemove = function(userId) {
		$scope.RemoveJSON = {};
		$scope.RemoveJSON["status"] = "Removed";
		OrganizationService.updateUserDetails($scope.organization.id, userId, $scope.RemoveJSON).then(
				function(response) {
					toaster.pop({
						type : 'success',
						title : "Confirmation",
						body : "User removed.",
					});
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

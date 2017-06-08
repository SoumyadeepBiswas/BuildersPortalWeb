function OrganizationToBeDeleted(data) {
	$.extend(true, this, data);
	var _parent = this;
	if (this.members != null) {
		_.each(this.members, function(item, index) {
			_parent.members[index] = new Member(item);
		});
	}
}
function MemberToBeDeleted(data) {
	$.extend(true, this, data);
	if (this.user != null) {
		this.user = new User(this.user);
	}
}
app.service('OrganizationServiceToBeDeleted', [ '$q', '$http', '$rootScope', $$OrganizationServiceToBeDeleted ]);
function $$OrganizationServiceToBeDeleted($q, $http, $rootScope) {
	console.log(":::::::::inside $$OrganizationServiceToBeDeleted");

	this.findOrganizationByQuery = function(userId) {
		console.log(":::::::::inside delegate method");
		var request = $http.get('/Organization?' + $.param({
			userId : userId
		}));

		var result = $q.defer();
		$q.all([ request ]).then(function(responses) {
			result.resolve(responses[0].data);
		});
		return result.promise;
	};
}

app.controller('UserController', [ '$rootScope', '$scope', '$uibModal', '$window', 'OrganizationService', '$timeout',
		'$http', '$q', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'IAMService', 'toaster', $$UserController ]);
function $$UserController($rootScope, $scope, $uibModal, $window, OrganizationService, $timeout, $http, $q,
		DTOptionsBuilder, DTColumnDefBuilder, IAMService, toaster) {
	console.log(":::::::::::::::OrganizationController:::::::::::::");

	$scope.organization = null;

	OrganizationService.findOrganizationByQuery($rootScope.contextParams.userId).then(function(data) {
		$scope.organization = null;
		if ($.isArray(data)) {
			$scope.organization = new Organization(data[0]);
		}
		console.log($scope.organization);
	});

	$scope.configDataTable = function() {
		$scope.dtOrgMember = {};
		$scope.dtOrgMember.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
				.withDisplayLength(10);

		$scope.dtOrgMember.dtOptions = DTOptionsBuilder.newOptions().withDisplayLength(10);
		$scope.dtOrgMember.dtOptions.sDom = "t<'row DTTTFooter'<'col-sm-6'i><'col-sm-6'p>>";
		$scope.dtOrgMember.dtOptions.lengthMenu = [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ];
		$scope.dtOrgMember.dtOptions.sPageButton__ = "button";

		$scope.dtOrgMember.dtOptions.language = {
			lengthMenu : "Display _MENU_ users",
			zeroRecords : "No user to display",
			emptyTable : "No user to display",
			info : "Showing _START_ to _END_ of _TOTAL_ user(s)"

		};
		$scope.dtOrgMember.dtColumnDefs = [ DTColumnDefBuilder.newColumnDef(0).notSortable(),
				DTColumnDefBuilder.newColumnDef(1).withOption("sType", "unit-html"),
				DTColumnDefBuilder.newColumnDef(4).notSortable(), DTColumnDefBuilder.newColumnDef(5).notSortable() ];
	}
	$scope.configUserDataTable = function() {
		$scope.dtUsers = {};
		$scope.dtUsers.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(
				10);

		$scope.dtUsers.dtOptions = DTOptionsBuilder.newOptions().withDisplayLength(10);
		$scope.dtUsers.dtOptions.sDom = "t<'row DTTTFooter'<'col-sm-6'i><'col-sm-6'p>>";
		$scope.dtUsers.dtOptions.lengthMenu = [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ];
		$scope.dtUsers.dtOptions.sPageButton__ = "button";

		$scope.dtUsers.dtOptions.language = {
			lengthMenu : "Display _MENU_ users",
			zeroRecords : "No user to display",
			emptyTable : "No user to display",
			info : "Showing _START_ to _END_ of _TOTAL_ user(s)"

		};
		$scope.dtUsers.dtColumnDefs = [ DTColumnDefBuilder.newColumnDef(0).notSortable(),
				DTColumnDefBuilder.newColumnDef(8).notSortable() ];
	}

	$scope.fnManageDelegateAddDelegate = function() {
		var modalInstance = $uibModal.open({
			windowClass : '',
			templateUrl : 'app/views/partials/organization/organization_add_user.html',
			controller : 'ManageOrganizationController',
			size : 'md'
		});

		modalInstance.result.then(function(newuser) {
			console.log('newuser', newuser);
			if ($scope.organization == null) {
				$scope.organization = {};
				$scope.organization.members = [];
			}
			$scope.organization.members.push({
				user : newuser
			});
		});
	};

	$scope.configDataTable();
	$scope.configUserDataTable();
	$scope.users = null;
	$scope.roles = [ {
		value : 'PropertyOwner',
		label : 'Property Owner'
	}, {
		value : 'PropertyDelegate',
		label : "Property Delegate"
	}, {
		value : 'User',
		label : "User"
	} ];
	$scope.statuses = [ {
		value : 'Active',
		label : 'Active'
	}, {
		value : 'Pending',
		label : "Pending"
	}, {
		value : 'Locked',
		label : "Locked"
	}, {
		value : 'Deactivate',
		label : "Deactivate"
	} ];
	$scope.searchQuery = {
		role : [ 'PropertyOwner', 'PropertyDelegate', 'User' ],
		status : [ 'Active' ]
	};
	$scope.userDownloadOptions = {
		fileName : 'user.csv',
		mode : 'csv',
		header : true,
		columns : [ {
			name : 'username',
			label : 'Login Email',
			enable : true
		}, {
			name : 'firstName',
			label : 'User First Name',
			enable : true
		}, {
			name : 'lastName',
			label : 'User Last Name',
			enable : true
		}, {
			name : 'roles',
			label : 'Roles',
			format : 'authorities',
			enable : true
		}, {
			name : 'phoneNumber',
			label : 'Phone Number',
			enable : true
		}, {
			name : 'customerId',
			label : 'Customer Id',
			enable : true
		}, {
			name : 'status',
			label : 'Status',
			format : 'value',
			enable : true
		}, {
			name : 'lastLoginDate',
			label : 'Last Login',
			format : [ 'date', 'MM/dd/yyyy' ],
			enable : true
		} ]
	};
	$scope.showListAsCsv = function(options, list) {
		var items = [];
		_.each(options, function(item, index) {
			items.push(_.findWhere(list, {
				value : item
			}));
		});
		var labels = _.pluck(items, 'label');
		return labels.length ? labels.join(', ') : 'Any';
	};
	$scope.populateUserBySearchText = function() {
		pageLoader.show('populateUserBySearchText');
		$scope.cloneSearchQuery = angular.copy($scope.searchQuery);
		IAMService.findUserByStatusAndRole($scope.searchQuery).then(function(response) {
			pageLoader.hide('populateUserBySearchText');
			$rootScope.users = $scope.users = response;
		}, function(httpresponse) {
			console.log('fail', httpresponse);
			pageLoader.hide('populateUserBySearchText');
			toaster.pop({
				type : 'warning',
				title : "Error",
				body : httpresponse.statusText,
				timeout : 300000
			});
		});
	}
	$scope.cloneSearchQuery = null;
	$rootScope.populatePreSearchedUser = function() {
		pageLoader.show('populateUserBySearchText');
		IAMService.findUserByStatusAndRole($scope.cloneSearchQuery).then(function(response) {
			pageLoader.hide('populateUserBySearchText');

			$rootScope.users = $scope.users = response;
		}, function(httpresponse) {
			console.log('fail', httpresponse);
			pageLoader.hide('populateUserBySearchText');
			toaster.pop({
				type : 'warning',
				title : "Error",
				body : httpresponse.statusText,
				timeout : 300000
			});
		});
	}
	console.log($scope.userData);
	
	
	/*$scope.accountEvent = function(userId){
		pageLoader.show('accountEvent');
		IAMService.getAuditEventsList(userId).then(function(response) {
			pageLoader.hide('accountEvent');
			console.log(response);
			$rootScope.accountEventData = response;
			
		}, function(httpresponse) {
			console.log('fail', httpresponse);
			pageLoader.hide('accountEvent');
			toaster.pop({
				type : 'warning',
				title : "Error",
				body : httpresponse.statusText,
				timeout : 300000
			});
		});
	}*/
	$rootScope.AcccountEventDownloadOption = {
			fileName : 'AcccountEvent.csv',
			mode : 'csv',
			header : true,
			columns : [ {
				name : 'user',
				label : 'Account ID',
				format : 'customerId',
				enable : true
			},{
				name : 'user',
				label : 'First Name',
				format : 'firstName',
				enable : true
			},{
				name : 'user',
				label : 'Last Name',
				format : 'lastName',
				enable : true
			},{
				name : 'user',
				label : 'User Name',
				format : 'username',
				enable : true
			},/* {
				name : 'createdDate',
				label : 'Created Date',
				enable : true
			}, {
				name : 'updatedBy',
				label : 'Updated By',
				enable : true
			},*/
			 {
				name : 'name',
				label : 'Event Name',
				enable : true
			},{
				name : 'updatedDate',
				label : 'Event Modified Date',
				format : [ 'date', 'MM/dd/yyyy HH:mm','UTC-5' ],
				enable : true
			},{
				name : 'user',
				label : 'Event Modified By',
				format : 'EventModifiedBy',
				enable : true
			},{
				name : 'modifiedByCSR',
				label : 'Modified By CSR',
				enable : true
			}/*, {
				name : 'id',
				label : 'ID',
				enable : true
			}*//*, {
				name : 'description',
				label : 'Description',
				enable : true
			}*//*,{
				name : 'userId',
				label : 'User ID',
				enable : true
			}, {
				name : 'status',
				label : 'Status',
				enable : true
			}*/]
		};
};

app.controller('UserMgmntController', [ '$rootScope', '$scope', '$uibModalInstance', 'modalData', 'toaster',
		'IAMService', $$UserMgmntController ]);
function $$UserMgmntController($rootScope, $scope, $uibModalInstance, modalData, toaster, IAMService) {
	$scope.userform = {
		customerId : 0
	};
	$scope.user = modalData.user;
	/*if(modalData.accountEventList){
		$scope.accountEventData = modalData.accountEventList;
	}*/
	$scope.newuser = null;

	$scope.addUser = function() {

		console.log("userform", $scope.userform);
		$scope.userform.createdBy = $rootScope.principal.user.id;
		IAMService.addUser($scope.userform).then(function(newuser) {
			$scope.newuser = newuser;
			console.log("newuserb", $scope.newuser);
			console.log('toaster', toaster);
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "User added.",
				onHideCallback : function() {
					$scope.close();
				}
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
	$scope.actionSendRegistrationEmail = function() {
		IAMService.resendRegistrationMail($scope.user.id).then(function(response) {
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "Registration Email sent.",
				onHideCallback : function() {
					$scope.close();
				}
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
	$scope.actionResetPassword = function() {
		IAMService.resetPassword($scope.user.id, $scope.user.username).then(function(response) {
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "Password reset link has been sent to the user to reset password.",
				onHideCallback : function() {
					$scope.close();
				}
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

};
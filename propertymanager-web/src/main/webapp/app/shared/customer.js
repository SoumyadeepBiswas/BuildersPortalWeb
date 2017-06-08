function DataTableCustomer(DTOptionsBuilder, DTColumnDefBuilder) {
	this.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(10);

	this.dtOptions = DTOptionsBuilder.newOptions().withDisplayLength(10);
	this.dtOptions.sDom = "t<'row DTTTFooter'<'col-sm-6'i><'col-sm-6'p>>";
	this.dtOptions.lengthMenu = [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ];
	this.dtOptions.sPageButton__ = "button";

	this.dtOptions.language = {
		lengthMenu : "Display _MENU_ customers",
		zeroRecords : "No customer to display",
		emptyTable : "No customer to display",
		info : "Showing _START_ to _END_ of _TOTAL_ customers"

	};
	this.dtColumnDefs = [ DTColumnDefBuilder.newColumnDef(0).notSortable(),
			DTColumnDefBuilder.newColumnDef(3).notSortable(), DTColumnDefBuilder.newColumnDef(4).notSortable(),
			DTColumnDefBuilder.newColumnDef(5).notSortable() ];
}
function DataTableCustomerDelegate(DTOptionsBuilder, DTColumnDefBuilder) {
	this.dtOptions = DTOptionsBuilder.newOptions().withOption('responsive', true).withPaginationType('full_numbers').withDisplayLength(10);

	this.dtOptions = DTOptionsBuilder.newOptions().withDisplayLength(10);
	this.dtOptions.sDom = "t<'row DTTTFooter'<'col-sm-6'i><'col-sm-6'p>>";
	this.dtOptions.lengthMenu = [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ];
	this.dtOptions.sPageButton__ = "button";

	this.dtOptions.language = {
		lengthMenu : "Display _MENU_ customers",
		zeroRecords : "No customer to display",
		emptyTable : "No customer to display",
		info : "Showing _START_ to _END_ of _TOTAL_ customers"

	};
	this.dtColumnDefs = [ DTColumnDefBuilder.newColumnDef(0).notSortable(), DTColumnDefBuilder.newColumnDef(1),
			DTColumnDefBuilder.newColumnDef(2).notSortable() ];
}

function DataTableDashboardCustomers(DTOptionsBuilder, DTColumnDefBuilder) {
	this.dtOptions = DTOptionsBuilder.newOptions().withOption('responsive', true).withPaginationType('full_numbers')
			.withDisplayLength(10);

	this.dtOptions = DTOptionsBuilder.newOptions().withOption('responsive', true).withDisplayLength(10);
	this.dtOptions.sDom = "t<'row DTTTFooter'<'col-sm-6'i><'col-sm-6'p>>";
	this.dtOptions.lengthMenu = [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ];
	this.dtOptions.sPageButton__ = "button";

	this.dtOptions.language = {
		lengthMenu : "Display _MENU_ customers",
		zeroRecords : "No customer to display",
		emptyTable : "No customer to display",
		info : "Showing _START_ to _END_ of _TOTAL_ customers"

	};
	//this.dtColumnDefs = [ DTColumnDefBuilder.newColumnDef(5).notSortable() ];
}
app.controller('CustomerController', [ '$rootScope', '$scope', '$compile', '$timeout', '$filter', 'CustomerService',
		'DTOptionsBuilder', 'DTColumnDefBuilder', 'toaster', $$CustomerController ]);
function $$CustomerController($rootScope, $scope, $compile, $timeout, $filter, CustomerService, DTOptionsBuilder,
		DTColumnDefBuilder, toaster) {

	$scope.searchText = null;
	$scope.dtCustomer = new DataTableCustomer(DTOptionsBuilder, DTColumnDefBuilder);
	$scope.dtCustomerDelegate = new DataTableCustomerDelegate(DTOptionsBuilder, DTColumnDefBuilder);
	$scope.dtDashboardCustomers = new DataTableDashboardCustomers(DTOptionsBuilder, DTColumnDefBuilder);

	$scope.findCustomersByQuery = function() {
		pageLoader.show('findCustomersByQuery');
		CustomerService.findCustomersByQuery($scope.searchText).then(function(result) {
			$scope.customers = result;
			$rootScope.accessibleCustomers = result;
			pageLoader.hide('findCustomersByQuery');
		});

	};
	$scope.findCustomerById = function(customerId) {
		CustomerService.findCustomerById(customerId).then(function(result) {
			$scope.customers = result;
			$rootScope.accessibleCustomers = result;
		});
	};
	$scope.filterCustomerList = function(item, index) {
		if ($scope.searchText == null || $scope.searchText == "")
			return true;
		var customerData = item.customerId + " " + item.organizationName + " " + item.mailingAddress.streetNumber + " "
				+ item.mailingAddress.streetName + " " + item.mailingAddress.city + " " + item.mailingAddress.province
				+ " " + item.mailingAddress.postalCode;

		return customerData.toUpperCase().indexOf(($scope.searchText).toUpperCase()) >= 0;
	};

};

app.controller('RegistrationController', [ '$rootScope', '$scope', '$window', '$uibModalInstance', '$timeout',
		'toaster', 'IAMService', 'CustomerService', $$RegistrationController ]);
function $$RegistrationController($rootScope, $scope, $window, $uibModalInstance, $timeout, toaster, IAMService,
		CustomerService) {
	$scope.customer = null;
	$scope.newuser = null;
	$scope.unitAndTenantCnt = null;
	$scope.isLHAccountChecked = false;

	$scope.findCustomerById = function() {
		pageLoader.show('findCustomerById');
		CustomerService.findCustomerUnitAndTenantCounts($scope.newuser.customerId).then(function(result) {
			$scope.unitAndTenantCnt = result;
		});

		CustomerService.findCustomerById($scope.newuser.customerId).then(function(result) {
			$scope.customer = result;
			pageLoader.hide('findCustomerById');
		}, function(httpresponse) {
			console.log('fail', httpresponse);
			$scope.customer = {};
			pageLoader.hide('findCustomerById');
			toaster.pop({
				type : 'warning',
				title : "Error",
				body : httpresponse,
				timeout : 300000
			});
		});
	}

	$scope.registerUser = function() {
		if ($scope.customer.user == null) {
			$scope.registerNewUser();
		} else {
			$scope.updatePMPRole();
		}
	}

	$scope.updatePMPRole = function() {
		var userform = {
			// username : $scope.customer.primaryEmail.emailAddress,
			username : $scope.customer.user.username,
			customerId : $scope.customer.customerId,
			userRoles : [ 'PropertyOwner' ]
		};
		console.log("updatePMPRole", userform);

		IAMService
				.updateUserRole($scope.customer.user.id, userform)
				.then(
						function(newuser) {
							// Call PMP API to send confirmation mail
							CustomerService
									.notifyUserForPMPAccess($scope.customer.user.id, $scope.customer.user.username,
											$scope.customer.user.firstName)
									.then(
											function(response) {

											},
											function(httpresponse) {
												console.log('fail', httpresponse);
												toaster
														.pop({
															type : 'warning',
															title : "User has provided Property Management Portal access but failed to send notification.",
															body : httpresponse.statusText,
															timeout : 300000
														});
												return;
											});
							toaster.pop({
								type : 'success',
								title : "Confirmation",
								body : "User has provided Property Management Portal access.",
								onHideCallback : function() {
									$scope.close();
								}
							});
							$scope.close();
						}, function(httpresponse) {
							console.log('fail', httpresponse);
							toaster.pop({
								type : 'warning',
								title : "Error occured while providing Property Management Portal access.",
								body : httpresponse.statusText,
								timeout : 300000
							});
						});
	}

	$scope.registerNewUser = function() {
		var userform = {
			username : $scope.customer.primaryEmail.emailAddress,
			customerId : $scope.customer.customerId,
			createdBy : $rootScope.principal.user.id,
			firstName : $scope.customer.firstName,
			lastName : $scope.customer.lastName,
			phoneNumber : $scope.customer.primaryPhone == null ? null : $scope.customer.primaryPhone.phoneNumber,
			password : 'tester',
			userRoles : $scope.isLHAccountChecked ? [ 'PropertyOwner', 'Owner' ] : [ 'PropertyOwner' ],
			applicationName : ApplConfig.applicationName,
			applicationUrl : ApplConfig.homeurl,
			loginUrl : ApplConfig.loginUrl

		};
		console.log("registerUser", userform);

		IAMService.registerUser(userform).then(function(newuser) {
			$scope.newuser = newuser;
			console.log("newuserb", $scope.newuser);
			console.log('toaster', toaster);
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "User added with email " + $scope.newuser.username + ".",
				onHideCallback : function() {
					$scope.close();
				}
			});
			$scope.close();
		}, function(httpresponse) {
			console.log('fail', httpresponse);
			toaster.pop({
				type : 'warning',
				title : "Error occured while registering the customer.",
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
	$scope.ok = function() {
		$uibModalInstance.close($scope.newuser);
	};
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

};
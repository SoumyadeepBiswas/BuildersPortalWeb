app.controller('ReportController', ['$rootScope', '$scope', '$uibModal', '$window', 'toaster', '$timeout', 'ReportService','PropertyService',$$ReportController]);
function $$ReportController($rootScope, $scope, $uibModal, $window, toaster, $timeout, ReportService, PropertyService) {
	$scope.userDownloadOptions = {
		fileName : 'user.csv',
		mode : 'csv',
		header : true,
		columns : [ {
			name : 'username',
			label : 'Login Email',
			enable : true
		},{
			name : 'firstName',
			label : 'User First Name',
			enable : true
		},{
			name : 'lastName',
			label : 'User Last Name',
			enable : true
		},{
			name : 'roles',
			label : 'Roles',
			format : 'authorities',
			enable : true
		},{
			name : 'phoneNumber',
			label : 'Phone Number',
			enable : true
		},{
			name : 'customerId',
			label : 'Customer Id',
			enable : true
		} ,{
			name : 'status',
			label : 'Status',
			format : 'value',
			enable : true
		},{
			name : 'lastLoginDate',
			label : 'Last Login Time',
			format : [ 'date', 'dd/MM/yyyy HH:mm:ss'],
			enable : true
		} ]
	};
	
	
	$scope.userDownloadOptionsForOwners = {
			fileName : 'user.csv',
			mode : 'csv',
			header : true,
			columns : [ {
				name : 'username',
				label : 'Login Email',
				enable : true
			},{
				name : 'firstName',
				label : 'User First Name',
				enable : true
			},{
				name : 'lastName',
				label : 'User Last Name',
				enable : true
			},{
				name : 'roles',
				label : 'Roles',
				format : 'authorities',
				enable : true
			},{
				name : 'propertyCnt',
				label : 'Property Count',
				enable : true
			},{
				name : 'phoneNumber',
				label : 'Phone Number',
				enable : true
			},{
				name : 'customerId',
				label : 'Customer Id',
				enable : true
			} ,{
				name : 'status',
				label : 'Status',
				format : 'value',
				enable : true
			},{
				name : 'lastLoginDate',
				label : 'Last Login Time',
				format : [ 'date', 'dd/MM/yyyy HH:mm:ss'],
				enable : true
			} ]
		};
	
	
	$scope.accountEventsDownloadOptions = {
			fileName : 'AccountEvents.csv',
			mode : 'csv',
			header : true,
			columns : [ {
				name : 'webAccountId',
				label : 'Account Id',
				enable : true
			},{
				name : 'eventName',
				label : 'Events',
				enable : true
			},{
				name : 'eventModifiedDate',
				label : 'Event Modified Date',
				format : [ 'date', 'dd/MM/yyyy HH:mm:ss'],
				enable : true
			},{
				name : 'eventModifiedBy',
				label : 'Event Modified By',
				enable : true
			},{
				name : 'eventModifierIsCsr',
				label : 'Event Modified By CSR',
				enable : true
			} ]
		};
	
	$scope.propertyDataDownloadOptions = {
			fileName : 'properties.csv',
			mode : 'csv',
			header : true,
			columns : [{
				name : 'customerId',
				label : 'Customer Id',
				enable : true
			}, {
				name : 'propertyId',
				label : 'Property Id',
				enable : true
			}, {
				name : 'propertyName',
				label : 'Property Name',
				enable : true
			},  {
				name : 'propertyClassification',
				label : 'Property Type',
				enable : true
			}, {
				name : 'noOfUnits',
				label : 'No Of Units',
				enable : true
			}, {
				name : 'address',
				label : 'Street Number',
				format : 'streetNumber',
				enable : true
			},{
				name : 'address',
				label : 'Street Name',
				format : 'streetName',
				enable : true
			},	{
				name : 'address',
				label : 'City',
				format : 'city',
				enable : true
			}, {
				name : 'address',
				label : 'Province',
				format : 'province',
				enable : true
			},{
				name : 'address',
				label : 'Postal Code',
				format : 'postalCode',
				enable : true
			} ]
		};
	
	
	$scope.reports = [
			{
				name : 'Last Login Time',
				description : 'List of owner and delegates with last login time (only the active users)',
				action : ApplConfig.iam.apiEndpoint
						+ '/user?role=PropertyOwner&role=PropertyDelegate&role=User&status=Active',
				downloadOption : $scope.userDownloadOptions
			},
			{
				name : 'Not Activated',
				description : 'Webaccount pending for activation.',
				action : ApplConfig.iam.apiEndpoint
						+ '/user?role=PropertyOwner&role=PropertyDelegate&role=User&status=Pending',
				downloadOption : $scope.userDownloadOptions

			},
			{
				name : 'Abandoned Password',
				description : 'Abandoned Password.',
				action : ApplConfig.iam.apiEndpoint
						+ '/user?role=PropertyOwner&role=PropertyDelegate&role=User&status=Pending',
				downloadOption : $scope.userDownloadOptions

			},
			{
				name : 'Locked Accounts',
				description : 'Locked Accounts.',
				action : ApplConfig.iam.apiEndpoint
						+ '/user?role=PropertyOwner&role=PropertyDelegate&role=User&status=Locked',
				downloadOption : $scope.userDownloadOptions

			},
			/*{
				name : 'Accounts Events',
				description : 'Accounts Events.',
				action : ApplConfig.apiServerEndpoint + '/Report/AccountsEvents?mode=download',
				downloadOption : $scope.accountEventsDownloadOptions
			},*/
			{
				name : 'Owners and Delegates',
				description : 'List of owner and delegates(List of locked and inactive indicators)',
				action : ApplConfig.iam.apiEndpoint	+ '/user?role=PropertyOwner&role=PropertyDelegate&status=Active',
				downloadOption : $scope.userDownloadOptionsForOwners
			}/*, 
			{
				name : 'Property List',
				description : 'List of properties',
				action : ApplConfig.apiServerEndpoint + '/CSR/Properties',
				downloadOption :	$scope.propertyDataDownloadOptions
			}*/]

	$scope.downloadReport = function(report) {
		pageLoader.show();
		report.data = null;
		ReportService.downloadReport(report).then(function(response) {
			console.log("response...", response);
			report.data = response;
			if(report.name == 'Owners and Delegates'){
				PropertyService.findUserPropertyCounts().then(function(propertyCntresponse) {
					if (propertyCntresponse) {
						$.each(propertyCntresponse, function(index, value) {
							var userRes = _.findWhere(report.data, {
								id : value.userId
							});
							if(userRes){
								userRes['propertyCnt'] = value.propertyCnt;
							}
						});
					}
					console.log("Processed response...", report.data);
				});
			}
			pageLoader.hide();
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "Report is ready. Click on download to obtain the report.",
			});
		}, function(httpresponse) {
			console.log('fail', httpresponse);
			pageLoader.hide();
			toaster.pop({
				type : 'warning',
				title : "Error",
				body : httpresponse.statusText,
				timeout : 300000
			});
		});
	}
};

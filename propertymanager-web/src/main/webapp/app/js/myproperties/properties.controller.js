'use strict';
app.controller('PropertiesController', [ '$rootScope', '$scope', '$compile', '$timeout', '$stateParams',
		'PropertyService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'properties', 'toaster', 'PropertyResource',
		'AccessControl', $$PropertiesController ]);
function $$PropertiesController($rootScope, $scope, $compile, $timeout, $stateParams, PropertyService,
		DTOptionsBuilder, DTColumnDefBuilder, properties, toaster, PropertyResource, AccessControl) {

	console.log('$stateParams', $stateParams);
	$scope.pageSize = 50;
	$scope.PropertyResource = PropertyResource;
	$scope.properties = properties;
	$scope.AccessControl = AccessControl;
	$scope.propertyFilter = new PropertyFilter(properties, $stateParams);
	$scope.unitFilter = new PropertyUnitFilter();

	$scope.dataTablePremise = {};
	$scope.showhideAdvanced = function() {
		$("#advanced_filter_opener").hide();
		$("#f_close").show();
	}
	$scope.showhideAdvancedClose = function() {
		$("#advanced_filter_opener").show();
		$scope.actionReset();
		$("#f_close").hide();
	}

	$scope.dataTablePremise.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
			.withDisplayLength(10).withBootstrap();

	$scope.dataTablePremise.dtOptions = DTOptionsBuilder.newOptions().withDisplayLength(10);
	$scope.dataTablePremise.dtOptions.sDom = "f'<'dt-premise-toolbar'>lt<'row DTTTFooter'<'col-sm-5'i><'col-sm-7'p>>";
	$scope.dataTablePremise.dtOptions.lengthMenu = [ [ 10, 25, 50, -1 ], [ 10, 25, 50, "All" ] ];
	$scope.dataTablePremise.dtOptions.sPageButton__ = "button";

	$scope.filterObjProperty = {
		text : ""
	};

	$scope.dataTablePremise.dtOptions.language = {
		search : "",
		searchPlaceholder : "Search a Unit",
		lengthMenu : "Display _MENU_ units",
		zeroRecords : "No units to display",
		emptyTable : "No units to display",
		info : "Showing _START_ to _END_ of _TOTAL_ units"

	};
	$scope.dataTablePremise.dtOptionsNoPaging = _.extend({}, $scope.dataTablePremise.dtOptions);
	$scope.dataTablePremise.dtOptionsNoPaging.paging = false;
	$scope.dataTablePremise.dtOptionsNoPaging.info = false;
	$scope.dataTablePremise.dtOptionsNoPaging.searching = false;

	$scope.dataTablePremise.dtColumnDefs = [ DTColumnDefBuilder.newColumnDef(0).withOption("sType", "unit-html"),
			DTColumnDefBuilder.newColumnDef(5).notSortable(), DTColumnDefBuilder.newColumnDef(6).notSortable() ];

	$scope.dataTablePremise.dtColumnDefs = [ DTColumnDefBuilder.newColumnDef(1).withOption('searchable', false),
			DTColumnDefBuilder.newColumnDef(2).withOption('searchable', false),
			DTColumnDefBuilder.newColumnDef(3).withOption('searchable', false),
			DTColumnDefBuilder.newColumnDef(4).withOption('searchable', false),
			DTColumnDefBuilder.newColumnDef(5).withOption('searchable', false),
			DTColumnDefBuilder.newColumnDef(6).withOption('searchable', false).notSortable() ];

	$scope.displayLimit = "10";

	$scope.dataTablePremiseOption = function(n) {
		return (n > 10 ? $scope.dataTablePremise.dtOptions : $scope.dataTablePremise.dtOptionsNoPaging);
	}
	$scope.actionGetUnitDetails = function(property) {
		if (property.allUnits != null) {
			return;
		}
		property.allUnits = {
			$resolved : false
		};
		PropertyService.findUnitsByProperty(property).then(function(response) {
			if (response) {
				property.allUnits = response;
				if (property.allUnits && property.allUnits.length > 2) {
					property.commonUnits = _.filter(response, function(item) {
						return item.isCommonInstallation();
					});
					property.units = _.filter(response, function(item) {
						return !item.isCommonInstallation();
					});
				} else {
					property.commonUnits = [];
					property.units = property.allUnits;
				}
			}
		});

	};
	if ($rootScope.delegateFilter != null) {
		$scope.filterObjProperty.text = ($rootScope.delegateFilter).toString();
		$rootScope.delegateFilter = null;
	}
	$scope.actionPatchNickname = function(property) {
		var alphaNumericText = /^[a-z\d\-_\s]+$/i;
		var nicknameJSON = {
			"propertyName" : property.propertyName
		};

		if (property.propertyName.length == 0) {
			$("#maxlen-" + property.propertyId).hide();
			$("#alphaNumeric-" + property.propertyId).hide();
		} else if (property.propertyName.length > 60) {
			$("#maxlen-" + property.propertyId).show();
		} else if (!(property.propertyName).match(alphaNumericText)) {
			$("#alphaNumeric-" + property.propertyId).show();
		} else {
			$("#maxlen-" + property.propertyId).hide();
			$("#alphaNumeric-" + property.propertyId).hide();
			PropertyService.patchDetails(property, nicknameJSON).then(function(response) {
				if (response != "" || response != null) {
					$rootScope.updatePropertyNameFlag = true;
					$rootScope.propertiesData = $scope.properties;
					$scope.test = response;
					property.propertyName = $scope.test.propertyName;
				}
				toaster.pop({
					type : 'success',
					title : "Confirmation",
					body : "Property name updated.",
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
	}

	$scope.actionPatchClassification = function(property) {
		var classificationJSON = {
			"propertyClassification" : property.propertyClassification
		};

		console.log(classificationJSON);

		PropertyService.patchClassificationDetails(property, classificationJSON).then(function(_property) {
			console.log('actionPatchClassification', _property);
			property.mergeClassification(_property);
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "Property classification updated.",
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
		$scope.preparePropertyClassifcationList();
	}

	$scope.selectPropety = function(property) {
		$scope.selectedProperty = property;
	}
	$scope.selectUnit = function(property, unit, index) {
		$rootScope.property = property;
		if (unit == null) {
			unit = property.singleUnit;
		}
		$rootScope.unit = unit;
		$rootScope.index = index;

	};

	$scope.filterUnitList = function(item, index) {
		if ($scope.unitFilter.disconnected) {
			return (item.connectionStatus == 0);
		} else if ($scope.unitFilter.owner) {
			return (item.tenantsOccupied == 0)
		} else if ($scope.unitFilter.searchText != null && $scope.unitFilter.searchText != ""
				&& item.premiseAddress.streetUnit != null) {
			return (item.premiseAddress.streetUnit.indexOf($scope.unitFilter.searchText) >= 0);
		}
		return true;
	}

	$scope.confirmFlag = false;
	var fd1 = new FormData();
	$scope.actionUploadImage = function(files) {
		var fd = new FormData();
		// Take the first selected file
		fd.append("file", files[0]);
		if (files[0].size > 1048576) {
			$("#myModal1").modal();
			return;
		}
		if (files[0].size > 524288) {
			$("#myModal").modal();
			fd1 = fd;
		} else
			$scope.uploadImage(fd);
	};
	$scope.changeConfirmFlag = function() {
		$scope.confirmFlag = true;
		$scope.uploadImage(fd1);
	}
	$scope.uploadImage = function(file) {
		PropertyService.postUploadImage($scope.selectedProperty.propertyId, file).then(function(response) {
			$scope.selectedProperty.version = $scope.selectedProperty.version + 1;
			$scope.selectedProperty.hasImage=true; 
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "Image uploaded successfully."
			});
			if ($scope.confirmFlag) {
				$scope.confirmUploadImage = false;
				$("#myModal").modal("hide");
				$scope.confirmFlag = false;

			}
		}, function(httpresponse) {
			console.log('fail', httpresponse);
			toaster.pop({
				type : 'warning',
				title : "Error",
				body : httpresponse,
				timeout : 300000
			});
		});
	};

	$scope.actionReset = function() {
		$scope.properties = $scope.propertyFilter.reset();
		$scope.Commercial = $scope.MultiUnit = $scope.House = $scope.TownHouse = $scope.HighRise = $scope.NotClassified = false;
		$scope.propertyTypeFilter = "";
	};
	$scope.actionApply = function() {
		$scope.properties = $scope.propertyFilter.apply();

		$scope.propertyTypeFilter = "";
		if ($scope.Commercial == true)
			$scope.propertyTypeFilter = $scope.propertyTypeFilter + "'Commercial'" + ", ";
		if ($scope.MultiUnit == true)
			$scope.propertyTypeFilter = $scope.propertyTypeFilter + "'Multi-Unit'" + ", ";
		if ($scope.House == true)
			$scope.propertyTypeFilter = $scope.propertyTypeFilter + "'House'" + ", ";
		if ($scope.HighRise == true)
			$scope.propertyTypeFilter = $scope.propertyTypeFilter + "'High Rise'" + ", ";
		if ($scope.TownHouse == true)
			$scope.propertyTypeFilter = $scope.propertyTypeFilter + "'Town House'" + ", ";
		if ($scope.NotClassified == true)
			$scope.propertyTypeFilter = $scope.propertyTypeFilter + "'Not Classified'" + " ";
		$scope.classificationTypeFilter($scope.propertyTypeFilter);

	}
	$timeout(function() {
		if ($scope.propertyFilter.isON()) {
			$('#advanced_filter_opener').click();
			$scope.actionApply();
		}
	}, 100);

	$scope.propertyDataDownload = {
		fileName : 'properties.csv',
		mode : 'csv',
		header : true,
		columns : [ {
			name : 'customerId',
			label : 'Customer Id',
			enable : true
		}, {
			name : 'noOfUnits',
			label : 'No Of Units',
			enable : true
		}, {
			name : 'propertyClassification',
			label : 'Property Type',
			enable : true
		}, {
			name : 'propertyId',
			label : 'Property Id',
			enable : true
		}, {
			name : 'propertyName',
			label : 'Property Name',
			enable : true
		}, {
			name : 'address',
			label : 'City',
			format : 'city',
			enable : true
		}, {
			name : 'address',
			label : 'Postal Code',
			format : 'postalCode',
			enable : true
		}, {
			name : 'address',
			label : 'Province',
			format : 'province',
			enable : true
		}, {
			name : 'address',
			label : 'Street Name',
			format : 'streetName',
			enable : true
		}, {
			name : 'address',
			label : 'Street Number',
			format : 'streetNumber',
			enable : true
		}, {
			name : 'address',
			label : 'Unit Number',
			format : 'streetUnit',
			enable : true
		}, {
			name : 'propertySummary',
			label : 'CSA',
			format : 'csaSigned',
			enable : true
		}, {
			name : 'propertySummary',
			label : 'Occupancy',
			format : 'tenantOccupied',
			enable : true
		}, {
			name : 'propertySummary',
			label : 'Service Type',
			format : 'electricity',
			enable : true
		}, {
			name : 'propertySummary',
			label : 'Status',
			format : 'connected',
			enable : true
		}, {
			name : 'propertySummary',
			label : 'Move Type',
			format : 'moveinPending',
			enable : true
		}, {
			name : 'propertySummary',
			label : 'Move Date',
			format : 'maxMoveinDate',
			enable : true
		} ]
	}

	$scope.classificationTypeFilter = function(type) {
		if ($scope.Commercial || $scope.MultiUnit || $scope.House || $scope.TownHouse || $scope.HighRise
				|| $scope.NotClassified) {
			$scope.properties = _.filter($scope.properties, function(property) {
				if ($scope.propertyTypeFilter.indexOf("'" + property.propertyClassification + "'") != -1)
					return property;
			});
			$scope.propertyFilter.$applied = true;
		}

	};

	$scope.preparePropertyClassifcationList = function() {
		$scope.classificationListDynamic = "";
		for (var i = 0; i < $scope.properties.length; i++) {
			if ($scope.classificationListDynamic.indexOf("'" + $scope.properties[i].propertyClassification + "'") == -1)
				$scope.classificationListDynamic = $scope.classificationListDynamic + "'"
						+ $scope.properties[i].propertyClassification + "', ";
		}
	};
	$scope.preparePropertyClassifcationList();
	$scope.checkDynamically = function(type) {
		if ($scope.classificationListDynamic.indexOf("'" + type + "'") >= 0)
			return true;
		else
			return false;
	}
	$scope.applyFilter = function() {

	}
	$scope.chanePageSize = function(v) {
		if (v > 0) {
			$scope.pageSize = v;
		} else {
			$scope.pageSize = $scope.propertyFilter.size();
		}
	}

};

function PropertyFilter(properties, data) {
	this.disconnected = false;
	this.pendingMoves = false;
	this.ownerOccupancy = false;
	this.$applied = false;
	this.$closed = true;

	this.$copy = _.clone(properties);
	this.disconnected = (data && "Y" == data.disconnected);
	this.pendingMoves = (data && "Y" == data.pendingMoves);
	this.ownerOccupancy = (data && "Y" == data.ownerOccupancy);

	this.isON = function() {
		return (this.disconnected || this.pendingMoves || this.ownerOccupancy);
	}
	this.size = function() {
		if (this.$copy == null) {
			return 0;
		}
		return this.$copy.length;
	}
	this.reset = function() {
		this.disconnected = false;
		this.pendingMoves = false;
		this.ownerOccupancy = false;
		this.$applied = false;
		this.$closed = true;
		return this.$copy;
	}
	this.apply = function() {
		if (this.isON() == false) {
			return this.reset();
		}
		var filteredProperties = null;

		if (this.pendingMoves && this.disconnected && this.ownerOccupancy) {
			filteredProperties = _.filter(this.$copy, function(property) {
				if (property.propertySummary.moveoutPending != 0 || property.propertySummary.moveinPending != 0
						|| property.propertySummary.connected != property.noOfUnits
						|| property.propertySummary.tenantOccupied != property.noOfUnits)
					return property;
			});
		} else if (this.pendingMoves && this.disconnected) {
			filteredProperties = _.filter(this.$copy, function(property) {
				if (property.propertySummary.moveoutPending != 0 || property.propertySummary.moveinPending != 0
						|| property.propertySummary.connected != property.noOfUnits)
					return property;
			});
		} else if (this.pendingMoves && this.ownerOccupancy) {
			filteredProperties = _.filter(this.$copy, function(property) {
				if (property.propertySummary.moveoutPending != 0 || property.propertySummary.moveinPending != 0
						|| property.propertySummary.tenantOccupied != property.noOfUnits)
					return property;
			});
		} else if (this.disconnected && this.ownerOccupancy) {
			filteredProperties = _.filter(this.$copy, function(property) {
				if (property.propertySummary.connected != property.noOfUnits
						|| property.propertySummary.tenantOccupied != property.noOfUnits)
					return property;
			});
		} else if (this.pendingMoves) {
			filteredProperties = _.filter(this.$copy, function(property) {
				if (property.propertySummary.moveoutPending != 0 || property.propertySummary.moveinPending != 0)
					return property;
			});
		} else if (this.disconnected) {
			filteredProperties = _.filter(this.$copy, function(property) {
				if (property.propertySummary.connected != property.noOfUnits)
					return property;
			});
		} else if (this.ownerOccupancy) {
			filteredProperties = _.filter(this.$copy, function(property) {
				if (property.propertySummary.tenantOccupied != property.noOfUnits)
					return property;
			});
		}

		this.$applied = true;
		this.$closed = false;
		return filteredProperties;
	}
}
function PropertyUnitFilter() {
	this.disconnected = false;
	this.pendingMoves = false;
}

app.controller('PropertyDetailsCtrl',
		[ '$filter', '$rootScope', '$scope', '$timeout', 'ElectricityConsumptionService', 'WaterConsumptionService',
				'$stateParams', 'AccessControl', 'PropertyService', 'toaster', $$PropertyDetailsCtrl ]);
function $$PropertyDetailsCtrl($filter, $rootScope, $scope, $timeout, ElectricityConsumptionService,
		WaterConsumptionService, $stateParams, AccessControl, PropertyService, toaster) {
	console.log("::::inside property details property ", $rootScope.property);
	console.log("::::inside property details property ", $rootScope.unit);
	$scope.AccessControl = AccessControl;
	$scope.property = $rootScope.property;
	$scope.unit = $rootScope.unit;
	$scope.energyUsage = null;
	$scope.waterData = null;

	$scope.sumElectricityCost = 0;
	$scope.sumElectricityConsumption = 0;
	$scope.sumWaterCost = 0;
	$scope.sumWaterConsumption = 0;

	$scope.waterUsageGraph = {
		title : {
			text : null
		}
	};
	$scope.energyUsageGraph = {
		title : {
			text : null
		}
	};

	$scope.dataView = true;

	$scope.actionLoadElectricityUsage = function($event) {
		if ($scope.unit.services.electricity && $scope.unit.services.electricity.length > 0) {
			ElectricityConsumptionService.getBillingEnergyUsage({
				customerId : $scope.unit.ownerCustomerId,
				propertyId : $scope.property.propertyId,
				premiseId : $scope.unit.premiseId
			}).then(
					function(response) {
						if (response) {
							$scope.energyUsage = response;
							
							_.each($scope.energyUsage.usageSummary, function(value, key) {
								value.usageAmount = Math.round(value.usageAmount);
								value.chargeAmount = Math.round(value.chargeAmount);
							});

							$scope.energyUsageGraph = {};
							var seriesData = _.sortBy(response.usageSummary, 'billPeriodMonth');
							_.each(seriesData, function(value, key) {
								value.billPeriodMonth = $filter('date')(value.billPeriodMonth, 'MMM dd, yyyy', 'UTC-5');
							});
							$scope.energyUsageGraph = new EnergyUsageGraph(seriesData);
							$scope.energyUsageGraph.applyACL(AccessControl.hasAccess($scope.property, 'cost'));

							$scope.sumElectricityConsumption = 0;
							$scope.sumElectricityCost = 0;
							for (var i = 0; i < seriesData.length; i++) {
								$scope.sumElectricityConsumption = $scope.sumElectricityConsumption
										+ seriesData[i].usageAmount;
								$scope.sumElectricityCost = $scope.sumElectricityCost
										+ seriesData[i].chargeAmount;

								$scope.unit.electricityAverageMonthlyCost = $scope.sumElectricityCost/seriesData.length;
							}
						}
					});
		} 
	}
	$scope.actionLoadWaterUsage = function($event) {
		if ($scope.unit.services.water && $scope.unit.services.water.length > 0) {
			WaterConsumptionService.getWaterData({
				customerId : $scope.unit.ownerCustomerId,
				propertyId : $scope.property.propertyId,
				premiseId : $scope.unit.premiseId
			}).then(function(response) {
				if (response) {
					$scope.waterData = response;
					
					_.each($scope.waterData.usageSummary, function(value, key) {
						value.usageAmount = Math.round(value.usageAmount);
						value.chargeAmount = Math.round(value.chargeAmount);
					});

					$scope.waterUsageGraph = {};
					var seriesData = _.sortBy(response.usageSummary, 'billPeriodMonth');
					_.each(seriesData, function(value, key) {
						//$filter('date')(value.billPeriodMonth, 'MMM dd, yyyy', 'UTC-5');
						value.billPeriodMonth = $filter('date')(value.billPeriodMonth, 'MMM dd, yyyy', 'UTC-5');
					});
					$scope.waterUsageGraph = new WaterUsageGraph(seriesData);
					$scope.waterUsageGraph.applyACL(AccessControl.hasAccess($scope.property, 'cost'));

					$scope.sumWaterConsumption = 0;
					$scope.sumWaterCost = 0;
					for (var i = 0; i < seriesData.length; i++) {
						$scope.sumWaterConsumption = $scope.sumWaterConsumption + seriesData[i].usageAmount;
						$scope.sumWaterCost = $scope.sumWaterCost + seriesData[i].chargeAmount;
						$scope.unit.waterAverageMonthlyCost = $scope.sumWaterCost / seriesData.length;
					}
					$scope.sumWaterConsumption = $scope.sumWaterConsumption / 1000;
				}
			});
		}
	}

	$scope.toggle = function() {
		$scope.dataView = !$scope.dataView;
		$timeout(function() {
			if ($scope.energyUsage != null) {
				$scope.energyUsageGraph = {};
				$scope.energyUsageGraph = new EnergyUsageGraph($scope.energyUsage);
				$scope.energyUsageGraph.applyACL(AccessControl.hasAccess($scope.property, 'cost'));
			}
			if ($scope.waterData != null) {
				$scope.waterUsageGraph = {};
				$scope.waterUsageGraph = new WaterUsageGraph($scope.waterData);
				$scope.waterUsageGraph.applyACL(AccessControl.hasAccess($scope.property, 'cost'));

			}
		}, 50);

	};
	if ($scope.unit) {
		$scope.actionLoadElectricityUsage();
		$scope.actionLoadWaterUsage();
	}
	$scope.addressDownload = function(property, unit) {
		showAddressFlag = true;
		//$scope.unitName = ((unit.premiseAddress.streetUnit) != null ? (unit.premiseAddress.streetUnit) : "-");
		if(unit && unit.premiseAddress){
			$scope.unitName = ((unit.premiseAddress.streetUnit) != null ? (unit.premiseAddress.streetUnit) : "-");
		}else if(property && property.propertySummary){
			$scope.unitName = ((property.propertySummary.unitNumber) != null ? (property.propertySummary.unitNumber) : "-");
		}else{
			$scope.unitName = "-";
		}
		console.log("::::::::Testing Purpose:::::::::::", property);
		propertyAddress = "Address," + property.address.streetNumber + " " + property.address.streetName + " "
				+ property.address.city + " " + property.address.province + " " + property.address.postalCode + "\n"
				+ "Unit," + $scope.unitName + ",\n";
	}

	$scope.energyDownloadOption = {
		fileName : 'energydata.csv',
		mode : 'csv',
		header : true,
		columns : [ {
			name : 'billPeriodTo',
			label : 'Billing Month',
			format : [ 'date', 'MMM-dd-yyyy', 'UTC-5' ],
			enable : true
		}, {
			name : 'usageAmount',
			label : 'Usage(KWH)',
			enable : true
		}, {
			name : 'chargeAmount',
			label : 'Total Approximate Cost($)',
			enable : AccessControl.hasAccess($scope.property, 'cost')
		} ]
	}

	$scope.waterDownloadOption = {
		fileName : 'waterdata.csv',
		mode : 'csv',
		header : true,
		columns : [ {
			name : 'billPeriodTo',
			label : 'Billing Month',
			format : [ 'date', 'MMM-dd-yyyy', 'UTC-5' ],
			enable : true
		}, {
			name : 'usageAmount',
			label : 'Usage(meter cube)',
			format : 'convertToMeterCube',
			enable : true
		}, {
			name : 'chargeAmount',
			label : 'Total Approximate Cost($)',
			enable : AccessControl.hasAccess($scope.property, 'cost')
		} ]
	}

	$scope.printDiv = function(divName) {
		var printContents = document.getElementById(divName).innerHTML;
		var printAddress = document.getElementById('printAddress').innerHTML;
		var popupWin = window.open('', '_blank',
				'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,top=50');
		popupWin.window.focus();
		popupWin.document.open();
		popupWin.document.write('<!DOCTYPE html><html><head><title>Consumption data Print Out</title>'
				+ '<link rel="stylesheet" type="text/css" href="app/directory/file.css" />'
				+ '</head><body onload="window.print(); window.close();"><div>' + printAddress + '</div><div>'
				+ printContents + '</div></body></html>');

		popupWin.document.close();
	}
	$scope.sendEmail = function(property, divName) {
		var mailContents = '<html><body><div>' + document.getElementById('printAddress').innerHTML + '</div><div>'
				+ document.getElementById(divName).innerHTML + '</body></html>';

		PropertyService.emailPremiseConsumption(property, mailContents).then(function(response) {
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "Consumption details mailed successfully.",
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

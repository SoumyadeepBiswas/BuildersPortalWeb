function stackLabelFormatter() {
	var _sum = 0;
	var _pos = this.x;
	_.each(this.axis.chart.series, function(series, index) {
		if (series.visible && series.data.length > _pos) {
			if (series.data[_pos].data) {
				_sum += series.data[_pos].data.usageCost
			}
		}
	});
	return ("$" + Highcharts.numberFormat(_sum, 0));
}
function barChartTooltipFormatter() {
	var html = "<table class='chart-tooltip'><thead>";
	html += '<tr><th colspan=3>' + this.x + '</th></tr></thead>';
	var _sum = 0;
	var _sumConsumption = 0;
	html += "<tbody>";
	var costApplicable = false;
	var unit = '';
	var multiplier = 1;
	if (this.points && this.points.length > 0) {
		costApplicable = this.points[0].point.data.costApplicable;
		if (this.points[0].series.userOptions) {
			unit = this.points[0].series.userOptions.unit;
			multiplier = this.points[0].series.userOptions.multiplier;
		}
	}
	/*$.each(this.points, function(index, point) {
		if (point.point.data) {
			if (point.series.name == 'Multi-Unit') {
				html += "<tr><td> " + 'Multi-Unit (2-6)' + " :</td><td style='text-align:right'> ";
			} else {
				html += "<tr><td> " + point.series.name + " :</td><td style='text-align:right'> ";
			}
			if (costApplicable) {
				_sum += point.point.data.usageCost
				html += '  $' + Highcharts.numberFormat(point.point.data.usageCost, 2);
			} else {
				_sum += (point.point.data.usageAmount * multiplier);
				html += Highcharts.numberFormat(point.point.data.usageAmount * multiplier, 2) + unit;
			}
			html += "</td></tr> ";
		}
	});
	html += '</tbody>';
	if (this.points.length > 1) {
		html += "<tfoot><tr><td> Total :</td><td> ";
		if (costApplicable) {
			html += "$" + Highcharts.numberFormat(_sum, 2);
		} else {
			html += Highcharts.numberFormat(_sum, 2) + unit;
		}
		html += "</td></tr></tfoot>";
	}
	html += '</table>'
	return html;*/
	
	if(costApplicable)
		html += "<tr><td>  Category</td><td style='text-align:right'>Cost</td><td style='text-align:right'>Consumption</td></tr> ";
	else
		html += "<tr><td>  Category</td><td style='text-align:right'>Consumption</td></tr> ";
	
	$.each(this.points, function(index, point) {
		if (point.point.data) {
			if (point.series.name == 'Multi-Unit') {
				html += "<tr><td> " + 'Multi-Unit (2-6)' + " :</td><td style='text-align:right'> ";
			} else {
				html += "<tr><td> " + point.series.name + " :</td><td style='text-align:right'> ";
			}
			if (costApplicable) {
				_sum += point.point.data.usageCost;
				_sumConsumption += point.point.data.usageAmount * multiplier;
				html += '  $' + Math.round(/*Highcharts.numberFormat(*/point.point.data.usageCost/*, 2)*/) +"</td><td style='text-align:right'> "+Math.round(/*Highcharts.numberFormat(*/point.point.data.usageAmount * multiplier/*, 2)*/) + unit ;
			} else {
				_sum += (point.point.data.usageAmount * multiplier);
				html += Math.round(/*Highcharts.numberFormat(*/point.point.data.usageAmount * multiplier/*, 2)*/) + unit;
			}
			html += "</td></tr> ";
		}
	});
	html += '</tbody>';
	if (this.points.length > 1) {
		html += "<tfoot><tr><td> Total :</td><td style='text-align:right'> ";
		if (costApplicable) {
			html += "$" + Math.round(/*Highcharts.numberFormat(*/_sum/*, 2)*/);
			html += "</td><td style='text-align:right'>"+Math.round(/*Highcharts.numberFormat(*/_sumConsumption/*, 2)*/) + unit;
		} else {
			html += Math.round(/*Highcharts.numberFormat(*/_sum/*, 2)*/) + unit;
		}
		html += "</td></tr></tfoot>";
	}
	html += '</table>'
		return html;
};

var usageStackChartOption = {
	credits : {
		enabled : false
	},
	chart : {
		type : 'column',
		height : 320,
		marginTop : 30
	},
	title : {
		text : ''
	},
	lang : {
		noData : "No usage data available."
	},
	noData : {
		style : {
			fontWeight : 'bold',
			fontSize : '15px',
			color : '#303030'
		}
	},
	xAxis : {
		categories : [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
		labels : {
			rotation : -45,
			align : 'right',
			style : {
				cursor : 'pointer',
				color : '#23527c',
				fontSize : "14px",
				fontFamily : "Open Sans"
			}
		}
	},
	yAxis : {
		min : 0,
		title : {
			text : 'Consumption (kWh)'
		},
		stackLabels : {
			enabled : false,
			rotation :  -45,
			crop : false,
			y: -15 ,
			style : {
				fontWeight : 'bold',
				color : '#525252'
			},
			formatter : stackLabelFormatter
		}
	},
	tooltip : {
		shared : true,
		backgroundColor : null,
		borderWidth : 0,
		useHTML : true,
		formatter : barChartTooltipFormatter
	},
	plotOptions : {
		column : {
			stacking : 'normal',
			dataLabels : {
				enabled : false,
				color : 'white',
				style : {
					textShadow : '0 0 3px black'
				}
			}
		},
		series : {
			cursor : 'pointer',
			pointWidth : 20,
			point : {
				events : {
					click : function() {
						if (this.series.chart.renderTo) {
							angular.element(this.series.chart.renderTo).scope().drillDown(this.category);
						}
					}
				}
			}
		}
	},
	series : []
};

var usageChartOption = {
	credits : {
		enabled : false
	},
	chart : {
		type : 'column',
		height : 310,
	},
	title : {
		text : ''
	},
	legend : {
		enabled : false
	},
	xAxis : {
		categories : [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
		labels : {
			rotation : -45,
			align : 'right',

		}
	},
	yAxis : {
		min : 0,
		title : {
			text : 'Consumption (kWh)'
		},
		stackLabels : {
			enabled : false,
			style : {
				fontWeight : 'bold',
				color : '#525252'
			},
			formatter : stackLabelFormatter
		}
	},
	tooltip : {
		shared : true,
		backgroundColor : null,
		borderWidth : 0,
		useHTML : true,
		formatter : barChartTooltipFormatter,
	},
	plotOptions : {
		column : {
			stacking : 'normal',
			dataLabels : {
				enabled : false,
				color : 'white',
				style : {
					textShadow : '0 0 3px black'
				}
			}
		},
		series : {
			cursor : 'pointer',
			pointWidth : 40,
			point : {
				events : {
					click : function() {
						if (this.series.chart.renderTo) {
							angular.element(this.series.chart.renderTo).scope().drillDown(this.category);
						}
					}
				}
			}
		}
	},
	series : [ {
		name : 'High Rise',
		data : [ 9.35, 8.35, 7.35, 6.35, 5.35, 4.35, 5.35, 6.35, 7.35, 8.35, 9.35, 8.35 ],
		color : '#1FA8B0'
	} ]
};

function DataCube(data, context) {
	this.data = $.extend(true, [], data);
	this.context = context;
}
DataCube.prototype.cube = function(context) {

	var _localdata = $.extend(true, [], this.data);
	var _localcontext = (context == null ? this.context : context);

	var _cube = {
		cube : {},
		dimension1Keys : []
	};
	console.log("_localcontext.filter", _localcontext.filter);
	if (_localcontext.filter) {
		_localdata = _.where(_localdata, _localcontext.filter);
	}

	_localdata = _.sortBy(_localdata, _localcontext.dimension1);
	_.each(_localdata, function(value, key) {
		value.billPeriodTo = value.billPeriodTo.toString("MMM, yyyy");
	});

	var _dataByDimension2 = _.groupBy(_localdata, _localcontext.dimension2);
	_.each(_dataByDimension2, function(_dataByDimension2Item, _dataByDimension2Key) {
		var _dataByDimension2_1 = _.groupBy(_dataByDimension2Item, _localcontext.dimension1);

		_cube.dimension1Keys = _.uniq(_.union(_cube.dimension1Keys, _.keys(_dataByDimension2_1)), false);
		var _dataByDimension2_1_reduced = _.map(_dataByDimension2_1, function(groupItem, key4) {

			var _agrdata = _.reduce(groupItem, function(m, x) {
				m[_localcontext.dimensionValue] = m[_localcontext.dimensionValue] + x[_localcontext.dimensionValue];
				m.usageCost = m.usageCost + x.usageCost;
				return m;
			}, {
				propertyAddress : groupItem[0].propertyAddress,
				addressStreetName : groupItem[0].addressStreetName,
				addressStreetNumber : groupItem[0].addressStreetNumber,
				billPeriodFrom : groupItem[0].billPeriodFrom,
				billPeriodTo : groupItem[0].billPeriodTo,
				propertyId : groupItem[0].propertyId,
				propertyType : groupItem[0].propertyType,
				accessProfile : groupItem[0].accessProfile,
				costApplicable : groupItem[0].costApplicable,
				usageAmount : 0,
				usageCost : 0
			});
			return _agrdata;
		});
		_cube.cube[_dataByDimension2Key] = _dataByDimension2_1_reduced;
	});

	return _cube;
};
app.controller('ConsumptionController', [ '$rootScope', '$scope', '$q', '$timeout', 'workingCustomer',
		'ElectricityConsumptionService', 'WaterConsumptionService', 'AccessControl', $$ConsumptionController ]);
function $$ConsumptionController($rootScope, $scope, $q, $timeout, workingCustomer, ElectricityConsumptionService,
		WaterConsumptionService, AccessControl) {
	$scope.workingCustomer = workingCustomer;
	$scope.viewOption = {
		ownerOccupied : false,
		drillLevels : [],
		filter : {}
	};
	$scope.eusageData = null;
	$scope.wusageData = null;

	$scope.payableUsageOption = 'Total';
	$scope.enableAggregatedCost = AccessControl.hasAccess($scope.workingCustomer, 'cost');

	$scope.init = function() {
		ElectricityConsumptionService.findElectricityUsageByUser({
			customerId : $scope.workingCustomer.customerId,
			userId : $rootScope.contextParams.userId
		}).then(function(response) {
			$scope.eusageData = response;
			$scope.masterDataElectricity = angular.copy(response);
			// make access profile at property level
			_.each($scope.eusageData, function(value, index) {
				value.accessProfile = $scope.workingCustomer.accessProfile;
				value.costApplicable = $scope.enableAggregatedCost;
			});
			$scope.createUsageChart($scope.eusageData, $scope.viewOption, $scope.electricityOption);
		});
		WaterConsumptionService.findWaterUsageByUser({
			customerId : $scope.workingCustomer.customerId,
			userId : $rootScope.contextParams.userId
		}).then(function(response) {
			$scope.wusageData = response;
			$scope.masterDataWater = angular.copy(response); 
			// make access profile at property level
			_.each($scope.wusageData, function(value, index) {
				value.accessProfile = $scope.workingCustomer.accessProfile;
				value.costApplicable = $scope.enableAggregatedCost;
				value.usageAmount =  value.usageAmount / 1000;
			});
			$scope.createUsageChart($scope.wusageData, $scope.viewOption, $scope.waterOption);
		});
	};
	$scope.createUsageChart = function(usageSummary, viewOption, opt) {

		var analyticsContext = {
			dimension1 : 'billPeriodTo',
			dimension2 : 'propertyType',
			dimensionValue : 'usageAmount'

		};

		if ($scope.viewOption.ownerOccupied) {
			analyticsContext.filter = {
				ownerOccupied : 1
			};
		}

		var propertyResource = new PropertyResource();
		var datacube = new DataCube(usageSummary, analyticsContext);
		var _chartdata = datacube.cube();

		/**
		 * Added this block to show only last 12 months data in chart -- Start
		 */
		
		var dt = [];
		_.each(_chartdata.dimension1Keys,function(value,key){
			dt.push(Date.parse(value));
		});
		
		_chartdata.dimension1Keys = dt;
		_chartdata.dimension1Keys = _.sortBy(_chartdata.dimension1Keys);
		var dateString = [];
		
		_.each(_chartdata.dimension1Keys,function(value,key){
			dateString.push(new Date(value).toString("MMM, yyyy"));
		});
		_chartdata.dimension1Keys = dateString;
		
		_chartdata.dimension1Keys = _.last(_chartdata.dimension1Keys,12);
		$scope.cumulativeMonthlyConsumption ={};

		_.each(_chartdata.cube,function(eachCategoryData,key){
			_.each(eachCategoryData,function(value,key){
				value.billPeriodTo = Date.parse(value.billPeriodTo);
			});
			eachCategoryData = _.sortBy(eachCategoryData);
			_.each(eachCategoryData,function(value,key){
				value =new Date(value.billPeriodTo).toString("MMM, yyyy");
			});
			eachCategoryData = _.last(eachCategoryData,12);
			$scope.cumulativeMonthlyConsumption[eachCategoryData[0].propertyType] = eachCategoryData;
		});
		_chartdata.cube = $scope.cumulativeMonthlyConsumption;
		/**
		 * Added this block to show only last 12 months data in chart -- End
		 */

		var chartOption = $.extend(true, {}, usageStackChartOption);
		var _categories = _chartdata.dimension1Keys;
		var _series = [];

		_.each(_chartdata.cube, function(dimensionDataList, key) {
			var _seriesline = {
				name : key == 'Multi-Unit' ? 'Multi-Unit (2-6)' : key,
				unit : opt.unit,
				multiplier : opt.multiplier,
				color : propertyResource.getColor(key),
				data : []
			};
			_series.push(_seriesline);
			_.each(dimensionDataList, function(value, key) {
				_seriesline.data.push({
					y : value.usageAmount,
					data : value

				});
			});
		});

		chartOption.xAxis.categories = _categories;
		chartOption.yAxis.stackLabels.enabled = $scope.enableAggregatedCost;
		chartOption.yAxis.title.text = opt.unit;

		chartOption.series = _series;

		var chart = Highcharts.chart(opt.container, chartOption);
		chart.redraw();
		$scope.viewOption.drillLevels = [];
		$.each(chart.xAxis[0].ticks, function(i, tick) {
			if (tick.label) {
				tick.label.on('click', function() {
					$scope.drillDown($(this).text());

				});
			}
		});

	}
	$scope.actionDrillTo = function(level, key) {
		console.log('actionDrillTo-->', level, key);
		if (level == 0) {
			$scope.actionRedrawGraph();
		} else if (level < 3) {
			$scope.drillToLevel(level, key);
		}
	}
	$scope.drillDown = function(key) {
		$scope.actionDrillTo($scope.viewOption.drillLevels.length + 1, key);
	}
	$scope.drillToLevel = function(level, key) {
		while ($scope.viewOption.drillLevels.length >= level) {
			delete $scope.viewOption.filter[$scope.filterKeys[$scope.viewOption.drillLevels.length]];
			$scope.viewOption.drillLevels.pop();
		}
		$scope.viewOption.drillLevels.push(key);
		$scope.viewOption.filter[$scope.filterKeys[level]] = key;
		$scope.drillToLevelUsageChart(level, key, $scope.eusageData, $scope.viewOption, $scope.electricityOption);
		$scope.drillToLevelUsageChart(level, key, $scope.wusageData, $scope.viewOption, $scope.waterOption);
	}

	$scope.filterKeys = [ '', 'billPeriodTo', 'propertyType', 'propertyType' ];
	$scope.analyticsContext = [ {}, {
		dimension1 : 'propertyType',
		dimension2 : 'billPeriodTo',
		dimensionValue : 'usageAmount'

	}, {
		dimension1 : 'propertyAddress',
		dimension2 : 'billPeriodTo',
		dimensionValue : 'usageAmount'

	}, {
		dimension1 : 'propertyAddress',
		dimension2 : 'billPeriodTo',
		dimensionValue : 'usageAmount'

	} ];

	$scope.usageChartOption = [ usageStackChartOption, usageChartOption, usageChartOption, usageChartOption ];
	$scope.drillToLevelUsageChart = function(level, key, usageSummary, viewOption, opt) {
		var analyticsContext = $scope.analyticsContext[level];

		analyticsContext.filter = viewOption.filter;
		if ($scope.viewOption.ownerOccupied) {
			analyticsContext.filter.ownerOccupied = 1;
		} else {
			delete analyticsContext.filter.ownerOccupied;
		}

		var propertyResource = new PropertyResource();
		var datacube = new DataCube(usageSummary, analyticsContext);
		var _chartdata = datacube.cube();

		var chartOption = $.extend(true, {}, $scope.usageChartOption[level]);

		var _categories = _.first(_chartdata.dimension1Keys, 10);
		var _timekeys = _.keys(_chartdata.cube);
		var _series = [];

		var oneseries = _.first(_chartdata.cube[_timekeys[0]], 10);

		var _seriesline = {
			name : _timekeys[0],
			unit : opt.unit,
			multiplier : opt.multiplier,
			data : []
		};
		_series.push(_seriesline);
		_.each(oneseries, function(value, key) {
			_seriesline.data.push({
				y : value.usageAmount,
				color : propertyResource.getColor(value.propertyType),
				data : value
			});
		});

		chartOption.xAxis.categories = _categories;
		chartOption.yAxis.stackLabels.enabled = $scope.enableAggregatedCost;
		chartOption.yAxis.title.text = opt.unit;

		chartOption.series = _series;

		var chart = Highcharts.chart(opt.container, chartOption);
		chart.redraw()

		$timeout(function() {
			$scope.$apply()
		}, 50);
	}

	$scope.actionRedrawGraph = function() {
		if ($scope.payableUsageOption == 'Owner') {
			$scope.viewOption.ownerOccupied = true;
			$scope.eusageData = angular.copy($scope.masterDataElectricity);
			_.each($scope.eusageData, function(value, index) {
				value.accessProfile = $scope.workingCustomer.accessProfile;
				value.costApplicable = $scope.enableAggregatedCost;
			});
			$scope.wusageData = angular.copy($scope.masterDataWater);
			_.each($scope.wusageData, function(value, index) {
				value.accessProfile = $scope.workingCustomer.accessProfile;
				value.costApplicable = $scope.enableAggregatedCost;
			});
		} else {
			$scope.viewOption.ownerOccupied = false;
			$scope.eusageData = angular.copy($scope.masterDataElectricity);
			_.each($scope.eusageData, function(value, index) {
				value.accessProfile = $scope.workingCustomer.accessProfile;
				value.costApplicable = $scope.enableAggregatedCost;
			});
			$scope.wusageData = angular.copy($scope.masterDataWater);
			_.each($scope.wusageData, function(value, index) {
				value.accessProfile = $scope.workingCustomer.accessProfile;
				value.costApplicable = $scope.enableAggregatedCost;
			});
		}
		$scope.viewOption.filter = {};
		$scope.createUsageChart($scope.eusageData, $scope.viewOption, $scope.electricityOption);
		$scope.createUsageChart($scope.wusageData, $scope.viewOption, $scope.waterOption);
	}
	$scope.waterOption = {
		container : 'container_water',
		unit : 'm3',
		multiplier : 1
	};
	$scope.electricityOption = {
		container : 'container',
		unit : 'KWH',
		multiplier : 1
	}
	$scope.init();
};

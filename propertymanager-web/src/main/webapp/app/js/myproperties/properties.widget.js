'use strict';
var propertiesWidget = (function() {

	init = function(propertiesList) {
		// This is initiated by Controller
	}

	return {
		inti : init
	}
});


var graph1 = function(data, id) {
	var title = data[0].title;
	var chartname = data[0].chartname;
	var yaxisTitleText = data[0].yaxisTitleText;
	var yaxisTitleColor = data[0].yaxisTitleColor;
	var cost1 = [];
	for (var i = 0; i < data[0].chartdata.length; i++)
		cost1[i] = data[0].chartdata[i].cost;
	var month = [];
	var d = [], i;
	for (var i = 0; i < data[0].chartdata.length; i++)
		month[i] = data[0].chartdata[i].month;

	var chart = new Highcharts.Chart({
		chart : {

			type : 'column',
			renderTo : id,
			reflow : true,

		},
		title : {
			text : ''
		},
		xAxis : {
			categories : month
		},
		yAxis : {
			min : 0,
			title : {
				text : yaxisTitleText,
				color : yaxisTitleColor
			},
			stackLabels : {
				enabled : true,
				style : {
					fontWeight : 'bold',
					color : (Highcharts.theme && Highcharts.theme.textColor) || '#525252',
					align : 'center'

				},
				formatter : function() {
					return "$" + cost1[this.x];
				}
			}
		},
		legend : {
			enabled : false,
			align : 'center',
			x : -30,
			verticalAlign : 'top',
			y : 25,
			floating : false
		
		},
		tooltip : {
			shared : true
		},
		plotOptions : {
			column : {
				stacking : 'normal',
				dataLabels : {
					enabled : true,
					color : (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
				}
			}
		},
		series : [ {
			name : chartname,
			color : yaxisTitleColor,
			data : (function() {
				// generate an array of random data

				for (i = 0; i < data[0].chartdata.length; i++) {
					d.push([ data[0].chartdata[i].usage ]);
				}
				return d;
			}()),
			tooltip : {
				valuePrefix : '',
				valueSuffix : yaxisTitleText
			},
			pointPadding : 0.3,
			pointPlacement : -0.2,
			dataLabels : {
				enabled : false,
				rotation : 0,
				color : '#525252',

				align : 'center',
				format : '${y}', // one decimal
				y : 5, // 10 pixels down from the top
				style : {
					fontSize : '13px',
					fontFamily : 'Verdana, sans-serif'
				}
			}
		} ]
	});
	return chart;
};

var graph2 = function(waterData, id) {
	
	var chartname = "Water";
	var yaxisTitleText = "m<sup>3<sup>";
	var yaxisTitleColor = "#00B0F4";
	var cost1 = [];
	for (var i = 0; i < waterData.usageSummary.length; i++)
		cost1[i] = waterData.usageSummary[i].chargeAmount;
	var month = [];
	var d = [], i;
	for (var i = 0; i < waterData.usageSummary.length; i++)
		month[i] = waterData.usageSummary[i].billPeriodMonth;

	var chart = new Highcharts.Chart({
		chart : {

			type : 'column',
			renderTo : id,
			reflow : true,

		},
		title : {
			text : ''
		},
		xAxis : {
			type : 'datetime',
			dateTimeLabelFormats : {
				month : '%e. %b',
				year : '%b'
			},
		},
		yAxis : {
			min : 0,
			unit : 'm<sup>3<sup>',
			title : {
				text : yaxisTitleText,
				color : yaxisTitleColor
			},
			stackLabels : {
				enabled : true,
				style : {
					fontWeight : 'bold',
					color : (Highcharts.theme && Highcharts.theme.textColor) || '#525252',
					align : 'center'

				},
				formatter__ : function() {
					return "$" + cost1[this.y];
				}
			}
		},
		legend : {
			enabled : false,
			align : 'center',
			x : -30,
			verticalAlign : 'top',
			y : 25,
			floating : false
		
		},
		tooltip : {
			shared : true
		},
		plotOptions : {
			column : {
				stacking : 'normal',
				dataLabels : {
					enabled : true,
					color : (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
				}
			}
		},
		series : [ {
			color : yaxisTitleColor,
			data : (function() {
				// generate an array of random data

				for (i = 0; i < waterData.usageSummary.length; i++) {
					d.push({x:waterData.usageSummary[i].billPeriodMonth, y:waterData.usageSummary[i].usageAmount });
				}
				return d;
			}()),
			tooltip : {
				valuePrefix : '',
				valueSuffix : yaxisTitleText
			},
			pointPadding : 0.3,
			pointPlacement : -0.2,
			dataLabels : {
				enabled : false,
				rotation : 0,
				color : '#525252',

				align : 'center',
				format : '${y}', // one decimal
				y : 5, // 10 pixels down from the top
				style : {
					fontSize : '13px',
					fontFamily : 'Verdana, sans-serif'
				}
			}
		} ]
	});
	
	return chart;
};

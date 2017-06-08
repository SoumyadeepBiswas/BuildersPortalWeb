$.keyValueTable = function(mydata) {
	var table = $("<table class='chart-tooltip'>");
	var tblHeader = "<thead><tr>";
	tblHeader += "<th colspan=2>" + mydata.caption + "</th>";
	tblHeader += "</tr></thead>";
	$(tblHeader).appendTo(table);
	var _kvpair = _.pairs(mydata.data);
	_.each(_kvpair, function(value, index) {
		var TableRow = "<tr>";
		TableRow += "<td>" + value[0] + "</td>";
		TableRow += "<td><b>" + value[1] + "</b></td>";
		TableRow += "</tr>";
		$(table).append(TableRow);
	});
	return ($('<div>').append(table));
};
/*function demo () {
	var positions = [];
	if (this.series) {
		var data = this.series[0].data;
		for (i = 0; i < data.length; i++) {
			positions.push(new Date(data[i].x).toString("MMM DD, YYYY"));
		}
	}
	return positions;
}*/
function UsageGraphOptionEnergy() {
	this.enableCost = false;
	this.credits = {
		enabled : false
	};
	this.chart = {
		type : 'column',
		reflow : true,
		marginRight: 30 
	};
	this.title = {
		text : null
	};
	this.xAxis = {
		/*categories : function() {
			var positions = [];
			if (this.x) {
				var data = this.x;
				for (i = 0; i < data.length; i++) {
					positions.push((Highcharts.dateFormat('%b %d, %Y',new Date( data[i]))).toString()this.x);
				}
			}
			return positions;
		},*/
			type : 'category',
		ordinal: true,	
		labels : {
			rotation : -45,
			/*formatter : function() {
				return (Highcharts.dateFormat('%b %d, %Y',this.value)) (this.value).toString("MMM dd,yyyy"));
			}*/
		},
		tickmarkPlacement: 'on'
		/*tickPositioner : function(min, max) {
			var positions = [];
			if (d1) {
				var data = d1;
				for (i = 0; i < data.length; i++) {
					positions.push(new Date(data[i].x).toString("MMM DD, YYYY"));
				}
			}
			return positions;
		}*/
	};
	this.yAxis = {
		min : 0,
		unit : 'UNIT',
		title : {
			text : 'UNIT',
			color : "#00B0F4"
		},
		stackLabels : {
			enabled : true,
			style : {
				fontWeight : 'bold',
				color : (Highcharts.theme && Highcharts.theme.textColor) || '#525252',
				align : 'center'

			},
			formatter : function() {
				var userOptions = this.axis.chart.userOptions;
				console.log("userOptions.axis chart..", userOptions);
				if (userOptions.enableCost) {
					if(energyData){
					var data = energyData/*this.axis.series[0].cost*/;
					var _point = _.findWhere(data, {
						y : this.total
					});
					if (_point == null) {
						return "";
					}
					
					return '$' + Highcharts.numberFormat(_point.z, 0);
					}
				}
			}
		}
	};
	this.legend = {
		enabled : false
	};
	this.plotOptions = {
		column : {
			stacking : 'normal',
			dataLabels : {
				enabled : true,
				overflow: 'none',
		        crop: false,
				color : (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
				rotation : 270,
				useHTML : true,
				style : {
					fontWeight : "normal",
					textShadow : false,
					textOutline : false
				},
				formatter : function() {
					// var _unit = this.series.chart.yAxis[0].options.unit;
					return Highcharts.numberFormat(this.total, 0); // + _unit;
				}
			},
			minPointLength: 3,
			pointWidth : 20,
		},
		series : {
			color : '#000'
		}
	};
	this.tooltip = {
		backgroundColor : null,
		borderWidth : 0,
		useHTML : true,
		style : {
			padding : 0
		},
		formatter : function() {

			var tooltiptext = "";
			var data = /*this.series.data;*/ energyData;
			var _point = _.findWhere(data, {
				/*y : this.total*/
				x : this.key
			});
			if (_point == null) {
				return "";
			}
			var _unit = this.series.chart.yAxis[0].options.unit;

			var table = null;
			var userOptions = this.series.chart.userOptions;
			console.log("userOptions.series.chart.", userOptions);
			if (userOptions.enableCost) {
				table = $.keyValueTable({
					caption : /*Highcharts.dateFormat('%b %d, %Y', new Date(*/_point.x/*))*/,
					data : {
						'Total Approximate Cost' : '$' + Highcharts.numberFormat(_point.z, 0),
						'Usage' : Highcharts.numberFormat(_point.y, 0) + _unit
					}
				});
			} else {
				table = $.keyValueTable({
					caption : /*Highcharts.dateFormat('%b %d, %Y', new Date(*/_point.x/*))*/,
					data : {
						'Usage' : Highcharts.numberFormat(_point.y, 0) + _unit
					}
				});
			}
			return table.html();
		}
	};
}

function UsageGraphOption() {
	this.enableCost = false;
	this.credits = {
		enabled : false
	};
	this.chart = {
		type : 'column',
		reflow : true,
		marginRight: 30 
	};
	this.title = {
		text : null
	};
	this.xAxis = {
		/*categories : function() {
			var positions = [];
			if (this.x) {
				var data = this.x;
				for (i = 0; i < data.length; i++) {
					positions.push((Highcharts.dateFormat('%b %d, %Y',new Date( data[i]))).toString()this.x);
				}
			}
			return positions;
		},*/
			type : 'category',
		ordinal: true,	
		labels : {
			rotation : -45,
			/*formatter : function() {
				return (Highcharts.dateFormat('%b %d, %Y',this.value)) (this.value).toString("MMM dd,yyyy"));
			}*/
		},
		tickmarkPlacement: 'on'
		/*tickPositioner : function(min, max) {
			var positions = [];
			if (d1) {
				var data = d1;
				for (i = 0; i < data.length; i++) {
					positions.push(new Date(data[i].x).toString("MMM DD, YYYY"));
				}
			}
			return positions;
		}*/
	};
	this.yAxis = {
		min : 0,
		unit : 'UNIT',
		title : {
			text : 'UNIT',
			color : "#00B0F4"
		},
		stackLabels : {
			enabled : true,
			style : {
				fontWeight : 'bold',
				color : (Highcharts.theme && Highcharts.theme.textColor) || '#525252',
				align : 'center'

			},
			formatter : function() {
				var userOptions = this.axis.chart.userOptions;
				console.log("userOptions.axis chart..", userOptions);
				if (userOptions.enableCost) {
					if(waterData){
					var data = waterData/*this.axis.series[0].cost*/;
					var _point = _.findWhere(data, {
						y : this.total
					});
					if (_point == null) {
						return "";
					}
					
					return '$' + Highcharts.numberFormat(_point.z, 0);
					}
				}
			}
		}
	};
	this.legend = {
		enabled : false
	};
	this.plotOptions = {
		column : {
			stacking : 'normal',
			dataLabels : {
				enabled : true,
				overflow: 'none',
		        crop: false,
				color : (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
				rotation : 270,
				useHTML : true,
				style : {
					fontWeight : "normal",
					textShadow : false,
					textOutline : false
				},
				formatter : function() {
					// var _unit = this.series.chart.yAxis[0].options.unit;
					return Highcharts.numberFormat(this.total, 0); // + _unit;
				}
			},
			minPointLength: 3,
			pointWidth : 20,
		},
		series : {
			color : '#000'
		}
	};
	this.tooltip = {
		backgroundColor : null,
		borderWidth : 0,
		useHTML : true,
		style : {
			padding : 0
		},
		formatter : function() {

			var tooltiptext = "";
			var data = /*this.series.data;*/ waterData;
			var _point = _.findWhere(data, {
				/*y : this.total*/
				x : this.key
			});
			if (_point == null) {
				return "";
			}
			var _unit = this.series.chart.yAxis[0].options.unit;

			var table = null;
			var userOptions = this.series.chart.userOptions;
			console.log("userOptions.series.chart.", userOptions);
			if (userOptions.enableCost) {
				table = $.keyValueTable({
					caption : /*Highcharts.dateFormat('%b %d, %Y', new Date(*/_point.x/*))*/,
					data : {
						'Total Approximate Cost' : '$' + Highcharts.numberFormat(_point.z, 0),
						'Usage' : Highcharts.numberFormat(_point.y, 0) + _unit
					}
				});
			} else {
				table = $.keyValueTable({
					caption : /*Highcharts.dateFormat('%b %d, %Y', new Date(*/_point.x/*))*/,
					data : {
						'Usage' : Highcharts.numberFormat(_point.y, 0) + _unit
					}
				});
			}
			return table.html();
		}
	};
}


UsageGraphOption.prototype.xBoundary = function(p1, p2) {
	if (p1) {
		this.xAxis.min = (new Date(p1.x)).addDays(-1).getTime();
	}
	if (p2) {
		this.xAxis.max = (new Date(p2.x)).addDays(1).getTime();
	}

}

function WaterUsageGraphOption() {
	$.extend(true, this, new UsageGraphOption());
	//var chartOption = $.extend(true, {}, UsageGraphOption);

	this.yAxis.unit = 'm<sup>3<sup>';
	this.yAxis.title = {
		text : 'm<sup>3<sup>',
		color : "#00B0F4"
	};
	this.plotOptions.series.color = '#00B0F4';

}
function UsageGraph() {
	this.data = null;
	this.options = null;
	this.series = null;
}
UsageGraph.prototype.applyACL = function(showCost) {
	this.options.enableCost = showCost;
}
var waterData = [];
var energyData = [];
function WaterUsageGraph(idata) {
	$.extend(true, this, new UsageGraph());
	this.data = idata;
	this.options = null;
	this.series = null;

	this.buildOption = function(showCost) {
		this.options = new WaterUsageGraphOption();
		/*var _categories = [];
		_.each(this.series[0].data, function(xAxisData, key) {
			_categories.push(new Date(xAxisData.x).toString("MMM dd, yyyy"));
			//xAxisData.x = new Date(xAxisData.x).toString("MMM dd, yyyy");
		})
		this.options.categories = _categories;*/
		//this.options.xBoundary(this.series[0].data[0], this.series[0].data[this.series[0].data.length - 1]);
	}
	
	this.buildSeries = function() {
		if (this.data == null) {
			return [ {} ];
		}
		waterData = [];
		// var seriesData = _.last(_.sortBy(this.data.usageSummary,
		// 'billPeriodMonth'), 12);
		//var seriesData = _.sortBy(this.data.usageSummary, 'billPeriodMonth');
		var d = [];
		/*_.each(seriesData, function(value, key) {
			value.billPeriodTo = value.billPeriodTo.toString("MMM dd, yyyy");
		});*/
		for (i = 0; i < (this.data).length; i++) {
			/*d.push({
				x : this.data[i].billPeriodMonth(i+1),
				y : this.data[i].usageAmount / 1000,
				z : this.data[i].chargeAmount
			});*/
			d.push([(this.data)[i].billPeriodMonth,this.data[i].usageAmount / 1000]);
			waterData .push({
				x : (this.data)[i].billPeriodMonth,
				y : (this.data)[i].usageAmount / 1000,
				z : (this.data)[i].chargeAmount
			});
		}
		this.series = [ {
			name : 'waterusage',
			data : d,
			cost : waterData
		} ];
		
		
	}

	this.buildSeries();
	this.buildOption();

	console.log('this.series', this.series);
	
};
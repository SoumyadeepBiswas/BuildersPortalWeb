function pieChartTooltipFormatter() {
	var key = this.point.name;
	var html = "<table class='chart-tooltip'>";
	html += "<tbody>";
	$.each(this.series.data, function(index, data) {
		html += "<tr><td> ";
		if (data.name == key) {
			html += '<i class="fa fa-play" aria-hidden="true"></i>';
		} else {
			html += '<i class="fa fa-play" style="color:#000000" aria-hidden="true"></i>';
		}
		html += data.name == 'Multi-Unit' ? 'Multi-Unit (2-6)': data.name + "</td>";
		html += "<td> " + data.data[data.name] + ' (' + Highcharts.numberFormat(data.percentage, 2) + '%)'
				+ "</td></tr> ";

	});
	html += '</tbody>';
	html += '</table>';
	return html;
};

function donut(id, data, overrideOptions) {
	var _colors = [ '#1FA8B0', '#EEAC4C', '#5DB04B', '#396999', '#9683B5' ];
	var _totalcount = 0;
	_.each(data, function(value, index) {
		_totalcount += parseInt(_.pairs(value)[0][1]);
	});
	var _seriesData = [];
	_.each(data, function(value, index) {
		var _v = _.pairs(value)[0];
		_seriesData.push({
			name : _v[0],
			y : (_v[1] / _totalcount) * 100,
			data : value
		});
	});
	// series color
	if (overrideOptions && overrideOptions.classificationList) {
		if (_seriesData.length) {
			_colors = [];
			_.each(_seriesData, function(value, index) {
				var _citem = _.findWhere(overrideOptions.classificationList, {
					value : value.name
				});
				if (_citem && _citem.color) {
					_colors.push(_citem.color);
				}
			});
		}
	}
	// no data
	if (_totalcount == 0) {
		_seriesData = [ 100 ];
		_colors = [ '#d4f6f7' ];
	}
	var _option = {
		credits : {
			enabled : false
		},
		chart : {
			renderTo : id,
			type : 'pie',
			backgroundColor : 'rgba(255, 255, 255, 0.1)',
			margin : [ 0, 0, 0, 0 ],
			spacingTop : 0,
			spacingBottom : 0,
			spacingLeft : 0,
			spacingRight : 0
		},
		exporting : {
			enabled : false
		},
		title : {
			text : _totalcount > 0 ? '<div><div class="text-center pie-title-1lines"><b>' + _totalcount
					+ '</b></div><div>' : overrideOptions.nodataText,
			verticalAlign : 'middle',
			floating : true,
			useHTML : true
		},
		yAxis : {
			title : {
				text : 'Total percent market share'
			}
		},
		plotOptions : {
			pie : {
				shadow : false
			},
			series : {
				states : {
					hover : {
						enabled : (_totalcount > 0)
					}
				}
			}
		},
		tooltip : {
			enabled : (_totalcount > 0),
			//shared : true,
			backgroundColor : null,
			borderWidth : 0,
			useHTML : true,
			formatter : pieChartTooltipFormatter
		},
		series : [ {
			name : 'Browsers',
			data : _seriesData,
			colors : _colors,
			size : '100%',
			innerSize : '60%',
			showInLegend : false,
			dataLabels : {
				enabled : false
			}
		} ]
	};
	if (overrideOptions) {
		_option = $.extend({}, _option, overrideOptions)
	}
	setTimeout(function() {
		this.chart = new Highcharts.Chart(_option);
	}, 200);

}
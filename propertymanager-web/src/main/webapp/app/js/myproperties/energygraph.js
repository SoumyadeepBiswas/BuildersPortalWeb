function EnergyUsageGraphOption() {
	$.extend(true, this, new UsageGraphOptionEnergy());

	this.yAxis.unit = 'kWh';
	this.yAxis.title = {
		text : 'kWh',
		color : "#BA3C3D"
	};
	this.plotOptions.series.color = '#BA3C3D';

}
function EnergyUsageGraph(idata) {
	$.extend(true, this, new UsageGraph());
	this.data = idata;
	this.options = null;
	this.series = null;

	this.buildOption = function() {
		this.options = new EnergyUsageGraphOption();
		/*var _categories = [];
		_.each(this.series[0].data, function(xAxisData, key) {
			_categories.push(new Date(xAxisData.x).toString("MMM dd, yyyy"));
		})
		this.options.categories = _categories;
		this.options.xBoundary(this.series[0].data[0], this.series[0].data[this.series[0].data.length - 1]);*/
	}
	this.buildSeries = function() {
		if (this.data == null) {
			return [ {} ];
		}
		energyData = [];
		//var seriesData = _.last(_.sortBy(this.data.usageSummary, 'billPeriodMonth'), 12);
		//var seriesData = _.sortBy(this.data.usageSummary, 'billPeriodMonth');
		//console.log('	seriesData ', seriesData);
		var d = [];
		for (i = 0; i < (this.data).length; i++) {
			d.push([(this.data)[i].billPeriodMonth,(this.data)[i].usageAmount])
			energyData.push({
				x : (this.data)[i].billPeriodMonth,
				y : (this.data)[i].usageAmount,
				z : (this.data)[i].chargeAmount,
			});
		}
		this.series = [ {
			data : d
		} ];
	}
	this.buildSeries();
	this.buildOption();
};
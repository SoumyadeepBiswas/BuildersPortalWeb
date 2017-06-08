(function(window, angular) {
	var app = angular.module('app');
	app.config([ '$ocLazyLoadProvider', $$lazyConfig ]);
	function $$lazyConfig($ocLazyLoadProvider) {
		$ocLazyLoadProvider
				.config({
					debug : true,
					events : true,
					modules : [
							{
								name : 'toaster',
								files : [

								'//cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/2.0.0/toaster.min.css',
										'//cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/2.0.0/toaster.min.js' ]
							},{
								name : 'wizard',
								files : [

									'lib/jquery/fuelux/wizard/wizard-custom.min.js' ]
							},
							{
								name : 'ui.select',
								files : [
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/angular-ui-select/select.css',
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/angular-ui-select/select.js' ]
							},
							{
								name : 'ngTagsInput',
								files : [ '//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/ng-tags-input/ng-tags-input.js' ]
							},
							{
								name : 'daterangepicker',
								serie : true,
								files : [
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/angular-daterangepicker/moment.js',
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/angular-daterangepicker/daterangepicker.js',
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/angular-daterangepicker/angular-daterangepicker.js' ]
							},
							{
								name : 'vr.directives.slider',
								files : [ '//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/angular-slider/angular-slider.min.js' ]
							},
							{
								name : 'minicolors',
								files : [
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/angular-minicolors/jquery.minicolors.js',
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/angular-minicolors/angular-minicolors.js' ]
							},
							{
								name : 'textAngular',
								files : [
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/text-angular/textAngular-sanitize.min.js',
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/text-angular/textAngular-rangy.min.js',
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/text-angular/textAngular.min.js' ]
							},
							{
								name : 'ng-nestable',
								files : [
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/angular-nestable/jquery.nestable.js',
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/angular-nestable/angular-nestable.js' ]
							},
							{
								name : 'angularBootstrapNavTree',
								files : [ '//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/angular-bootstrap-nav-tree/abn_tree_directive.js' ]
							},
							{
								name : 'ui.calendar',
								files : [
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/jquery/fullcalendar/jquery-ui.custom.min.js',
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/jquery/fullcalendar/moment.min.js',
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/jquery/fullcalendar/fullcalendar.js',
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/angular-ui-calendar/calendar.js' ]
							},
							{
								name : 'ngGrid',
								files : [
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/ng-grid/ng-grid.min.js',
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/ng-grid/ng-grid.css' ]
							},
							{
								name : 'dropzone',
								files : [
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/angular-dropzone/dropzone.min.js',
										'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/modules/angular-dropzone/angular-dropzone.js' ]
							},
							{
								name : 'highcharts-ng',
								serie : true,
								files : [ '//cdnjs.cloudflare.com/ajax/libs/highcharts-ng/0.0.13/highcharts-ng.min.js',
										'//code.highcharts.com/highcharts.js',
										'//code.highcharts.com/modules/no-data-to-display.js' ]
							},
							{
								name : 'uxpHttp',
								files : [ 'uxp/modules/http-wrapper.js' ]
							},
							{
								name : 'xeditable',
								files : [
										'//cdnjs.cloudflare.com/ajax/libs/angular-xeditable/0.6.0/js/xeditable.min.js',
										'//cdnjs.cloudflare.com/ajax/libs/angular-xeditable/0.6.0/css/xeditable.min.css' ]
							},
							{
								name : 'datatables',
								serie : true,
								files : [ '//cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js',

								'//cdnjs.cloudflare.com/ajax/libs/angular-datatables/0.5.5/angular-datatables.js',

								]
							},
							{
								name : 'datatables.bootstrap',
								files : [

										'//cdn.datatables.net/1.10.12/css/dataTables.bootstrap.min.css',
										'//cdn.datatables.net/1.10.12/js/dataTables.bootstrap.js',

										'//cdnjs.cloudflare.com/ajax/libs/angular-datatables/0.5.5/plugins/bootstrap/datatables.bootstrap.min.css',
										'//cdnjs.cloudflare.com/ajax/libs/angular-datatables/0.5.5/plugins/bootstrap/angular-datatables.bootstrap.js',

								]
							},
							{
								name : 'angucomplete',
								files : [ 'uxp/css/angucomplete.css', 'uxp/css/easy-autocomplete.css',
										'thirdparty/angular/angucomplete.js' ]
							},

					]
				});
	}
	console.log("$ocLazyLoadProvider:init")
})(window, window.angular);
var LazyLoadConfig = {

	bootstrap : {
		files : [ '//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/jquery/bootstrap-confirmation.js',
				'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/jquery/bootstrap-tooltip.js',
				'//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/jquery/bootstrap-transition.js' ]
	},
	googlemap : {
		files : [ '//cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js', {
			type : 'js',
			path : '//maps.googleapis.com/maps/api/js?key=AIzaSyB2EYVrCKyT9t8AmS4SH0a9hm1xAt6uRis'
		} ]
	}
};

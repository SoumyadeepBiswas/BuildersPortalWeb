(function(window, angular) {
	'use strict';
	var app = angular.module('app');
	app.controller('AppCtrl', [ '$rootScope', '$localStorage', '$state', '$timeout', $$AppCtrl ]);
	function $$AppCtrl($rootScope, $localStorage, $state, $timeout) {
		$rootScope.settings = {
			skin : '//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/assets/css/skins/black.min.css',
			color : {
				themeprimary : '#474544',
				themesecondary : '#d73d32',
				themethirdcolor : '#ffce55',
				themefourthcolor : '#a0d468',
				themefifthcolor : '#e75b8d'
			},
			rtl : false,
			fixed : {
				navbar : false,
				sidebar : false,
				breadcrumbs : false,
				header : false
			}
		};
		if (angular.isDefined($localStorage.settings))
			var x = 0;
		else
			$localStorage.settings = $rootScope.settings;

		$rootScope.$watch('settings', function() {
			if ($rootScope.settings.fixed.header) {
				$rootScope.settings.fixed.navbar = true;
				$rootScope.settings.fixed.sidebar = true;
				$rootScope.settings.fixed.breadcrumbs = true;
			}
			if ($rootScope.settings.fixed.breadcrumbs) {
				$rootScope.settings.fixed.navbar = true;
				$rootScope.settings.fixed.sidebar = true;
			}
			if ($rootScope.settings.fixed.sidebar) {
				$rootScope.settings.fixed.navbar = true;

				// Slim Scrolling for Sidebar Menu in
				// fix state
				var position = $rootScope.settings.rtl ? 'right' : 'left';
				if (!$('.page-sidebar').hasClass('menu-compact')) {
					$('.sidebar-menu').slimscroll({
						position : position,
						size : '3px',
						color : $rootScope.settings.color.themeprimary,
						height : $(window).height() - 90,
					});
				}
			} else {
				if ($(".sidebar-menu").closest("div").hasClass("slimScrollDiv")) {
					$(".sidebar-menu").slimScroll({
						destroy : true
					});
					$(".sidebar-menu").attr('style', '');
				}
			}

			$localStorage.settings = $rootScope.settings;
		}, true);

		$rootScope.$watch('settings.rtl', function() {
			switchClasses("pull-right", "pull-left");
			switchClasses("databox-right", "databox-left");
			switchClasses("item-right", "item-left");

			$localStorage.settings = $rootScope.settings;
		}, true);

		$rootScope.$on('$viewContentLoaded', function(event, toState, toParams, fromState, fromParams) {
			if ($rootScope.settings.rtl) {
				switchClasses("pull-right", "pull-left");
				switchClasses("databox-right", "databox-left");
				switchClasses("item-right", "item-left");
			}
			if ($state.current.name == 'error404') {
				$('body').addClass('body-404');
			}
			if ($state.current.name == 'error500') {
				$('body').addClass('body-500');
			}
			$timeout(function() {
				if ($rootScope.settings.fixed.sidebar) {
					// Slim Scrolling for Sidebar Menu
					// in fix state
					var position = $rootScope.settings.rtl ? 'right' : 'left';
					if (!$('.page-sidebar').hasClass('menu-compact')) {
						$('.sidebar-menu').slimscroll({
							position : position,
							size : '3px',
							color : $rootScope.settings.color.themeprimary,
							height : $(window).height() - 90,
						});
					}
				} else {
					if ($(".sidebar-menu").closest("div").hasClass("slimScrollDiv")) {
						$(".sidebar-menu").slimScroll({
							destroy : true
						});
						$(".sidebar-menu").attr('style', '');
					}
				}
			}, 500);

			window.scrollTo(0, 0);
		});
	}
	console.log("AppCtrl:init");

})(window, window.angular);
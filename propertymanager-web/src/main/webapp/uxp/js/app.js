var iamEmailChange = false;
var iamRegisterUserCSR = false;
var showAddressFlag = false;
var propertyAddress = "";
var app = null;
(function(window, angular) {
	'use strict';
	console.log("module app::initialized started");
	app = angular.module('app', [ 'ngAnimate', 'ngCookies', 'ngResource', 'ngSanitize', 'ngTouch', 'ngStorage',
			'ngMessages', 'ui.router', 'ncy-angular-breadcrumb', 'ui.bootstrap', 'oc.lazyLoad', 'checklist-model',
			'uxpHttp', 'uxpSession' ]);
	console.log("module app::initialized");
})(window, window.angular);
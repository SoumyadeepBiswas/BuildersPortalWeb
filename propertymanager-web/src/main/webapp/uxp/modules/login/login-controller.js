app.controller('LoginController', [ '$scope', '$log', '$state', '$cookies', '$rootScope', '$interval', '$sce',
		$$LoginController ]);
function $$LoginController($scope, $log, $state, $cookies, $rootScope, $interval, $sce) {
	stopTime = $interval(loginWatcher, 1000);
	// linkIAMUITimer = $interval(linkIAMUI, 1000);
	function loginWatcher() {
		var _loginCookie = $cookies.get(ApplConfig.getTokenKey());
		console.log('_loginCookie  ', ApplConfig.getTokenKey(), _loginCookie);
		if (_loginCookie) {
			console.log('_loginCookie found moveing to app.secure.home');
			$interval.cancel(stopTime);
			$state.go("app.secure.home");
		}
	}
	// link iam UI
	function linkIAMUI() {
		console.log('Linking with iam:')
		if (typeof iam !== "undefined") {
			$rootScope.ApplConfig.appInitialize = true;
			var _linkdata = {
				actionlink : '#_login',
				action : 'login',
				clientId : 'idc.londonhydro.com',
				applicationCode : ApplConfig.applicationCode,
				applicationName : ApplConfig.applicationName,
				applicationUrl : ApplConfig.homeurl,
				redirectUri : '#',
				loginUrl : ApplConfig.homeurl,
				embedded : true
			};
			console.log("_linkdata******* ", _linkdata);
			iam.link(_linkdata);
			$interval.cancel(linkIAMUITimer);
		}
	}
	var loginemail = '';//$.getUrlVar('email');
	$scope.iamUrl = $sce.trustAsResourceUrl(ApplConfig.iam.embededURL() + "?" + $.param({
		header : 'N',
		applicationCode : ApplConfig.applicationCode,
		applicationName : ApplConfig.applicationName,
		email : loginemail,
		r : ApplConfig.homeurl
	}));
	$rootScope.ApplConfig.appInitialize = true;

};
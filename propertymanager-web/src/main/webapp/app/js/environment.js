function IAMConfig(data) {
	$.extend(true, this, data);
};
IAMConfig.prototype.loginURL = function() {
	return this.iamBaseURL + "/#!/login";
}
IAMConfig.prototype.logoutURL = function() {
	return this.iamBaseURL + "/#!/logout";
}
IAMConfig.prototype.embededURL = function() {
	return this.iamBaseURL + "/iam-classic.html#!/login";
}
IAMConfig.prototype.pluginURL = function() {
	return this.iamBaseURL + "/uxp/plugin/iam-plugin.js";
}
IAMConfig.prototype.getTokenKey = function() {
	return this.environrment + '-iam-token';
}
IAMConfig.prototype.getUserKey = function() {
	return this.environrment + '-user';
}
IAMConfig.prototype.domain = function() {
	return ".londonhydro.com";
}
IAMConfig.prototype.whoamiURL = function() {
	return this.apiEndpoint + "/management/whoami";
}
function ApplConfig(data) {
	$.extend(true, this, data);
	this.title ="Builder's Portal" //"Property Management Portal";
	this.allowedRoles = [ 'PropertyOwner', 'PropertyManager', 'PropertyDelegate', 'CSR' ];
};
ApplConfig.prototype.getTokenKey = function() {
	return this.iam.getTokenKey();
}
ApplConfig.prototype.getUserKey = function() {
	return this.iam.getUserKey();
}
ApplConfig.prototype.decideHomeURL = function(v) {
	this._homeURL = v;
	if (this._homeURL == '' || true) {
		this._homeURL = document.location;
		if (this._homeURL.host) {
			this._homeURL = this._homeURL.protocol + "//" + this._homeURL.host;
		}
		if (this._homeURL.endsWith("/")) {
			this._homeURL = this._homeURL.substring(this._homeURL.length - 1);
		}
	}
}
ApplConfig.prototype.homeURL = function() {
	return this._homeURL;
}

ApplConfig.environrment = '${profile.name}';

var IAMConfig = new IAMConfig();
IAMConfig.environrment = '${profile.name}';
IAMConfig.iamBaseURL = '${iam.baseurl}';
IAMConfig.apiEndpoint = '${iam.apiendpoint}';

var ApplConfig = new ApplConfig();
ApplConfig.iam = IAMConfig;
ApplConfig.applicationName = 'PMP';
ApplConfig.homeurl = '${app.homeurl}';
ApplConfig.loginUrl = '${app.loginurl}';
ApplConfig.apiServerEndpoint = '${app.apiendpoint}';
ApplConfig.myAccountUrl = '${app.myaccounturl}';
ApplConfig.myAccountActivateUrl = '${app.myaccountactivateurl}';
//${staticfilev}

if (document.domain.indexOf('localhost') >= 0 || document.domain.indexOf('local') >= 0) {
	ApplConfig.environrment = 'dev';
	IAMConfig.environrment = 'dev';
	
	IAMConfig.iamBaseURL = 'https://dev.londonhydro.com/iam';
	
	// IAMConfig.apiEndpoint = 'https://iam-dot-lh-platform-dev.appspot.com';
	IAMConfig.apiEndpoint = 'https://iamapi-dot-lh-platform-dev.appspot.com/iam/api';
	
	ApplConfig.apiServerEndpoint = 'http://local.londonhydro.com:8080/api';
	//ApplConfig.apiServerEndpoint = 'https://api-dot-lh-propertymanager-dev.appspot.com';

	//ApplConfig.homeurl = 'http://local.londonhydro.com:8090/homelocal';
	ApplConfig.homeurl = 'http://local.londonhydro.com:8080/pmpapp/homelocal';
}
// ApplConfig.decideHomeURL('${app.baseurl}');
$.get(ApplConfig.apiServerEndpoint + "/ping", function(data) {
	console.log(ApplConfig.iamApiEndpoint + "loaded...");
});
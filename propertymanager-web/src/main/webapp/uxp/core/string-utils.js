String.prototype.startsWith = function(str) {
	if (!str)
		return "";
	return this.slice(0, str.length) == str;
};
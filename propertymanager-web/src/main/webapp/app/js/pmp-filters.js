app.filter('gfilterMemberIsDelegateEquivalent', gfilterMemberIsDelegateEquivalent);
function gfilterMemberIsDelegateEquivalent() {
	return function(items) {
		if(items==null) {
			return false;
		}
		return items.filter(function(item, index, array) {
			return item.isDelegateEquivalent();
		});
	}
}

app.filter('gpropertyFilter', gpropertyFilter);
function gpropertyFilter() {
	return function(items, search) {
		if (!search || search == "" || items == null) {
			return items;
		}
		var withSelected = null;
		var text = null;
		if (angular.isObject(search)) {
			withSelected = search.selected;
			text = search.text;
		} else {
			text = search;
		}
		text = text.toUpperCase();
		console.log("gpropertyFilter ", search, text);
		return items.filter(function(item, index, array) {
			var q1 = item.hasText(text);
			var q2 = (withSelected == null || item.selected == withSelected);
			return q1 && q2;
		});

	};
}
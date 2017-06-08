Date.prototype.YYYYMMDD = function() {
	return this.toString("yyyy-MM-dd");
};
function str2KeyValue(str) {
	if (str == null || str == '') {
		return null;
	}

	var _arr = str.split(',');
	var _kvlist = [];
	_.each(_arr, function(value, index) {
		var kv = value.split('=');
		var obj = {};
		obj[kv[0]] = kv[1];
		_kvlist.push(obj);
	});
	return _kvlist;
};
(function(window, angular) {
	app.filter('offset', function() {
		return function(input, start) {
			start = +start;
			if (angular.isArray(input) && input.length > 0) {
				return input.slice(start);
			}
			/* start = parseInt(start, 10); */
			return input;
		};

	});

	app.filter('startFrom', function() {
		return function(input, start) {
			if (input != null)
				return input.slice(start);
		};
	});

	app.filter('num', function() {
		return function(input) {
			return parseInt(input, 10);
		};
	});

	app.directive('tooltip', function() {
		return {
			restrict : 'A',
			link : function(scope, element, attrs) {
				$(element).hover(function() {
					// on mouseenter
					$(element).tooltip('show');
				}, function() {
					// on mouseleave
					$(element).tooltip('hide');
				});
			}
		};
	});
	app.filter('phoneNumber', function() {
		return function(list, category) {
			if (jQuery.type(list) === 'string') {
				return list;
			}
			var _phone = _.findWhere(list, {
				phoneCategory : category
			});
			return _phone == null ? 'Not Set' : _phone.phoneNumber;
		}
	});

	app.filter('legalName', function() {
		return function(data) {
			if (data == null || jQuery.type(data) === 'string') {
				return data;
			}
			if (data.customerType == 'O') {
				return data.organizationName;
			}
			if (data.firstName == null) {
				return "Not set";
			}
			if (data.lastName == null) {
				return data.firstName;
			}
			
			return data.firstName + ' ' + data.lastName;
		}
	});

	app.filter('convertToMeterCube', function() {
		return function(data) {

			return data / 1000;
		}
	});

	app.directive("leftbarToggler", function() {
		return {
			restrict : 'A',
			link : function(scope, element, attrs) {
				if ($(window).width() >= 768) {
					var $toggler = $("<div class='box-slider box-slider-left'></div>").html(
							"<i class='fa fa-2x fa-chevron-circle-left' aria-hidden='true'></i");
					$toggler.on('click', function(event) {
						if ((element).hasClass('use-sidebar')) {
							element.removeClass('use-sidebar');
							$toggler.children("i").removeClass("fa-chevron-circle-left");
							$toggler.children("i").addClass("fa-chevron-circle-right");
							window.dispatchEvent(new Event('resize'));
						} else {
							element.addClass('use-sidebar');
							$toggler.children("i").addClass("fa-chevron-circle-left");
							$toggler.children("i").removeClass("fa-chevron-circle-right");
							window.dispatchEvent(new Event('resize'));
						}
					});
					element.children("div[role=content]").append($toggler);
				}
			}
		};
	});
	app.directive("required", function() {
		return {
			restrict : 'A',
			link : function(scope, element, attrs) {
				$("label[for='" + $(element).attr('name') + "']").append("<span class='text-danger'>*</span>");
			}
		};
	});

	app.directive("loading", $$loading);
	function $$loading() {
		return {
			restrict : 'A',
			require : 'ngModel',
			scope : true,
			link : function(scope, element, attrs, ngModel) {
				element.prepend('<div role="loader"><div class="loader-img" style="display: block;"></div></div>');
				ngModel.$render = function() {
					var newValue = ngModel.$viewValue;
					var emptyarray = false;
					if (angular.isArray(newValue)) {
						if (newValue.length > 0) {
							newValue = newValue[0];
						} else if (newValue.length == 0) {
							emptyarray = true;
						}
					}
					if (emptyarray || (newValue && newValue.$resolved == true) || newValue == "") {
						if (element) {
							element.children('div[role="loader"]').each(function(index) {
								//this.remove();
								$(this).remove();
							});
						}
					}
				};
			}
		};
	}
	app.directive("blockingLoading", $$blockingLoading);
	function $$blockingLoading() {
		return {
			restrict : 'A',
			require : 'ngModel',
			scope : true,
			link : function(scope, element, attrs, ngModel) {
				var _loader = '<div role="blockingloader" class="loader-bg"><div class="loader-img" style="display: block;"></div></div>';
				element.append(_loader);
				ngModel.$render = function() {
					var newValue = ngModel.$viewValue;
					if (angular.isArray(newValue)) {
						if (newValue.length > 0) {
							newValue = newValue[0];
						}
					}
					if (newValue && newValue.$resolved) {
						element.children('div[role="blockingloader"]').remove();
					}
				};
				scope.$watch(function() {
					if (angular.isObject(ngModel.$modelValue)) {
						return ngModel.$modelValue.$resolved;
					}
					return true;
				}, function(newValue) {
					if (newValue == null || newValue) {
						element.children('div[role="blockingloader"]').remove();
					} else {
						element.append(_loader);
					}
				}, true);
			}
		};
	}
	app.directive("showHidePair", function() {
		return {
			restrict : 'A',
			link : function(scope, element, attrs, ngModel) {
				var buttons = $(element).find('a').on("click", function() {
					buttons.toggle("slide");
				});
			}
		};
	});
	app.directive('download', [ '$filter', $$download ]);
	function $$download($filter) {
		return {
			restrict : 'A',
			require : 'ngModel',
			scope : {
				downloadOption : '='
			},
			link : function(scope, element, attrs, ngModel) {
				element.bind('click', function(e) {
					var csvString = '';
					var _colcount = 0;
					if (showAddressFlag) {
						csvString = csvString + propertyAddress;
						showAddressFlag = false;
					}
					if (scope.downloadOption.header) {
						_.each(scope.downloadOption.columns, function(opt, index) {
							if (opt.enable) {
								if (_colcount > 0) {
									csvString += ",";
								}
								csvString += opt.label;
								_colcount++;
							}
						})
						csvString += "\n";
					}
					_.each(ngModel.$viewValue, function(record, index) {
						_colcount = 0;
						_roles = "";
						_.each(scope.downloadOption.columns, function(opt, index2) {
							if (opt.enable) {
								if (_colcount > 0) {
									csvString += ",";
								}
								_colcount++;
								if (angular.isArray(opt.format) && opt.format.length == 2) {
									csvString += $filter(opt.format[0])(record[opt.name], opt.format[1]);
								}else if (opt.name == "user") {
									if(opt.format == 'EventModifiedBy'){
										if(/*(record[opt.name])['customerId']*/!record['modifiedByCSR'])
											csvString += (record[opt.name])['customerId'];
										else
											csvString += "CSR"/*(record[opt.name])['firstName']+" "+(record[opt.name])['lastName']*/;
									}
									else{
										if((record[opt.name])[opt.format])
											csvString += (record[opt.name])[opt.format];
										else
											csvString += '-';
									}
								} else if (angular.isArray(opt.format) && opt.format.length == 3) {
									csvString += $filter(opt.format[0])(record[opt.name], opt.format[1],opt.format[2]);
								} else if (opt.name == "address") {
									csvString += (record[opt.name])[opt.format];
								} else if (opt.format == "csaSigned") {
									if ((record[opt.name])[opt.format] == 0)
										csvString += "No";
									else
										csvString += "Yes";
								} else if (opt.format == "tenantOccupied") {
									if ((record[opt.name])[opt.format] == 0)
										csvString += "Owner";
									else
										csvString += "Tenant";
								} else if (opt.format == "connected") {
									if ((record["noOfUnits"]) - ((record[opt.name])[opt.format]) == 0)
										csvString += "Connected";
									else
										csvString += (record["noOfUnits"]) - ((record[opt.name])[opt.format])
												+ " Disconnected";
								} else if (opt.format == "moveinPending") {
									if ((record[opt.name])[opt.format] != 0)
										csvString += "Move-In";
									else if ((record[opt.name])["moveoutPending"] != 0)
										csvString += "Move-Out";
									else
										csvString += "No Pending Move";
								} else if (opt.format == "maxMoveinDate") {
									if ((record[opt.name])["moveinPending"] != 0)
										csvString += (record[opt.name])[opt.format];
									else if ((record[opt.name])["moveoutPending"] != 0)
										csvString += (record[opt.name])["minMoveoutDate"];
									else
										csvString += "No Pending Move in / out Date";
								} else if (opt.format == "electricity") {
									if ((record[opt.name])[opt.format] > 0 && (record[opt.name])["water"] > 0)
										csvString += "E/W";
									else if ((record[opt.name])[opt.format] > 0)
										csvString += "E";
									else if ((record[opt.name])["water"] > 0)
										csvString += "W";
									else
										csvString += "No Connections";
								} else if (opt.format == "convertToMeterCube") {
									csvString += $filter(opt.format)(record[opt.name]);
								} else if (opt.name == "status") {
									if(opt.format)
										csvString += (record[opt.name])[opt.format];
									else
										csvString += (record[opt.name]);
								} else if (opt.name == "roles") {
									if (angular.isArray(record[opt.format]) && record[opt.format].length > 1) {
										_.each(record[opt.format], function(role, index) {
											if (_roles == "") {
												_roles += (role)['authority'];
											} else {
												_roles += " / " + (role)['authority'];
											}
										});
										csvString += _roles;
									} else {
										csvString += (record[opt.format][0])['authority'];
									}
								} else {
									if (record[opt.name] != null) {
										csvString += record[opt.name];
									} else {
										csvString += "-";
									}
								}
							}
						});
						csvString += "\n";
					});
					var a = $('<a/>', {
						style : 'display:none',
						href : 'data:application/octet-stream;base64,' + btoa(csvString),
						download : scope.downloadOption.fileName
					}).appendTo('body')
					a[0].click()
					a.remove();
				});
			}
		}
	}
	;

	app.directive('checkStrength', $$checkStrength);
	function $$checkStrength() {
		return {
			replace : false,
			restrict : 'EACM',
			link : function(scope, iElement, iAttrs) {

				var strength = {
					colors : [ '#F00', '#F90', '#FF0', '#5cb85c', '#0F0' ],
					mesureStrength : function(p) {

						var _force = 0;
						var _regex = /[$-/:-?{-~!"^_`\[\]]/g;

						var _lowerLetters = /[a-z]+/.test(p);
						var _upperLetters = /[A-Z]+/.test(p);
						var _numbers = /[0-9]+/.test(p);
						var _symbols = _regex.test(p);

						var _flags = [ _lowerLetters, _upperLetters, _numbers, _symbols ];
						var _passedMatches = $.grep(_flags, function(el) {
							return el === true;
						}).length;

						_force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
						_force += _passedMatches * 10;

						// penality (short
						// password)
						_force = (p.length <= 6) ? Math.min(_force, 10) : _force;

						// penality (poor
						// variety of
						// characters)
						_force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
						_force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
						_force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;

						return _force;

					},
					getColor : function(s) {

						var idx = 0;
						if (s <= 10) {
							idx = 0;
						} else if (s <= 20) {
							idx = 1;
						} else if (s <= 30) {
							idx = 2;
						} else if (s <= 40) {
							idx = 3;
						} else {
							idx = 4;
						}

						return {
							idx : idx + 1,
							col : this.colors[idx]
						};

					}
				};

				scope.$watch(iAttrs.checkStrength, function() {
					if (scope.memberform) {
						if (scope.memberform.password === '' || typeof scope.memberform.password == 'undefined') {
							iElement.css({
								"display" : "none"
							});
						} else {
							var c = strength.getColor(strength.mesureStrength(scope.memberform.password));
							iElement.css({
								"display" : "inline"
							});
							iElement.children('li').css({
								"background" : "#DDD"
							}).slice(0, c.idx).css({
								"background" : c.col
							});
						}
					}
				});

			},
			template : '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>'
		};
	}

	if (typeof String.prototype.contains != 'function') {
		String.prototype.contains = function(str) {
			//return this.toUpperCase().includes(str.toUpperCase());
			return (this.toUpperCase().indexOf(str.toUpperCase()) >= 0);
		};
	}

	app.directive('phonenumberDirective', [ '$filter', $$phonenumberDirective ]);
	function $$phonenumberDirective($filter) {
		function link(scope, element, attributes) {
			// scope.inputValue is the
			// value of input element
			// used in template
			scope.inputValue = scope.phonenumberModel;

			scope.$watch('inputValue', function(value, oldValue) {

				value = String(value);
				var number = value.replace(/[^0-9]+/g, '');
				scope.phonenumberModel = number;
				scope.inputValue = $filter('phonenumber')(number);
			});
		}

		return {
			link : link,
			restrict : 'E',
			scope : {
				phonenumberPlaceholder : '=placeholder',
				phonenumberModel : '=model',
				phonenumberPattern : '=patternPhone'
			},
			template : '<input ng-model="inputValue" name="phoneNumber" type="tel" class="form-control" required="required" placeholder="{{phonenumberPlaceholder}}" title="Phonenumber (Format: (999) 999-9999)">',
		};
	}

	app.filter('phonenumber', function() {
		return function(number) {
			if (!number) {
				return '';
			}
			if (number == 'Not Set') {
				return 'Not Set';
			}

			number = String(number);

			// Will return formattedNumber.
			// If phonenumber isn't longer than an area code,
			// just show number
			var formattedNumber = number;

			// if the first character is '1', strip it out and
			// add it back
			var c = (number[0] == '1') ? '+1 ' : '';
			number = number[0] == '1' ? number.slice(1) : number;

			// # (###) ###-#### as c (area) front-end
			var area = number.substring(0, 3);
			var front = number.substring(3, 6);
			var end = number.substring(6, 10);

			if (front) {
				formattedNumber = (c + "(" + area + ") " + front);
			}
			if (end) {
				formattedNumber += ("-" + end);
			}
			return formattedNumber;
		};
	});

	/** * Code for password strength started** */
	app.directive('passwordTips', function() {
		return {
			restrict : 'C',
			link : function(scope, element, attrs, ctrl) {
				element.on('keyup', function() {
					var passwordStrengthConfig = {
						colors : [ "#cccccc", "#ff0000", "#ff5f5f", "#56e500", "#4dcd00", "#399800" ],
						label : [ 'Too short', 'Weak', 'Medium Strong', 'Strong' ]
					}

					var score = 0;
					var value = $(this).val();

					// password length
					if (value.length >= 6) {
						$(".password-rule [role*='length']").removeClass("invalid").addClass("valid");
						score++;
					} else {
						$(".password-rule [role*='length']").removeClass("valid").addClass("invalid");
					}

					// at least 1 digit in password
					if (value.match(/\d/)) {
						$(".password-rule [role*='numeric']").removeClass("invalid").addClass("valid");
						score++;
					} else {
						$(".password-rule [role*='numeric']").removeClass("valid").addClass("invalid");
					}

					// at least 1 capital & lower letter in
					// password
					if (value.match(/[A-Z]/) && value.match(/[a-z]/)) {
						$(".password-rule [role*='lowercase']").removeClass("invalid").addClass("valid");
						score++;
					} else {
						$(".password-rule [role*='lowercase']").removeClass("valid").addClass("invalid");
					}
					$(".strength-bar").css('background-color', passwordStrengthConfig.colors[score]);
					$(".strength-label").html(passwordStrengthConfig.label[score]);
					$(".strength-meter").show();
				});
			}
		}
	});

	app.directive('passwordRule', function() {
		return {
			restrict : 'A',
			require : 'ngModel',
			link : function(scope, element, attr, ngModel) {
				ngModel.$validators.passwordstrength = function(modelValue) {
					var regex = new RegExp(/(?=.*[a-z])(?=.*[A-Z]).{6,30}/);
					if (modelValue == null) {
						return true;
					}
					if (regex.test(modelValue))
						return true;
					else if (modelValue.length < 6)
						return false;
					else if (modelValue.length > 30)
						return false;
					else
						return false;
				}
			}
		};
	});

	app.directive('popover', [ '$log', $$popover ]);
	function $$popover($log) {
		return {
			restrict : 'A',
			link : function(scope, element, attrs) {
				element.on('shown.bs.popover', function(e) {
					var $popover = jQuery(this);
					var $closeHandler = $('#' + $popover.attr('aria-describedby'));
					$closeHandler.on('click', function(e) {
						$closeHandler.off('click');
						$popover.click();
					})
				})
			}
		};
	}

	app.directive('pop', [ '$log', $$pop ]);
	function $$pop($log) {
		return {
			restrict : 'A',
			link : function(scope, element, attrs) {
				element.popover({
					content : function() {
						return $($(this).attr("data-pop")).html();
					}
				}).on('shown.bs.popover', function(e) {
					var $popover = jQuery(this);
					var $closeHandler = $('#' + $popover.attr('aria-describedby')).find('button[role="close"]');
					$closeHandler.on('click', function(e) {
						$closeHandler.off('click');
						$popover.click();
					})
				})
			}
		};
	}
	/** * Code for password strength started end** */

	app.directive('numbersOnly', function() {
		return {
			require : 'ngModel',
			link : function(scope, element, attrs, modelCtrl) {
				modelCtrl.$parsers.push(function(inputValue) {
					if (inputValue == undefined)
						return ''
					var transformedInput = inputValue.replace(/[^0-9]/g, '');
					if (transformedInput != inputValue) {
						modelCtrl.$setViewValue(transformedInput);
						modelCtrl.$render();
					}

					return transformedInput;
				});
			}
		};
	});

	console.log("utils:init done");
})(window, window.angular);
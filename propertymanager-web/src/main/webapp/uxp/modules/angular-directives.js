/*******************************************************************************
 * * Copyright (c) 2012-2013 London Hydro * ALL RIGHTS RESERVED * *
 * ****************************************************************************
 * 
 * File Name: directives.js
 * 
 * Facility: London Hydro UI Client
 * 
 * Author: Affinity Systems
 * 
 * Revision History
 * 
 * Date Author Description ------- ------------------
 * ----------------------------------------- 17Jul13 Affinity Systems Original
 * version
 */

'use strict';

var directives = angular.module('lhDirectives', [ 'ngRoute', 'lhSession' ]);

/**
 * Rendering directive based on user access level (roles - permissions).
 */
directives.directive('accessLevel', [ 'AuthFactory', '$rootScope', function(AuthFactory, $rootScope) {
	return {
		restrict : 'A',
		link : function($scope, element, attrs) {

			var prevDisp = element.css('display'), userRoles, accessLevel, allowedRoles, allowed = false;

			$scope.$on('multiAccounts', function() {
				console.log('multi-accounts');
				allowedRoles = routing.accLevels[attrs.accessLevel];
				userRoles = $rootScope.session.user.roles;

				if (allowedRoles && userRoles) {
					for (var i = 0; i < userRoles.length; i++)
						allowed = allowedRoles.indexOf(userRoles[i].roleName) >= 0 ? true : false;
				}
				updateCSS(allowed);
			});

			$scope.$on('singleAccount', function(event, billing) {
				console.log('single-account');
				allowedRoles = routing.accLevels[attrs.accessLevel];
				allowed = allowedRoles && allowedRoles.indexOf(billing.role) >= 0 ? true : false;
				updateCSS(allowed);
			});

			function updateCSS(allowed) {
				element.css('display', allowed ? prevDisp : 'none');
			}
		}
	};
} ]);

/**
 * Checkbox as Switch
 */
directives.directive('bindCheckboxSwitch', function() {
	return function(scope, element, attrs) {
		if (scope.$last) {
			var container = attrs["bindCheckboxSwitch"];
			jcf.customForms.replaceAll(container);
		}
	};
});

/**
 * Bind Plastic custom style inside the specified container
 */
directives.directive('bindCustomStyle', function() {
	return function(scope, element, attrs, $timeout) {
		var container = attrs["bindRadioSwitch"];
		jcf.customForms.replaceAll(container);
	};
});

/**
 * Error Message directive
 */
directives
		.directive(
				'alertBar',
				[
						'$parse',
						function($parse) {
							return {
								restrict : 'A',
								template : '<div style="top: 0; background-color: #C44344; color:white;" class="alert alert-error alert-bar modal fade"'
										+ 'data-ng-show="errorMessage">'
										+ '<button type="button" class="close" data-ng-click="hideAlert()">'
										+ 'x</button>' + '{{errorMessage}}</div>',
								link : function($scope, elem, attrs) {
									var alertMessageAttr = attrs['alertmessage'];
									$scope.errorMessage = null;

									$scope.$watch(alertMessageAttr, function(newVal) {
										$scope.errorMessage = newVal;
										$(".alert").delay(200).addClass("in").fadeOut(4000, function() {
											$scope.errorMessage = null;
											// Also clear the error message on
											// the bound variable. // Do this so
											// that if the same error happens
											// again
											// the alert bar will be shown again
											// next time.
											$parse(alertMessageAttr).assign($scope, null);
										});
									});

								}
							};
						} ]);

/**
 * Success Message directive similar to error message directive
 */
directives
		.directive(
				'successBar',
				[
						'$parse',
						function($parse) {
							return {
								restrict : 'A',
								template : '<div style="top: 0; background-color: #87b54c; color:white;" class="alert alert-success alert-bar modal fade"'
										+ 'data-ng-show="successMessage">'
										+ '<button type="button" class="close" data-ng-click="hideAlert()">'
										+ 'x</button>' + '{{successMessage}}</div>',
								link : function($scope, elem, attrs) {
									var alertMessageAttr = attrs['alertmessage'];
									$scope.successMessage = null;

									$scope.$watch(alertMessageAttr, function(newVal) {
										$scope.successMessage = newVal;
										$(".alert").delay(200).addClass("in").fadeOut(4000, $scope.hideAlert);
									});

									$scope.hideAlert = function() {
										$scope.successMessage = null;
										// Also clear the error message on the
										// bound variable. // Do this so that if
										// the same error happens again
										// the alert bar will be shown again
										// next time.
										$parse(alertMessageAttr).assign($scope, null);
									};
								}
							};
						} ]);

/**
 * Account Filter directive
 */
directives.filter('accountFilter', function() {
	return function(accounts, searchText) {
		if (searchText == undefined) {
			return accounts;
		}
		var result = [];
		for (var i = 0; i < accounts.length; i++) {
			if (accounts[i].id.indexOf(searchText) != -1
					|| (accounts[i].accountDetails.friendlyName != null ? accounts[i].accountDetails.friendlyName
							.indexOf(searchText) != -1 : false)) {
				result.push(accounts[i]);
			}
		}
		return result;
	};
});

directives.directive('runJs', [ '$timeout', function($timeout) {
	return function($scope, element, attrs) {
		if (navigator.userAgent.match(/(iPad)/g) || !(navigator.userAgent.match(/(iPod|iPhone)/g))) {
			$("#header").css("z-index", "5000");
		} else {
			$("#header").css("z-index", "0");
		}
		$scope.$on('isJSLoaded', function() {

			$timeout(function() { // You might need this timeout to be sure
				// its run after DOM render.
				jQueryInit();
			}, 0, false);
		});
	};
} ]);

directives.directive('initCarousel', [ '$timeout', function($timeout) {
	return {
		link : function($scope, element, attrs) {
			if (navigator.userAgent.match(/(iPad)/g) || !(navigator.userAgent.match(/(iPod|iPhone)/g))) {
				$("#header").css("z-index", "5000");
			} else {
				$("#header").css("z-index", "0");
			}
			$scope.$on('isCarouselLoaded', function() {

				$timeout(function() { // You might need this timeout to be
					// sure its run after DOM render.
					initCarouselFade();
					initPopups();
					jcf.customForms.replaceAll('.custom-form');
					refreshCustomScroll();

					$timeout(function() {
						initHolderFixed();
						initSmoothScroll();
					}, 2000);

				}, 100, false);
			});

		}
	};
} ]);

directives.directive('mobileClick', function() // Ipad fix
{
	return function($scope, element, attrs) {
		$scope.$on('mobileClick', function() {
			if ($("#mobileCorpNav").hasClass("active") && navigator.userAgent.match(/(iPhone|iPod)/g)) {
				$("#header").css("z-index", "0");
			} else {
				$("#header").css("z-index", "5000");
			}
		});
	};
});

directives.directive('initCarouselMyLondonHydro', [ '$timeout', function($timeout) {
	return {
		link : function($scope, element, attrs) {
			$scope.$on('dataLoaded', function() {
				$timeout(function() { // You might need this timeout to be
					// sure its run after DOM render.
					initCarousel();
				}, 0, false);
			});
		}
	};
} ]);

directives.directive('overlay', function($log, $http, $compile, $timeout) {
	var compile = function(html, scope) {
		$timeout(function() {
			$compile(html)(scope);
			scope.$digest();
		});
	};
	return function(scope, element, attrs) {
		$(element).on("click", function($event) {
			console.log('overlay click', currentScope);
			var currentScope = scope.$new();
			$event.preventDefault();
			openOverlay(attrs['overlay'], function(html) {
				compile(html, currentScope);
			});
			return false;
		});
	};
});

directives.directive('slider', function($log) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			initSlideShow(element);
		}
	};
});

directives.directive('jcfall', function($log, $timeout) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			if (attrs['onEvent']) {
				scope.$on(attrs['onEvent'], function() {
					jcf.customForms.replaceAll(attrs['jcfall']);
				});
			} else {
				jcf.customForms.replaceAll(attrs['jcfall']);
			}
		}
	};
});

directives.directive('tabs', function($log) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			initTabs(element);
		}
	};
});

directives.directive('pop', function($log) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			$('.btn-close').click(function() {
				$(element).popover('hide')
			});
			$(element).popover({
				content : function() {
					return $($(this).attr("data-pop")).html();
				}
			});
		}
	};
});

directives.directive('popups', function($log) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			initPopups(element);
		}
	};
});

directives.directive('isMobile', function($log, $rootScope, $window) {
	return function() {
		var w = angular.element($window);
		$rootScope.isMobile = function() {
			return w.width() < 800;
		};
		$rootScope.$watch($rootScope.isMobile, function() {
			$rootScope.isMobile = w.width() < 800;
		});
		w.bind('resize', function() {
			$rootScope.$apply();
		});
	};
});

directives.directive('favicon', function($log, $rootScope, $window) {
	return function() {
		$rootScope.$on('$routeUpdate', function() {
			$('link[type*=icon]').detach().appendTo('head');
		});
		$rootScope.$on('$routeChangeSuccess', function() {
			$('link[type*=icon]').detach().appendTo('head');
		});
	};
});

directives.directive('accordionbind', function($log) {
	return {
		link : {
			post : function(scope, element, attrs, controller) {
				setTimeout(function() {
					if (attrs['toggle1'] != '' && attrs['toggle2'] != '' && attrs['toggle1'] != undefined
							&& attrs['toggle2'] != undefined) {
						var toggle1 = attrs['toggle1'];
						var toggle2 = attrs['toggle2'];
						var opener = $(element).find('div.opener a');
						opener.click(function() {
							if (opener.html() == toggle1)
								opener.html(toggle2);
							else
								opener.html(toggle1);
						});
					}
					// The accroddionBind directive can have a value of a field
					// to watch. eg. <div data-accordion-bind="accounts">
					// When this the case jquery will be run everytime there is
					// change on the given property in the scope.
					if (attrs['accordionbind']) {
						scope.$watch(attrs['accordionbind'], function() {
							initAccordion(element);
						});
					} else {
						initAccordion(element);
					}
				}, 250);
			}
		}
	};
});

directives.directive('overlay2', function($log, $compile) {

	/**
	 * Overriding the openState function jquery.overlays.js for overlays that
	 * load all slides in a single shot.
	 */
	var openState = function(state, firstTime) {

		if (typeof (firstTime) == "undefined")
			firstTime = false;

		// setup history
		this.options.stateKeyHistory.push(state.key);

		// open state
		if (firstTime) {
			// open fancy box since we don't have one open
			var fbOptions = this.getFancyBoxOptions(state);
			fbOptions.type = 'inline';
			fbOptions.afterShow = undefined;
			jQuery.fancybox(jQuery(state.selector), fbOptions);
		} else {
			// update contents
			jQuery('.fancybox-inner').html(jQuery(state.selector));
		}
	};

	return {
		controller : function($scope, $element, $attrs, $transclude) {
			$scope.currentStep = 0;
			$scope.openFancybox = function(selector) {
				var fbOptions = $scope.overlay.getFancyBoxOptions();
				fbOptions.type = 'inline';
				fbOptions.afterShow = undefined;
				jQuery.fancybox(jQuery(selector), fbOptions);
			};

			$scope.cancel = function() {
				$scope.$broadcast('closingOverlay', $scope.overlay);
				$scope.overlay.close();
				$scope.currentStep = 0;
				return false;
			};

		},
		link : function(scope, element, attrs) {
			var overlay = OVERLAYS[attrs['overlay2']];
			if (!overlay) {
				throw new Error('Could not find overlay with key: ' + attrs['overlay2']);
			}
			if (!overlay.templatePath) {
				throw new Error('No template path defined for overlay: ' + attrs['overlay2']);
			}

			overlay.openState = openState;
			element.on("click", function($event) {

				var containerCssClass = 'overlay-' + attrs['overlay2'] + '-container';
				var templateContainer = jQuery('.' + containerCssClass)[0];

				scope.overlayReady = function() {
					var openOverlayFn = angular.element(jQuery(':first-child', templateContainer)).scope().openOverlay;
					if (!openOverlayFn) {
						throw new Error('Could not find openOverlay function in controller for overlay: '
								+ attrs['overlay2']);
					}
					angular.element(jQuery(':first-child', templateContainer)).scope().openOverlay();
				};

				if (!templateContainer) {
					templateContainer = jQuery("<div style='display:none'/>");
					templateContainer.attr('class', containerCssClass);
					templateContainer.attr('data-ng-include', "'" + overlay.templatePath() + "'");
					templateContainer.attr('data-onload', "overlayReady()");
					scope.templateContainer = templateContainer;
					jQuery(element).parent().append(templateContainer);
					overlay.template = templateContainer;
					scope.overlay = overlay;
					$compile(overlay.template)(scope);
					scope.$apply();
				} else {
					scope.overlayReady();
				}
				return false;
			});
		}
	};
});

directives.directive('dirtyCheck', function($rootScope, $log) {
	return function() {
		$(document).keypress(function(e) {
			if ($rootScope.global.transaction) {
				$rootScope.global.transaction.clear();
			}
		});
		$('input').keypress(function(e) {
			if ($rootScope.global.transaction) {
				$rootScope.global.transaction.clear();
			}
		});
		$('input').click(function(e) {
			if ($rootScope.global.transaction) {
				$rootScope.global.transaction.clear();
			}
		});
	};
});

directives.directive('gaEvent', function($rootScope, $log, Analytics) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			console.log('gaEvent', attrs['gaEvent']);
			var gaeventName = attrs['gaEvent'];
			Analytics.trackEvent(gaeventName, 'button', 'click');
		}
	};
});

directives.directive('regexEmailValidate', function() {
	return {
		require : "ngModel",
		link : function(scope, elm, attrs, ctrl) {
			var validator = function(value) {
				ctrl.$setValidity('regexEmailValidate', isEmailValid(value));
				return value;
			};

			ctrl.$parsers.unshift(validator);
			ctrl.$formatters.unshift(validator);
		}
	};
});

var isEmailValid = function(value) {
	if (!value)
		return true;
	var results = validationRules.email(undefined, value);
	return results == true;
}

directives.directive('uppercase', function() {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, element, attrs, ctrl) {
			element.bind('keyup', function($event) {
				element.val(element.val().toUpperCase());
			});
			ctrl.$parsers.push(function(value) {
				return value.toUpperCase();
			});
		}
	}
});

directives.directive('usaZipCode', function() {
	return {
		restrict : 'A',
		link : function(scope, element, attrs, ctrl) {
			$(element).attr("maxlength", "10");
			element.bind('keydown', function($event) {
				var key = $event.which || $event.keyCode;
				return (key == 8 || key == 9 || key == 13 || key == 46 || key == 110 || key == 190
						|| (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
			});
		}
	}
});

directives.directive('canadaPostCode', function() {
	return {
		restrict : 'A',
		link : function(scope, element, attrs, ctrl) {
			$(element).attr("maxlength", "7");
			element.bind('keyup', function($event) {
				var key = $event.which || $event.keyCode;
				if (key == 8) {
					return;
				}
				var $this = $(this);
				var white = new RegExp(/^\s$/);
				if ($this.val().length == 3) {
					$this.val($this.val() + " ");
				}

				if ($this.val().length == 5 && white.test($this.val().charAt(4))) {
					$this.val($this.val().replace($this.val(), $this.val().substring(0, 4)));
				}
			});
		}
	}
});

directives.directive('passwordTips', function() {
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

				// at least 1 capital & lower letter in password
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

directives.directive('passwordRule', function() {
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

directives.directive('phoneNumber', function($timeout) {
	return {
		restrict : 'A',
		require : 'ngModel',
		scope : true,
		link : function(scope, element, attrs, ngModel) {
			$(element).attr("maxlength", "12");
			$(element).attr("placeholder", "999-999-9999");
			$(element).attr("pattern", "[0-9]{3}-?[0-9]{3}-?[0-9]{4,}");
			$(element).attr("validation-validate", "yes");
			$(element).attr("validation-rule", "phone-number-optional");
			if (typeof $(element).attr('required') !== typeof undefined && $(element).attr('required') !== false) {
				$(element).attr("validation-rule", "phone-number")
			}

			element.bind('keydown', function($event) {
				var key = $event.which || $event.keyCode;
				return (key == 8 || key == 9 || key == 13 || key == 46 || key == 110 || key == 190 || key == 189
						|| (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
			});
			element.bind('focus', function($event) {
				var $this = $(this);
				$this.val($this.val().replace(/-/g, ''));
			});
			element.bind('blur', function($event) {
				var key = $event.which || $event.keyCode;
				if (key == 8) {
					return;
				}
				var $this = $(this);
				formatPhoneNumber($this);
				scope.$apply(function() {
					ngModel.$setViewValue($this.val());
				});
			});

			$timeout(function() {
				formatPhoneNumber(element);
			}, 50);
		}
	}
});

directives.directive('phoneNumberExt', function() {
	return {
		restrict : 'A',
		require : 'ngModel',
		scope : true,
		link : function(scope, element, attrs, ctrl) {
			$(element).attr("maxlength", "4");
			$(element).attr("placeholder", "9999");
			element.bind('keydown', function($event) {
				var key = $event.which || $event.keyCode;
				return (key == 8 || key == 9 || key == 13 || key == 46 || key == 110 || key == 190 || key == 189
						|| (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
			});
			element.bind('focus', function($event) {
				var $this = $(this);
				$this.val($this.val().replace(/-/g, ''));
			});
		}
	}
});

directives.directive('aeroplan', function($rootScope, $log) {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, element, attrs) {
			element.bind('keypress', function($event) {

				var value = $(element).val();
				// TO be move to common place
				var aeroPlanPrefix = "627421";
				var nCheck = 0, nDigit = 0, bEven = false;
				value = value.replace(/\D/g, "");
				value = aeroPlanPrefix + value;

				var bEven = true;
				for (var n = value.length - 1; n >= 0; n--) {
					var cDigit = value.charAt(n), nDigit = parseInt(cDigit, 10);

					if (bEven) {
						if ((nDigit *= 2) > 9)
							nDigit -= 9;
					}

					nCheck += nDigit;
					bEven = !bEven;
				}
				var checkDigit = (1000 - nCheck) % 10;
				var _modelName = attrs.ngModel.replace(".number", "");
				scope[_modelName].checkDigit = checkDigit;
				console.log(_modelName);
			});
		}
	};
});

/* Needed for mylondonhydromenu */
directives.directive('openclose', function($log) {
	return {
		link : function(scope, element, attrs) {
			initOpenClose();
		}
	};
});

directives.directive('closemobileslider', function($timeout) {
	return function(scope, element) {
		scope.$on('$routeChangeStart', function() {
			$timeout(function() {
				$('#slide-menu').addClass('js-slide-hidden');
			});
		});
	};
});

directives.directive('mobileSideMenu', function($timeout) {
	return function(scope, element) {

		$timeout(function() {
			if ($(element).is(":visible")) {
				$($(element).attr('data-target')).addClass('collapse');
			}
			$($(element).attr('data-target')).find('a').click(function() {
				if ($($(element).attr('data-target')).hasClass('in')) {
					$(element).click();
				}
			})
		}, 1000);
		$(window).resize(function() {
			if ($(element).is(":visible")) {
				$($(element).attr('data-target')).addClass('collapse');
			} else {
				$($(element).attr('data-target')).removeClass('collapse');
			}
		});
	}
});

directives.directive('a', function() {
	return {
		restrict : 'E',
		link : function(scope, elem, attrs) {
			if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
				elem.on('click', function(e) {
					e.preventDefault();
				});
			}
		}
	};
});

function formatPhoneNumber(element) {
	if ($(element).val() != "") {
		var $this = $(element);
		var white = new RegExp(/^\s$/);
		var _value = $this.val();
		_value = _value.replace(/-/g, '').replace('(', '').replace(')', '').replace(/^0+/, '');
		if (_value.length > 10) {
			_value = _value.substring(0, 10);
		}
		if (_value.length >= 9) {
			_value = "" + _value.substring(0, 3) + "-" + _value.substring(3, 6) + "-" + _value.substring(6, 10);
		} else if (_value.length == 6) {
			_value = "" + _value.substring(0, 3) + "-" + _value.substring(3) + "-";
		}
		$this.val(_value);

	}
}

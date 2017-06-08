function PropertyAccessStructure() {
	this.properties = [];
	this.propertyAccessList = [];
	this.propertyAccessGroupByUser = [];
}
PropertyAccessStructure.prototype.log = function() {
	console.log('PropertyAccessStructure::propertyAccessGroupByUser', this.propertyAccessGroupByUser);
	console.log('PropertyAccessStructure::propertyAccessList', this.propertyAccessList);
}
PropertyAccessStructure.prototype.process = function(properties, list) {
	this.properties = properties || [];
	this.propertyAccessList = list || [];
	this._build();
}
PropertyAccessStructure.prototype._build = function() {
	console.log("PropertyAccessStructure::_build properties ..");
	var superthis = this;
	this.propertyAccessGroupByUser = [];
	console.log("_build properties ..", this.properties, this.propertyAccessList);

	// remove property access with no user
	this.propertyAccessList = _.reject(this.propertyAccessList, function(pa) {
		return (pa.userAccessDetails == null || pa.userAccessDetails.length == 0);
	});
	_.each(this.properties, function(property, index) {
		property.selected = false;
		property.userAccessDetails = null;
		_.each(superthis.propertyAccessList, function(delegate, index2) {
			if (property.propertyId == delegate.propertyId)
				property.userAccessDetails = delegate.userAccessDetails
		})
	})

	for (var j = 0; j < this.propertyAccessList.length; j++) {
		_delegators = this.propertyAccessList[j].userAccessDetails;
		if (_delegators) {
			for (var k = 0; k < _delegators.length; k++) {
				var _userAccess = _.findWhere(this.propertyAccessGroupByUser, {
					username : _delegators[k].userName
				});
				if (_userAccess == null) {
					this.propertyAccessGroupByUser.push(new UserWithAccessibleProperty({
						username : _delegators[k].userName,
						user : _delegators[k],
						properties : [ _.clone(this.propertyAccessList[j]) ],
						select : false
					}));
				} else {
					_userAccess.properties.push(_.clone(this.propertyAccessList[j]));
				}
			}
		}
	}
	_.each(this.propertyAccessList, function(item, index) {
		item.selected = false;
	});

	if (this.propertyAccessGroupByUser == null || this.propertyAccessGroupByUser.length == 0) {
	}
	this.log();
}
PropertyAccessStructure.prototype.add = function(newList) {
	console.log("add", newList, this.propertyAccessList);
	var superthis = this;
	_.each(newList, function(item, index) {
		var pa = _.find(superthis.propertyAccessList, function(v) {
			return v.propertyId == item.resourceId;
		});
		if (pa == null) {
			var property = _.find(superthis.properties, function(v) {
				return v.propertyId == item.resourceId;
			});
			pa = new PropertyAccess(property);
			superthis.propertyAccessList.push(pa);
		}
		pa.userAccessDetails = pa.userAccessDetails || [];
		var isExists = _.findWhere(pa.userAccessDetails, {
			userId : item.userId
		});
		if (!isExists) {
			pa.userAccessDetails.push(item);
		}
	});
	console.log("add final", newList, this.propertyAccessList);
	this._build();
}
PropertyAccessStructure.prototype.remove = function(discardList) {
	console.log("remove->", discardList, this.propertyAccessList);
	var superthis = this;
	_.each(discardList, function(item, index) {
		var pa = _.find(superthis.propertyAccessList, function(v) {
			return v.propertyId == item.resourceId;
		});
		if (pa && pa.userAccessDetails) {
			pa.userAccessDetails = _.reject(pa.userAccessDetails, function(uad) {
				return (uad.userId == item.userId);
			});
			if (pa.userAccessDetails.length == 0) {
				pa.userAccessDetails = null;
			}
		}
	});
	this._build();
}
app.controller('DelegateController', [ '$rootScope', '$scope', '$uibModal', '$window', 'DelegateService',
		'BatchService', 'PropertyService', 'toaster', '$timeout', 'OrganizationResource', 'organization',
		$$DelegateController ]);
function $$DelegateController($rootScope, $scope, $uibModal, $window, DelegateService, BatchService, PropertyService,
		toaster, $timeout, OrganizationResource, organization) {
	console.log("DelegateController::");
	$scope.OrganizationResource = OrganizationResource;
	$rootScope.organization = organization
	$rootScope.delegateFilter = null;

	$scope.propertyDelegateRoleEditable = false;

	$scope.filterObjProperty = {
		text : "",
		select : true
	};
	$scope.filterObjUser = {
		text : ""
	};

	$scope.filterObjDelegate = {
		text : ""
	};

	$scope.filterDelegateList = function(item, index) {
		if ($scope.filterObjDelegate.text == null || $scope.filterObjDelegate.text == "")
			return true;
		var data = item.user.username;
		return data.toUpperCase().indexOf(($scope.filterObjDelegate.text).toUpperCase()) >= 0;
	}

	$scope.propertyAccess = new PropertyAccessStructure();

	$scope.pageuiOption = {
		viewByUser : false
	};
	$scope.$watchCollection('[item1, item2]', function(newValues, oldValues) {
		// do stuff here
		// newValues and oldValues contain the new and respectively old value
		// of the observed collection array
	});
	$scope.getDelegateDetails = function() {
		pageLoader.show('getDelegateDetails');
		BatchService.all([ {
			uri : '/Customer/' + $rootScope.workingUser.customerId + '/Property',
			className : Property
		}, {
			uri : '/Customer/' + $rootScope.workingUser.customerId + '/ResourceAccess',
			className : PropertyAccess
		} ]).then(function(data) {
			$scope.properties = data[0];
			$scope.propertyAccessData = data[1];
			$scope.propertyAccess.process($scope.properties, $scope.propertyAccessData);
			pageLoader.hide('getDelegateDetails');
		});
	};
	$scope.getDelegateDetailsToBeDeleted = function() {
		pageLoader.show('getDelegateDetails');
		PropertyService.findPropertiesByCustomer($rootScope.workingUser.customerId).then(function(data) {
			$scope.properties = data;
			if ($rootScope.updatePropertyNameFlag) {
				$scope.properties = $rootScope.propertiesData;
			}
			DelegateService.getPropertyAccessList($rootScope.workingUser.customerId).then(function(response) {
				if (jQuery.isEmptyObject(response)) {
					pageLoader.hide('getDelegateDetails');
					console.log("Empty response")
					return [];
				} else {
					pageLoader.hide('getDelegateDetails');
					console.log("response present")
					return response;
				}

			}).then(function(response2) {
				$scope.propertyAccess.process($scope.properties, response2);
			});
		});
	};

	$scope.getDelegateDetails();

	$scope.fnManageDelegateUser = function(user) {
		console.log("fnManageDelegateUser", user);
		var modalInstanceGrant = $uibModal.open({
			windowClass : '',
			templateUrl : 'app/views/partials/delegate/manage_delegateuser.html',
			controller : 'DelegatePropertyAccessController',
			size : 'lg',
			resolve : {
				modalData : function() {
					return {
						user : user,
						properties : $scope.properties
					}
				}
			}
		});
		modalInstanceGrant.result.then(function(data) {
			console.log("fnManageDelegateUser return value->", data)
			$scope.propertyAccess.add(data);
		});
	};

	$scope.fnReSendActivationEmail = function(user, propertyId) {
		console.log("fnReSendActivationEmail user->", user);
		DelegateService.reSendActivationEmail(user, propertyId).then(function(response) {
			console.log("sssssss", response);
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "Mail sent successfully.",
			});
		}, function(httpresponse) {
			console.log('fail', httpresponse);
			toaster.pop({
				type : 'warning',
				title : "Error",
				body : httpresponse.statusText,
				timeout : 300000
			});
		});
	}

	$scope.uifOpenInlineForm = function(idx) {
		console.log('idx...', idx);
		$('#inline-add-delegate-form-opener-' + idx).hide();
		$('#inline-add-delegate-form-' + idx).show();
	}
	$scope.uifOpenInlineForm2 = function(idx) {
		console.log('idx...', idx);
		$('div[id^="inline-add-delegate-form2-"]').hide();
		$('[id^="inline-add-delegate-form-opener2-"]').show();
		$('#inline-add-delegate-form-opener2-' + idx).hide();
		$('#inline-add-delegate-form2-' + idx).show();
	}

	$scope.uifCloseInlineForm = function(idx) {
		$('#inline-add-delegate-form-opener-' + idx).show();
		$('#inline-add-delegate-form-' + idx).hide();
	}
	$scope.uifCloseInlineForm2 = function(idx) {
		$('#inline-add-delegate-form-opener2-' + idx).show();
		$('[id^="inline-add-delegate-form-opener2-"]').show();
		$('#inline-add-delegate-form2-' + idx).hide();
	}
	$scope.flag = false;
	$scope.holder = null;
	$scope.check = function(member, property) {

		$scope.flag = true;
		$scope.holder = member

	}

	$scope.setDelegateFilter = function(propertyId) {
		$rootScope.delegateFilter = propertyId;
	}

	$scope.actionAddPropertyAccessToUser2 = function(index, properties, delegateUser) {
		$scope.actionAddPropertyAccessToUser(properties, delegateUser);
		$scope.uifCloseInlineForm2(index);
	}

	$scope.actionAddPropertyAccessToUser = function(properties, delegateUser) {
		console.log("actionAddPropertyAccessToUser:::: selected property :::: ", properties, delegateUser);
		if ($.isArray(properties) == false) {
			properties = [ properties ];
		}
		if (properties == null || properties.length == 0) {
			console.warn("size zero!!!");
			return;
		}
		if (delegateUser.username == $rootScope.workingUser.username) {
			toaster.pop("warn", "Warning", "You have selected your email address.");
			console.warn("self delegate not allowed");
			return;
		}
		// $rootScope.global.transaction.$resolved = false;
		var _accessList = [];
		$.each(properties, function(index, value) {
			_accessList.push({
				"userId" : delegateUser.id,
				"resourceId" : value.propertyId,
				"delegatorUserId" : $rootScope.contextParams.userId,
				"status" : "Pending"
			});
		});

		DelegateService.addPropertyAccess(_accessList).then(function(response) {
			// $rootScope.global.transaction.$resolved = true;
			$scope.propertyAccess.add(response);
			toaster.pop("success", "Success", "User delegated");
		});

	};

	$scope.deSelectAllProperties = function(items) {
		// $scope.selectAllFlag = false;
		if ($.isArray(items)) {
			_.each(items, function(item, index) {
				item.selected = false;
			});
		}

		if ($('#selectAll').prop('checked')) {
			$('#selectAll').click();
		}
	};

	$scope.actionManageDelegateRemovePorpertyAccess = function(delegateUser, properties) {
		console.log("actionManageDelegateRemovePorpertyAccess::delegateUser", delegateUser);
		console.log("actionManageDelegateRemovePorpertyAccess::properties", properties);
		if ($.isArray(properties) == false) {
			properties.selected = true;
			properties = [ properties ];
		}

		if (properties == null || properties.length == 0) {
			console.warn("size zero!!!");
			return;
		}
		if (delegateUser.username == $rootScope.workingUser.username) {
			toaster.pop("warn", "Warning", "You have selected your email address.");
			console.warn("self delegate not allowed");
			return;
		}
		var _removeList = [];
		$.each(properties, function(index, property) {
			if (property && property.selected) {
				_removeList.push({
					"userId" : delegateUser.userId,
					"resourceId" : property.propertyId,
					"delegatorUserId" : delegateUser.delegatorUserId,
					"expiryDate" : delegateUser.expiryDate,
					"isDeleted" : "Y"
				});
			}
		});

		console.log("actionManageDelegateRemovePorpertyAccess remove->", _removeList)

		// $rootScope.global.transaction.$resolved = false;
		DelegateService.removePorpertyAccess(_removeList).then(function() {
			// $rootScope.global.transaction.$resolved = true;
			$scope.propertyAccess.remove(_removeList);
			$scope.showTransactionMessage("202");
		});
	};

	$scope.actionManageDelegateRemovePorpertyAccessForUser = function(delegateUser, isAll) {
		console.log("actionManageDelegateRemovePorpertyAccessForUser ", delegateUser, isAll);
		if (isAll) {
			$rootScope.selectAll(delegateUser.properties);
		}
		$scope.actionManageDelegateRemovePorpertyAccess(delegateUser.user, delegateUser.properties);
	};

	$scope.actionUpdaterPropertyAccessProfileByUser = function(user, userProperty) {
		console.log('actionUpdaterPropertyAccessProfileByUser', user, userProperty);
		DelegateService.updatePropertyAccessProfile(user, userProperty).then(function() {
			$scope.showTransactionMessage();
		});
	}

	$scope.toaster = {
		type : 'success',
		title : 'Success',
		text : 'Role updated successfully.'
	};
	$scope.pop = function() {
		toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
	};

	$scope.showTransactionMessage = function(status, msg) {
		console.log("::::custompopup::::", status, msg);
		console.log($scope.open);

		if (status == 202) {
			$scope.toaster.type = "success";
			$scope.toaster.title = "Success";
			$scope.toaster.text = "Remove successful";
		} else if (status == "notSelected") {
			$scope.toaster.type = "info";
			$scope.toaster.title = "Info";
			$scope.toaster.text = "Please select at least one property";
		} else if (msg) {
			$scope.toaster.type = "success";
			$scope.toaster.title = "Success";
			$scope.toaster.text = msg;
		}
		toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);

	};
	$scope.close = function() {
		$uibModalInstance.dismiss('cancel');
	};

};

app.controller('DelegatePropertyAccessController', [ '$rootScope', '$scope', '$window', '$uibModalInstance',
		'modalData', 'PropertyService', 'DelegateService', 'IAMService', '$timeout', 'toaster',
		$$DelegatePropertyAccessController ]);
function $$DelegatePropertyAccessController($rootScope, $scope, $window, $uibModalInstance, modalData, PropertyService,
		DelegateService, IAMService, $timeout, toaster) {
	$scope.properties = modalData.properties;
	$scope.delegateUser = modalData.user;

	console.log("DelegatePropertyAccessController::", $scope.delegateUser);

	$scope.nonDelegatedPropertiesForTheUser = [];

	$scope.ok = function(data) {
		$uibModalInstance.close(data);
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.setNonDelegatedPropertiesForTheUser = function() {
		console.log("setNonDelegatedPropertiesForTheUser", $scope.nonDelegatedPropertiesForTheUser.length);
		if ($scope.properties == null) {
			return;
		}
		$scope.nonDelegatedPropertiesForTheUser = _.reject($scope.properties, function(p) {
			if ($scope.delegateUser.properties == null || $scope.delegateUser.properties.length == 0) {
				return true;
			}
			for (var j = 0; j < $scope.delegateUser.properties.length; j++) {
				if (p.propertyId == $scope.delegateUser.properties[j].propertyId) {
					return true;
				}
			}
		});
		$rootScope.unSelectAll($scope.nonDelegatedPropertiesForTheUser);
		console.log("No. of Non-Delegated Properties :::::", $scope.nonDelegatedPropertiesForTheUser.length);
	};

	$scope.actionAddPropertyAccessToUser = function() {
		console.log("actionAddPropertyAccessToUser for user-> ", $scope.delegateUser);
		// $rootScope.global.transaction.$resolved = false;
		var _accessList = [];
		_.each($scope.nonDelegatedPropertiesForTheUser, function(value, index) {
			if (value.selected) {
				console.log("property->", value);
				_accessList.push({
					"userId" : $scope.delegateUser.user.userId,
					"resourceId" : value.propertyId,
					"delegatorUserId" : $scope.delegateUser.user.delegatorUserId,
					"expiryDate" : $scope.delegateUser.user.expiryDate,
					"status" : "Pending"
				});
			}
		});
		console.log("_accessList->", _accessList);

		DelegateService.addPropertyAccess(_accessList).then(function(response) {
			// $rootScope.global.transaction.$resolved = true;
			console.log("actionAddPropertyAccessToUser::", response);
			toaster.pop("success", "Success", "User delegated");
			$scope.ok(response);
		});
	};

	$scope.setNonDelegatedPropertiesForTheUser();

};

app.controller('ManageDelegatedUserController', [ '$rootScope', '$scope', '$uibModalInstance', 'toaster',
		'OrganizationService', 'OrganizationResource', 'IAMService', 'modalData', $$ManageDelegatedUserController ]);
function $$ManageDelegatedUserController($rootScope, $scope, $uibModalInstance, toaster, OrganizationService,
		OrganizationResource, IAMService, modalData) {
	$scope.OrganizationResource = OrganizationResource;

	$scope.memberform = {
		customerId : 0
	};

	$scope.memberform.defaultProfile = $scope.OrganizationResource.lovRoles[0].value;

	$scope.newuser = null;
	$scope.member = modalData.member;
	$scope.organization = modalData.organization;
	if ($scope.member) {
		$scope.memberform = $scope.member.form();
	}

	console.log('ManageDelegatedUserController', $scope.memberform);

	$scope.actionAddUser = function() {
		console.log("actionAddUser");
		console.log("memberform", $scope.memberform);
		$scope.memberform.createdBy = $rootScope.workingUser.id;
		IAMService.addUser($scope.memberform).then(function(newuser) {
			$scope.newuser = newuser;
			console.log("newuser ::: ", $scope.newuser);
			console.log('toaster', toaster);
			$scope.newmember = new Member();
			$scope.newmember["defaultProfile"] = $rootScope.newDelegateType;
			$scope.newmember["user"] = newuser;
			($rootScope.organization.members).push($scope.newmember);
			if (newuser && newuser.authorities) {
				$scope.setRole = false;
				for (i = 0; i < newuser.authorities.length; i++) {
					if (newuser.authorities[i].roleCode != "PropertyDelegate") {
						$scope.setRole = true;
					}
				}
			}
			if ($scope.setRole) {
				var userform = {
					username : $scope.newuser.username,
					userRoles : [ 'PropertyDelegate' ]
				};
				IAMService.updateUserRole($scope.newuser.id, userform).then(function(newuser) {
					console.log('toaster', toaster);
					toaster.pop({
						type : 'success',
						title : "Confirmation",
						body : "Delegate user added.",
						onHideCallback : function() {
							$scope.close();
						}
					});
					$scope.close();
				}, function(httpresponse) {
					console.log('fail', httpresponse);
					toaster.pop({
						type : 'warning',
						title : "Error occured while adding delegate access.",
						body : httpresponse.statusText,
						timeout : 300000
					});
				});
				return;
			}
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "Delegate user added."

			});
			$scope.memberform.username="";
			$scope.memberform.firstName="";
			$scope.memberform.lastName="";
			$scope.memberform.phoneNumber="";
			$scope.memberform.defaultProfile="";
			$scope.close();
		}, function(httpresponse) {
			console.log('fail', httpresponse);
			toaster.pop({
				type : 'warning',
				title : "Error",
				body : httpresponse.statusText,
				timeout : 300000
			});
		});
	}

	$scope.close = function() {
		if ($scope.newuser == null) {
			$scope.cancel();
		} else {
			$uibModalInstance.close($scope.newuser);
		}
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
};

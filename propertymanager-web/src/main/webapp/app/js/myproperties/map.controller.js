'use strict';
app.controller('MapCtrl', [ '$rootScope', '$scope', '$timeout', '$compile', 'PropertyService', 'properties', 'source',
		$$MapCtrl ]);
function $$MapCtrl($rootScope, $scope, $timeout, $compile, PropertyService, properties, source) {

	$scope.selectedProperties = [];
	$scope.source = source;

	var markers = {
		"House" : "img/house.png",
		"Town House" : "img/townhouse.png",
		"Multi-Unit (2-6)" : "img/multi.png",
		"High Rise" : "img/highrise.png",
		"Commercial" : "img/commercial.png",
		"Adjacent Properties" : "img/group.png"
	};

	$scope.markers = markers;

	// London's coordinates
	var mylocation = {
		'lat' : 42.9637,
		'lng' : -81.2497
	};

	var mapOptions = {
		minZoom : 11,
		zoom : 11,
		center : mylocation,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		scaleControl : true,
		zoomControl : true,
		// made the zoom small style
		zoomControlOptions : {
			style : google.maps.ZoomControlStyle.SMALL
		},
		streetViewControl : false,
		mapTypeControl : false,
		styles : [ {
			featureType : "poi",
			stylers : [ {
				visibility : "off"
			} ]
		}, {
			featureType : "transit",
			stylers : [ {
				visibility : "off"
			} ]
		} ]
	};

	var map = new google.maps.Map(document.getElementById('map'), mapOptions);
	var infoWindow = new google.maps.InfoWindow();
	// create isOpen function
	google.maps.InfoWindow.prototype.isOpen = function() {
		var map = this.getMap();
		return (map !== null && typeof map !== "undefined");
	}

	var mc = buildMarkerClusterer(map);
	buildLegend(map);

	google.maps.event.addListener(mc, "clusterclick", function(cluster, event) {
		var i = 0;
		var content = "";
		$scope.selectedProperties = [];
		for (i; i < cluster.markers_.length; i++) {
			var marker = cluster.markers_[i];
			content += "<br>" + marker.info + "<br>";
			$scope.selectedProperties.push(marker.property);
		}
		infoWindow.setPosition(cluster.getMarkers()[0].getPosition());
		infoWindow.setContent(content);
		infoWindow.open(map);
		$scope.$apply();
	});

	var serviceBoundry = new google.maps.KmlLayer({
		url : "https://www.londonhydro.com/lhkmlcache/service_territory.kml",
		map : map,
		clickable : false,
		preserveViewport : true,
		suppressInfoWindows : true
	});
	$scope.properties = properties;
	var i = 0;
	for (i = 0; i < $scope.properties.length; i++) {
		var property = $scope.properties[i];
		createMarker(property, map);
	}
	var htmlcontent = $('#map ');
	$compile(htmlcontent.contents())($scope);

	function createMarker(property, map) {
		var geocoder = new google.maps.Geocoder();
		geocoder
				.geocode(
						{
							'address' : property.address.postalCode
						},
						function(results, status) {
							if (status === google.maps.GeocoderStatus.OK) {
								var location = results[0].geometry.location;
								var marker = new google.maps.Marker({
									map : map,
									position : location,
									icon : markers[property.propertyClassification] || markers["Multi-Unit (2-6)"]
								});

								var address = "";
								if (property.address.streetNumber != null) {
									address += property.address.streetNumber + " ";
								}
								address += property.address.streetName + " " + property.address.city + " "
										+ property.address.province + " " + property.address.postalCode;
								var windowContent = "<div class='row'>"
										+ "<div class='col-xs-3'>"
										+ "<img width='60' class='center-block' src='https://openclipart.org/image/2400px/svg_to_png/220760/1434327792.png'>"
										+ "</div>" + "<div class='col-xs-9'>";
								if (property.nickname != null) {
									windowContent += "<b>" + property.nickname + "</b>";
								}
								windowContent += "<b>" + address + "</b><br>";
								windowContent += "<span><b>Units: </b>" + property.noOfUnits
										+ "<b class='pull-right'><a href='#/app/" + $rootScope.contextParams.userId
										+ "/";
								if ($rootScope.contextParams.customerId) {
									windowContent += $rootScope.contextParams.customerId + "/";
								}
								windowContent += "property?propertyId=" + property.propertyId
										+ "'>View Units</a></b></span><br>";

								windowContent += "<b>Disconnects: </b>"
										+ (property.noOfUnits - property.propertySummary.connected)
										+ "<br>"
										+ "<b>Moves: </b>"
										+ (property.propertySummary.moveinPending + property.propertySummary.moveoutPending)
										+ "</div></div>";

								marker.info = windowContent;
								marker.property = property;

								marker.addListener('click', function(event) {

									infoWindow.setContent(this.info);
									infoWindow.open(map, this);
									$scope.selectedProperties = [];
									$scope.selectedProperties.push(this.property);
									$scope.$apply();
								});

								mc.addMarker(marker);
							}
						});
	}

	function buildMarkerClusterer(map) {
		var markerClusterStyle = [ {
			height : 35,
			url : "img/group.png",
			width : 32,
			textColor : 'rgba(255, 255, 255, 1)',
		} ];
		var mcOptions = {
			gridSize : 20,
			zoomOnClick : false,
			styles : markerClusterStyle
		};
		return new MarkerClusterer(map, [], mcOptions);
	}

	function buildLegend(map) {
		var legend = document.getElementById('map-legend');
		for ( var key in markers) {
			var name = key;
			var icon = markers[key];
			var div = document.createElement('div');
			div.innerHTML = '<img width="20" src="' + icon + '"> ' + name;
			if (name == 'Adjacent Properties') {
				div.innerHTML += '&nbsp;<i id="map-tooltip" class="fa fa-question-circle" data-toggle="tooltip" data-placement="top" title="Properties that are too close together to display separately will be grouped." style="cursor: pointer;"></i>';
			}
			legend.appendChild(div);
		}
		$('#map-tooltip').tooltip();

		map.controls[google.maps.ControlPosition.LEFT_TOP].push(legend);
	}
};

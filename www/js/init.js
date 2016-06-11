$(document).on("mobileinit", function() {
	$.mobile.allowCrossDomainPages = true;
    $.mobile.touchOverflowEnabled = true;
    $.mobile.hideUrlBar = false;
    $.mobile.loadingMessage = true;
	$.mobile.hashListeningEnabled = false;
	$.mobile.pageContainer = $('#container');
	$.mobile.defaultPageTransition = 'slide';
	
    $(function() {
       	$('body').css({'background-color': MAIN_BG_COLOR });
		$('#container').css({'background-color': MAIN_BG_COLOR });
		
		$('.loading-app').removeClass('loading-app');
	   	tht.initialize();
			
		$('#container').bind("scroll", function() {
			tht.onEventScroll();
		});
    });
	
	$(window).bind("resize", function() {
		tht.onWindowResize();
	});
});


$(document).on("click", function(e) {
	if ($(e.target).hasClass('ui-btn-infowindow')) {
		var listid = $(e.target).attr('data-listid');
		if (listid>0) {
			var categ = $(e.target).attr('data-categ-type');
			if (categ && categ!='') {
				tht.ctarget = $(e.target);
			} else {
				tht.target = $(e.target);
			}
		}
	} else {
		var listid = $(e.target).closest('li').find('a.ui-btn').attr('data-listid');
		if (listid>0) {
			var categ = $(e.target).closest('li').attr('data-categ-type');
			if (categ && categ!='') {
				tht.ctarget = $(e.target).closest('li').find('a.ui-btn');
			} else {
				tht.target = $(e.target).closest('li').find('a.ui-btn');
			}
		}
	}
})
$(document).on("pagechange", function(e, ui) {
	tht.onPageChange(e, ui);
});

$(document).on("pagebeforeshow", function(e, ui) {
	tht.onPageBeforeShow(e, ui);
});
$(document).on("click", '.show-tht-page-load', function(e, ui) {
	tht.showLoader(225);
});

$(document).on("pageshow", function(e, ui) {
	tht.onPageShow(e, ui);
});

$(document).on("pageinit", "#map_view_favourites", function(e, ui) {
	tht.onPageInit('map_view_favourites', e, ui);
});
$(document).on("pageinit", "#map_view_places", function(e, ui) {
	tht.onPageInit('map_view_places', e, ui);
});
$(document).on("pageinit", "#map_view_events", function(e, ui) {
	tht.onPageInit('map_view_events', e, ui);
});
$(document).on("pageinit", "#favourites_map", function(e, ui) {
	tht.onPageInit('favourites_map', e, ui);
});
$(document).on("pageinit", "#places_map", function(e, ui) {
	tht.onPageInit('places_map', e, ui);
});
$(document).on("pageinit", "#events_map", function(e, ui) {
	tht.onPageInit('events_map', e, ui);
});
$(document).on("pageinit", "#page-categ-sub-map", function(e, ui) {
	tht.onPageInit('page-categ-sub-map', e, ui);
});
$(document).on("popupbeforeposition", function(e, ui) {

	//if (tht.isTablet()) {

        var hW = $("#home").width();
        var pW = hW*0.9;
        var pM = (hW*0.1)/2;


		var popstyle = '<style id="popstyle">.ui-popup-container.pop.in{margin-left:'+ pM +'px !important;width:'+pW+'px !important;left:0px !important;}</style>';
		$('#popstyle').remove();
		$('head').append(popstyle);
	//}
});
$(document).on("popupafterclose", function(e, ui) {
	if (tht.isTablet()) {
		$('#popstyle').remove();
	}
});

var tht = {
    onAddListing: false,
    pageNo: 0,
	target: null,
	ctarget: null,
	reasons: null,
	citylist: null,
	cityDefault: null,
	cityCurrent: null,
	prevPage: null,
	gallery: null,
	container: '#container',
	geoLatLng: {"lat":null, "lng":null},
	getGeoLatLng: function() {
		var val = this.getItem('geolatlng');
		if (typeof val!='undefined' && val) {
			return val;
		}
		return this.geoLatLng;
	},
    initialize: function() {
        this.startUp();
    },
	tabletMap: null,
	markers: [],
	storedMarkers: [],
	setItem: function(itm, val) {
		$.localStorage(itm, val);
	},
	getItem: function(itm) {
		var itm = $.localStorage(itm);
		return itm;
	},
	setCityCurrent: function(cityCurrent) {
		var $this = this;
		$this.setItem('cityCurrent', cityCurrent);
		$('.location-current-location').html( cityCurrent.cityname);
	},
	setUsername: function(username) {
		var $this = this;
		$this.setItem('username', username);
	},
	setPassword: function(password) {
		var $this = this;
		$this.setItem('password', password);
	},
	getCityCurrent: function() {
		var $this = this;
		var ret = $this.getItem('cityCurrent');
		ret = ret ? ret : '';
		return ret;
	},
	getUsername: function() {
		var $this = this;
		var ret = $this.getItem('username');
		//var ret = 'testing@test.com';
		ret = ret ? ret : '';
		return ret;
	},
	getPassword: function() {
		var $this = this;
		var ret = $this.getItem('password');
		//var ret = 'testing';
		ret = ret ? ret : '';
		return ret;
	},
	isLogged: function() {
		var username = this.getUsername();
		var password = this.getPassword();
		if (username && password) {
			return true;
		}
		return false;
	},
	windowSize: function() {
		var h = $(window).height();
		var w = $(window).width();
		var size = {"w":w, "h":h};
		return size;
	},
	getOrientation: function() {
		var $this = this;
		var winSize = $this.windowSize();
		var ret = '';
		if (winSize.w > winSize.h) {
			ret = 'landscape';
		} else {
			ret = 'portrait';
		}
		return ret;
	},
	isTablet: function() {
		//return false;
		var $this = this;
		var winSize = $this.windowSize();
		var ret = '';
		if (winSize.w >= 768) {
			ret = true;
		} else {
			ret = false;
		}
		return ret;
	},
    getContainer: function(page_id) {
        var container = $('#' + page_id + '> .ui-content');
        return container;
    },
	getReasons: function() {
		var $this = this;
		var reasons;
		if (typeof $this.reasons=='object' && $($this.reasons).length > 0) {
			reasons = $this.reasons;
		} else {
			reasons = {"1":"Spam", "2":"Linguaggio", "3":"Commenti", "4":"Immagini", "5":"Azienda Chiusa"};
		}
		return reasons;
	},
	getCity: function(ld) {
		var $this = this;

		var currentCity = $this.getCityCurrent();
        //console.log(currentCity);
		var avCity = null;
		if (currentCity && typeof currentCity=='object' && typeof currentCity.city_id!='undefined' && currentCity.city_id!='') {
			return currentCity.city_id;
		}
		var currentCity = $this.cityDefault;
		if (currentCity && typeof currentCity=='object' && typeof currentCity.city_id!='undefined' && currentCity.city_id!='') {
			return currentCity.city_id;
		}
		if (ld) {
			return 1;
		}
		return null;
	},
	getLatLng: function() {
		var $this = this;
		var currentCity = $this.cityCurrent;
		var avCity = null;
		if (currentCity && typeof currentCity=='object' && typeof currentCity.city_id!='undefined' && currentCity.city_id!='') {
			return {"lat":currentCity.lat, "lng":currentCity.lng};
		}
		var currentCity = $this.cityDefault;
		if (currentCity && typeof currentCity=='object' && typeof currentCity.city_id!='undefined' && currentCity.city_id!='') {
			return {"lat":currentCity.lat, "lng":currentCity.lng};
		}
		return {"lat":null, "lng":null};
	},
	updateLocation: function(city_id, tag) {
        //console.log(city_id);
		var $this = this;
		if (city_id!='') {
			var citylist = $this.getCityList();
			$.each(citylist, function (i) {
				var row 		= citylist[i];
				var cityId 		= row.city_id;
				if (cityId == city_id) {
					$this.cityCurrent = row;
					$this.setCityCurrent(row);
					//$('#location_search').attr('placeholder', row.cityname);
				}
			});
		} else {
			$this.cityCurrent = $this.cityDefault;
		}
		if (tag!='undefined') {
			//$this.loadCityList(true);
			//$('#location [data-role="controlgroup"]').controlgroup().controlgroup('refresh');
		}

	},
	getCityList: function() {
		var $this = this;
		var citylist = null;
		if (typeof $this.citylist=='object' && $($this.citylist).length > 0) {
			citylist = $this.citylist;
		}
		return citylist;
	},
    showLoader: function(delay) {
		if (delay>0) {
			var cT;
			clearTimeout(cT);
			cT = setTimeout(function(){
				 $.mobile.loading('show');
			}, delay);
		} else {
			 $.mobile.loading('show');
		}
    },
    hideLoader: function(inner, delay) {
		if (!inner) {
			$('.loading-more').remove();
		}
		if (delay>0) {
			var cT;
			clearTimeout(cT);
			cT = setTimeout(function(){
				$.mobile.loading('hide');
			}, delay);
		} else {
			$.mobile.loading('hide');
		}
    },
    onEventScroll: function() {
        var busy = false;
        var actPage = this.getActivePage();
        if (actPage) {
            var cont = '#' + actPage + ' .ui-result-set .ui-btn-loadmore';
			if(actPage == 'location') {
                cont = '#' + actPage + ' .ui-grid-cities .ui-btn-loadmore';
			}
            //actPage);
            //alert(cont);
            var loadmore = $(cont).html();
            if (loadmore && loadmore.length) {
                //var sTop = $(window).scrollTop();
				var sTop = $('#container').scrollTop();
                var wH = $(window).height();
                var pH = $('.ui-page-active').outerHeight();
                var tH = sTop + wH;
                if (tH >= pH && !busy) {
                    busy = true;
                    $(cont).trigger('click');
                }
            }
        }
    },
    startUp: function() {
        var $this = this;
		
        // home page
        $this.loadPageHome();

        setTimeout(function(){
            // get geo location
            $this.shareGeoLocation();
        }, 3000);

		
		// load locations
		var cPageNo = 0;
		$this.loadCityList(true, cPageNo, false);
	
        // about page
        $this.loadPageAbout();
		
		// add listing page
        $this.createPageAddListing();
		
		if ($this.isTablet()) {
			// add side bar map
       	 	$this.showSidebarMap('home');
		}

        //document.addEventListener("orientationchange", $this.refreshPageHeight, true);
        $(window).bind( 'orientationchange', function(e){
            if ($.event.special.orientationchange.orientation() == "portrait") {
                //Do whatever in portrait mode
                // we must wait for the change animationbefore recalculating
                setTimeout(function(){
                    $this.refreshPageHeight();
                }, 1000);

            } else {
                //Do Whatever in landscape mode
                // we must wait for the change animationbefore recalculating
                setTimeout(function(){
                    $this.refreshPageHeight();
                }, 1000);
            }
        });
    },
	shareGeoLocation: function() {
		$this = this;

		var latlng = $this.getGeoLatLng();
		if (latlng && latlng.lat && latlng.lat!='' && latlng.lng && latlng.lng!='') {
			//alert("Latlng");
			if ($this.isTablet()) {
				$this.updateSidebarMap('home', latlng);
			}

		} else {
			//alert("Empty");
			navigator.geolocation.getCurrentPosition(
				function(position){
					$this.geoLatLng = {"lat":position.coords.latitude, "lng":position.coords.longitude};
					$this.setItem('geolatlng', $this.geoLatLng);
					//navigator.notification.alert("Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude);
					//$this.updateSidebarMap('home', $this.geoLatLng);
				},
				function(error){
					navigator.notification.alert('GPS is not enabled. Please check your GPS settings.');
					console.log(error);
				},
                {timeout:6000}
			);
		}
	},
	loadPageHome: function() {
		var $this = this;
		var content = '';
		var manu_pages = '';
		var categs_page = '';
		
		content		+= '<div id="home" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'"><div data-role="header" style="background-color:'+ H_BG_TOP +'" data-position="fixed" data-tap-toggle="false"><h3><img class="main-logo" src="images/logo.png" /></h3><a href="#about" class="ui-btn-right ui-btn ui-btn-right ui-btn-gt show-page-loading-msg" data-transition="slide">' + TITLE_ABOUT + '</a></div><div data-role="content"><div class="ui-grid-solo main-menu">';
		
		var isLogged = $this.isLogged();
		for(i=0; i < MAIN_MENU.length; i++) {
			var menu = MAIN_MENU[i];
			var menu = MAIN_MENU[i];
			var menu_id = menu.id;
			var menu_title = menu.title;
			var categs = (typeof menu.categs !== 'undefined' && menu.categs==true) ? true : false;
			
			var loginp = menu_id=='favourites' ? 'tht-pop="false" tht-pop-s="#' + menu_id + '" tht-pop-e="tht.showPopupLogin(\'home\', this);"' : '';
		
			if (categs) {
				content		+= '<div class="ui-block-a"><a href="#' + menu_id + '-categs" id="home-'+ menu_id +'-categs" class="ui-btn"  data-transition="slide">' + menu_title + '</a></div>';
			} else {
				content		+= '<div class="ui-block-a"><a href="#' + menu_id + '" id="home-'+ menu_id +'" class="ui-btn" data-transition="slide" '+ loginp +'>' + menu_title + '</a></div>';
			}
			
			var right_btn 		= '';
			var right_btn_page 	= '';
			if (typeof menu.right_btn.id !== 'undefined') {
				var map_class = menu.right_btn.map ? 'ui-btn-map' : '';
				right_btn = '<a href="#' + menu.right_btn.id + '" class="ui-btn-right ui-btn ui-btn-right ui-btn-gt show-page-loading-msg '+ map_class +'" data-transition="slide">' + menu.right_btn.title + '</a>';
				
				var map_class = menu.right_btn.map ? 'ui-gmap' : '';
				if (menu.right_btn.id != menu_id) {
					right_btn_page = '<div id="' + menu.right_btn.id + '" data-role="page" class="ui-gmap page-list-map map-list-'+ menu.right_btn.id +'" style="background-color:'+ MAP_BG_COLOR +'!important;"><div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + menu_title + '</h1></div><div data-role="content" id="' + menu.right_btn.id + '_canvas" style="background-color:'+ MAP_BG_COLOR +'!important;"></div></div>';
				}
			}
			var filter_box = '';
			if (menu.filter_menu) {
				filter_box = this.getDataFilterBox(menu_id);
			}
			if (menu_id=='account') {
				$this.createPageAccount();
			} else {
				manu_pages	+= '<div id="' + menu_id + '" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'"><div data-role="header" data-position="fixed"  data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + menu_title + '</h1>' + right_btn + '</div>'+ filter_box +'<div data-role="content"></div></div>';
			}
			manu_pages	+= right_btn_page;

			if (categs) {
				var mapBtn = '<a href="#' + menu_id + '_map" class="ui-btn-right ui-btn ui-btn-right ui-btn-gt ui-btn-map" data-transition="slide">' + TITLE_MAP + '</a>';
				if (menu_id=='blog') {
					mapBtn = '';
				}
				var categ_page = '<div id="' + menu_id + '-categs" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'" class="page-list-categs categs-list-'+ menu_id +'"><div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + menu_title + '</h1>'+ mapBtn +'</div><div data-role="content"></div></div>';
				categs_page	+= categ_page;
			}
		}
		var popup = $this.getPopupContent('home');
		content		+= popup;
		content		+= '</div></div></div>';
		content		+= manu_pages;
		content		+= categs_page;
				
		$('#container').prepend(content);
		if ($this.isTablet()) {
			$this.setSidebarMap();
		}
	},
	showSidebarMap: function(page_id) {
		var $this = this;
		switch(page_id) {
			case 'home':
			default: {
				var latlng = $this.getGeoLatLng();
				$this.drawSidebarMap(page_id, true, latlng);
			}
			break;
		}
	},
	drawSidebarMap: function(page_id, single, latlng) {
		if (typeof google!='undefined' && typeof google.maps!='undefined') {
		} else {
			return;
		}
		var $this = this;
		var center;
		var marker;
		var zoom = SIDBAR_MAP_DEFAULT_ZOOM;
		var myOptions = {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: new google.maps.LatLng(latlng.lat, latlng.lng)
        };
		var lat = latlng.lat;
		var lng = latlng.lng;
		if (page_id == 'home') {
			if (latlng.lat && latlng.lng) {
				center = new google.maps.LatLng(latlng.lat, latlng.lng);
				marker = true;
				zoom = 6;
			}
		}
       
	    $this.tabletMap = new google.maps.Map(document.getElementById("sidebar-map"), myOptions);
		
		zoom = parseInt(zoom);
		$this.tabletMap.setZoom(zoom);
		
		if (!center) {
			center = new google.maps.LatLng(39.953438023308465, -75.14579772949219);
			lat = 39.953438023308465;
			lng = -75.14579772949219;
		}
		$this.tabletMap.setCenter(center);
			
		if (marker) {
			var marker = new google.maps.Marker({
				position: center,
				map: $this.tabletMap,
				icon: 'images/marker_icon.png',
				animation: google.maps.Animation.DROP,
				lat: lat,
				lng: lng
			});
			$this.markers.push(marker);
			$this.storeMarkers(page_id);
		}
		google.maps.event.addListener( $this.tabletMap, 'idle', function() {
			var ctM;
			clearTimeout(ctM);
			ctM = setTimeout(function() {
				$('.map-loader').hide();
			}, 500);
		});
	},
	updateSidebarMap: function(page_id, latlng, update, catId) {
		//console.log('updateSidebarMap( '+page_id+', '+update+', '+catId+' )');
		$('.map-loader').show();
		var $this = this;
		if ($this.tabletMap) {
			if (page_id == 'home') {
				if (latlng.lat && latlng.lng) {
					var locations = [[latlng.lat, latlng.lng]];
					$this.addMarkers(page_id, locations, update);
				}
			} else if (page_id == 'favourites' || page_id == 'page-categ-sub') {
				var locations = [];
				if (latlng.length>0) {
					for (var i=0;i < latlng.length; i++){
						var row = latlng[i];
						var id = row.ID;
						var title = row.post_title;
						var lat = row.lat_pos;
						var lng = row.long_pos;
						var icon = row.icon;
						if (lat!='' && lng!='') {
							var location = [lat, lng, title, id, icon];
							locations.push(location);
						}
					}
				}
				$this.addMarkers(page_id, locations, update);
			} else if (page_id == 'places-categs' || page_id == 'events-categs' || (typeof catId!='undefined' && catId>0) ) {
				var locations = [];
				if (latlng.length>0) {
					for (var i=0;i < latlng.length; i++){
						var row = latlng[i];
						var id = row.ID;
						var title = row.post_title;
						var lat = row.lat_pos;
						var lng = row.long_pos;
						var icon = row.icon;
						if (lat!='' && lng!='') {
							var location = [lat, lng, title, id, icon];
							locations.push(location);
						}
					}
				}
				$this.addMarkers(page_id, locations, update, catId);
			}
		}
	},
	addMarkers: function(page_id, locations, update, catId) {
		//console.log('addMarkers( '+page_id+', '+update+', '+catId+' )');
		var $this = this;
		var bounds;
		if (update) {
			//bounds = $this.tabletMap.getBounds();
		} else {
			$this.clearMarkers();
			//bounds = new google.maps.LatLngBounds();
		}
		var marker, i;
		var infowindow = new google.maps.InfoWindow();
		var total = locations.length;
		var markerInfo;
		for (var i = 0; i < locations.length; i++) {  
			var lat = locations[i][0];
			var lng = locations[i][1];
			var title = typeof locations[i][2]!='undefined' && locations[i][2] ? locations[i][2] : '';
			var id = typeof locations[i][3]!='undefined' && locations[i][3] ? locations[i][3] : '';
			var icon = typeof locations[i][4]!='undefined' && locations[i][4] ? locations[i][4] : '';
			var latlng = new google.maps.LatLng(lat, lng);
			
			markerInfo = title;
			if (id) {
				if (page_id=='favourites') {
					markerInfo = '<a href="#page_view_favourites" data-listid="'+ id +'" data-corners="false" data-role="button" class="ui-link ui-btn ui-shadow ui-btn-infowindow" role="button" data-transition="slide">'+ title +'</a>';
				} else if (page_id=='page-categ-sub' || page_id=='places-categs' || page_id=='events-categs' || (typeof catId!='undefined' && catId>0)) {
					markerInfo = '<a href="#page_view_page-categ-sub" data-listid="'+ id +'" data-corners="false" data-role="button" class="ui-link ui-btn ui-shadow ui-btn-infowindow" role="button" data-transition="slide">'+ title +'</a>';
				}
			}
			
			marker = new google.maps.Marker({
				position: latlng,
				animation: google.maps.Animation.DROP,
				map: $this.tabletMap,
				title: title,
				html: markerInfo,
				lat: lat,
				lng: lng,
				id: id
			});
			if (icon!='') {
				marker.setIcon(icon);
			}
			var j = $this.markers.length;
			if (title) {
				google.maps.event.addListener(marker, 'click', (function(marker, j) {
					return function() {
						infowindow.setContent(this.html);
						infowindow.open($this.tabletMap, marker);
					}
				})(marker, j));
			}
			$this.markers.push(marker);
			center = latlng;
		}
		if (total>1) {
			var bounds = $this.getBounds();
			center = bounds.getCenter();
			$this.tabletMap.panTo(center);
			$this.tabletMap.fitBounds(bounds);
		} else {
			$this.tabletMap.panTo(center);
			$this.tabletMap.setZoom(parseInt(MAP_ZOOM));
		}
		$this.storeMarkers(page_id);
		var ctM1;
		clearTimeout(ctM1);
		ctM1 = setTimeout(function() {
			$('.map-loader').hide();
		}, 2000);
		google.maps.event.addDomListener(window, 'resize', function() {
			$this.drawCanvasHeight(page_id, true);
			google.maps.event.trigger($this.tabletMap, "resize");
			if (total>1) {
				$this.tabletMap.panTo(center);
				$this.tabletMap.fitBounds(bounds);
			} else {
				$this.tabletMap.panTo(center);
				$this.tabletMap.setZoom(parseInt(MAP_ZOOM));
			}
		});
	},
	storeMarkers: function(page_id) {
		var $this = this;
		$this.storedMarkers[page_id] = $this.markers;
	},
	reupdateSidebarMap: function(page_id) {
		//console.log('reupdateSidebarMap( '+page_id+' )');
		var $this = this;
		if ($this.storedMarkers && typeof $this.storedMarkers[page_id]!='undefined') {
			$('.map-loader').show();
			var markers = $this.storedMarkers[page_id];
			var new_markers = [];
			for (var i = 0; i < markers.length; i++) {
				var marker = markers[i];
				var lat = typeof marker.lat!='undefined' && marker.lat ? marker.lat : '';
				var lng = typeof marker.lng!='undefined' && marker.lng ? marker.lng : '';
				var title = typeof marker.title!='undefined' && marker.title ? marker.title : '';
				var id = typeof marker.id!='undefined' && marker.id ? marker.id : '';
				var icon = typeof marker.icon!='undefined' && marker.icon ? marker.icon : '';
				if (lat && lng) {
					var new_marker = [lat, lng, title, id, icon];
					new_markers.push(new_marker);
				}
			}
			$this.addMarkers(page_id, new_markers, false);
		}
	},
	getBounds: function() {
		var $this = this;
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0; i < $this.markers.length; i++) {
			var pos = $this.markers[i].getPosition();
			bounds.extend(pos);
		}
		return bounds;
	},
	clearMarkers: function() {
		var $this = this;
		for (var i = 0; i < $this.markers.length; i++) {
			$this.markers[i].setMap(null);
		}
		$this.markers = [];
	},
	setSidebarMap: function() {
		var $this = this;
		var content = $this.getHtmlMap();
		$($this.container).append(content);
		$($this.container +' > [data-role="panel"]').panel();
		$($this.container +' > [data-role="panel"]').panel("open");
		$('body').toggleClass('tablet');
	},
	getHtmlMap: function() {
		var content = '<div data-role="panel" id="tablet-map" data-position="right" data-display="overlay" data-animate="false" data-position-fixed="true" data-swipe-close="false" class="ui-panel-display-reveal" style="background-color:'+ MAP_BG_COLOR +'"><div id="sidebar-map"></div><div class="map-loader"></div></div>';
		return content;
	},
	getPopupContent: function(page_id) {
		$('#'+ page_id +'-popLogin-screen').remove();
		$('#'+ page_id +'-popLogin-popup').remove();
		var popup = '<a href="#'+ page_id +'-popLogin" id="show'+ page_id +'-popLogin" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-btn-popup-hidden">vv</a>';
		popup += '<div data-role="popup" class="ui-popup-box" id="'+ page_id +'-popLogin" data-overlay-theme="b" data-dismissible="false"><div data-role="header" data-theme="a" style="background-color:'+ MSG_HEAD_BG_COLOR +'"><h1 style="color:'+ MSG_HEAD_THT_COLOR +'">'+ TITLE_MESSAGE +'</h1></div><div role="main" class="ui-content"><p class="ui-title ui-message">'+ MSG_LOGINTOACCESS +'</p><a href="javascript:void(0)" class="ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="back" data-transition="pop" style="color:'+ BTN_TXT_COLOR +'" >'+ TITLE_OK +'</a></div></div>';
		return popup;
	},
	showPopupLogin: function(page_id, e) {
		var $this = this;
		var popId = page_id +'-popLogin';
		$this.showPopup(popId);
	},
	loadPageAbout: function() {
		var $this = this;
		var page = '<div id="about" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'"><div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + TITLE_ABOUT + '</h1><a href="#popupVersion" data-rel="popup" href="#" class="ui-btn-right ui-btn ui-btn-right ui-btn-gt show-page-loading-msg"  data-transition="pop" data-position-to="window">' + TITLE_VERSION + '</a></div><div data-role="content"><iframe src="'+ URL_BASE +'?api=about" id="iframe-about" class="iframe-about" width="100%" height="100%" frameborder="0" align="middle" seamless></iframe><div data-role="popup" id="popupVersion" class="ui-content" style="max-width:280px"><a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">' + TITLE_CLOSE + '</a><p>' + MSG_APPVERSION + '</p></div></div></div>';
		$('#container').append(page);
		$('#iframe-about').load(function() {
					$this.hideLoader();
					$this.refreshPageHeight('about');
				});
	},
	createPageLogin: function(ref) {
		//console.log('createPageLogin( '+ref+' )');
		var $this = this;
		
		var page_id = 'account';
		
		// header
		var header = '<div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + TITLE_SIGNIN + '</h1></div>';
		var username = $this.getUsername();
		var password = $this.getPassword();
		var isLogged = $this.isLogged();
		
		var page_content = '<div class="ui-grid-solo">';
		page_content += '<div class="ui-block-a"><label for="acEmail">'+ TITLE_EMAIL +'</label><input value="'+ username +'" name="email" id="acEmail" value="" type="text"></div>';
		page_content += '<div class="ui-block-a"><label for="acPassword">'+ TITLE_PASSWORD +'</label><input name="password" value="'+ password +'" id="acPassword" value="" type="password"></div>';
		if (isLogged) {
			page_content += '<div class="ui-block-a ui-block-logout"><a onclick="tht.Logout()" href="#" class="ui-btn ui-btn-logout" data-corners="false">'+ TITLE_LOGOUT +'</a></div>';
		} else {
			page_content += '<div class="ui-block-a ui-block-acbtns"><div class="ui-grid-b"><div class="ui-block-a"><a href="#register" data-transition="slide" class="ui-btn" data-corners="false">'+ TITLE_SIGNUP +'</a></div><div class="ui-block-b"><span class="ui-btn-or">or</span></div><div class="ui-block-c"><a href="#" class="ui-btn" data-corners="false" onclick="tht.Login(this)">'+ TITLE_SIGNIN +'</a></div></div></div>';
			page_content += '<div class="ui-block-a ui-block-fb"><a onclick="tht.fbLogin()" href="#" class="ui-btn ui-btn-fb" data-corners="false">'+ TITLE_FB_CONNECT +'</a></div>';
		}
		page_content += '</div>';
		
		var popup = '<a href="#popLogin" id="showpopLogin" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-btn-popup-hidden"></a>';
		popup += '<div data-role="popup" class="ui-popup-box" id="popLogin" data-overlay-theme="b" data-dismissible="false"><div data-role="header" data-theme="a" style="background-color:'+ MSG_HEAD_BG_COLOR +'"><h1 style="color:'+ MSG_HEAD_THT_COLOR +'">'+ TITLE_SIGNIN +'</h1></div><div role="main" class="ui-content"><p class="ui-title ui-message"></p><a href="javascript:void(0)" class="ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="back" data-transition="pop" style="color:'+ BTN_TXT_COLOR +'" >'+ TITLE_OK +'</a></div></div>';
		
		page_content += popup;
		
		if (ref) {
			var page = page_content;
		} else {
			var content = '<div data-role="content">'+ page_content +'</div>';
			var page = '<div id="'+ page_id +'" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'" class="'+ page_id +' ui-page-login">'+ header + content +'</div>';
		}
		$('#popLogin-screen').remove();
		$('#popLogin-popup').remove();
		
		$this.createPage(page_id, page, ref);
	},
	createPageRegister: function() {
		//console.log('createPageRegister()');
		var $this = this;
		
		var page_id = 'register';
		// header
		var header = '<div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_SIGNIN + '"><h1>' + TITLE_REGISTER + '</h1></div>';
		
		var page_content = '<div class="ui-grid-solo">';
		page_content += '<div class="ui-block-a"><label for="regEmail">'+ TITLE_EMAIL +'</label><input name="email" id="regEmail" value="" type="text" data-corners="true"></div>';
		page_content += '<div class="ui-block-a"><label for="regName">'+ TITLE_NAME +'</label><input name="name" id="regName" value="" type="text" data-corners="true"></div>';
		page_content += '<div class="ui-block-a"><label for="regPassword">'+ TITLE_PASSWORD +'</label><input name="password" id="regPassword" value="" type="password" data-corners="true"></div>';
		page_content += '<div class="ui-block-a"><label for="regPasswordR">'+ TITLE_PASSWORD_REPEAT +'</label><input name="passwordr" id="regPasswordR" value="" type="password"></div>';
		page_content += '<div class="ui-block-a"><a onclick="tht.Register();" href="#" class="ui-btn ui-btn-done" data-corners="false">'+ TITLE_DONE +'</a></div>';
		page_content += '</div>';
		
		var popup = '<a href="#popReg" id="showpopReg" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-btn-popup-hidden"></a>';
		popup += '<div data-role="popup" class="ui-popup-box" id="popReg" data-overlay-theme="b" data-dismissible="false"><div data-role="header" data-theme="a" style="background-color:'+ MSG_HEAD_BG_COLOR +'"><h1 style="color:'+ MSG_HEAD_THT_COLOR +'">'+ TITLE_SIGNUP +'</h1></div><div role="main" class="ui-content"><p class="ui-title ui-message"></p><a href="javascript:void(0)" class="ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="back" data-transition="pop" style="color:'+ BTN_TXT_COLOR +'" >'+ TITLE_OK +'</a></div></div>';
		
		page_content += popup;
		
		var content = '<div data-role="content">'+ page_content +'</div>';
		
		var page = '<div id="'+ page_id +'" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'" class="'+ page_id +' ui-page-register">'+ header + content +'</div>';
		
		$('#popReg-screen').remove();
		$('#popReg-popup').remove();
		
		$this.createPage(page_id, page);
	},
	createPageAccount: function() {
		//console.log('createPageAccount()');
		var $this = this;
		$this.createPageLogin();
		$this.createPageRegister();
	},
	Login: function(obj) {
		//console.log('Login()');
		var $this = this;
		$this.showLoader();
		
		var email = $('.ui-page-login #acEmail').val();
		var password = $('.ui-page-login #acPassword').val();
		
		var popId = 'popLogin';
		if (email=='') {
			$this.hideLoader();
			$this.showPopup(popId, TITLE_LOGIN_ERROR, MSG_AUTHFAILD);
			$('.ui-page-login #acEmail').focus();
			return;
		}
		if (password=='') {
			$this.hideLoader();
			$this.showPopup(popId, TITLE_LOGIN_ERROR, MSG_AUTHFAILD);
			$('.ui-page-login #acPassword').focus();
			return;
		}
		
		var fields = 'api=user_auth&user_name='+ email +'&user_pass='+ password;
		
		$.ajax({
			url: URL_BASE,
			dataType: 'json',
			cache: false,
			crossDomain: true,
			data: fields,
			timeout: 1000000,
			type: 'GET'
		}).done(function( data, textStatus, jqXHR ) {
			$this.hideLoader();
			$this.processLogin(data, email, password, popId);
		}).fail(function( jqXHR, textStatus, errorThrown ) {
			//console.log(errorThrown);
			$this.hideLoader();
			$this.showPopup(popId, TITLE_LOGIN_ERROR, MSG_BROKENCONNECTION);
		});
	},
	Register: function(obj) {
		//console.log('Register()');
		var $this = this;
		$this.showLoader();
		
		var email = $('.ui-page-register #regEmail').val();
		var name = $('.ui-page-register #regName').val();
		var password = $('.ui-page-register #regPassword').val();
		var passwordR = $('.ui-page-register #regPasswordR').val();
		
		var popId = 'popReg';
		if (email=='') {
			$this.hideLoader();
			$this.showPopup(popId, TITLE_SIGNUP_ERROR, MSG_ENTEREMAIL);
			$('.ui-page-register #regEmail').focus();
			return;
		}
		var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		if (!filter.test(email)) {
			$this.hideLoader();
			$this.showPopup(popId, TITLE_SIGNUP_ERROR, MSG_VALIDEMAIL);
			$('.ui-page-register #regEmail').focus();
			return;
		}
		
		if (name=='') {
			$this.hideLoader();
			$this.showPopup(popId, TITLE_SIGNUP_ERROR, MSG_ENTERNAME);
			$('.ui-page-register #regName').focus();
			return;
		}
		if (password=='') {
			$this.hideLoader();
			$this.showPopup(popId, TITLE_SIGNUP_ERROR, MSG_ENTERPASS);
			$('.ui-page-register #regPassword').focus();
			return;
		}
		if (password!=passwordR) {
			$this.hideLoader();
			$this.showPopup(popId, TITLE_SIGNUP_ERROR, MSG_PASSINCORRECT);
			$('.ui-page-register #regPassword').focus();
			return;
		}
		
		var fields = 'api=user_reg&user_name='+ name +'&user_email='+ email +'&user_pass='+ password;
		$.ajax({
			url: URL_BASE,
			dataType: 'json',
			cache: false,
			crossDomain: true,
			data: fields,
			timeout: 1000000,
			type: 'GET'
		}).done(function( data, textStatus, jqXHR ) {
			$this.hideLoader();
			$this.processRegister(data, email, password, popId);
		}).fail(function( jqXHR, textStatus, errorThrown ) {
			//console.log(errorThrown);
			$this.hideLoader();
			$this.showPopup(popId, TITLE_SIGNUP_ERROR, MSG_BROKENCONNECTION);
		});
	},
	Logout: function() {
		var $this = this;
		$this.setUsername('');
		$this.setPassword('');
		$this.createPageLogin(true);
		$this.applyPopup();
	},
	processLogin: function(res, email, password, popId) {
		var $this = this;
		if (res && typeof res=='object') {
			var pid = 'login';
			if (res.auth==true) {
				var t = TITLE_SIGNIN;
				var m = MSG_LOGINOK + email;
				$this.onLogin(email, password);
			} else {
				pid = '';
				var t = TITLE_LOGIN_ERROR;
				var m = MSG_AUTHFAILD;
			}
			$this.showPopup(popId, t, m, pid);
		} else {
			$this.showPopup(popId, TITLE_LOGIN_ERROR, MSG_AUTHFAILD);
		}
	},
	processRegister: function(res, email, password, popId) {
		//console.log('processRegister( '+res+', '+email+', '+password+', '+popId+' )');
		var $this = this;
		
		if (res && typeof res=='object') {
			if (res.reg==true) {
				var t = TITLE_SIGNUP;
				var m = MSG_LOGINOK + email;
				var o = 'register';
				$this.onLogin(email, password);
				$this.showPopup(popId, t, m, o);
			} else {
				var t = TITLE_SIGNUP_ERROR;
				var m = res.msg;
				$this.showPopup(popId, t, m);
			}
		} else {
			$this.showPopup(popId, TITLE_SIGNUP_ERROR, MSG_BROKENCONNECTION);
		}
	},
	onLogin: function(email, password) {
		var $this = this;
		$this.setUsername(email);
		$this.setPassword(password);
		$this.createPageLogin(true);
		
		$this.removePopup();
		
		$('#regEmail').val('');
		$('#regName').val('');
		$('#regPassword').val('');
		$('#regPasswordR').val('');
		
		// api ios token
		$this.apiIosToken();
	},
	showPopup: function(id, title, message, page_id) {
		var objB = '#show'+ id;
		var objT = '#'+ id +' > .ui-header > .ui-title';
		var objM = '#'+ id +' > .ui-content > .ui-message';
		var objA = '#'+ id +' > .ui-content > .ui-btn';
		if (title && title!='') {
			$(objT).text(title);
		}
		if (message && message!='') {
			$(objM).text(message);
		}
		if (page_id && page_id!='') {
			$(objA).attr('onclick', 'tht.onClosePopup(\''+ page_id +'\');');
		}
		$(objB).trigger('click');
	},
	onClosePopup: function(page_id) {
		//console.log('onClosePopup( '+page_id+' )');
		switch(page_id) {
			case 'register':
				var sT = '';
				clearTimeout(sT);
				sT = setTimeout(function(){
					$('#register > .ui-header > .ui-toolbar-back-btn').trigger('click');
					var objA = '#register > .ui-content > .ui-btn';
					$(objA).removeAttr('onclick');
				}, 50);
			break;
			case 'login':
				var sT = '';
				clearTimeout(sT);
				sT = setTimeout(function(){
					$('#account > .ui-header > .ui-toolbar-back-btn').trigger('click');
					var objA = '#account > .ui-content > .ui-btn';
					$(objA).removeAttr('onclick');
				}, 50);
			break;
		}
	},
	createPage: function(page_id, content, ref) {
		if (ref) {
			$('#'+ page_id + ' > .ui-content').html(content);
			$('#'+ page_id).trigger('create');
		} else {
			$('#'+ page_id).remove();
			$('#container').append(content);
			$('#'+ page_id).trigger('pagecreate');
		}
	},
	createPageAddListing: function() {
		var page_id = 'page-add-listing';
		var content = '<div id="'+ page_id +'" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'" class="page-add-listing">';
		content += '<div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + TITLE_ADD_LISTING + '</h1></div>';
		content += '<div data-role="content" style="background-color:'+ DETAILS_BG +'!important;"></div>';
		content += '</div>';
		$('#'+ page_id).remove();
		$('#container').append(content);
		$('#'+ page_id).trigger('create');
	},
	createPagePostComment: function(section, id) {
		//console.log('createPagePostComment ( '+section+', '+id+' )');
		var $this = this;
		var page_id = 'page-post-comment';
		
		if (section=='blog') {
			var ratings = '';
			var txtAddComment = TITLE_POST_COMMENT;
		} else {
			var ratings = $this.getSubmitRating(0);
			var txtAddComment = TITLE_ADD_REVIEW;
		}
		
		// page start
		var content = '<div id="'+ page_id +'" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'" class="'+ page_id +'" data-list-type="'+ section +'">';
		
		// header
		content += '<div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + txtAddComment + '</h1></div>';
		
		// content start
		content += '<div data-role="content">';
		
		content += '<div class="ui-grid-solo"><div class="ui-block-a" style="background-color:'+ DETAILS_BG +'"><textarea id="list_comment" rows="8" cols="40" class="ui-input-text ui-shadow-inset ui-body-inherit ui-corner-all ui-textinput-autogrow"></textarea></div><div class="ui-block-a">'+ ratings +'<a class="ui-btn ui-btn-inline ui-btn-txt" href="javascript:void(0);" onclick="tht.submitComment(\''+ section +'\', '+ id +');" id="btn-post-comment">'+ TITLE_SUBMIT +'</a></div></div>';

		content += '<input type="hidden" id="post-rating" value="0" /><input type="hidden" id="list-type" value="'+ section +'" />';		
		
		var content_pop = '<a href="#popupCommentt" id="showpPopCommentt" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-btn-popup-hidden">'+ TITLE_POST_COMMENT +'</a>';
		content_pop += '<div data-role="popup" class="ui-popup-box" id="popupCommentt" data-overlay-theme="b" data-dismissible="false"><div data-role="header" data-theme="a" style="background-color:'+ MSG_HEAD_BG_COLOR +'"><h1 style="color:'+ MSG_HEAD_THT_COLOR +'">'+ TITLE_POST_COMMENT +'</h1></div><div role="main" class="ui-content"><p class="ui-title ui-message">Comment posted.</p><a href="javascript:void(0)" class="ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="back" data-transition="pop" style="color:'+ BTN_TXT_COLOR +'" >'+ TITLE_OK +'</a></div></div>';
		
		// content end
		content += '</div>';
		
		// page end
		content += '</div>';
		
		$('#'+ page_id).remove();
		$('#container').append(content);
		$('#'+ page_id).trigger('create');
		
		$('#'+ page_id +' > div[data-role="content"]').append(content_pop);
	},
	createPagePostReport: function(section, id) {
		var $this = this;
		var page_id = 'page-post-report';	
		// page start
		var content = '<div id="'+ page_id +'" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'" class="'+ page_id +' page-post-comment">';
		
		// header
		content += '<div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + TITLE_REPORT + '</h1></div>';
		
		// content start
		content += '<div data-role="content">';
			
		var reasons = $this.getReasons();
		var content_reasons = '';
		$.each(reasons, function (rId, rName) {
			content_reasons += '<input name="reason" id="radio-'+ rId +'" value="'+ rId +'" type="radio"><label for="radio-'+ rId +'" style="color:'+ BTN_TXT_COLOR +'">'+ rName +'</label>';
		});
		
		content += '<div class="ui-grid-solo ui-grid-reasons" style="background-color:'+ DETAILS_BG +'"><fieldset data-role="controlgroup"><legend>'+ TITLE_CHOOSE_REASON +'</legend>'+ content_reasons +'</fieldset></div>';
		
		content += '<div class="ui-grid-solo"><div class="ui-block-a" style="background-color:'+ DETAILS_BG +'"><div class="ui-controlgroup-label" role="heading"><legend>'+ TITLE_COMMENT +'</legend></div><textarea id="report_comment" rows="8" cols="40" class="ui-input-text ui-shadow-inset ui-body-inherit ui-corner-all ui-textinput-autogrow"></textarea></div><div class="ui-block-a"><a class="ui-btn ui-btn-inline ui-btn-txt" href="javascript:void(0);" onclick="tht.submitCommentReport(\''+ section +'\', '+ id +');" id="btn-post-comment">'+ TITLE_SUBMIT +'</a></div></div>';
		
		var content_pop = '<a href="#popupCommenttR" id="showpPopCommenttR" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-btn-popup-hidden">'+ TITLE_REPORT +'</a>';
		content_pop += '<div data-role="popup" class="ui-popup-box" id="popupCommenttR" data-overlay-theme="b" data-dismissible="false"><div data-role="header" data-theme="a" style="background-color:'+ MSG_HEAD_BG_COLOR +'"><h1 style="color:'+ MSG_HEAD_THT_COLOR +'">'+ TITLE_REPORT +'</h1></div><div role="main" class="ui-content"><p class="ui-title ui-message">Comment posted.</p><a href="javascript:void(0)" class="ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="back" data-transition="pop" style="color:'+ BTN_TXT_COLOR +'">'+ TITLE_OK +'</a></div></div>';
		
		// content end
		content += '</div>';
		
		// page end
		content += '</div>';
		
		$('#'+ page_id).remove();
		$('#container').append(content);
		$('#'+ page_id).trigger('create');
		
		$('#'+ page_id +' > div[data-role="content"]').append(content_pop);
	},
	submitComment: function(section, id) {
		var $this = this;
		$this.showLoader();
		var comment = $('#page-post-comment #list_comment').val();
		comment = $.trim(comment);
		if (comment=='') {
			$this.hideLoader();
			var msg = MSG_EMPTY_COMMENT;
			$('#popupCommentt p.ui-message').text(msg);
			$('#showpPopCommentt').trigger('click');
			$('#page-post-comment #list_comment').focus();
			return;
		}
		var rating = $('#page-post-comment #post-rating').val();
		var listType = $('#page-post-comment #list-type').val();
		if (rating < 1) {
			rating = 1;
		}
		if (rating > 5) {
			rating = 5;
		}
		
		var fields = 'user_name='+ $this.getUsername() +'&user_pass='+ $this.getPassword() +'&post_type=comment&comment_post_ID='+ id +'&comment='+ comment +'&post_id='+ id;
		if (listType!='blog') {
			fields += '&post_'+ id +'_rating='+ rating;
		}
		var jqxhr = $.ajax({
						url: URL_BASE + '?api_submit=1',
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'POST'
					}).done(function( data, textStatus, jqXHR ) {
						$this.hideLoader();
						if (data && typeof data=='object') {
							var msg = data.msg;
							if (msg!='') {
								msg = msg.replace('&#8217;','\'');
							}
							if (data.comment== true) {
								$('#popupComment p.ui-message').text(msg);
								$('#page-post-comment > .ui-header > .ui-toolbar-back-btn').trigger('click');
								var page_id = 'page_view_'+ section;
								var to;
								clearTimeout(to);
								to = setTimeout(function(){
									$this.loadComments(section, page_id, id, 'showpPopComment');
									$this.createPagePostComment(section, id);
								}, 200);
							} else {
								$('#popupCommentt p.ui-message').text(msg);
								$('#showpPopCommentt').trigger('click');
							}
						}
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						//console.log(errorThrown);
						$this.hideLoader();
					});
	},
	submitCommentReport: function(section, id) {
		var $this = this;
		$this.showLoader();
		var reason = $('#page-post-report input[name="reason"]:checked').val();
		if (!reason || reason=='') {
			$this.hideLoader();
			var msg = MSG_EMPTY_REASON;
			$('#popupCommenttR p.ui-message').text(msg);
			$('#showpPopCommenttR').trigger('click');
			$('#page-post-report #radio-1').focus();
			return;
		}
		
		var comment = $('#page-post-report #report_comment').val();
		comment = $.trim(comment);
		if (comment=='') {
			$this.hideLoader();
			var msg = MSG_EMPTY_COMMENT;
			$('#popupCommenttR p.ui-message').text(msg);
			$('#showpPopCommenttR').trigger('click');
			$('#page-post-report #report_comment').focus();
			return;
		}
		
		var fields = 'api_submit=report&user_name='+ $this.getUsername() +'&user_pass='+ $this.getPassword() +'&moderation_report='+ id +'&user_comments='+ comment +'&reason='+ reason;
		var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {
						$this.hideLoader();
						if (data && typeof data=='object') {
							var msg = data.msg;
							if (msg!='') {
								msg = msg.replace('&#8217;','\'');
							}
							if (data.moderation_report== true) {
								$('#popupCommentR p.ui-message').text(msg);
								$('#page-post-report > .ui-header > .ui-toolbar-back-btn').trigger('click');
								var page_id = 'page_view_'+ section;
								var to;
								clearTimeout(to);
								to = setTimeout(function(){
									$('#showpPopCommentR').trigger('click');
									$this.createPagePostReport(section, id);
								}, 200);
							} else {
								$('#popupCommenttR p.ui-message').text(msg);
								$('#showpPopCommenttR').trigger('click');
							}
						}
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						//console.log(errorThrown);
						$this.hideLoader();
					});
	},
	getDataFilterBox: function(section) {
		var content = '<div class="ui-filter-box ui-grid-solo" style="background-color:'+ FILTER_BOX_BG_COLOR +'"><div class="ui-block-a ui-filter-search" style="background-color:'+ SEARCH_BG_COLOR +'"><input name="'+ section +'_search" id="'+ section +'_search" value="" type="search" style="color:'+ SEARCH_TEXT_COLOR +'" placeholder="'+ TITLE_SEARCH +'"></div>';
		if (section!='location') {
		content += '<div class="ui-block-a ui-filter-acts" style="background-color:'+ SORT_BG_COLOR +'"><div class="ui-filter-btns ui-grid-a"><div data-role="navbar" class="ui-navbar" role="navigation"><ul class="ui-grid-b"><li class="ui-block-a"><a id="'+ section +'_rating_btn" data-sort="rating" href="#" style="color:'+ MAIN_SORT_TEXT +'" class="ui-link ui-btn ui-btn-inline ui-btn-filter ui-btn-filter-first show-page-loading-msg">'+ TITLE_RATING +'</a></li><li class="ui-block-b"><a id="'+ section +'_comment_btn" data-sort="review" style="color:'+ MAIN_SORT_TEXT +'" href="#" class="ui-link ui-btn ui-btn-inline ui-btn-filter show-page-loading-msg">'+ TITLE_COMMENT +'</a></li><li class="ui-block-c" ><a id="'+ section +'_nearest_btn" style="color:'+ MAIN_SORT_TEXT +'" data-sort="distance" href="#" class="ui-link ui-btn ui-btn-inline ui-btn-filter ui-btn-filter-last show-page-loading-msg" data-inline="true">'+ TITLE_NEAREST +'</a></li></ul></div></div></div><div class="ui-block-a center ui-btn-add-new" style="background-color:'+ ADD_NEW_BG_COLOR +'"><a id="'+ section +'-btn_new" href="#page-add-listing" class="ui-btn ui-btn-inline ui-btn-txt" data-transition="slide" style="color:'+ MAIN_BUTTON_TEXT +'" tht-pop="false" tht-pop-s="#page-add-listing" tht-pop-e="tht.showPopupLogin(\''+ section +'\', this);">'+ TITLE_ADD_NEW +'</a></div>';
		}
		content += '</div>';
		return content;
	},
	onPageChange:function(e, ui) {
		var $this = this;
		var page_id = $this.getActivePage();
		var prevPage = $this.getPreviousPage(ui);
		//console.log('onPageChange - CURRENT : '+ page_id +', PREVIOUS : '+prevPage);
		var isBack = $this.checkBackEvent(page_id, prevPage);
		if ($this.isTablet()) {
			var catId = $('#'+ page_id).attr('data-cat-id');
			var catType = $('#'+ page_id).attr('data-cat-type');
			if ( catId && page_id=='page-categ-sub-'+ catId && typeof ui.options.reverse!='undefined' && ui.options.reverse==true) {
				isBack = true;
			}
		}
		if (isBack) {
			if ($this.isTablet()) {
				$this.reupdateSidebarMap(page_id);
			}
			return;
		} else {
			if (page_id=='home' && $this.isTablet() ) {
				$this.reupdateSidebarMap(page_id);
			}
		}
		switch(page_id) {
			case 'favourites':
				$this.loadListings(page_id);
				$this.createPageDetail(page_id);
				$this.getModerationReasons();
			break;
			case 'location':
				if (page_id == prevPage) {
					$this.loadNearest();
				}
                $('#location .ui-input-clear').click();
			break;
			case 'page_view_favourites':
				//$this.hideLoader();
			break;
		}
		if ($this.isTablet()) {
			var catId = $('#'+ page_id).attr('data-cat-id');
			var catType = $('#'+ page_id).attr('data-cat-type');
			//console.log('catId: '+ catId +', catType: '+ catType);
			if ( catId && page_id=='page-categ-sub-'+ catId) {
				$this.showCategMarkers(page_id, catType, catId);
			}
		}
		//console.log('PREV PAGE: '+prevPage);
		if (page_id=='page_view_page-categ-sub' && (page_id==prevPage || prevPage=='home')) {
			var section = $this.getSectionName($(tht.ctarget).closest('li').attr('data-categ-type'));
			var psection = section;
			var list_id = $(tht.target).attr('data-listid');
			var href = $(tht.target).attr('href');
			var backBtn = TITLE_PLACES;
			if (prevPage=='page-categ-sub') {
				backBtn = $this.getPrevTitle(prevPage);
			}
			if ($(tht.target).hasClass('ui-btn-infowindow')) {
				var title = $(tht.target).text();
				backBtn = TITLE_MAP;
				psection = 'page-categ-sub';
			} else {
				var title = $(tht.target).find('h2').text();
			}
			if ($(tht.target).hasClass('ui-btn-notify')) {
				backBtn = TITLE_BACK;
				//psection = 'page-categ-sub';
			}
			
			$this.setBackButtonText(page_id, backBtn);
			var mpage_id = '#'+ page_id;
			//console.log('onPageBeforeShow() - '+ mpage_id +', '+ href +', '+ list_id);
			if (list_id>0 && mpage_id==href) {
				$this.showLoader(150);
				$this.setPageContent(page_id, '');
				$this.setPageTitle(page_id, title);
				$this.onEventViewListing(section, page_id, list_id);
			}
		}
		$this.bindFilterBox(page_id);
		var isLogged = $this.isLogged();
		if (!isLogged) {
			$this.applyPopup();
		}
		message = $this.getItem('popup_n');
		if (typeof message!='undefined' && message) {
			var ton;
			clearTimeout(ton);
			ton = setTimeout(function(){
				$this.setItem('popup_n', '');
				navigator.notification.alert(
					message,  					// message
					function(res) {
						return;
					},                  // callback to invoke
					TITLE_APP_NAME,            // title
					TITLE_OK  // buttonLabels
				);
			}, 2000);
		}
	},
	applyPopup: function() {
		$('#container').find('[tht-pop="false"]').each(function(){
			var $el = this;
			var href = $($el).attr('href');
			var onclick = $($el).attr('tht-pop-e');
			$($el).attr('tht-pop-s', href);
			$($el).attr('href', '#');
			$($el).attr('onclick', onclick);
			$($el).attr('tht-pop', 'true');
		});
	},
	removePopup: function() {
		$('#container').find('[tht-pop="true"]').each(function(){
			var $el = this;
			var href = $($el).attr('tht-pop-s');
			$($el).attr('href', href);
			$($el).removeAttr('onclick');
			$($el).attr('tht-pop', 'false');
		});
	},
	onPageShow:function(e, ui) {
		var $this = this;
		var page_id = $this.getActivePage();
		var prevPage = $this.getPreviousPage(ui);
		//console.log('onPageShow - CURRENT : '+ page_id +', PREVIOUS : '+prevPage);
		var isBack = $this.checkBackEvent(page_id, prevPage);
		if (isBack) {
			return;
		}
		var categ_id = parseInt($(tht.ctarget).attr('data-listid'));
		var objCateg = $(tht.ctarget).closest('li');
		var categ_parent = parseInt($(objCateg).attr('data-categ-parent'));
		var categ_type = $(objCateg).attr('data-categ-type');
		var has_childs = $(objCateg).attr('data-has-child');
		var is_categ = categ_id>0 && (categ_parent==0 || categ_parent>0) ? true : false;
		switch(page_id) {
			case 'page_view_favourites':
			case 'comment_view_favourites':
			case 'page-add-listing':
			//case 'favourites_map':
			//case 'map_view_favourites':
				//$this.showLoader();
			break;
			case 'places-categs':
			case 'events-categs':
			case 'blog-categs':
				$this.showLoader();
				$this.loadListings(page_id);
				if (tht.isTablet()) {
					$this.createPageDetail('page-categ-sub');
				}
			break;
			case 'home':
				if (prevPage=='places-categs' || prevPage=='events-categs' || prevPage=='blog-categs') {
					//$('#'+ prevPage +' > div[data-role="content"]').html('');
				}
			break;
			case 'sub-categs':
				$this.showLoader();
				$this.loadListings(page_id);
			break;
			case 'page-categ-sub':
				if (categ_type=='place') {
					page_id = 'places-list';
				} else if (categ_type=='event') {
					page_id = 'events-list';
				} else if (categ_type=='blog') {
					page_id = 'blog-list';
				}
				$this.showLoader();
				$this.loadListings(page_id, 'page-categ-sub');
				$this.createPageDetail('page-categ-sub');
				$this.getModerationReasons();
			break;
		}
        $this.refreshPageHeight(page_id);
	},
	onPageBeforeShow:function(e, ui) {
		$.mobile.hashListeningEnabled = false;
		var $this = this;
		var page_id = $this.getActivePage();
		var actPageInfo = $this.getActivePageInfo();
		var prevPage = $this.getPreviousPage(ui);
		var prevPageInfo = $this.getPreviousPageInfo(ui);
		$this.prevPage = prevPageInfo;
		//console.log('onPageBeforeShow - CURRENT : '+ page_id +', PREVIOUS : '+prevPage);
		if (prevPage=='page-categ-sub' || prevPage=='page-categ-sub-map') {
			var parentId = parseInt($(tht.ctarget).closest('li').attr('data-categ-parent'));
			var catId = parseInt($(tht.ctarget).attr('data-listid'));
			if (prevPage=='page-categ-sub-map') {
				if ( page_id=='page-categ-sub-'+ catId || page_id=='page-categ-sub-'+ parentId) {
					$this.createPageMap('page-categ-sub');
				}
			} else {
				if ( page_id=='page-categ-sub' || page_id=='page-categ-sub-'+ catId || page_id=='page-categ-sub-'+ parentId || page_id=='places-categs' || page_id=='events-categs') {
					$this.createPageMap(prevPage);
				}
			}
		}
		var isBack = $this.checkBackEvent(page_id, prevPage);
		if (isBack) {
			return;
		}
		switch(page_id) {
			case 'page_view_favourites':
				var section = 'favourites';
				var list_id = $(tht.target).attr('data-listid');
				var href = $(tht.target).attr('href');
				var backBtn = TITLE_FAVOURITES;
				if ($(tht.target).hasClass('ui-btn-infowindow')) {
					var title = $(tht.target).text();
					backBtn = TITLE_MAP;
				} else {
					var title = $(tht.target).find('h2').text();
				}
				$('#page_view_'+ section +' [data-role="header"] a.ui-btn-left').text(backBtn);
				var mpage_id = '#'+ page_id;
				if (list_id>0 && mpage_id==href) {
					$('#page_view_'+ section +' [data-role="content"]').html('');
					$('#page_view_'+ section +' [data-role="header"] .ui-title').text(title);
					$this.showLoader();
					$this.onEventViewListing(section, page_id, list_id);
				}
			break;
			case 'page_view_page-categ-sub':
				var section = $this.getSectionName($(tht.ctarget).closest('li').attr('data-categ-type'));
				var psection = section;
				var list_id = $(tht.target).attr('data-listid');
				var href = $(tht.target).attr('href');
				var backBtn = TITLE_PLACES;
				if (prevPage=='page-categ-sub') {
					backBtn = $this.getPrevTitle(prevPage);
				}
				if ($(tht.target).hasClass('ui-btn-infowindow')) {
					var title = $(tht.target).text();
					backBtn = TITLE_MAP;
					psection = 'page-categ-sub';
				} else {
					var title = $(tht.target).find('h2').text();
				}
				if ($(tht.target).hasClass('ui-btn-notify')) {
					backBtn = TITLE_BACK;
					//psection = 'page-categ-sub';
				}
				
				$this.setBackButtonText(page_id, backBtn);
				var mpage_id = '#'+ page_id;
				//console.log('onPageBeforeShow() - '+ mpage_id +', '+ href +', '+ list_id);
				if (list_id>0 && mpage_id==href) {
					$this.showLoader(150);
					$this.setPageContent(page_id, '');
					$this.setPageTitle(page_id, title);
					$this.onEventViewListing(section, page_id, list_id);
				}
			break;
			case 'comment_view_favourites':
				var section = 'favourites';
				var list_id = $(tht.target).attr('data-listid');
				var href = $(tht.target).attr('href');
				var mpage_id = '#'+ page_id;
				if (list_id>0 && mpage_id==href) {
					$('#comment_view_'+ section +' [data-role="content"]').html('');
					$this.showLoader();
					$this.onEventViewComment(section, page_id, list_id);
				}
			break;
			case 'comment_view_places':
				var section = 'places';
				var list_id = $(tht.target).attr('data-listid');
				var href = $(tht.target).attr('href');
				var mpage_id = '#'+ page_id;
				if (list_id>0 && mpage_id==href) {
					$('#comment_view_'+ section +' [data-role="content"]').html('');
					$this.showLoader();
					$this.onEventViewComment(section, page_id, list_id);
				}
			break;
			case 'comment_view_events':
				var section = 'events';
				var list_id = $(tht.target).attr('data-listid');
				var href = $(tht.target).attr('href');
				var mpage_id = '#'+ page_id;
				if (list_id>0 && mpage_id==href) {
					$('#comment_view_'+ section +' [data-role="content"]').html('');
					$this.showLoader();
					$this.onEventViewComment(section, page_id, list_id);
				}
			break;
			case 'comment_view_blog':
				var section = 'blog';
				var list_id = $(tht.target).attr('data-listid');
				var href = $(tht.target).attr('href');
				var mpage_id = '#'+ page_id;
				if (list_id>0 && mpage_id==href) {
					$('#comment_view_'+ section +' [data-role="content"]').html('');
					$this.showLoader();
					$this.onEventViewComment(section, page_id, list_id);
				}
			break;
			case 'page-add-listing':
				$.mobile.hashListeningEnabled = false;
				var backBtnText = TITLE_BACK;
				var addListingUrl = URL_BASE +'?api_submit=1&submit_place=1&user_name='+ $this.getUsername() +'&user_pass='+ $this.getPassword();
				switch(prevPage) {
					case 'favourites': {
						backBtnText = TITLE_FAVOURITES;
						addListingUrl += '&list_type=favourite';
					}
					break;
					case 'places': {
						backBtnText = TITLE_PLACES;
						addListingUrl += '&list_type=place';
					}
					break;
					case 'events': {
						backBtnText = TITLE_EVENTS;
						addListingUrl += '&list_type=event';
					}
					break;
					case 'blog': {
						backBtnText = TITLE_BLOG;
						addListingUrl += '&list_type=blog';
					}
					break;

				}
                addListingUrl += '&app_type=pg';
				$this.refreshPageHeight(page_id);
				$('#'+ page_id +' .ui-content').html('');
				$('#'+ page_id +' .ui-header .ui-toolbar-back-btn').text(backBtnText);
				var content = '<iframe src="'+ addListingUrl +'" id="iframe-add-listing" class="iframe-add-listing" width="100%" height="100%" frameborder="0" align="middle" seamless></iframe>';
				$('#'+ page_id +' .ui-content').html(content);

				$('#iframe-add-listing').load(function() {
					$this.hideLoader();
					$this.refreshPageHeight(page_id);
                    $this.fixAddListingPageHeight();
                    $this.checkAddListingFrame();
				});
			break;
			case 'location':
				$this.loadLocations();

			break;
			case 'page-categ-sub':
				var categ_title = $(tht.ctarget).find('h2').text();
				var objCateg = $(tht.ctarget).closest('li');
				var categ_type = $(objCateg).attr('data-categ-type');
				var section = 'places';
				if (categ_type=='place') {
					section = 'places';
				} else if (categ_type=='event') {
					section = 'events';
				} else if (categ_type=='blog') {
					section = 'blog';
				}
				if (prevPage=='places-categs' || prevPage=='events-categs' || prevPage=='blog-categs' || (prevPage.indexOf('age-categ-sub-')>0 && prevPage!='page-categ-sub-map')) {
					var backBtnTxt = $('#'+ prevPage +' > [data-role="header"] > [role="heading"]').text();
					$('#'+ page_id + ' > [data-role="header"] > .ui-toolbar-back-btn').text(backBtnTxt);
				}
				$('#'+ page_id).attr('data-section', section);
				$('#'+ page_id + ' > [data-role="header"] > [role="heading"]').text(categ_title);
			break;
			case 'page-categ-sub-map':
				var parentId = parseInt($(tht.ctarget).closest('li').attr('data-categ-parent'));
				var catId = parseInt($(tht.ctarget).attr('data-listid'));
				if (prevPage=='page-categ-sub' || prevPage=='page-categ-sub-'+ catId || prevPage=='page-categ-sub-'+ parentId) {
					var backBtnTxt = $this.getPrevTitle(prevPage);
					$this.setBackButtonText(page_id, backBtnTxt);
				}
			break;
		}
	},
    checkAddListingFrame: function() {


        // Create IE + others compatible event handler
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // Listen to message from child window
        eventer(messageEvent,function(e) {
            console.log('parent received message!:  ',e.data);
            var response =jQuery.parseJSON(e.data);
            if(typeof response =='object')
            {
                //It is JSON
                var out = "<p>"+response.msg+"</p>";
                out += "<br /><button onclick=\"window.open('"+response.url+"', '_system', 'location=yes');\" >";
                out += TITLE_PAYNOW;
                out += "</button>";
                $('.ui-page-active div.ui-content').html(out);
            }else{
                console.log("not json");
            }

        },false);
    },
    getPrevTitle: function(prevPageId) {
        var title = $('#'+ prevPageId +' > [data-role="header"] > [role="heading"]').text();
        return title;
    },
	setBackButtonText: function(page_id, title) {
		$('#'+ page_id +' > [data-role="header"] > .ui-toolbar-back-btn').text(title);
	},
	setPageTitle: function(page_id, title) {
		$('#'+ page_id +' > [data-role="header"] > [role="heading"]').text(title);
	},
	setPageContent: function(page_id, content) {
		$('#'+ page_id +' > [data-role="content"]').html(content);
	},
	getSectionName: function(categ_type) {
		var section = 'places';
		if (categ_type=='place') {
			section = 'places';
		} else if (categ_type=='event') {
			section = 'events';
		} else if (categ_type=='blog') {
			section = 'blog';
		}
		return section;
	},
	loadLocations: function() {
		var $this = this;
		var citylist = $this.getCityList();
	},
	onPageInit:function(page_id, e, ui) {
		var $this = this;
		var prevPage = $this.getPreviousPage(ui);
		//console.log('onPageInit - CURRENT : '+ page_id +', PREVIOUS : '+prevPage);
		switch(page_id) {
			case 'map_view_favourites':
			case 'map_view_places':
			case 'map_view_events':
				var lat = $('#'+ page_id).attr('data-lat');
				var lng = $('#'+ page_id).attr('data-lng');
				var title = $('#'+ page_id +' .ui-header .ui-title').text();
				$this.drawMap(page_id, 'canvas_'+ page_id, lat, lng, title);
			break;
			case 'favourites_map': {
				$this.showMapList(page_id, page_id +'_canvas');
			}
			break;
			case 'places_map':
			case 'events_map':
			case 'blog_map':
			case 'page-categ-sub-map':
				$this.showMapList(page_id, page_id +'_canvas');
				$this.createPageDetail('page-categ-sub');
			break;
		}
	},
	createPageDetail:function(section) {
		//console.log('createPageDetail( '+section+' )');
		var $this = this;
		switch(section) {
			case 'favourites': {
				var content = '<div id="page_view_' + section + '" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'" class="page-view-listing page-view-' + section + '"><div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_FAVOURITES + '"><h1>' + TITLE_FAVOURITES + '</h1><a href="#map_view_'+ section +'" class="ui-btn-right ui-btn ui-btn-right ui-btn-gt ui-btn-map" data-transition="slide">' + TITLE_MAP + '</a></div><div data-role="content" style="background-color:'+ DETAILS_BG +'!important;"></div></div>';
				$('#page_view_' + section).remove();
				$('#container').append(content);
				$('#page_view_' + section).trigger('create');
			}
			break;
			case 'page-categ-sub': {
				var msection = $this.getSectionName($(tht.ctarget).closest('li').attr('data-categ-type'));
				var mapBtn = '';
				if (msection!='blog') {
					mapBtn = '<a href="#map_view_'+ msection +'" class="ui-btn-right ui-btn ui-btn-right ui-btn-gt ui-btn-map" data-transition="slide">' + TITLE_MAP + '</a>';
				}
				var content = '<div id="page_view_' + section + '" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'" class="page-view-listing page-view-' + section + '"><div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_PLACES + '"><h1>' + TITLE_PLACES + '</h1>'+ mapBtn +'</div><div data-role="content" style="background-color:'+ DETAILS_BG +'!important;"></div></div>';
				$('#page_view_' + section).remove();
				$('#container').append(content);
				$('#page_view_' + section).trigger('create');
			}
			break;
			break;
		}
	},
	getModerationReasons: function() {
		var $this = this;
		var fields = 'api=moderation_reasons';
		var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {
						if (data && typeof data=='object') {
							$this.reasons = data;
						}
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						//console.log(errorThrown);
					});
	},
	loadCityList: function(show, cPageNo, loadmore) {
		var cLoadmore = (typeof loadmore!='undefined') && loadmore ? true : false;
		var $this = this;
		var fields = 'api=city&list=all';
		fields    += '&page='+ cPageNo;
		var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {
						if (data && typeof data=='object') {
							var list = $this.sortCityList(data, show, null, cPageNo, cLoadmore);
							$this.citylist = list;
						}
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						//console.log(errorThrown);
					});
	},
	loadNearest: function() {
		var $this = this;
		$this.showLoader();
		var geoLatlng = $this.getGeoLatLng();
		var fields = 'api=city&lat='+ geoLatlng.lat +'&lon='+ geoLatlng.lng;
        //navigator.notification.alert("GPS:"+fields);
		var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {
						$this.hideLoader();
						if (data && typeof data=='object' && $(data).length > 0) {
							//$this.sortCityList(data, true, '', 0, '', true);
							$this.updateLocation(data[0].city_id);
							$('#city-label-'+ data[0].city_id).trigger('click');
							$('#location_search').val(data[0].cityname);
						}
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						//$this.sortCityList($this.citylist, true);
						$('#location').trigger('create');
						$this.hideLoader();
						//console.log(errorThrown);
					});
	},
	searchLocation: function(pageNo, loadmore) {
		//console.log('searchLocation( pageNo: '+pageNo+', loadmore: '+loadmore+' )');
		var $this = this;	
		var tag = $this.getSearchValue('location');
		var fields = 'api=city&list=all';
		if (tag!='') {
			fields    += '&search='+ tag;
		}
		
		var cLoadmore = (typeof loadmore!='undefined') && loadmore ? true : false;
		pageNo = parseInt(pageNo) > 0 ? parseInt(pageNo) : 0;
		fields    += '&page='+ pageNo;
		
		var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {
						$this.hideLoader();
						$this.sortCityList(data, true, true, pageNo, cLoadmore);
						$('#location').trigger('create');
						//$('#location_search').val('');
						if (cLoadmore && data && typeof data=='object' && $(data).length > 0) {
							//$.extend(false, $this.citylist, data );
                            $.each(data, function( index2, value2 ) {

                                city_added = false;
                                $.each($this.citylist, function( index, value ) {
                                    if(value2.city_id==value.city_id){
                                        city_added = true;
                                    }
                                });

                                if(!city_added){
                                    $this.citylist.push( value2);
                                }
                            });

                            $this.citylist = $.unique( $this.citylist );
						}
						if (!cLoadmore) {
							$('#location_search').trigger('focus');
						}
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						$this.hideLoader();
						//console.log(errorThrown);
						$('#location').trigger('create');
					});
	},
	sortCityList: function(list, show, tag, cPageNo, loadmore, noLoad) {
		//console.log('sortCityList( show: '+show+', tag: '+tag+', cPageNo: '+cPageNo+', loadmore: '+loadmore+' )');
		var $this = this;
		var curCity = '';
		var curRow = '';
		var is_object = (list && typeof list=='object') ? true : false;
		if (!is_object) {
			return;
		}
		list.sort(function(obj1, obj2) {
			var asc = parseInt(obj1.sortorder) - parseInt(obj2.sortorder);
			return asc;
		});
		var city = $this.getCity();

		
		var cLoadmore = (typeof loadmore!='undefined') && loadmore ? true : false;
		if (typeof show!='undefined' && show) {
			var rows = '';
			$.each(list, function (i) {
				var row 		= list[i];
				var cityId 		= row.city_id;
				var cityName 	= row.cityname;
				var cityLat 	= row.lat;
				var cityLng 	= row.lng;
				var isDefault 	= row.is_default;
				var checked 	= '';
				if (isDefault=='1') {
					$this.cityDefault = row;
					checked = 'checked="checked"';

                    if(!city){$this.setCityCurrent(row);}
				}
				if (city && city!='') {
					checked = '';
					if (city == cityId) {
						$this.cityCurrent = row;

						checked = 'checked="checked"';
					}
				} else {
					$this.cityCurrent = row;

				}
				var tag = typeof tag!='undefined' && tag != '' ? 1 : 0;

				curRow = '<input onchange="javascript:tht.updateLocation(\''+ cityId +'\', '+ tag +');" name="city" id="city-'+ cityId +'" value="'+ cityId +'" type="radio" '+ checked +'><label id="city-label-'+ cityId +'" data-corners="false" for="city-'+ cityId +'"  style="background-color:'+ CITYLIST_BG_COLOR +'">'+ cityName +' <font>('+ TITLE_CURRENT +')</font></label>';
				rows += curRow;

			});
            // add the current city name to the top
            var currentCity = $this.getCityCurrent();
            var city = $this.getCity();
            if(city && currentCity.cityname){curCity = '<div class="location-current-location" style="background-color:'+ CITYLIST_BG_COLOR +';">'+ currentCity.cityname +'</div>'; /*rows = curCity+rows; */}

            if (rows != '' && typeof noLoad == 'undefined') {
				rows += this.getLoadMoreCity('location', cPageNo);
			}

			if (cLoadmore) {
				$('#container > #location .ui-grid-cities > fieldset > div').append(rows);
			} else {
				var content = curCity+'<div class="ui-grid-solo ui-grid-cities"><fieldset data-corners="false" data-role="controlgroup">'+ rows +'</fieldset></div>';
				$('#container > #location > div[data-role="content"]').html(content);
			}
			$('#container > #location').trigger('create');
		}
		return list;
	},
	getLoadMoreCity: function(page_id, pageNo) {
		var content = '<div class="ui-radio li-loadmore loadmore" onclick="javascript:tht.onEventLoadMoreCity(\''+ page_id +'\', \''+ pageNo +'\')"><label data-corners="false" style="background-color:'+ CITYLIST_BG_COLOR +'" class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-radio-off ui-btn-loadmore">'+ TITLE_LOADMORE +'</label></div>';
		return content;
	},
	onEventLoadMoreCity: function(page_id, pageNo){
		var loadmore = '#'+ page_id +' .ui-grid-cities > fieldset > div';
		$(loadmore).find('.loadmore').remove();
		var loader = '<div class="ui-radio li-loadmore loadmore loading-more ui-last-child"><label data-corners="false" style="background-color:'+ CITYLIST_BG_COLOR +'" class="ui-btn-loadmore ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-radio-off">&nbsp;</a></label></div>';
		$(loadmore).append(loader);
		
		pageNo++;
		this.searchLocation(pageNo, true);
	},
	onEventViewComment: function(section, page_id, list_id) {
		switch(section) {
			case 'favourites':
			case 'places':
			case 'events':
			case 'blog':
				this.loadComment(section, page_id, list_id);
			break;
		}
	},
	onEventViewListing: function(section, page_id, list_id) {
		//console.log('onEventViewListing() - '+ section +', '+ page_id +', '+ list_id);
		switch(section) {
			case 'favourites':
			case 'places':
			case 'events':
			case 'blog':
				this.loadDetail(section, page_id, list_id);
			break;
		}
	},
	loadDetail: function(section, page_id, list_id) {
		var $this = this;
		var fields = 'api=single&p_id='+ list_id +'&custom=1&user_name='+ this.getUsername() +'&user_pass='+ this.getPassword();
		var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {
						if (data && typeof data=='object' && data.ID!='undefined') {
							$this.parseListingDetail(section, page_id, data);
							if ($this.isTablet() && data.post_type!='post') {
								var locations = [[data.lat, data.lon, data.post_title, data.ID, data.pinIcon]];
								$this.addMarkers(page_id, locations, false);
							}
						}
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						//console.log(errorThrown);
					});
	},
	loadComment: function(section, page_id, list_id) {
		var $this = this;
		var fields = 'api=com&c_id='+ list_id;
		var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {
						if (data && typeof data=='object' && data.comment_ID!='undefined') {
							$this.parseCommentDetail(section, page_id, data);
						}
						$this.hideLoader();
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						//console.log(errorThrown);
						$this.hideLoader();
					});
	},
	parseListingDetail:  function(section, page_id, data) {
		var $this = this;
		var id 		= data.ID;
		var thumb 	= typeof data.images== 'object' ? data.images[0] : data.images;
        var thumb1 	= typeof data.images== 'object' ? data.images[1] : data.images;
		var gallery	= typeof data.images== 'object' && $(data.images).length>0 ? data.images : null;
		var title 	= data.post_title;
		var address = data.address;
		var lat 	= data.lat;
		var lon 	= data.lon;
		var ratings		= '';
		var custom = data.custom;
		if (typeof data.star_rating!='undefined' && data.post_type != 'post') {
			ratings = $this.showRating(data.star_rating);
		}
		var desc = data.post_content;
		var post_link = data.post_link;
		desc = $this.nl2br(desc);
		var offers = typeof data.special!='undefined' && data.special != '' ? $this.nl2br(data.special) : '';
		
		// header
		$('#'+ page_id +' > [data-role="header"] .ui-title').text(title);
		
		// content
		var content = '<div class="ui-grid-solo ui-listing-header"><div class="ui-block-a ui-block-title">'+ title +'</div><div class="ui-block-a">'+ ratings +'</div></div>';
		if (data.post_type != 'post') {
			var geoLatlng = $this.getGeoLatLng();
			content += '<div class="ui-grid-c ui-listing-address"><div class="ui-block-a"><p><b>Indirizzo:</b> '+ address +'</p></div><div class="ui-block-b"><button class="ui-btn ui-btn-inline ui-icon-direction ui-btn-icon-top" onclick="window.open(\'https://maps.google.com/maps?saddr='+ geoLatlng.lat +','+ geoLatlng.lng +'&daddr='+ lat +','+ lon +'\', \'_system\', \'location=yes\');">Trova Percorso</button></div></div>';
		}
		if (gallery) {
			content += '<div class="ui-grid-solo ui-listing-image"><div class="ui-block-a"><img src="'+ thumb +'"></div></div>';
		} else {
			content += '<div class="ui-grid-solo ui-listing-image"><div class="ui-block-a"><img src="'+ thumb +'"></div></div>';
		}
                
        // modifiche vetrina inizio header
        content += '<div class="ui-grid-solo ui-gallery-header"><div class="ui-block-a  ui-block-title">'+ TITLE_IMG_GALLERY +'</div></div>';
        // inizio vetrina
         if (gallery) {
            content += '<div class="ui-grid-solo ui-listing-image"><div class="ui-block-a"><a href="#page-gallery" data-role="none" data-corners="false" data-transition="slide"><img src="'+ thumb1 +'"><span class="ui-thumb-arrlft"></span><span class="ui-thumb-arrrgt"></span></a></div></div>';
          } else {
                 content += '<div class="ui-grid-solo ui-listing-image"><div class="ui-block-a"><img src="'+ thumb1 +'"></div></div>';
        // fine modifiche vetrina
        
                                      }
        content += '<div class="ui-grid-solo ui-desc-header"><div class="ui-block-a  ui-block-title">'+ TITLE_PLACE_DESC +'</div></div>';
		content += '<div class="ui-grid-solo ui-listing-desc"><p>'+ desc +'</p></div>';
		if (offers!='') {
			content += '<div class="ui-grid-solo ui-listing-offers"><label>'+ TITLE_SPECIAL_OFFERS +'</label><p>'+ offers +'</p></div>';
		}
		
		content += '<a href="#popupComment" id="showpPopComment" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-btn-popup-hidden">'+ TITLE_POST_COMMENT +'</a><div data-role="popup" class="ui-popup-box" id="popupComment" data-overlay-theme="b" data-dismissible="false"><div data-role="header" data-theme="a" style="background-color:'+ MSG_HEAD_BG_COLOR +'"><h1 style="color:'+ MSG_HEAD_THT_COLOR +'">'+ TITLE_POST_COMMENT +'</h1></div><div role="main" class="ui-content"><p class="ui-title ui-message">Comment posted.</p><a href="javascript:void(0)" class="ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="back" data-transition="pop" style="color:'+ BTN_TXT_COLOR +'" >'+ TITLE_OK +'</a></div></div>';
		content += '<a href="#popupCommentR" id="showpPopCommentR" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-btn-popup-hidden">'+ TITLE_REPORT +'</a><div data-role="popup" class="ui-popup-box" id="popupCommentR" data-overlay-theme="b" data-dismissible="false"><div data-role="header" data-theme="a" style="background-color:'+ MSG_HEAD_BG_COLOR +'"><h1 style="color:'+ MSG_HEAD_THT_COLOR +'">'+ TITLE_REPORT +'</h1></div><div role="main" class="ui-content"><p class="ui-title ui-message">Comment posted.</p><a href="javascript:void(0)" class="ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="back" data-transition="pop" style="color:'+ BTN_TXT_COLOR +'" >'+ TITLE_OK +'</a></div></div>';
		content += '<a href="#popupFav-'+ page_id +'" id="showPopupFav-'+ page_id +'" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-btn-popup-hidden">'+ TITLE_FAVOURITES +'</a><div data-role="popup" class="ui-popup-box" id="popupFav-'+ page_id +'" data-overlay-theme="b" data-dismissible="false"><div data-role="header" data-theme="a" style="background-color:'+ MSG_HEAD_BG_COLOR +'"><h1 style="color:'+ MSG_HEAD_THT_COLOR +'">'+ TITLE_FAVOURITES +'</h1></div><div role="main" class="ui-content"><p class="ui-title ui-message">Added to favourites</p><a href="javascript:void(0)" class="ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="back" data-transition="pop" style="color:'+ BTN_TXT_COLOR +'" >'+ TITLE_OK +'</a></div></div>';
		$('#'+ page_id +' > #popupComment-popup').remove();
		$('#'+ page_id +' > #popupComment-screen').remove();
		$('#'+ page_id +' > #popupCommentR-popup').remove();
		$('#'+ page_id +' > #popupCommentR-screen').remove();
		$('#popupFav-'+ page_id +'-popup').remove();
		$('#popupFav-'+ page_id +'-screen').remove();	
		$('#popupTime-'+ page_id +'-popup').remove();
		$('#popupTime-'+ page_id +'-screen').remove();
		
		var twt = data.twitter;
		
		var links = '';
		if (twt) {
			links += '<li data-icon="false"><a class="ui-gticon-twt" data-corners="false" href="sms:'+twt+'">Rispondi alla Domanda del Giorno"</a></li>';
		}
		var website = data.website;
		if (website) {
			links += '<li data-icon="false"><button class="ui-gticon-website" data-corners="false" onclick="window.open(\''+ website +'\', \'_system\', \'location=yes\');">'+ website +'</button></li>';
		}
		var email = data.email;
		if (email) {
			links += '<li data-icon="false"><a class="ui-gticon-email" data-corners="false" href="mailto:'+ email +'">'+ email +'</a></li>';
		}
		var fb = data.facebook;
		if (fb) {
			links += '<li data-icon="false"><button class="ui-gticon-fb" data-corners="false" onclick="window.open(\''+fb+'\', \'_system\', \'location=yes\');">'+fb+'</button></li>';
		}
		
		var phone = data.phone;
		if (phone) {
			links += '<li data-icon="false"><a class="ui-gticon-phone" data-corners="false" href="tel:'+phone+'">'+phone+'</a></li>';
		}
		var time = data.time;
		if (time && time!='') {
			content += '<a href="#popupTime-'+ page_id +'" id="showPopupTime-'+ page_id +'" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-btn-popup-hidden">'+ TITLE_TIME +'</a><div data-role="popup" class="ui-popup-box" id="popupTime-'+ page_id +'" data-overlay-theme="b" data-dismissible="false"><div data-role="header" data-theme="a" style="background-color:'+ MSG_HEAD_BG_COLOR +'"><h1 style="color:'+ MSG_HEAD_THT_COLOR +'">'+ TITLE_TIME +'</h1></div><div role="main" class="ui-content"><p class="ui-title ui-message">'+ time +'</p><a href="javascript:void(0)" class="ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="back" data-transition="pop" style="color:'+ BTN_TXT_COLOR +'" >'+ TITLE_OK +'</a></div></div>';
			links += '<li data-icon="false"><button class="ui-gticon-time" data-corners="false" onclick="javascript:$(\'#showPopupTime-'+ page_id +'\').trigger(\'click\');">'+time+'</button></li>';
		}
		if (links!='') {
			content += '<div class="ui-grid-solo ui-listing-links"><ul data-role="listview" data-corners="false">'+links+'</ul></div>';
		}
		
		if (custom && custom.length>0) {
			var custom_fields = '<div class="ui-grid-solo ui-listing-custom">';
			for (var i=0;i < custom.length; i++) {
				if (custom[i] != '') {
					custom_fields += '<span>'+ custom[i] +'</span>';
				}
			}
			custom_fields += '</div>';
			content += custom_fields;
		}
		
		favBtn = '';
		if (section!='favourites' && section!='blog') {
			var isFav = data.fav==true ? true : false;
			var titleFavBtn = isFav ? TITLE_FAV_REMOVE : TITLE_FAV_ADD;
			var actFavBtn = isFav ? 'remove' : 'add';
			favBtn = '<div class="ui-block-a"><a href="javascript:void(0)" data-role="button" data-corners="false" onclick="javascript:tht.actionFav(\''+ id +'\', \''+ page_id +'\', \''+ actFavBtn +'\', this);">'+ titleFavBtn +'</a></div>';
		}
		var txtAddComment = section=='blog' ? TITLE_ADD_COMMENT : TITLE_ADD_REVIEW;
		content += '<div class="ui-grid-solo ui-listing-actions"><div class="ui-block-a"><a href="#page-post-comment" data-role="button" data-corners="false" data-transition="slide" tht-pop="false" tht-pop-s="#page-post-comment" tht-pop-e="tht.showPopupLogin(\''+ page_id +'\', this);">'+ txtAddComment +'</a></div><div class="ui-block-a"><a href="#" data-role="button" data-corners="false" onclick="tht.share(\''+ title +'\', \''+ thumb +'\', \''+ post_link +'\')">'+ TITLE_SHARE +'</a></div>'+ favBtn +'</div>';
		
		content += '<div class="ui-grid-solo ui-listing-comments"><ul data-role="listview" data-shadow="false" data-iconshadow="false" data-corners="false" class="ui-result-set"><li data-icon="false" class="li-loadmore loadmore loading-more ui-last-child"><a href="#" class="ui-btn ui-btn-loadmore">&nbsp;</a></li></ul></div>';
		var popup = $this.getPopupContent(page_id);
		content	+= popup;
		
		$('#'+ page_id +' > [data-role="content"]').html(content);
		$('#'+ page_id +' > [data-role="content"]').attr('data-post-type', data.post_type);
		
		$('#'+ page_id).trigger('create');
		
		$this.loadComments(section, page_id, id);
		$this.createPageViewComment(section, page_id, title);
		if (section!='blog') {
			$this.createPageViewMap(section, page_id, title, lat, lon);
		}
		$this.createPagePostComment(section, id);
		$this.createPagePostReport(section, id);
		if (gallery) {
			$this.createPageGallery(section, id, gallery);
		}
		var isLogged = $this.isLogged();
		if (!isLogged) {
			$this.applyPopup();
		}
	},
	parseCommentDetail:  function(section, page_id, data) {
		var $this = this;
		var info = data[0];
		var id = info.comment_ID;
		var author = info.comment_author;
		var approved = info.comment_approved;
		var date = info.comment_date;
		var comment = info.comment_content;
		var avatar = info.avatar;
		var ratings = info.star_rating;
		
		var hasImg = info.comment_image!='' ? true : false;
		var dataIcon = info.comment_image;
		var rateClass = '';
		if (section=='blog') {
			ratings = '';
		} else {
			rateClass = 'ui-comment-rate';
			ratings = $this.showRating(ratings);
		}
		
		var content = '<div class="ui-grid-solo ui-comment-info"><div class="ui-block-a"><ul data-role="listview" data-shadow="false" data-iconshadow="false" data-corners="false" class="ui-result-set '+ page_id +'-list">';
		content += '<li data-icon="false" class="'+ rateClass +'"><a href="#" style="background-color:'+ DETAILS_BG +'!important;border-color:'+ LISTING_BORDER +'!important"><img class="ui-list-thumb" src="'+ avatar +'"><h2>'+ author +'</h2>'+ ratings +'<p>'+ date +'</p></a></li>';
		content += '</ul></div></div>';
		if (hasImg) {
			content += '<div class="ui-grid-solo ui-comment-image"><div class="ui-block-a"><img src="'+ dataIcon +'"></div></div>';
		}
		content += '<div class="ui-grid-solo ui-comment-desc"><p>'+ comment +'</p></div>';
				
		$('#'+ page_id +' > [data-role="content"]').html(content);
		
		$('#'+ page_id).trigger('create');
		
		this.hideLoader();
	},
	checkBackEvent: function(activePage, prevPage) {
		var ret = false;
		switch(activePage) {
			case 'favourites':
				ret = true;
				if (prevPage=='home' || prevPage=='' || prevPage==null) {
					ret = false;
				}
				return ret;
			break;
			case 'page_view_favourites':
				ret = true;
				if (prevPage=='favourites' || prevPage=='favourites_map' || prevPage=='' || prevPage==null) {
					ret = false;
				}
				return ret;
			break;
			case 'page_view_page-categ-sub':
				ret = true;
				var parentId = parseInt($(tht.ctarget).closest('li').attr('data-categ-parent'));
				var catId = parseInt($(tht.ctarget).attr('data-listid'));
				if ( prevPage.indexOf('age-categ-sub')>0 || prevPage=='places-categs' || prevPage=='events-categs' || prevPage=='blog-categs' || prevPage=='places_map' || prevPage=='events_map' || prevPage=='blog_map' || prevPage=='' || prevPage==null || prevPage=='home') {
					ret = false;
				}
				return ret;
			break;
			case 'favourites_map':
			break;
			case 'places-categs':
			case 'events-categs':
			case 'blog-categs':
				ret = true;
				if (prevPage=='home' || prevPage=='' || prevPage==null) {
					ret = false;
				}
				return ret;
			break;
			case 'page-categ-sub':
				ret = true;
				if (prevPage=='places-categs' || prevPage=='events-categs' || prevPage=='blog-categs' || (prevPage.indexOf('age-categ-sub-')>0 && prevPage!='page-categ-sub-map') || prevPage=='' || prevPage==null) {
					ret = false;
				}
				return ret;
			break;
		}
		return ret;
	},
	bindFilterBox: function(page_id) {
		//console.log('bindFilterBox( '+page_id+' )');
		var $this = this;
		var exists = $('#'+ page_id +' > .ui-filter-box').html();
		if (exists && exists.length > 5) {
			var timer;
			$('#'+ page_id +' > .ui-filter-box .ui-input-clear').unbind('click');
			$('#'+ page_id +' > .ui-filter-box .ui-input-clear').bind('click');
			$('#'+ page_id +' > .ui-filter-box .ui-input-clear').on('click', function(e) {
				e.preventDefault();
				$('#'+ page_id +'_search').val('');
				$('#'+ page_id +'_search').trigger('keyup');
				$('#'+ page_id +'_search').trigger('focus');
				$('#'+ page_id +'_search').trigger('blur');
			});
			$('#'+ page_id +'_search').unbind('keyup');
			$('#'+ page_id +'_search').bind('keyup');
			$('#'+ page_id +'_search').on('keyup', function(e) {
				e.preventDefault();
				clearInterval(timer);
				timer = setTimeout(function() {
					$this.onEventFilter(page_id, this);
				}, 500);
			});
			$('#'+ page_id +'_rating_btn').unbind('click');
			$('#'+ page_id +'_rating_btn').bind('click');
			$('#'+ page_id +'_rating_btn').on('click', function(e) {
				$(this).closest('div').find('.ui-btn-active').removeClass('ui-btn-active');
				$(this).addClass('ui-btn-active');
				$this.onEventFilter(page_id, this);
			});
			$('#'+ page_id +'_comment_btn').unbind('click');
			$('#'+ page_id +'_comment_btn').bind('click');
			$('#'+ page_id +'_comment_btn').on('click', function(e) {
				$(this).closest('div').find('.ui-btn-active').removeClass('ui-btn-active');
				$(this).addClass('ui-btn-active');
				$this.onEventFilter(page_id, this);
			});
			$('#'+ page_id +'_nearest_btn').unbind('click');
			$('#'+ page_id +'_nearest_btn').bind('click');
			$('#'+ page_id +'_nearest_btn').on('click', function(e) {
				$(this).closest('div').find('.ui-btn-active').removeClass('ui-btn-active');
				$(this).addClass('ui-btn-active');
				$this.onEventFilter(page_id, this);
			});
			
			var content = $this.getPopupContent(page_id);
			$('#'+ page_id +' > .ui-filter-box').append(content);
			$('#'+ page_id).trigger('create');
		}
	},
	getActivePage: function() {
		try{
			var page = $(':mobile-pagecontainer').pagecontainer('getActivePage')[0].id;
			return page;
		} catch (e) {
			return null;
		}
	},
	getActivePageInfo: function() {
		var page = $(':mobile-pagecontainer').pagecontainer('getActivePage')[0];
		return page;
	},
	getPreviousPage: function(ui) {
		try{
			var prevPage = ui.prevPage;
			if (typeof prevPage=='undefined' || (typeof prevPage=='object' && !prevPage.length)) {
				return null;
			}
			prevPage = prevPage[0].id;
			return prevPage;
		} catch (e) {
			return null;
		}
	},
	getPreviousPageInfo: function(ui) {
		var prevPage = ui.prevPage;
		if (typeof prevPage=='undefined' || (typeof prevPage=='object' && !prevPage.length)) {
			return null;
		}
		prevPage = prevPage[0];
		return prevPage;
	},
	loadListings: function(page_id, opage_id) {
		var $this = this;
		switch(page_id) {
			case 'favourites': {
				var pageNo = 0;
				var container = '#favourites > .ui-content';
				var bLoad = $(container).html().length < 5 ? true : false;
				$(container).html('');
				$this.showLoader();
				$this.loadFavourites(page_id, pageNo);
			}
			break;
			case 'places-list':
			case 'events-list':
			case 'blog-list':	{
				page_id = opage_id;
				var pageNo = 0;
				$this.showLoader();
				var categ_id = parseInt($(tht.ctarget).attr('data-listid'));
				var objCateg = $(tht.ctarget).closest('li');
				var categ_type = $(objCateg).attr('data-categ-type');
				
				$this.loadListingByCateg(page_id, pageNo, false, categ_id, categ_type);
			}
			break;
			case 'places-categs': {
				var parent = 0;
				var level = 0;
				var type = 'place';
				$this.loadCategListings(page_id, type, parent, level);
				$this.createPageSubCateg(page_id, type, parent, level);
			}
			break;
			case 'events-categs': {
				var parent = 0;
				var level = 0;
				var type = 'event';
				$this.loadCategListings(page_id, type, parent, level);
				$this.createPageSubCateg(page_id, type, parent, level);
			}
			break;
			case 'blog-categs': {
				var parent = 0;
				var level = 0;
				var type = 'blog';
				$this.loadCategListings(page_id, type, parent, level);
				$this.createPageSubCateg(page_id, type, parent, level);
			}
			break;
			case 'sub-categs' : {
				var categ_id = parseInt($(tht.ctarget).attr('data-listid'));
				var objCateg = $(tht.ctarget).closest('li');
				var categ_parent = parseInt($(objCateg).attr('data-categ-parent'));
				var categ_type = $(objCateg).attr('data-categ-type');
				var is_categ = categ_id>0 && (categ_parent==0 || categ_parent>0) ? true : false;
				$this.loadCategListings(page_id, categ_type, categ_parent);
			}
		}
	},
	onEventFilter: function(page_id, obj) {
		switch(page_id) {
			case 'favourites': {
				var pageNo = 0;
				this.showLoader();
				this.loadFavourites(page_id, pageNo);
			}
			break;
			case 'page-categ-sub': {
				var pageNo = 0;
				this.showLoader();
				var categ_id = parseInt($(tht.ctarget).attr('data-listid'));
				var objCateg = $(tht.ctarget).closest('li');
				var categ_type = $(objCateg).attr('data-categ-type');
				this.loadListingByCateg(page_id, pageNo, false, categ_id, categ_type);
			}
			case 'location': {
				this.showLoader();
				$this.searchLocation();
			}
			break;
		}
	},
	onEventSearch: function(page_id, obj) {
		switch(page_id) {
			case 'favourites': {
				var pageNo = 0;
				this.showLoader();
				this.loadFavourites(page_id, pageNo);
			}
			break;
			case 'page-categ-sub': {
				var pageNo = 0;
				this.showLoader();
				var categ_id = parseInt($(tht.ctarget).attr('data-listid'));
				var objCateg = $(tht.ctarget).closest('li');
				var categ_type = $(objCateg).attr('data-categ-type');
				this.loadListingByCateg(page_id, pageNo, false, categ_id, categ_type);
			}
			break;
		}
	},
	onEventSort: function(page_id, obj) {
		switch(page_id) {
			case 'favourites': {
				var pageNo = 0;
				this.showLoader();
				this.loadFavourites(page_id, pageNo);
			}
			break;
			case 'page-categ-sub': {
				var pageNo = 0;
				this.showLoader();
				var categ_id = parseInt($(tht.ctarget).attr('data-listid'));
				var objCateg = $(tht.ctarget).closest('li');
				var categ_type = $(objCateg).attr('data-categ-type');
				this.loadListingByCateg(page_id, pageNo, false, categ_id, categ_type);
			}
			break;
		}
	},
	getSearchValue: function(page_id) {
		var search = $('#'+ page_id +'_search').val();
		search = $.trim(search);
		return search;
	},
	getSortValue: function(page_id) {
		var sort = $('#'+ page_id +' .ui-filter-acts').find('a.ui-btn-active').attr('data-sort');
		sort = $.trim(sort);
		return sort;
	},
	loadFavourites: function(page_id, pageNo, loadmore) {
		var $this = this;
		var container = '#'+ page_id +'> .ui-content';
		var fields = 'api=home&user_name='+ this.getUsername() +'&user_pass='+ this.getPassword() +'&city_id='+ $this.getCity();
		search = $this.getSearchValue(page_id);
		var bLoadMore = (typeof loadmore!='undefined') ? true : false;
		if (search!='') {
			fields    += '&search='+ search;
		}
		sort = $this.getSortValue(page_id);
		if (sort!='') {
			fields    += '&sort='+ sort;
		}
		if (sort=='distance') {
			var latlng = $this.getGeoLatLng();
			fields    += '&lat='+ latlng.lat +'&lon='+ latlng.lng;
		}
		fields    += '&page='+ pageNo;
		var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {
						$this.hideLoader();
						if (data && typeof data=='object' && data.length) {
							var list = $this.showList(page_id, data, pageNo, bLoadMore);
							var update = false;
							if (bLoadMore) {
								update = true;
								$('#'+ page_id +'-listview').append(list);
							} else {
								$(container).html(list);
							}
							if ($this.isTablet()) {
								$this.updateSidebarMap(page_id, data, update)
							}
							$('#'+ page_id +'-listview').listview().listview('refresh');
						} else {
							if (pageNo==0) {
								tht.favourites = {};
								var msg = $this.getEmptyMsg(page_id);
								$(container).html(msg);
							}
						}
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						$this.hideLoader();
						//console.log(errorThrown);
						if (pageNo==0) {
							var msg = $this.getEmptyMsg(page_id);
							$(container).html(msg);
						}
					});
	},
	loadListingByCateg: function(page_id, pageNo, loadmore, categ_id, categ_type) {
		//console.log('loadListingByCateg( '+page_id+', '+pageNo+', '+loadmore+', '+categ_id+', '+categ_type+' )');
		var $this = this;
		var container = '#'+ page_id +'>  div[data-role="content"]';
		var fields = 'api=list&type='+ categ_type +'&city_id='+ $this.getCity() +'&cat_id='+ categ_id;
		search = $this.getSearchValue(page_id);
		var bLoadMore = (typeof loadmore!='undefined') && loadmore ? true : false;
		if (search!='') {
			fields    += '&search='+ search;
		}
		sort = $this.getSortValue(page_id);
		if (sort!='') {
			fields    += '&sort='+ sort;
		}
		if (sort=='distance') {
			var latlng = $this.getGeoLatLng();
			fields    += '&lat='+ latlng.lat +'&lon='+ latlng.lng;
           // navigator.notification.alert("GPS2:"+fields);
		}
		fields    += '&page='+ pageNo;
		var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {							
						$this.hideLoader();
						if (data && typeof data=='object' && data.length) {
							var list = $this.showList(page_id, data, pageNo, bLoadMore);
							update = false;
							if (bLoadMore) {
								update = true;
								$('#'+ page_id +'-listview').append(list);
							} else {
								$(container).html(list);
							}
							if ($this.isTablet() && categ_type!='blog') {
								$this.updateSidebarMap(page_id, data, update);
							}
							$('#'+ page_id +'-listview').listview().listview('refresh');
						} else {
							if (pageNo==0) {
								var msg = $this.getEmptyMsg(page_id);
								$(container).html(msg);
							}
						}
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						$this.hideLoader();
						//console.log(errorThrown);
						if (pageNo==0) {
							var msg = $this.getEmptyMsg(page_id);
							$(container).html(msg);
						}
					});
	},
	loadCategListings: function(page_id, type, parent) {
		var $this = this;
		var container = '#'+ page_id +'> .ui-content';
		var fields = 'api=cat&list=all&type='+ type +'&city_id='+ $this.getCity(true);
		var bLoadMore = (typeof loadmore!='undefined') ? true : false;
		var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {							
						$this.hideLoader();
						if (data && typeof data=='object' && data.length) {
							var list = $this.showListCategs(page_id, data, type, parent);
							$(container).html(list);
							if ($this.isTablet() && type!='blog') {
								$this.showCategMarkers(page_id, type);
							}
							$('#'+ page_id +'-listview').listview().listview('refresh');
						} else {
							var msg = $this.getEmptyMsg(page_id);
							$(container).html(msg);
						}
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						$this.hideLoader();
						//console.log(errorThrown);
						if (pageNo==0) {
							var msg = $this.getEmptyMsg(page_id);
							$(container).html(msg);
						}
					});
	},
	showCategMarkers: function(page_id, type, catId) {
		//console.log('showCategMarkers( '+page_id+', '+type+', '+type+' )');
		var $this = this;
		var fields = 'api=mark&city_id='+ $this.getCity() +'&post_type='+ type;
		if (typeof catId!='undefined' && catId>0) {
			fields += '&cat_id='+ catId;
		}
		$('.map-loader').show();
		var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {							
						if (data && typeof data=='object' && data.length) {
							$this.updateSidebarMap(page_id, data, false, catId);
						} else {
							$('.map-loader').hide();
						}
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						$('.map-loader').hide();
						//console.log(errorThrown);
					});
	},
	getEmptyMsg: function(page_id) {
		var msg = MSG_NO_DATA;
		switch(page_id) {
			case 'favourites':
			break;
		}
		var id = page_id + '-no_data';
		var msg_content = '<div class="ui-empty-box ui-grid-solo" id="'+ id +'"><div class="ui-block-a"><p>'+ msg +'</p></div></div>';
		return msg_content;
	},
	showList: function(page_id, data, pageNo, bLoadMore) {
		var content = '';
		if (!bLoadMore) {
			var content = '<ul data-role="listview" data-shadow="false" data-iconshadow="false" data-corners="false" id="'+ page_id +'-listview" class="ui-result-set '+ page_id +'-list">';
		}
		for (var i=0;i < data.length; i++){
			content += this.getTmplList(page_id, data[i]);
		}
		var loadMore = '';
		loadMore += this.getLoadMore(page_id, pageNo);
		content += loadMore;
		if (!bLoadMore) {
			content += '</ul>';
		}
		
		return content;
	},
	showListCategs: function(page_id, data, type, parent) {
		var $this = this;
		var content = '<ul data-role="listview" data-shadow="false" data-iconshadow="false" data-corners="false" id="'+ page_id +'-listview" class="ui-result-set '+ page_id +'-list ui-categ-list">';
		for (var i=0;i < data.length; i++){
			var childs = $this.getCategChilds(data[i].term_id, data);
			content += $this.getTmplListCateg(page_id, data[i], type, parent, childs);
		}
		content += '</ul>';		
		return content;
	},
	getCategChilds: function(categId, data) {
		var ret = [];
		var j = 0;
		for (var i=0;i < data.length; i++){
			var parent = data[i].parent;
			var term_id = data[i].term_id;
			if (categId == parent) {
				ret[j] = data[i];
				j++;
			}
		}
		return ret;
	},
	loadComments: function(section, page_id, list_id, msg){
		//console.log('loadComments ( '+ section +', '+ page_id +', '+ list_id +', '+ msg +' )');
		var listType = section;
		if (section=='places' || section=='events' || section=='blog') {
			section = 'page-categ-sub';
		}
		var $this = this;
		$this.hideLoader(true);
		var fields = 'api=com&p_id='+ list_id;
		var list = '';
		if (section=='places' || section=='events' || section=='blog') {
			var parentObj = $('#'+ page_id +' .ui-listing-comments');
		} else {
			var parentObj = $('#page_view_'+ section +' .ui-listing-comments');
		}
		var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {							
						$this.hideLoader(true);
						if (data && typeof data=='object' && data.length) {
							var list = $this.parseComments(section, listType, data);
							parentObj.html(list);
							$(parentObj).find('[data-role="listview"]').listview().listview('refresh');
							if (typeof msg != 'undefined') {
								$('#'+ msg).trigger('click');
							}
						} else {
							parentObj.html(MSG_NO_COMMENT);
						}
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						parentObj.html(MSG_NO_COMMENT);
						//console.log(errorThrown);
					});
	},
	parseComments: function(section, listType, data) {
		//console.log('parseComments ( '+ section +', '+ listType +' )');
		var content = '<ul data-role="listview" data-shadow="false" data-iconshadow="false" data-corners="false">';
		for (var i=0;i < data.length; i++){
			var info = data[i];
			var id = info.comment_ID;
			var author = info.comment_author;
			var comment = info.comment_content;
			var avatar = info.avatar;
			var ratings = info.star_rating;
			
			var hasImg = info.comment_image!='' ? true : false;
			var dataIcon = hasImg ? 'camera' : 'false';
			if (listType=='blog') {
				ratings = '';
			} else {
				ratings = this.showRating(ratings);
			}
			if (comment && comment.length>140) {
				comment = comment.substring(0, 140);
			}
			content += '<li data-icon="'+ dataIcon +'" class="ui-nosvg"><a href="#comment_view_'+ listType +'" data-listid="'+ id +'" data-transition="slide" class="ui-alt-icon show-tht-page-load" style="border-color:'+ LISTING_BORDER +'"><img class="ui-list-thumb" src="'+ avatar +'"><h2>'+ author +'</h2><p>'+ comment +'</p>'+ ratings +'<p class="comment-more">'+ TITLE_MORE +'</p></a></li>';
		}
		content += '</ul>';
		return content;
	},
	createPageViewComment: function(section, page_id, title) {
		//console.log('createPageViewComment() - '+ section + ', '+ page_id + ', '+ title);
		var $this = this;
		switch(section) {
			case 'favourites':
			case 'places':
			case 'events':
			case 'blog': {
				var content = '<div id="comment_view_' + section + '" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'" class="page-view-comment comment-view-' + section + '"><div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + title + '</h1></div><div data-role="content" style="background-color:'+ DETAILS_BG +'!important;"></div></div>';
				$('#comment_view_' + section).remove();
				$('#container').append(content);
				$('#comment_view_' + section).trigger('create');
			}
			break;
		}
	},
	createPageViewMap: function(section, page_id, title, lat, lng) {
		//console.log('createPageViewMap() - '+ section +', '+ page_id +', '+ title +', '+ lat +', '+ lng);
		var $this = this;
		switch(section) {
			case 'favourites': {
				var content = '<div id="map_view_' + section + '" data-role="page" class="ui-gmap page-view-map map-view-'+ section +'" data-lat="'+ lat +'"  data-lng="'+ lng +'" style="background-color:'+ MAP_BG_COLOR +'!important;"><div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + title + '</h1></div><div data-role="content" id="canvas_map_view_'+ section +'" style="background-color:'+ MAP_BG_COLOR +'!important;"></div></div>';
				$('#map_view_' + section).remove();
				$('#container').append(content);
				$('#map_view_' + section).trigger('create');
			}
			break;
			case 'page_view_page-categ-sub':
			case 'places':
			case 'events': {
				section = $this.getSectionName($(tht.ctarget).closest('li').attr('data-categ-type'));
				//console.log('createPageViewMap() - '+ section);
				var content = '<div id="map_view_' + section + '" data-role="page" class="ui-gmap page-view-map map-view-'+ section +'" data-lat="'+ lat +'"  data-lng="'+ lng +'" style="background-color:'+ MAP_BG_COLOR +'!important;"><div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + title + '</h1></div><div data-role="content" id="canvas_map_view_'+ section +'" style="background-color:'+ MAP_BG_COLOR +'!important;"></div></div>';
				$('#map_view_' + section).remove();
				$('#container').append(content);
				$('#map_view_' + section).trigger('create');
			}
			break;
		}
	},
	drawCanvasHeight: function(page_id, fresh) {

        var pH = $("#container").outerHeight(true);
        //var pH = $(window).outerHeight(true);
        var hH = $('.ui-page-active div[data-role="header"]').outerHeight(true);
        var cT = $('.ui-page-active div.ui-content').offset().top;
		var cH = pH - hH;

        // check for sorting top bars
        var sH = 0;
        if(sH = $('.ui-page-active div.ui-filter-box').outerHeight(true)){
            cH = cH - sH;
        }
        var HH = 0
        HH = hH+sH;

        /*console.log("pH:"+pH );
        console.log("hH:"+hH );
        console.log("cH:"+cH );*/

        $('.ui-page-active div[data-role="content"].ui-content').height(pH -cT);
	},
    refreshPageHeight: function(page_id) {


        var pH = $("#container").outerHeight(true);
        //var pH = $(window).outerHeight(true);
        var hH = $('.ui-page-active div[data-role="header"]').outerHeight(true);
        var cT = $('.ui-page-active div.ui-content').offset().top;
        if (hH < 1) {
            hH = 49;
        }
        var cH = pH - hH;

        // check for sorting top bars
        var sH = 0;
        if(sH = $('.ui-page-active div.ui-filter-box').outerHeight(true)){
            cH = cH - sH ;
        }
        var HH = 0
        HH = hH+sH;


        /*console.log("XpH:"+pH );
         console.log("XhH:"+hH );
         console.log("XcH:"+cH );*/

        // if on report this page extend the height so the text box can be seen behind the keyboard
        if(page_id=='page-post-report') {
            pH = pH + pH;
        }



        //$('.ui-page-active div.ui-content').css('max-height','calc(100vh - '+HH+'px)');

        $('.ui-page-active div[data-role="content"].ui-content').height(pH - cT);



        //console.log('#'+ page_id +' > [data-role="content"]');
    },
    fixAddListingPageHeight: function(){

        var $this = this;

        if(jQuery("#page-add-listing").hasClass( "ui-page-active" ) && !$this.onAddListing) {
            $this.onAddListing = true;
            setTimeout(function () {
                $this.onAddListing = false;
                $this.fixAddListingPageHeight();
                var con = jQuery('#container').height();
                jQuery('#page-add-listing').height(con);
            }, 500);
        }else{
           $this.onAddListing = false;
        }
    },
	drawMap: function(page_id, obj, lat, lng, title, draw) {
		//console.log('drawMap ( '+ page_id +', '+ obj +', '+ lat +', '+ lng +', '+ title +', '+ draw +' )');
		var $this = this;
		$this.showLoader();
		$this.drawCanvasHeight(page_id);
		
		var latlng = new google.maps.LatLng(lat, lng);
		
		var mapZoom = parseInt(MAP_ZOOM);
		mapZoom = mapZoom > 0 ? mapZoom : 14;
		var mapOptions = {
            zoom: mapZoom,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
		
		var map2 = new google.maps.Map(document.getElementById(obj), mapOptions);
		
		var infowindow = new google.maps.InfoWindow({
		  content: title
		});
		// Add an overlay to the map of current lat/lng
        var marker = new google.maps.Marker({
            position: latlng,
            map: map2,
            title: title,
			animation: google.maps.Animation.DROP,
        });
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map2, marker);
		});
		google.maps.event.addListener( map2, 'idle', function() {
			var center = map2.getCenter();
			google.maps.event.trigger(map2, "resize");
			map2.setCenter(center);
			$this.hideLoader(false, 1000);
		});
		google.maps.event.addDomListener(window, 'resize', function() {
			$this.drawCanvasHeight(page_id, true);
			var center = map2.getCenter();
			google.maps.event.trigger(map2, "resize");
			map2.setCenter(center);
		});
	},
	showMapList: function(page_id, obj, draw) {
		//console.log('showMapList ( '+ page_id +' )');
		var $this = this;
		$this.showLoader(250);
		switch(page_id) {
			case 'favourites_map': {
				var fields = 'api=home&user_name='+ $this.getUsername() +'&user_pass='+ $this.getPassword() +'&city_id='+ $this.getCity();
				var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {							
						$this.drawMapList(page_id, data, draw);
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						var data = {};
						$this.drawMapList(page_id, data, draw);
						//console.log(errorThrown);
					});
			}
			break;
			case 'places_map': 
			case 'events_map':
			case 'blog_map':
			case 'page-categ-sub-map': {
				var listType = 'place';
				if (page_id=='events_map') {
					listType = 'event';
				} else if (page_id=='blog_map') {
					listType = 'blog';
				}
				var catId = '';
				if (page_id=='page-categ-sub-map') {
					var catId = parseInt($(tht.ctarget).attr('data-listid'));
					listType = $(tht.ctarget).closest('li').attr('data-categ-type');
					catId = '&cat_id='+ catId;
				}
				var isCatPage = $($this.prevPage).attr('data-cat-page') == 'true' ? true : false;
				if (isCatPage) {
					catId = $($this.prevPage).attr('data-cat-id');
					listType = $($this.prevPage).attr('data-cat-type');
					catId = '&cat_id='+ catId;
				}

				var fields = 'api=mark&post_type='+ listType +'&city_id='+ $this.getCity() + catId;
				var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {							
						$this.drawMapList(page_id, data, draw);
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						var data = {};
						$this.drawMapList(page_id, data, draw);
						//console.log(errorThrown);
					});
			}
			break;
		}
	},
	drawMapList: function(page_id, data, draw) {
		//console.log('drawMapList ( '+ page_id +' )');
		var $this = this;
		$this.hideLoader();
		$this.showLoader();
		$this.drawCanvasHeight(page_id);
		
		var mapZoom = parseInt(MAP_ZOOM);
		mapZoom = mapZoom > 0 ? mapZoom : 14;
		var obj = page_id +'_canvas';
		switch(page_id) {
			case 'favourites_map': {
				if (data && typeof data=='object' && data.length) {
					var bounds = new google.maps.LatLngBounds();
					var mapOptions = {
						zoom: mapZoom,
						center: new google.maps.LatLng(data[0].lat_pos, data[0].long_pos),
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					var infowindow = null;
					
					var map = new google.maps.Map(document.getElementById(obj), mapOptions);
					
					var infowindow = null;
					infowindow = new google.maps.InfoWindow({
						content: "holding..."
					});
					
					for (var i=0;i < data.length; i++) {
						var info = data[i];
						var id = info.ID;
						var icon = info.icon;
						var title = info.post_title;
						var lat = info.lat_pos;
						var lng = info.long_pos;
						if (lat && lng) {
						} else {
							continue;
						}
						var latlng = new google.maps.LatLng(lat, lng);
						
						bounds.extend(latlng);
						
						var markerInfo = '<a href="#page_view_favourites" data-listid="'+ id +'" data-corners="false" data-role="button" class="ui-link ui-btn ui-shadow ui-btn-infowindow" role="button" data-transition="slide">'+ title +'</a>';
												
						var marker =  new google.maps.Marker({
							position: latlng,
							map: map,
							icon: icon,
							animation: google.maps.Animation.DROP,
							title: title,
							html: markerInfo
						});
						
						infowindow = new google.maps.InfoWindow({
							content: MSG_LOADING,
						});
						
						google.maps.event.addListener(marker, 'click', (function(marker, i) {
							return function() {
								infowindow.setContent(this.html );
								infowindow.open(map, marker);
							}
						})(marker, i));
					}
					
					if (data.length > 1) {
						map.fitBounds(bounds);
					}
					google.maps.event.addListener( map, 'idle', function() {
						//$this.hideLoader(false, 2000);
						var center = map.getCenter();
						google.maps.event.trigger(map, "resize");
						map.setCenter(center);
						$this.hideLoader();
					});
					google.maps.event.addDomListener(window, 'resize', function() {
						$this.drawCanvasHeight(page_id, true);
						var center = map.getCenter();
						google.maps.event.trigger(map, "resize");
						if (data.length > 1) {
							map.fitBounds(bounds);
						} else {
							map.setCenter(center);
						}
					});
				}
			}
			break;
			case 'events_map':
			case 'places_map':
			case 'blog_map':
			case 'page-categ-sub-map': {
				if (page_id=='page-categ-sub-map') {
					obj = 'page-categ-sub-map-canvas';
				}
				if (data && typeof data=='object' && data.length) {
					var bounds = new google.maps.LatLngBounds();
					var mapOptions = {
						zoom: mapZoom,
						center: new google.maps.LatLng(data[0].lat_pos, data[0].long_pos),
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					var infowindow = null;
					
					var listType = 'place';
					if (page_id=='events_map') {
						listType = 'event';
					} else if (page_id=='blog_map') {
						listType = 'blog';
					}
					
					var map = new google.maps.Map(document.getElementById(obj), mapOptions);
					
					var infowindow = null;
					infowindow = new google.maps.InfoWindow({
						content: "holding..."
					});
					
					for (var i=0;i < data.length; i++) {
						var info = data[i];
						var id = info.ID;
						var icon = info.icon;
						var title = info.post_title;
						var lat = info.lat_pos;
						var lng = info.long_pos;
						if (lat && lng) {
						} else {
							continue;
						}
						var latlng = new google.maps.LatLng(lat, lng);
						
						bounds.extend(latlng);
						
						var markerInfo = '<a href="#page_view_page-categ-sub" data-listid="'+ id +'" data-corners="false" data-role="button" class="ui-link ui-btn ui-shadow ui-btn-infowindow" role="button" data-transition="slide">'+ title +'</a>';
												
						var marker =  new google.maps.Marker({
							position: latlng,
							map: map,
							icon: icon,
							animation: google.maps.Animation.DROP,
							title: title,
							html: markerInfo
						});
						
						infowindow = new google.maps.InfoWindow({
							content: MSG_LOADING,
						});
						
						google.maps.event.addListener(marker, 'click', (function(marker, i) {
							return function() {
								infowindow.setContent(this.html );
								infowindow.open(map, marker);
							}
						})(marker, i));
					}
					
					if (data.length > 1) {
						map.fitBounds(bounds);
					}
					google.maps.event.addListener( map, 'idle', function() {
						//$this.hideLoader(false, 2000);
						var center = map.getCenter();
						google.maps.event.trigger(map, "resize");
						map.setCenter(center);
						$this.hideLoader();
					});
					google.maps.event.addDomListener(window, 'resize', function() {
						$this.drawCanvasHeight(page_id, true);
						var center = map.getCenter();
						google.maps.event.trigger(map, "resize");
						if (data.length > 1) {
							map.fitBounds(bounds);
						} else {
							map.setCenter(center);
						}
					});
				}
			}
			break;
		}
	},
	nl2br: function(str, is_xhtml) {   
		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
	},
	getLoadMore: function(page_id, pageNo) {
		var content = '<li data-icon="false" class="li-loadmore loadmore"><a class="ui-btn ui-btn-loadmore" href="#" onclick="javascript:tht.onEventLoadMore(\''+ page_id +'\', \''+ pageNo +'\')">'+ TITLE_LOADMORE +'</a></li>';
		return content;
	},
	onEventLoadMore: function(page_id, pageNo){
		var loadmore = '#'+ page_id +'-listview';
		$(loadmore).find('.loadmore').remove();
		var loader = '<li data-icon="false" class="li-loadmore loadmore loading-more ui-last-child"><a href="#" class="ui-btn ui-btn-loadmore">&nbsp;</a></li>';
		$(loadmore).append(loader);
		switch(page_id) {
			case 'favourites':
				pageNo++;
				this.loadFavourites(page_id, pageNo, true);
			break;
			case 'page-categ-sub':
				pageNo++;
				var categ_id = parseInt($(tht.ctarget).attr('data-listid'));
				var objCateg = $(tht.ctarget).closest('li');
				var categ_type = $(objCateg).attr('data-categ-type');
				this.loadListingByCateg(page_id, pageNo, true, categ_id, categ_type);
			break;
		}
	},
	getTmplList: function(page_id, data) {
		var $this 	= this;
		var id 		= data.ID;
		var thumb 	= data.thumb;
		var title 	= data.post_title;
		var address = data.address;
		var count 	= data.comment_count;
		var ratings	= '';
		if (typeof data.star_rating!='undefined' && data.post_type != 'post') {
			ratings = $this.showRating(data.star_rating);
		}
		if (data.post_type == 'event') {
			address = $this.nl2br(address);
		}
		var distance = '';
		if (data.distance!='') {
			distance = '<span class="ui-distance">'+ data.distance +'</span>';
		}
		var bgColor = data.featured==true ? LISTING_BG_FEATURED : LISTING_BG;
		var content = '<li data-icon="false" data-post-type="'+ data.post_type +'"><a data-listid='+ id +' href="#page_view_'+ page_id +'" data-transition="slide" style="background-color:'+ bgColor +'!important;border-color:'+ LISTING_BORDER +'!important" class="show-tht-page-load"><img class="ui-list-thumb" src="'+ thumb +'"><h2>'+ title +'</h2><p>'+ address +'</p><span class="ui-li-count" style="background-color:'+ LISTING_RCOUNT_BG +'; color:'+ LISTING_RCOUNT_TEXT +'">'+ count +'</span>'+ ratings + distance +'</a></li>';		return content;
	},
	getTmplListCateg: function(page_id, data, type, cparent, childs) {
        var $this = this;
		var id 		= data.term_id;
		var thumb 	= data.term_icon;
		var title 	= data.name;
		var count 	= data.count;
		var parent 	= data.parent;
		var back_title = TITLE_PLACES;
		if (type=='event') {
			back_title = TITLE_EVENTS;
		} else if (type=='blog') {
			back_title = TITLE_BLOG;
		}
		if (parent == 0) {
			var href = 'page-categ-sub';
			var child = 'false';
			if (typeof childs=='object' && childs.length>0) {
				child = 'true';
				href = href +'-'+ id;
				$this.createPageSubCategs(href, id, title, back_title, thumb, count, type, childs, parent, data);
			}
			var content = '<li data-icon="false" data-categ-id="'+ id +'" data-has-child="'+ child +'" data-categ-type="'+ type +'" data-categ-parent="'+ cparent +'"><a data-listid='+ id +' href="#'+ href +'" data-transition="slide" style="background-color:'+ CATEGORY_BG +'!important;border-color:'+ CATEGORY_BORDER +'!important"><img class="ui-list-thumb" src="'+ thumb +'"><h2>'+ title +'</h2><span class="ui-li-count">('+ count +')</span></a></li>';
		} else {
			content = '';
		}
		return content;
	},
	createPageSubCategs: function(page_id, pid, ptitle, back_title, pthumb, pcount, type, childs, pparent, data) {
        var $this = this;
		//console.log('createPageSubCategs( '+page_id+', '+pid+' )');
		var map_id = 'page-categ-sub-map';
		var content = '<div id="'+ page_id +'" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'" data-cat-page="true" data-cat-type="'+ type +'" data-cat-id="'+ pid +'" class="page-list-categs categs-list-'+ type +'">';
		var mapBtn = '';
		if (type!='blog') {
			mapBtn = '<a href="#'+ map_id +'" class="ui-btn-right ui-btn ui-btn-right ui-btn-gt ui-btn-map" data-transition="slide">' + TITLE_MAP + '</a>';
		}
		content += '<div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + back_title + '"><h1>' + ptitle + '</h1>'+ mapBtn +'</div>';
		
		var content_sub = '<ul data-role="listview" data-shadow="false" data-iconshadow="false" data-corners="false" id="'+ page_id +'-listview" class="ui-result-set '+ page_id +'-list ui-categ-list">';
		content_sub += '<li data-icon="false" data-categ-id="'+ pid +'" data-has-child="false" data-categ-type="'+ type +'" data-categ-parent="'+ pparent +'"><a data-listid='+ pid +' href="#page-categ-sub" data-transition="slide" style="background-color:'+ CATEGORY_BG +'!important;border-color:'+ CATEGORY_BORDER +'!important"><img class="ui-list-thumb" src="'+ pthumb +'"><h2>'+ ptitle +' ('+ TITLE_ALL +')</h2><span class="ui-li-count">('+ pcount +')</span></a></li>';
		for (var i=0;i < childs.length; i++){
			var subChilds = $this.getCategChilds(childs[i].term_id, data);
			var info 	= childs[i];
			var id 		= info.term_id;
			var thumb 	= info.term_icon;
			var title 	= info.name;
			var count 	= info.count;
			var parent 	= info.parent;
			if (parent == pid) {
				var href = 'page-categ-sub';
				var child = 'false';
				if (typeof subChilds=='object' && subChilds.length>0) {
					child = 'true';
					href = href +'-'+ id;
					$this.createPageSubCategs(href, id, title, ptitle, thumb, count, type, subChilds, parent, data);
				}
				content_sub += '<li data-icon="false" data-categ-id="'+ id +'" data-has-child="'+ child +'" data-categ-type="'+ type +'" data-categ-parent="'+ parent +'"><a data-listid='+ id +' href="#'+ href +'" data-transition="slide" style="background-color:'+ CATEGORY_BG +'!important;border-color:'+ CATEGORY_BORDER +'!important"><img class="ui-list-thumb" src="'+ thumb +'"><h2>'+ title +'</h2><span class="ui-li-count">('+ count +')</span></a></li>';
			}
		}
		content_sub += '</ul>';
		content += '<div data-role="content">'+ content_sub +'</div>';
		content += '</div>';
		
		$('#'+ page_id).remove();
		$('#container').append(content);
		$('#'+ page_id).trigger('create');
		
		if (type!='blog') {
			var map_id = 'page-categ-sub-map';
			var content = '<div id="' + map_id + '" data-role="page" class="ui-gmap page-list-map map-list-'+ page_id +'" style="background-color:'+ MAP_BG_COLOR +'!important;"><div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + TITLE_MAP + '</h1></div><div data-role="content" id="' + map_id + '-canvas" style="background-color:'+ MAP_BG_COLOR +'!important;"></div></div>';
			$('#'+ map_id).remove();
			$('#container').append(content);
			$('#'+ map_id).trigger('create');
		}
	},
	showRating: function(rating) {
		if (rating>5) {
			rating = 5;
		}
		var total = 5;
		var content = '<div class="ui-ratings"><div class="ui-grid-d">';
		count = 0;
		for (var i=1; i<=rating; i++) {
			count++;
			var type = 'a';
			if (i==2) {
				type = 'b';
			} else if (i==3) {
				type = 'c';
			} else if (i==4) {
				type = 'd';
			} else if (i==5) {
				type = 'e';
			}
			content += '<div class="ui-block-'+ type +' ui-star-green"></div>';
		}
		if (count < total) {
			var total = total - count;
			for (var i=1; i<=total; i++) {
				var type = 'a';
				if ((i+count)==2) {
					type = 'b';
				} else if ((i+count)==3) {
					type = 'c';
				} else if ((i+count)==4) {
					type = 'd';
				} else if ((i+count)==5) {
					type = 'e';
				}
				content += '<div class="ui-block-'+ type +' ui-star-gray"></div>';
			}
		}
		content += '</div></div>';
		return content;
	},
	getSubmitRating: function(rating) {
		if (rating>5) {
			rating = 5;
		}
		var total = 5;
		var content = '<div class="ui-ratings"><div class="ui-grid-d">';
		count = 0;
		for (var i=1; i<=rating; i++) {
			count++;
			var type = 'a';
			if (i==2) {
				type = 'b';
			} else if (i==3) {
				type = 'c';
			} else if (i==4) {
				type = 'd';
			} else if (i==5) {
				type = 'e';
			}
			content += '<div class="ui-block-'+ type +' ui-star-green" onclick="javascript:tht.selectRating('+ i +');"></div>';
		}
		if (count < total) {
			var total = total - count;
			for (var i=1; i<=total; i++) {
				var type = 'a';
				if ((i+count)==2) {
					type = 'b';
				} else if ((i+count)==3) {
					type = 'c';
				} else if ((i+count)==4) {
					type = 'd';
				} else if ((i+count)==5) {
					type = 'e';
				}
				var j = parseInt(i+count);
				content += '<div class="ui-block-'+ type +' ui-star-gray" onclick="javascript:tht.selectRating('+ j +');"></div>';
			}
		}
		$('#post-rating').val(rating);
		content += '</div></div>';
		return content;
	},
	selectRating: function(rating) {
		var ratings = tht.getSubmitRating(rating);
		$('#page-post-comment .ui-ratings').remove();
		$('#page-post-comment #btn-post-comment').before(ratings);
	},
	showListing: function() {
	},
	createPageSubCateg: function(page_id, type, parent) {
		var $this = this;
		var page_id = 'page-categ-sub';
		var map_id = 'page-categ-sub-map';
		var back_title = TITLE_BACK;
		if (type=='event') {
			back_title = TITLE_EVENTS;
		} else if (type=='blog') {
			back_title = TITLE_BLOG;
		} else if (type=='place') {
			back_title = TITLE_PLACES;
		}
		var filter_box = $this.getDataFilterBox(page_id);
		var mapBtn = '<a href="#'+ map_id +'" class="ui-btn-right ui-btn ui-btn-right ui-btn-gt ui-btn-map" data-transition="slide">' + TITLE_MAP + '</a>';
		if (type=='blog') {
			mapBtn = '';
		}
		var content = '<div id="'+ page_id +'" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'" class="page-view-categ page-list-categs-sub categs-list-'+ type +'"><div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + back_title + '"><h1>' + TITLE_PLACES + '</h1>'+ mapBtn +'</div>'+ filter_box +'<div data-role="content"></div></div>';
		$('#'+ page_id).remove();
		$('#container').append(content);
		$('#'+ page_id).trigger('create');
				
		var content = '<div id="' + map_id + '" data-role="page" class="ui-gmap page-list-map map-list-'+ page_id +'" style="background-color:'+ MAP_BG_COLOR +'!important;"><div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + TITLE_MAP + '</h1></div><div data-role="content" id="' + map_id + '-canvas" style="background-color:'+ MAP_BG_COLOR +'!important;"></div></div>';
		$('#'+ map_id).remove();
		$('#container').append(content);
		$('#'+ map_id).trigger('create');
	},
	createPageMap: function(page_id) {
		var map_id = page_id +'-map';
		var content = '<div id="' + map_id + '" data-role="page" class="ui-gmap page-list-map map-list-'+ page_id +'" style="background-color:'+ MAP_BG_COLOR +'!important;">';
		content += '<div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + TITLE_MAP + '</h1></div>';
		content += '<div data-role="content" id="' + map_id + '-canvas" style="background-color:'+ MAP_BG_COLOR +'!important;"></div>';
		content += '</div>';
		
		$('#'+ map_id).remove();
		$('#container').append(content);
		$('#'+ map_id).trigger('create');
	},
	actionFav: function(id, page_id, action, obj) {
		//console.log('actionFav ( '+ id +', '+ action +' )');
		if (!id>0) {
			return;
		}
		var $this = this;
		$this.showLoader();
		
		var msgObj = '#popupFav-'+ page_id +' > .ui-content .ui-message';
		var postAction = '';
		var newAct = action=='add' ? 'remove' : 'add';
		var title='';
		switch(action) {
			case 'add':
				title = TITLE_FAV_REMOVE;
				ptitle = TITLE_FAV_ADD;
				postAction = 'add_fav';
			break;
			case 'remove':
				title = TITLE_FAV_ADD;
				ptitle = TITLE_FAV_REMOVE;
				postAction = 'remove_fav';
			break;
		}
		var fields = 'api_submit='+ postAction +'&user_name='+ $this.getUsername() +'&user_pass='+ $this.getPassword() +'&post_id='+ id;
		var jqxhr = $.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'POST'
					}).done(function( data, textStatus, jqXHR ) {
						$this.hideLoader();
						if (data && typeof data=='object') {
							var msg = data.msg;
							if (msg!='') {
								msg = msg.replace('&#8217;','\'');
							}
							if (data.add_fav==true || data.remove_fav==true) {
								var onclick = 'javascript:tht.actionFav(\''+ id +'\', \''+ page_id +'\', \''+ newAct +'\', this);';
								$(obj).attr('onclick', onclick);
								var cF;
								clearTimeout(cF);
								cF = setTimeout(function() { 
									$(obj).text(title);
								}, 200);
							}
							$('#popupFav-'+ page_id +' > [data-role="header"] h1').text(ptitle);
							$(msgObj).text(msg);
							$('#showPopupFav-'+ page_id).trigger('click');
						}
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						//console.log(errorThrown);
						$this.hideLoader();
					});
	},
	createPageGallery: function(section, id, gallery) {
		//console.log('createPageGallery( '+section+', '+id+' )');
		var $this = this;
		var page_title = TITLE_IMG_GALLERY
		
		// header
		var header = '<div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="' + TITLE_BACK + '"><h1>' + page_title + '</h1></div>';
		
		var page_content = '<div class="ui-grid-solo">';
		var images = '';
		if (gallery && $(gallery).length>0) {
			var total = $(gallery).length;
			for (var i=0; i<total; i++) {
				var img_src = gallery[i];
				//img_src = img_src.replace('w=300','w=600');
				//img_src = img_src.replace('h=190','h=380');
				images += '<div><img u="image" src="'+ img_src +'" /></div>';
			}
			var slider = '<div id="img-gallery">';
			slider += '<div class="ui-gallery-slides" u="slides">';
			slider += images;
			slider += '</div">';
			slider += '<span u="arrowleft" class="ui-gallery-arrlft"></span><span u="arrowright" class="ui-gallery-arrrgt"></span>';
			slider += '<div u="navigator" class="ui-gallery-nav"><div u="prototype"></div></div>';
			slider += '</div">';
			
			page_content += slider;
		}
		page_content += '</div>';
		
		var content = '<div data-role="content" class="ui-gallery">'+ page_content +'</div>';
		
		var page_id = 'page-gallery';
		var page = '<div id="'+ page_id +'" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'">'+ header + content +'</div>';
		
		$this.newPage(page_id, page, page_content);
		$this.gallery = gallery;
		$this.refreshGalleryHeight();
		$this.loadGallery();
	},
	newPage: function(page_id, page, content) {
		//console.log('newPage( '+page_id+' )');
		
		var htm = $('#'+ page_id).html();
		if (htm && htm.length>0) {
			$('#'+ page_id + ' > [data-role="content"]').html(content);
			$('#'+ page_id).trigger('create');
		} else {
			$('#container').append(page);
			$('#'+ page_id).trigger('pagecreate');
		}
	},
	loadGallery: function() {
		var options = {
			$FillMode: 5,
			$DragOrientation: 3,
			$ArrowNavigatorOptions: {
				$Class: $JssorArrowNavigator$,
				$ChanceToShow: 2,
			},
			$BulletNavigatorOptions: {
				$Class: $JssorBulletNavigator$,
				$ChanceToShow: 2,
				$AutoCenter: 1,
				$SpacingX: 10,
				$SpacingY: 10,
			}
		};
	
		var gallery = new $JssorSlider$("img-gallery", options);
	},
	refreshGalleryHeight: function() {
		var $this = this;
		var wW = parseFloat($(window).width());
		if ($this.isTablet()) {
			wW = ( ( wW * 33.34 ) / 100 );
		}
        //var wH = parseFloat($(window).height());
        var wH = parseFloat($('#container').height());
		var hH = 50;
		var cW = wW;
		var cH = parseFloat(wH - hH);
		
		var objG = '#page-gallery > [data-role="content"] #img-gallery';
		var objGS = objG +' .ui-gallery-slides';
		$(objG).width(wW);
		$(objG).height(cH);
		$(objGS).width(wW);
		$(objGS).height(cH);
        //alert(1);
	},
	onWindowResize: function() {
		var $this = this;
		var page_id = $this.getActivePage();
		if (page_id=='page-gallery') {
			var $this = this;
			$this.createPageGallery('page-gallery', 111, $this.gallery);
		}
        //console.log("resize");
	},
	getFBAccessToken: function() {
		var $this = this;
		console.log('getFBAccessToken()');
		facebookConnectPlugin.getAccessToken(
			function (response) { 
				//alert('getAccessToken Success');
				//alert(JSON.stringify(response));
				$this.setItem('fbaccess_token', response);
			},
			function (response) { 
				//alert('getAccessToken Fail!');
				//alert(JSON.stringify(response));
				$this.setItem('fbaccess_token', '');
			}
		);
		var accessToken = $this.getItem('fbaccess_token');
		console.log('accessToken: '+ accessToken);
		return accessToken;
	},
	getFBLoginStatus: function() {
		//console.log('getFBLoginStatus()');
		//alert('getFBLoginStatus()');
		var $this = this;
		$this.setItem('fb_login_status', '');
		$this.setItem('fbaccess_token', '');
		facebookConnectPlugin.getLoginStatus(
			function (response) { 
				//alert(JSON.stringify(response));
				//console.log(JSON.stringify(response));
				var status = response.status;
				//alert(status);
				//console.log(status);
				
				if (status=='OPENED' || status=='connected') {
					var access_token = response.authResponse.accessToken;
					
					$this.setItem('fb_login_status', 'connected');
					$this.setItem('fbaccess_token', access_token);
					//alert(status);
					//console.log(status);
				}
			},
			function (response) { 
				console.log('getFBLoginStatus Fail!');
				console.log(JSON.stringify(response));
			}
		);
		var loginStatus = $this.getItem('fb_login_status');
		//console.log('loginStatus: '+ loginStatus);
		return loginStatus;
	},
	fbLogin: function() {
		//console.log('fbLogin()');
		//alert('fbLogin()');
		var $this = this;
		$this.showLoader();
		var intV = false;
		var fbI;
		var ctT;
		try {
			$this.getFBLoginStatus();
			var loginStatus = $this.getItem('fb_login_status');
			var accessToken = $this.getItem('fbaccess_token');
			
			//console.log('loginStatus: '+ loginStatus);
			//alert('loginStatus: '+ loginStatus);
			
			//console.log('accessToken: '+ accessToken);
			//alert('accessToken: '+ accessToken);
			
			if (loginStatus=='connected' && accessToken!='') {
				$this.processFBLogin(accessToken);
			} else {
				facebookConnectPlugin.login(["email"],
					function (response) { 
						$this.hideLoader();
						//console.log('login success');
						//alert('login success');
						//console.log(JSON.stringify(response));
						//alert(JSON.stringify(response));
						var loginStatus = '';
						var accessToken = '';
						if (typeof response.status !='undefined' && ( response.status=='OPENED' || response.status=='connected') ) {
							loginStatus = 'connected';
							accessToken = response.authResponse.accessToken;
							
							$this.setItem('fb_login_status', loginStatus);
							$this.setItem('fbaccess_token', accessToken);
							//alert(loginStatus+', '+accessToken);
							//console.log(loginStatus+', '+accessToken);
						}
						
						if (!(loginStatus=='connected' && accessToken!='')) {
							$this.getFBLoginStatus();
							var loginStatus = $this.getItem('fb_login_status');
							var accessToken = $this.getItem('fbaccess_token');
						}
						if (loginStatus=='connected' && accessToken!='') {
							$this.processFBLogin(accessToken);
						} else {
							navigator.notification.alert(MSG_FB_AUTHFAILD);
						}
						return;
					},
					function (response) { 
						$this.hideLoader();
						//console.log('login fail!');
						//alert('login fail!');
						//console.log(JSON.stringify(response));
						//alert(JSON.stringify(response));
						navigator.notification.alert(MSG_FB_AUTHFAILD);
						return;
					}
				);
			}
			return;
		} catch (e) {
			$this.hideLoader();
			console.log('fbLogin() Fail!');
			//alert('fbLogin() Fail!');
			console.log(e);
			//alert(e);
		}
		return;
	},
	processFBLogin: function(accessToken) {
		var $this = this;
		//console.log('processFBLogin( '+ accessToken +' )');
		//alert('processFBLogin( '+ accessToken +' )');
		facebookConnectPlugin.api('/me?fields=id,email,name,first_name,last_name', null, 
			function(response) {
				//console.log(JSON.stringify(response));
				//alert(JSON.stringify(response));
				var name = response.name;
				var email = response.email;
				var first_name = response.first_name;
				var last_name = response.last_name;
				var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
				var string_length = 8;
				var password = '';
				for (var i=0; i<string_length; i++) {
					var rnum = Math.floor(Math.random() * chars.length);
					password += chars.substring(rnum,rnum+1);
				}
				var fields = 'api=user_auth&facebook=1&user_name='+ email +'&user_pass='+ password +'&access_token='+ accessToken;
				//console.log(fields);
				//alert(fields);
	
				$.ajax({
						url: URL_BASE,
						dataType: 'json',
						cache: false,
						crossDomain: true,
						data: fields,
						timeout: 1000000,
						type: 'GET'
					}).done(function( data, textStatus, jqXHR ) {
						$this.hideLoader();
						//console.log(JSON.stringify(data));
						//alert(JSON.stringify(data));
						if (data && typeof data.auth!='undefined') {
							var popId = 'popLogin';
							$this.processLogin(data, email, password, popId);
						} else {
							navigator.notification.alert(MSG_FB_AUTHFAILD);
						}
						return;
					}).fail(function(  jqXHR, textStatus, errorThrown ) {
						$this.hideLoader();
						console.log(errorThrown);
						//alert(errorThrown);
						navigator.notification.alert(MSG_FB_AUTHFAILD);
						return;
					});

			},
			function(response) {
				$this.hideLoader();
				console.log(JSON.stringify(response));
				//alert(JSON.stringify(response));
				console.log(JSON.stringify(response.message));
				//alert(JSON.stringify(response.message));
			}
		);
	},
	share: function(title, image, url) {
		//console.log('share( '+ title +', '+ image +', '+ url +' )');
		var $this = this;
        var message = {
            text: title,
            image: image,
            url: url
        };

        if(!image){image = null;}
        image = null;

		try {
            window.plugins.socialsharing.share(title,title,image,url);
            //window.socialmessage.send(message);
            $this.hideLoader();
		} catch(e) {
			$this.hideLoader();
			console.log('window.plugins.socialsharing.share() fail!');
			//alert('window.plugins.socialsharing.share()');
			console.log(e);
			//alert(e);
		}
	},
	getImgSrc: function(url) {
		var name = 'src';
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(url);
		return results == null ? url : decodeURIComponent(results[1].replace(/\+/g, " "));
	},
	apiIosToken: function() {
		var $this = this;
		//console.log('apiIosToken()');
		
		var platform = $this.getPlatform(true);
		var token = $this.getItem('ios_token');
		//console.log('platform: '+ platform +', token: '+ token);
		
		var platform = $this.getPlatform(true);
		if (typeof device=='undefined' || !platform || !token) {
			return false;
		}
		var fields = 'api_submit=ios_token&ios_token='+ token +'&user_name='+ $this.getUsername() +'&city_id='+ $this.getCity() +'&platform='+ platform;
		//console.log('API: '+ fields);

		$.ajax({
			url: URL_BASE,
			dataType: 'json',
			cache: false,
			crossDomain: true,
			data: fields,
			timeout: 1000000,
			type: 'GET'
		}).done(function( data, textStatus, jqXHR ) {
			//console.log('OK');
			console.log(JSON.stringify(data));
		}).fail(function(  jqXHR, textStatus, errorThrown ) {
			console.log('Fail!');
			console.log(errorThrown);
		});
	},
	onDeviceReady: function() {
		console.log('onDeviceReady()');
		
		var $this = this;
		
		var platform = $this.getPlatform(true);
		if (platform) {
			$this.inItPushNotification(platform);
		}
		// api ios token
		$this.apiIosToken();
		$this.fbInIt();
	},
	fbInIt: function() {
		//console.log('fbInIt()');
		try { 
			if (!window.cordova) {
				console.log('cordova not defined');
				var appId = prompt("Enter FB Application ID", "486236014907492");
				facebookConnectPlugin.browserInit(appId);
			}
		} catch(e) {
			console.log('fbInIt() Fail!');
			console.log(e);
		}
	},
	inItPushNotification: function(platform) {
		//console.log('inItPushNotification( '+ platform +' )');
		var pushNotification = window.plugins.pushNotification;
		
		if ( platform == 'android' ){
			pushNotification.register(
			successHandler,
			errorHandler,
			{
				"senderID": GCM_SENDER_ID,
				"ecb":"onNotification"
			});
		} else {
			pushNotification.register(
			tokenHandler,
			errorHandler,
			{
				"badge":"true",
				"sound":"true",
				"alert":"true",
				"ecb":"onNotificationAPN"
			});
		}
		
		function tokenHandler (result) {
			// Your iOS push server needs to know the token before it can push to this device
			// here is where you might want to send it the token for later use.
			console.log('tokenHandler( '+ result +' )');
			//alert('tokenHandler( '+ result +' )');
		}
		// result contains any message sent from the plugin call
		function successHandler (result) {
			//console.log('successHandler( '+ result +' )');
			//alert('result = ' + result);
		}
		
		// result contains any error description text returned from the plugin call
		function errorHandler (error) {
			console.log('errorHandler( '+ error +' )');
			//alert('error = ' + error);
		}
	},
	getPlatform: function(lower) {
		//console.log('getPlatform( '+ lower +' )');
		var platform = typeof device!='undefined' && typeof device.platform!='undefined' && device.platform ? device.platform : '';
		if (lower && platform) {
			platform = platform.toLowerCase();
		}
		return platform;
	},
	pushToPage: function(listType, listId, listTitle, message) {
		var $this = this;
		//console.log('pushToPage( '+ listType +', '+ listId +', '+ listTitle +', '+ message +' )');
		listType = listType=='event' || listType=='blog' ? listType : 'place';
		if (!listId) {
			return;
		}
		var page_id = 'page_view_page-categ-sub';
		var page = $('#'+ page_id).html();
		var msection = listType!='blog' ? listType +'s' : listType;
		var mapBtn = '';
		if (msection!='blog') {
			mapBtn = '<a href="#map_view_'+ msection +'" class="ui-btn-right ui-btn ui-btn-right ui-btn-gt ui-btn-map" data-transition="slide">' + TITLE_MAP + '</a>';
		}
		if (typeof page=='undefined') {
			var content = '<div id="'+ page_id +'" data-role="page" style="background-color:'+ MAIN_BG_COLOR +'" class="page-view-listing '+ page_id +'"><div data-role="header" data-position="fixed" data-tap-toggle="false" data-add-back-btn="true" data-back-btn-text="'+ TITLE_BACK + '"><h1>'+ listTitle +'</h1>'+ mapBtn +'</div><div data-role="content" style="background-color:'+ DETAILS_BG +'!important;"></div></div>';
			$('#container').append(content);
			$('#'+ page_id).trigger('create');
		} else {
			if (msection=='blog') {
				$('#'+ page_id +' > div[data-role="header"] .ui-btn-map').remove();
			} else {
				$('#'+ page_id +' > div[data-role="header"] .ui-btn-map').remove();
				$('#'+ page_id +' > div[data-role="header"]').append(mapBtn);
			}
			$('#'+ page_id).trigger('pagecreate');
		}
		var target_id = 'target-'+ listType + '-' + listId;
		targets = $('#targets').html();
		if (typeof targets=='undefined') {
			$('body').append('<ul style="display:none;visibility:hidden" id="targets"></ul>');
		}
		var content = '<a data-transition="slide" role="button" class="ui-link ui-btn ui-shadow ui-btn-infowindow ui-btn-notify show-tht-page-load" data-role="button" data-corners="false" data-listid="'+ listId +'" href="#'+ page_id +'" id="'+ target_id +'">'+ listTitle +'</a>';
		$('#'+ target_id).remove();
		$('#targets').append(content);
		//var tt;
		//clearTimeout(tt);
		//tt = setTimeout(function() {
			$('#'+ target_id).trigger('click');
		//}, 10);
		/*
		alert(message);
		if (typeof message=='undefined' && message) {
			console.log('----------------( '+ listType +', '+ listId +', '+ listTitle +', '+ message +' )');
			navigator.notification.alert(
				message,  					// message
				function(res) {
					return;
				},                  // callback to invoke
				TITLE_APP_NAME,            // title
				[TITLE_OK]  // buttonLabels
			);
		}
		*/
		
	}
}

// iOS
function onNotificationAPN (event) {
	console.log('onNotificationAPN()');
	console.log(JSON.stringify(event));
	if ( event.alert ) {
		navigator.notification.alert(event.alert);
	}

	if ( event.sound ) {
		var snd = new Media(event.sound);
		snd.play();
	}

	if ( event.badge ) {
		pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
	}
}

// Android and Amazon Fire OS
function onNotification(e) {
	console.log('onNotification( ' + e.event + ' )');
	//console.log('e: '+ JSON.stringify(e));
	
	var platform = tht.getPlatform(true);
		
	switch (e.event) {
		case 'registered':
			if (e.regid.length > 0) {
				var regId = e.regid;
				if (platform) {
					tht.setItem('ios_token', regId);
					tht.apiIosToken();
				}
				// Your GCM push server needs to know the regID before it can push to this device
				// here is where you might want to send it the regID for later use.
				console.log('REGISTRATION ID : ' + regId);
				//alert('REGISTRATION ID : ' + regId);
			}
			break;
		case 'message':
			var message = e.payload.message;
            if(!message){
                break;
            }
			console.log('message'+message);
			var listType = typeof e.payload.listType !='undefined' ? e.payload.listType : '';
			var listId = typeof e.payload.listId !='undefined' ? e.payload.listId : '';
			var listTitle = typeof e.payload.listTitle !='undefined' ? e.payload.listTitle : TITLE_PLACES;
			// if this flag is set, this notification happened while we were in the foreground.
			// you might want to play a sound to get the user's attention, throw up a dialog, etc.
			if (e.foreground) {
				console.log('INLINE NOTIFICATION');
				// on Android soundname is outside the payload.
				// On Amazon FireOS all custom attributes are contained within payload
				var soundfile = e.soundname || e.payload.sound || 'beep.wav';
				//console.log("Media: /android_asset/www/"+ soundfile);
				// if the notification contains a soundname, play it.
				// playing a sound also requires the org.apache.cordova.media plugin
				var my_media = new Media("/android_asset/www/"+ soundfile);
				my_media.play();
				
				//navigator.notification.alert(message);
				navigator.notification.confirm(
					message,  					// message
					function(res) {
						//console.log('onConfirm( '+ res +' )');
						if (res=='2' && listType!='' && listId) {
							tht.pushToPage(listType, listId, listTitle);
						}
					},                  // callback to invoke
					TITLE_APP_NAME,            // title
					[TITLE_CANCEL,TITLE_OPEN]  // buttonLabels
				);
			} else {
				// otherwise we were launched because the user touched a notification in the notification tray.
				if (e.coldstart) {
					
					console.log('COLDSTART NOTIFICATION');
					tht.pushToPage(listType, listId, listTitle,message);
					tht.setItem('popup_n', message);
				}
				else {
					console.log('BACKGROUND NOTIFICATION');
					tht.pushToPage(listType, listId, listTitle,message);
					tht.setItem('popup_n', message);
				}
			}
			console.log('MESSAGE -> MSG : ' + message);
			//android only
			//console.log('MESSAGE -> MSGCNT : ' + e.payload.msgcnt);
			break;
		case 'error':
			console.log('ERROR -> MSG : ' + e.msg);
			break;
		default:
			console.log('EVENT -> Unknown, an event was received and we do not know what it is');
			break;
	}
}

function onConfirm(no) {
	console.log(no);
	console.log('onConfirm');
}

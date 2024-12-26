jQuery(function ($) {
    function initMap(element) {

        let maps = [],
            mapStyles = [{
                    "featureType": "landscape",
                    "elementType": "geometry.fill",
                    "stylers": [{
                            "color": "#c9edc5"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "color": "#f4f3f0"
                    }]
                },
                {
                    "featureType": "landscape.natural",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "visibility": "on"
                    }]
                },
                {
                    "featureType": "landscape.natural.terrain",
                    "elementType": "geometry.fill",
                    "stylers": [{
                            "visibility": "on"
                        },
                        {
                            "color": "#bcdfb8"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#c8eec4"
                    }]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "color": "#c9edc5"
                    }]
                },
                {
                    "featureType": "poi.sports_complex",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#c8eec4"
                    }]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                            "lightness": 100
                        },
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": [{
                        "visibility": "simplified"
                    }]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text",
                    "stylers": [{
                        "weight": "1"
                    }]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [{
                            "lightness": "0"
                        },
                        {
                            "color": "#ffe492"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                            "color": "#ffffff"
                        },
                        {
                            "weight": "2.53"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "visibility": "on"
                    }]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.stroke",
                    "stylers": [{
                            "visibility": "on"
                        },
                        {
                            "color": "#ffffff"
                        },
                        {
                            "weight": "0.50"
                        }
                    ]
                },
                {
                    "featureType": "transit.line",
                    "elementType": "geometry",
                    "stylers": [{
                            "visibility": "on"
                        },
                        {
                            "lightness": 700
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{
                        "color": "#7dcdcd"
                    }]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#abd9ee"
                    }]
                }
            ];

        function Map(id, mapOptions) {
            this.map = new google.maps.Map(document.getElementById(id), mapOptions);
            this.markers = [];
            this.infoWindows = [];
            this.clusters = null;
        }

        function addMarker(mapId, location, index, image, activeImage, filterVal) {
            maps[mapId].markers[index] = new google.maps.Marker({
                position: location,
                map: maps[mapId].map,
                icon: {
                    url: image
                },
                mainImage: image,
                activeIcon: activeImage,
                filterValue: filterVal
            });

            google.maps.event.addListener(maps[mapId].markers[index], 'click', function () {
                let mr = maps[mapId].markers;

                for (let i = 0; i < mr.length; i++) {
                    if (mr[i].active) {
                        mr[i].active = false;
                        mr[i].setIcon(this.icon)
                    }
                }

                this.active = true;
                this.setIcon(this.activeIcon);

                // maps[mapId].map.setCenter(location);
                maps[mapId].map.setZoom(17);
                maps[mapId].map.panTo(location);

                scrollToCard('.cnt-list ul', `li[data-filter="${this.filterValue}"]`);
            });

            return maps[mapId].markers[index];
        }

        function initialize(mapInst) {
            let mapId = mapInst.attr('id'),
                lat = mapInst.attr("data-lat"),
                lng = mapInst.attr("data-lng"),
                myLatLng = new google.maps.LatLng(lat, lng),

                zoomOnDesktop = mapInst.attr("data-zoom") ? parseInt(mapInst.attr("data-zoom")) : 12,
                zoomOnMobile = mapInst.attr("data-xs-zoom") ? parseInt(mapInst.attr("data-xs-zoom")) : 10,
                zoomMap = winW < 768 ? zoomOnMobile : zoomOnDesktop;


            const mapUiOptions = {
                zoom: zoomMap,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                },
                scrollwheel: false,
                disableDefaultUI: true,
                streetViewControl: false,
                fullscreenControl: false,
                center: myLatLng,
                styles: mapStyles
            };


            const clusterOptions = {
                gridSize: 60,
                ignoreHiddenMarkers: true,
                styles: [{
                    url: '/img/marker-cluster.png',
                    height: 48,
                    width: 48,
                    textSize: 16,
                    textColor: '#FFFFFF'
                }]
            };

            $.ajax({
                url: $(mapInst).attr('data-link'),
                type: 'get',
                dataType: 'json',
                error: function (data) {
                    console.log("File Not Found");
                },
                success: function (data) {
                    for (let i = 0; i < data.length; i++) {

                        const {
                            filterValue,
                            dataRel,
                            dataLat,
                            dataLng,
                            marker,
                            markerActive
                        } = data[i]

                        addMarker(
                            dataRel,
                            new google.maps.LatLng(dataLat, dataLng),
                            i,
                            marker,
                            markerActive,
                            filterValue
                        );
                    }

                    maps[mapId].markerClusterer = new MarkerClusterer(maps[mapId].map, maps[mapId].markers, clusterOptions);
                    maps[mapId].bounds = new google.maps.LatLngBounds();

                    maps[mapId].markers.forEach(function (marker) {
                        maps[mapId].bounds.extend(marker.getPosition());
                    });



                    maps[mapId].map.fitBounds(maps[mapId].bounds);

                    if (lat.length == 0 && lng.length == 0) {
                        maps[mapId].map.fitBounds(maps[mapId].bounds);
                    }

                    function filterMarkers(val) {
                        maps[mapId].markers.forEach(function (marker) {
                            marker.active = false;
                            marker.setIcon(marker.mainImage);

                            if (val == marker.filterValue) {
                                marker.active = true;
                                marker.setIcon(marker.activeIcon);

                                maps[mapId].map.setZoom(17);
                                maps[mapId].map.panTo(marker.position);

                                scrollToCard('.cnt-list ul', `li[data-filter="${marker.filterValue}"]`);
                            }
                        });
                    }

                    $(document).on('click', '.cnt-list-item', function () {
                        $(this).addClass('is-active').siblings().removeClass('is-active');

                        filterMarkers($(this).attr('data-filter'));
                    });
                }
            });

            maps[mapId] = new Map(mapId, mapUiOptions);

            // Click on map
            maps[mapId].map.addListener('click', function () {
                maps[mapId].markers.forEach(function (marker) {
                    marker.active = false;
                    marker.setIcon(marker.mainImage);
                });

                $('.cnt-list-item').removeClass('is-active');
            });

            // let options = {
            //     types: ['address'],
            //     componentRestrictions: {
            //         country: "ua"
            //     },
            //     // bounds: lvivAutocompleteBounds,
            //     // strictBounds: true
            // };

            // if ($('#streetAutocomplete').length) {
            //     let deliveryStreet = new google.maps.places.Autocomplete((document.getElementById('streetAutocomplete')), options);

            //     google.maps.event.addListener(deliveryStreet, 'place_changed', function () {
            //         let place = deliveryStreet.getPlace(),
            //             newLocation;

            //         // if (!place.geometry.location) return false;

            //         // newLocation = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
            //         // smoothZoomMap(map, 15);
            //         // addMarker(newLocation);

            //     });
            // }
        }

        initialize(element);
    }

    $('.map').each(function () {
        initMap($(this))
    });


    $(document).on('click', '.open-popup[data-rel="map-popup"]', function () {
        setTimeout(() => {
            $('.map').each(function () {
                initMap($(this))
            });
        }, 500);
    });


    function scrollToCard(parent, child) {
        let container = $(document).find(parent);
        let element = container.find(child);
        let position;

        if ($(window).width() > 991) {
            position = element.offset().top - container.offset().top + container.scrollTop();
            container.animate({
                scrollTop: position
            });

            element.addClass('is-active').siblings().removeClass('is-active');

        } else {
            position = element.offset().left - container.offset().left + container.scrollLeft() - 16;

            container.animate({
                scrollLeft: position
            });

            element.addClass('is-active').siblings().removeClass('is-active');
        }
    }

});
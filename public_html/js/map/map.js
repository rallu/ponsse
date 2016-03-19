var locations = {
    kalviakeskusta: [63.864267, 23.451369],
    janinmetsa: [61.965731,21.443878]
};

var puut = [{"lat":61.9657154019918,"lng":21.443348577240293},{"lat":61.965728444358604,"lng":21.443671257571893},{"lat":61.965623532643846,"lng":21.44374775929178},{"lat":61.965628135584645,"lng":21.443861646166475},{"lat":61.965628135584645,"lng":21.443861646166475},{"lat":61.9666937030546,"lng":21.44472851707851},{"lat":61.96672140837957,"lng":21.44485731601685},{"lat":61.966726010450266,"lng":21.44497120719844},{"lat":61.966645600369674,"lng":21.444985873129717},{"lat":61.96666322052047,"lng":21.44508782887135},{"lat":61.96660280555215,"lng":21.446599898523427},{"lat":61.9667618426412,"lng":21.44663782645817},{"lat":61.96676427626838,"lng":21.446809478496615},{"lat":61.96785428268822,"lng":21.446610730219174},{"lat":61.96781994485813,"lng":21.446540501842595},{"lat":61.96769039495792,"lng":21.446564124675824},{"lat":61.967699979647605,"lng":21.446801406227774},{"lat":61.967658990738755,"lng":21.446455117144414},{"lat":61.967892419490134,"lng":21.44900364265164},{"lat":61.96775138340273,"lng":21.449077154354338},{"lat":61.9676949503844,"lng":21.448571137848166},{"lat":61.96786153192258,"lng":21.449018833583217},{"lat":61.96596929664026,"lng":21.448407636165438},{"lat":61.965947366816785,"lng":21.44909043600272},{"lat":61.965891460414674,"lng":21.449043261309352},{"lat":61.96584945923998,"lng":21.448783220032446},{"lat":61.96505907262574,"lng":21.447263772228297},{"lat":61.96505907262574,"lng":21.447263772228297},{"lat":61.96489804469435,"lng":21.446953737472693},{"lat":61.96479582209339,"lng":21.447263961378493},{"lat":61.96481542347604,"lng":21.447470713738863}];

var leimikkoalue = [
    [61.96649148810202,  21.440950630797882],
    [61.968044763493516, 21.443306034011794],
    [61.968168653542726, 21.44993810735498],
    [61.9652460488642,   21.450891310766483],
    [61.96427072123524,  21.44590655070308],
    [61.96423923584479,  21.444459157003607],
    [61.96525256855184,  21.443031474875884]
];

var finland = [
    [70.08908764385052,15.188972418699505],
    [70.15861253328983,31.00324415505182],
    [59.518550095529875,32.10644570452472],
    [58.919985843195064, 18.020468378905058]
];

var harvesterloc = [61.966341021958876, 21.44658070515594];

var colors = {
    ponsse: "#fece21"
}

ponsse.controller("mapController", function($scope, $scope, socket) {
    var self = this;
    var map = null;
    this.lastClickPosition = null;
    var drawingLayer = null;

    this.init = function() {
        map = new L.map('map', {
            crs: L.TileLayer.MML.get3067Proj()
        });
        var resolutions = [
            8192, 4096, 2048, 1024, 512, 256,
            128,64, 32, 16, 8, 4, 2, 1, 0.5,
            0.25, 0.125, 0.0625, 0.03125, 0.015625
        ];
        L.tileLayer.mml_wmts({
            layer: "maastokartta",
            resolutions: resolutions
        }).addTo(map);

        L.polygon([finland, leimikkoalue], {
            color: colors.ponsse,
            fillColor: '#000',
            fillOpacity: 0.3
        }).addTo(map);

        map.setView(locations.janinmetsa, 13);

        L.marker(harvesterloc, {
            icon: L.divIcon({
                iconSize: [40,40],
                className: "harvester"
            })
        }).addTo(map);

        drawingLayer = L.layerGroup().addTo(map);

        map.on('click', function(e) {
            $scope.$apply(function() {
                console.log("clicked [" + e.latlng.lat + ", " + e.latlng.lng + "]");

                self.lastClickPosition = e.latlng;
                if (self.mode == "clickplace") {
                    self.modal = "addflag";
                }

                if (drawingArea) {
                    area.push(e.latlng);
                }
            });
        });

        map.on('mousedown touchstart', function(e) {
            if (self.mode == "drawwet") {
                self.startDrawArea(e, {
                    color: "#079ed0"
                });
            } else if (self.mode == "drawdanger") {
                self.startDrawArea(e, {
                    color: "#f91d1d"
                });
            }
        });

        map.on('mousemove touchmove', function(e) {
            if (drawing) {
                self.drawPoint(e);
            }
        });

        map.on('mouseup touchend', function(e) {
            if (self.mode == "drawwet" || self.mode == "drawdanger") {
                self.endDrawArea();
                $scope.$apply(function() {
                    self.mode = null;
                });
            }
        });
    };

    this.init();

    this.mode = null;
    this.modal = null;

    this.cancel = function() {
        this.mode = null;
        this.modal = null;
        this.flagtext = null;
        drawing = false;
        drawingPoints = [];
    };

    this.addFlag = function() {
        var marker = L.marker(self.lastClickPosition, {
            icon: L.divIcon({
                iconSize: [40,40],
                className: "map-icon icon ion-flag"
            })
        });
        var popup = L.popup().setContent(self.flagtext);
        marker.bindPopup(popup);
        //marker.addTo(map);
        marker.addTo(drawingLayer);
        var json = marker.toGeoJSON();
        json.type = "marker";
        json.markertext = self.flagtext;
        socket.emit("draw", json);

        this.cancel();
    };

    var drawing = false;
    var drawingPoints = [];
    var lastPoint = null;
    var thepolygon = null;
    this.startDrawArea = function(startevent, polygonoptions) {
        lastPoint = startevent.containerPoint;

        polygonoptions.lineJoin = "round";

        drawingPoints.push(startevent.latlng);
        thepolygon = new L.polygon(drawingPoints, polygonoptions);
        thepolygon.addTo(drawingLayer);
        thepolygon.color = polygonoptions.color;
        drawing = true;


        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
    };

    this.drawPoint = function(event) {
        if (event.containerPoint.distanceTo(lastPoint) > 10) {
            lastPoint = event.containerPoint;
            drawingPoints.push(event.latlng);
            thepolygon.setLatLngs(drawingPoints);
        }
    };

    this.endDrawArea = function() {
        if (thepolygon == null) {
            return;
        }
        var json = thepolygon.toGeoJSON();
        json.color = thepolygon.color;
        socket.emit("draw", json);
        drawing = false;
        drawingPoints = [];
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
    };

    this.endDrawArea();

    var area = [];
    var drawingArea = false;
    this.startArea = function() {
        if (drawingArea) {
            drawingArea = false;
            console.log(area);
            var foobar = [];
            for (var i = 0; i < area.length; i++) {
                foobar.push({
                    lat: area[i].lat,
                    lng: area[i].lng
                });
            }
            console.log(JSON.stringify(foobar));
        } else {
            area = [];
            drawingArea = true;
        }
    };

    $scope.$on("mapcommand", function(event, payload) {
        var command = payload.split(" ");
        if (command[1] == "vaara") {
            console.log(harvesterloc);
            L.circle(harvesterloc, parseInt(payload[2]), {
                color: "#f91d1d"
            }).addTo(map);
        }
    });

    socket.on("alldrawings", function(payload) {
        console.log(payload);
        drawingLayer.clearLayers();
        payload.forEach(function(json) {
            if (json.type == "marker") {
                console.log(json);
                var marker = L.marker([json.geometry.coordinates[1], json.geometry.coordinates[0]], {
                    icon: L.divIcon({
                        iconSize: [40,40],
                        className: "map-icon icon ion-flag"
                    })
                });
                var popup = L.popup().setContent(json.markertext);
                marker.bindPopup(popup);
                console.log(marker);
                marker.addTo(drawingLayer);
            } else {
                var polygon = L.geoJson(json);
                polygon.setStyle({
                    color: json.color
                });
                console.log(polygon);
                polygon.addTo(drawingLayer);
            }
        });
    });

    socket.emit("givedata");
});

var locations = {
    kalviakeskusta: [63.864267, 23.451369],
    janinmetsa: [61.965731,21.443878]
};


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

var colors = {
    ponsse: "#fece21"
}

ponsse.controller("mapController", function($scope) {
    var self = this;
    var map = null;
    this.lastClickPosition = null;

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

        map.setView(locations.janinmetsa, 14);

        map.on('click', function(e) {
            $scope.$apply(function() {
                console.log("clicked [" + e.latlng.lat + ", " + e.latlng.lng + "]");

                self.lastClickPosition = e.latlng;
                if (self.mode == "clickplace") {
                    self.modal = "addflag";
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
        marker.addTo(map);

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
        thepolygon.addTo(map);
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
        drawing = false;
        drawingPoints = [];
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
    };

    this.endDrawArea();
});

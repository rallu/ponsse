var locations = {
    kalviakeskusta: [63.864267, 23.451369],
    janinmetsa: [61.965731,21.443878]
};


var leimikkoalue = [
    []
];

ponsse.controller("mapController", function() {
    var map = null;

    this.init = function() {
        var map = new L.map('map', {
            crs: L.TileLayer.MML.get3067Proj()
        });
        L.tileLayer.mml_wmts({
            layer: "maastokartta",
            resolutions: [
                8192, 4096, 2048, 1024, 512, 256,
                128,64, 32, 16, 8, 4, 2, 1, 0.5,
                0.25, 0.125, 0.0625, 0.03125, 0.015625
            ]
        }).addTo(map);

        map.setView(locations.janinmetsa, 16);

        map.on('click', function(e) {
            console.log("clicked", e.latlng);
        });
    };

    this.init();
});

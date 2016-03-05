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

ponsse.controller("mapController", function() {
    var map = null;

    this.init = function() {
        var map = new L.map('map', {
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
            console.log("clicked", e.latlng);
        });
    };

    this.init();
});

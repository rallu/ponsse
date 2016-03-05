var express = require('express');
var request = require('request');
var app = express();

app.get("/map/:z/:x/:y", function(req, res) {
    var url = "http://karttamoottori.maanmittauslaitos.fi/maasto/wmts/1.0.0/maastokartta/default/ETRS-TM35FIN/";
    var z = req.params.z;
    var x = parseInt(req.params.x) + 400;
    var y = parseInt(req.params.y) + 1400;
    var rurl = url + z + "/" + x + "/" + y + ".png";
    console.log(rurl);
    request(rurl).pipe(res);
});

app.use("/weather", function(req, res) {
    var weatherurl = "http://yle.fi/saa/resources/ajax/saa-api/hourly-forecast.action?id=639362"
    request(weatherurl).pipe(res);
});

app.use(express.static("public_html"));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

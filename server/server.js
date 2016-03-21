var express = require("express");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require("request");

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


var drawings = [];

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on("givedata", function(message) {
      console.log("givedata");
      io.emit("alldrawings", drawings);
  });

  socket.on("draw", function(message) {
      console.log("got drawing");
      console.log(message);
      drawings.push(message);
      io.emit("alldrawings", drawings);
  });
});


app.use(express.static("public_html"));

http.listen(80, function () {
  console.log('Example app listening on port 80!');
});

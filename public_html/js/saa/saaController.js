ponsse.controller("saaController", function($http) {
    var self = this;
    $http.get("/weather").then(function(result) {
        self.weather = result.data;
        self.weather.weatherInfos = self.weather.weatherInfos.slice(0,8);
        console.log(self.weather);
    });
});

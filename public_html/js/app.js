var ponsse = angular.module("ponsse", ["ngRoute"]);

ponsse.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "js/main/main.html",
        controller: "mainController",
        controllerAs: "mainCtrl"
    }).when("/map", {
        templateUrl: "js/map/map.html",
        controller: "mapController",
        controllerAs: "mapCtrl"
    })
});

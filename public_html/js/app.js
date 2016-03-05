var ponsse = angular.module("ponsse", ["ngRoute","angularMoment"]);

ponsse.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "js/main/main.html",
        controller: "mainController",
        controllerAs: "mainCtrl"
    }).when("/map", {
        templateUrl: "js/map/map.html",
        controller: "mapController",
        controllerAs: "mapCtrl"
    }).when("/settings", {
        templateUrl: "js/settings/settings.html",
        controller: "settingsController",
        controllerAs: "settingsCtrl"
    }).when("/saa", {
        templateUrl: "js/saa/saa.html",
        controller: "saaController",
        controllerAs: "saaCtrl"
    });
});

angular.module("ponsse").controller("tyoController", function(tyoFactory) {
    this.arvot = tyoFactory;
}).factory("tyoFactory", function() {
    return {
        type: "tukki",
        size: 0,
        runkolukko: false
    };
});

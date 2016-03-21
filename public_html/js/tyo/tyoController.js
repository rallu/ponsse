angular.module("ponsse").controller("tyoController", function(tyoFactory) {
    this.arvot = tyoFactory;
}).factory("tyoFactory", function() {
    return {
        type: "mänty",
        size: "tukki",
        runkolukko: false
    };
});

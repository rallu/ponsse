ponsse.controller("bodyController", function($location, $scope, tyoFactory, $rootScope, $window) {
    var self = this;
    self.currentPage = "/";
    this.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };

    this.classActive = function(viewLocation) {
        if( self.isActive(viewLocation) ) {
            return 'active';
        }
    };

    var puut = ["mänty", "kuusi", "6", "koivu", "haapa", "muu"];

    var listening = false;
    var recognition = new webkitSpeechRecognition();
    recognition.lang = "fi-FI";
    recognition.onresult = function(event) {
        $scope.$apply(function() {
            var speechresult = event.results[0][0].transcript;
            if (event.results[0][0].confidence < 0.6) {
                return;
            }
            if (speechresult == "näytä kartta" || speechresult == "kartta") {
                $location.path("/map");
                self.speak("kartta");
            } else if (speechresult == "näytä työ" || speechresult == "työ") {
                $location.path("/tyo");
                self.speak("työ");
            } else if (speechresult == "näytä sää" || speechresult == "sää") {
                $location.path("/saa");
                self.speak("sää");
            } else if (puut.indexOf(speechresult.split(" ")[0]) > -1) {
                console.log("puukomento");
                var parts = speechresult.split(" ");
                tyoFactory.type = parts.splice(0,1)[0];
                tyoFactory.size = parts.join(" ");

                self.speak(speechresult);
            } else if (speechresult == "runkolukko" || speechresult == "lukko") {
                tyoFactory.runkolukko = !tyoFactory.runkolukko;
            } else if (speechresult.indexOf("kartta") == 0) {
                $location.path("/map");
                console.log(speechresult);
                $rootScope.$broadcast("mapcommand", speechresult);
            } else {
                console.log(speechresult);
                //self.speak(speechresult);
            }
        });
    };

    this.keydown = function(event) {
        if (event.keyCode == 17 && !listening) {
            recognition.start();
            listening = true;
        }
    };

    this.keyup = function(event) {
        if (event.keyCode == 17) {
            listening = false;
            recognition.stop();
        }
    };

    this.speak = function(text) {
        var u = new SpeechSynthesisUtterance();
        $window.speechSynthesis.getVoices();
        u.text = text;
        u.lang = 'fi-FI';
        u.rate = 1.5;
        speechSynthesis.speak(u);
    }
}).factory('socket', function (socketFactory) {
    return socketFactory();
});

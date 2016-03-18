ponsse.controller("bodyController", function($location, $scope) {
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

    var listening = false;
    var recognition = new webkitSpeechRecognition();
    recognition.lang = "fi-FI";
    recognition.onresult = function(event) {
        var speechresult = event.results[0][0].transcript;
        if (event.results[0][0].confidence < 0.6) {
            return;
        }

        if (speechresult == "näytä kartta") {
            $scope.$apply(function() {
                $location.path("/map");
            });
        } else if (speechresult == "näytä sää") {
            $scope.$apply(function() {
                $location.path("/saa");
            });
        } else {
            console.log(speechresult);
        }
    };

    this.keydown = function(event) {
        if (event.keyCode == 17 && !listening) {
            listening = true;
            recognition.start();
        }
    };

    this.keyup = function(event) {
        if (event.keyCode == 17) {
            listening = false;
            recognition.stop();
        }
    }

});

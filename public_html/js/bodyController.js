ponsse.controller("bodyController", function($location) {
    var self = this;
    self.currentPage = "/";
    this.isActive = function(viewLocation) {
      return viewLocation === $location.path();
    };

    this.classActive = function(viewLocation) {
      if( self.isActive(viewLocation) ) {
        return 'active';
      }
    }
});

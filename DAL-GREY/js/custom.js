(function () {
  "use strict";

  var app = angular.module('viewCustom', []);
  
  /* replace default logo layout with contents of prm-logo-after */
  app.component('prmLogoAfter', {
    template: '<div class="product-logo-local" tabindex="0" id="banner" role="banner" layout="row" layout-align="start center" layout-fill>' +
              '<img class="logo-image" alt="Novanet Logo" title="Novanet" ng-src="custom/DAL/img/novanet-logo.png">' +
              '<img class="logo-image" alt="Dalhousie Logo" ng-src="custom/DAL/img/library-logo.png">' +
              '</div>'
  });
      
})();

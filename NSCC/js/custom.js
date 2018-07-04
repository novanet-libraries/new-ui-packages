(function () {
  "use strict";

  var app = angular.module('viewCustom', ['angularLoad']);

  //hide the "Edit details" options in the user's personal details area.
  app.component('prmPersonalInfoAfter', {
    controller: 'NSCCPersonalInfoController',
    bindings  : {
      'parentCtrl': '='
    }
  })
  .controller('NSCCPersonalInfoController', ['$scope', function($scope){
    //console.log($scope);
    //console.log(this.parentCtrl);
    var parentCtrl = this.parentCtrl;
    parentCtrl.showPasswordSection = function(){ return false; };
    parentCtrl.isEditable          = function(){ return false; };
  }]);

})();

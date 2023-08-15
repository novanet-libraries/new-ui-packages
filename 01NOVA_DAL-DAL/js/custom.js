(function () {
  "use strict";

  var app = angular.module('viewCustom', []);

  //availability line fallback message
  //  Occasionally (often with recently removed ebooks) the calculated availability
  //  statement is missing/blank.   This is a temporary placeholder for that.
  app.component('prmSearchResultAvailabilityLineAfter', {
    bindings: {
      parentCtrl: '<'
    },
    controller: 'AvailFallbackMsg'
  }).controller('AvailFallbackMsg', ['$element', function($element){
    var vm = this;
    vm.$onInit = function(){
      if (!vm.parentCtrl.displayedAvailability || vm.parentCtrl.displayedAvailability.length < 1){
        if ($element.text().replace(/\s+/g, '') == '') {
          console.error('missing availability stmt in result: ', vm.parentCtrl.result["@id"]);
          //vm.parentCtrl.displayedAvailability = [ 'error_not_assigned' ];
          $element.css('color', '#6c6161').text('Not Available');
        }
      }else{
        $element.text(' ');
      }
    };
    vm.$doCheck = function(){
      if (!vm.parentCtrl.displayedAvailability || vm.parentCtrl.displayedAvailability.length < 1){
        if ($element.text().replace(/\s+/g, '') == '') {
          console.error('missing availability stmt in result: ', vm.parentCtrl.result["@id"]);
          //vm.parentCtrl.displayedAvailability = [ 'error_not_assigned' ];
          $element.css('color', '#6c6161').text('Not Available');
        }
      }else{
        $element.text(' ');
      }
    };    
  }]);

})();

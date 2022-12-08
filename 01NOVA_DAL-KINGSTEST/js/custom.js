(function () {
  "use strict";

  var app = angular.module('viewCustom', []);

  //all of this code just adds a note to the hold request form in Primo.
  app.component('prmRequestAfter', {
    bindings: {
      parentCtrl: '<'
    },
    controller: 'PrimoRequestAfterController'
  }).controller('PrimoRequestAfterController', ['$scope', '$element', function($scope, $element){
/*
    var vm = this;
    vm.$onInit = function(){
      console.log($scope);
      console.log(vm.parentCtrl);
      var xpResult = document.evaluate('//span[@role="button" and contains(., "Dalhousie University")]', document, null, XPathResult.ANY_TYPE, null);
      var span = xpResult.iterateNext();
      while (span){
        span.innerText = "Dalhousie or Kings";
        span = xpResult.iterateNext();
      }        
    }
*/
    try{
      var domObserver = new MutationObserver(function(mutationList){
        angular.forEach(mutationList, function(mutation){
          /*
          if (mutation.addedNodes && mutation.addedNodes.length > 0){
            angular.forEach(mutation.target, function(node){
              var spans = angular.element(node).find("span");
              angular.forEach(spans, function(span){
                if (span.innerText == "Dalhousie University"){
                  span.innerText = "Dalhousie or Kings";
                }
              });
            });
          }
          */
          var spans = angular.element(mutation.target).find("span");
          angular.forEach(spans, function(span){
            if (span.innerText == "Dalhousie University"){
              span.innerText = "Dalhousie or Kings";
            }
          });          
        });
      });

      angular.forEach($element.parent().children(), function(e,i){
        var elemnt = angular.element(e);
        if (elemnt.hasClass("service-form")){
          domObserver.observe(e, {childList: true, subtree: true});
        }
      });
    }catch(e){
      //continue anyway.
      console.log(e);
    }
    
  }]);

})();

(function () {
  "use strict";

  var app = angular.module('viewCustom', []);

  app.component('prmRequestAfter', {
    bindings: {
      parentCtrl: '<'
    },
    controller: 'PrimoRequestAfterController'
  }).controller('PrimoRequestAfterController', ['$scope', '$element', function($scope, $element){
    try{
      var domObserver = new MutationObserver(function(mutationList){
        angular.forEach(mutationList, function(mutation){
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
    }catch(ex){
      //continue anyway.
      console.log(ex);
    }

  }]);

})();

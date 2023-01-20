(function () {
  "use strict";

  var app = angular.module('viewCustom', []);

  app.component('prmServiceLinksAfter', {
    bindings: {
      parentCtrl: '<'
    },
    controller: 'PrimoServiceLinksAfterController'
  }).controller('PrimoServiceLinksAfterController', ['$scope', function($scope){
    var vm = this;
    vm.$onInit = function(){
      //console.log(vm.parentCtrl);
      console.log($scope);
      var urlprefix = window.appConfig.vid == '01NOVA_DAL:KINGS' ? 
          'https://caul-cbua.relais-host.com/user/login.html?group=patron&LS=NSHK&' :
          'https://util.library.dal.ca/Relais/?';
      
      console.log($scope.$ctrl.parentCtrl.recordLinks.length);
      
      angular.forEach($scope.$ctrl.parentCtrl.recordLinks, function(a, i){
        console.log('replacing ', a.linkURL);
        $scope.$ctrl.parentCtrl.recordLinks[i].linkURL = a.linkURL.replace('https://caul-cbua.relais-host.com/user/login.html?group=patron&LS=NSHV&', urlprefix);
        //a.linkURL = a.linkURL.replace(/^URLPREFIX/, urlprefix);
      });
    }
  }]);
    
  

})();

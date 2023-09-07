(function () {
  "use strict";

  var app = angular.module('viewCustom', []);

  app.component('reportAProblem', {
    templateUrl: function(){
      var lang = window.appConfig['primo-view']['attributes-map'].interfaceLanguage == 'fr' ? 'fr_FR' : 'en_US';
      return 'custom/' + window.appConfig.vid.replace(':', '-') + '/html/report-a-problem_' + lang + '.html';
    }
  });
  app.component('prmActionListAfter', {
    template: '<report-a-problem></report-a-problem>'
  });

})();

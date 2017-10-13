(function () {
  "use strict";

  var app = angular.module('viewCustom', ['angularLoad']);

  
  //add "try this search elsewhere" options
  app.component('prmSearchResultListAfter', {
    controller: 'SearchElsewhereController',
    bindings: {
      'parentCtrl': '='
    },
    template: '<div style="position:absolute;top:0;left:0;background-color:black;color:white;">' +
                '<p><a href="" ng-click="searchWorldcat();">try your search in WorldCat</a></p>' +
                '<p><a href="" ng-click="searchGoogleScholar();">try your search in Google Scholar</a></p>' +
              '</div>'
  })
  .controller('SearchElsewhereController', ['$scope', function($scope){
    var vm = this,
        getTerms = function(){
          var terms = "",
              searchFields = vm.parentCtrl.searchService.searchFieldsService;
          if (searchFields.advancedSearch){
            terms = "";
            searchFields.searchParams.query.forEach(function(t){
              terms += t.replace(/^[^,]+,[^,]+,/, '').replace(/,[^,]+$/, '') + " ";
            });
            terms = terms.replace(/^\s+|\s+$/, "");
          }
          else{
            terms = searchFields.mainSearch;
          }
          return terms || "";
        };

    $scope.searchWorldcat = function(){
      window.open("https://www.worldcat.org/search?q=" + encodeURIComponent(getTerms()), "_blank");      
    };
    $scope.searchGoogleScholar = function(){
      window.open("https://scholar.google.ca/scholar?q=" + encodeURIComponent(getTerms()), "_blank");
    };
    
    vm.$onInit = function(){
      console.log('SearchElsewhereController $onInit()');
    };
  }]);
  
  
  
  //add LiveHelp button/options
  app.component('prmExploreMainAfter', {
    controller: 'LiveHelpController',
    templateUrl: 'custom/ACAD/html/live-help.html'
  })
  .controller('LiveHelpController', ['$scope', 'angularLoad', function($scope, angularLoad){
    var ctrl       = this,
        chatWindow = null,
        chatUrl    = (function(){
          var url      = 'https://libraryh3lp.com/chat/novanet@chat.libraryh3lp.com',
              skin     = '10162',
              theme    = 'gota',
              title    = 'Live Help',
              identity = 'Librarian',
              css      = 'https://sites.stfx.ca/library/sites/sites.stfx.ca.library/files/libraryh3lp.css';

          url += '?skin='     + encodeURIComponent(skin);
          url += '&theme='    + encodeURIComponent(theme);
          url += '&title='    + encodeURIComponent(title);
          url += '&identity=' + encodeURIComponent(identity);
          url += '&css='      + encodeURIComponent(css);
          return url;
        })();

    ctrl.$onInit = function (){
      angularLoad.loadScript(
        'https://libraryh3lp.com/js/libraryh3lp.js?multi,poll'
      ).then(
        function(){
          //console.log('Loaded external libraryh3lp script.');
        },
        function(data){
          console.error('Failed to load external libraryh3lp script.');
          console.error(JSON.stringify(data, null, 2));
      });
    };

    $scope.liveHelpText = "Ask A Librarian!";

    $scope.showChat = function(evt){
      evt && evt.stopPropagation();

      if (chatWindow && !chatWindow.closed){
        chatWindow.focus();
      }
      else{
        chatWindow = window.open(chatUrl, 'Live Help', 'resizable=1,width=300,height=300,top:100,left:100');
      }
    };

  }]); //end definition of LiveHelpController      

})();

(function () {
  "use strict";

  var app = angular.module('centralCustom', ['angularLoad']);

  //all of this code just adds a note to the hold request form in Primo.
  app.component('prmRequestAfter', {
    bindings: {
      parentCtrl: '<'
    },
    controller: 'PrimoRequestAfterController'
  }).controller('PrimoRequestAfterController', ['$element', function($element){
      try{
        //The french note is encoded in UTF-8.  The browser will interpret it as the same encoding as the HTML page that embedded this script file.
        //So, if the french note is not displayed correctly in the browser, serve all pages as UTF-8, or change the character encoding of this file.
        var lang = location.search.match(/lang=fr_FR/) ? 'fr_FR' : 'en_US',
            enNote = "If you need a specific chapter, section, volume, issue, part or page, please include this information in the note fields below.",
            frNote = "Si vous avez besoin d'un chapitre, d'une section, d'un volume, d'un numéro, d'une partie ou d'une page précis(e) de l'œuvre demandée, veuillez l'indiquer dans la section « Note » ci-dessous.",
            //MutationObserver isn't available in IE <11.  Ignore that; IE<=10 simply won't show the note.
            domObserver = new MutationObserver(function(mutationList){
              angular.forEach(mutationList, function(mutation){
                //console.log('observerCallback', mutation);
                if (mutation.addedNodes && mutation.addedNodes.length > 0){
                  angular.forEach(mutation.addedNodes, function(node){
                    //we want the note at the top of the <div> with this className
                    var target = 'service-form-dynamic-panel',
                        elemnt = angular.element(node);
                    if (elemnt.hasClass(target)){
                      elemnt.prepend("<div style='text-align:center'>" + ( lang == 'fr_FR' ? frNote : enNote ) + "</div>");
                    }
                  });
                }
              });
            });

        //the service-form is an empty div until we click "Place a Hold".
        //This will notify us if "service-form" has children, that is,
        //when "service-form" is actually populated with the form elements.
        angular.forEach($element.parent().children(), function(e,i){
          var target = 'service-form',
              elemnt = angular.element(e);
          if (elemnt.hasClass(target)){
            domObserver.observe(e, {childList: true});
          }
        });
      }catch(e){
        //continue anyway.
        console.log(e);
      }
    }
  ]);

  //Hide virtual browse if callnumber is "Electronic Book" (or similar)
  //browse works on callnumber to show similar items; that doesn't work with these callnumbers.
  app.component('prmFullViewAfter', {
    bindings: {
      parentCtrl: '<'
    },
    controller: function (){
      var cn;
      try{
        cn = this.parentCtrl.item.enrichment.virtualBrowseObject.callNumber;
        if (cn.toLowerCase().substring(0,10) == 'electronic'){
          console.log("removing virtualbrowse section because callnumber is: " + cn);
          this.parentCtrl.item.enrichment.virtualBrowseObject.isVirtualBrowseEnabled = false;
        }
      }catch(e){
        console.error("Error occured in custom.js, prmVirtualBrowseAfter controller function.");
        console.error(e);
      }
    }
  });

  //hide the "REGISTER" user button iin the list of items
  app.component('prmLocationItemsAfter', {
    bindings: {
      parentCtrl: '='
    },
    controller: function(){
      var vm = this;
      vm.$onInit = function(){
        vm.parentCtrl.showRegisterUser = function() { return false; };
      }
    }
  });
  app.component('prmLocationsAfter', {
    bindings: {
      parentCtrl: '='
    },
    controller: function(){
      var vm = this;
      vm.$onInit = function(){
        vm.parentCtrl.showRegisterUser = function() { return false; };
      }
    }
  });
  
  
  app.component('seasonalNoticeCard', {
    templateUrl: function(){
      var lang = location.search.match(/lang=fr_FR/) ? 'fr_FR' : 'en_US';
      return 'custom/01NOVA_NETWORK-CENTRAL_PACKAGE/html/seasonal-notice_' + lang + '.html';
    }
  });
  app.component('institutionNoticeCard', {
    templateUrl: function(){
      return 'custom/' + window.appConfig.vid.replace(':', '-') + '/html/institution-notice_en_US.html';
    }
  });
  
  app.component('prmAccountOverviewAfter', {
    template: '<institution-notice-card></institution-notice-card><seasonal-notice-card></seasonal-notice-card>'
  });
  app.component('prmTopbarAfter', {
    template: '<live-help-widget></live-help-widget>'
  });
  
  app.component('prmTopBarBefore', {
    controller: 'TopBarBeforeController'
  }).controller('TopBarBeforeController', [function(){
    var vm = this;
    vm.$onInit = function(){
      if (location.hostname == 'novanet-primo.hosted.exlibrisgroup.com'){
        var dns = window.appConfig.vid.substr(window.appConfig.vid.indexOf(':')+1);
        if (dns == 'ACAD'){
          dns = 'acadia';
        }else if(dns == 'USA'){
          dns = 'usainteanne';
        }
        else{
          //all the other schools have a dns subdomain equal to their view code.
          dns = dns.toLowerCase();
        }
        location.href = location.href.replace('novanet-primo.hosted.exlibrisgroup.com', dns+'.novanet.ca');
      }
    }
  }]);
  
  //add "try this search elsewhere" options
  app.component('prmSearchResultListAfter', {
    controller: 'SearchElsewhereController',
    bindings: {
      'parentCtrl': '<'
    },
    templateUrl: function(){
      var lang = location.search.match(/lang=fr_FR/) ? 'fr_FR' : 'en_US';
      return 'custom/01NOVA_NETWORK-CENTRAL_PACKAGE/html/search-elsewhere-' + lang + '.html';
    }
  })
  .controller('SearchElsewhereController', ['$scope', function($scope){
    var vm = this,
        //this data belongs in the library info service, not here.
        gsInstIds = {
          ACAD:  '4382908539753259136',
          AST:   '4414605408550952312',
          CBU:   '9331274502214916509',
          DAL:   '5975043576360107395',
          KINGS: '5975043576360107395', //using Dal's
          MTA:   '8840802410783793469',
          MSVU:  '17224971713671833064',
          NSCC:  '6441348662430423134',
          NSCAD: '12584370207272605175',
          SMU:   '231651475990452367',
          STFX:  '8335306489616302259',
          USA:   '4402118154602451548'
        },
        worldCatUrls = {
          DEFAULT: 'https://www.worldcat.org/search?q=',
          ACAD:    'https://acadiau.on.worldcat.org/search?queryString=',
          AST:     'https://ast.on.worldcat.org/search?queryString=',
          CBU:     'https://cbu.on.worldcat.org/search?queryString=',
          DAL:     'https://dal.on.worldcat.org/search?queryString=',
          KINGS:   'https://dal.on.worldcat.org/search?queryString=',
          NSCC:    'https://nscc.on.worldcat.org/search?queryString=',
          NSCAD:   'https://nscad.on.worldcat.org/search?queryString=',
          MTA:     'https://mta.on.worldcat.org/search?queryString=',
          MSVU:    'https://msvu.on.worldcat.org/search?queryString=',
          SMU:     'https://smu.on.worldcat.org/search?queryString=',
          STFX:    'https://stfx.on.worldcat.org/search?queryString='
        };

    $scope.isSearchDone = function(){
      //return !vm.parentCtrl.searchInProgress;
      return vm.parentCtrl.resultsExists;
    };

    vm.$onInit = function(){
      var terms = '', searchFields = vm.parentCtrl.searchService.searchFieldsService;

      if (angular.isArray(searchFields.searchParams.query)){
        searchFields.searchParams.query.forEach(function(t){
          //each element in the query array will be a string structured like: 'field,operator,actual terms,BOOL'
          //e.g. 'any,contains,killer whales,AND'
          //strip everything out except the actual terms:
          terms += t.replace(/^[^,]+,[^,]+,/, '').replace(/,[^,]+$/, '') + ' ';
        });
        terms = terms.replace(/\s+/, ' ').replace(/^\s+|\s+$/, '');
      }
      else{
        terms = searchFields.mainSearch;
      }

      //worldcat
      angular.element(
        document.getElementById('searchWorldCat')
      ).attr('href', (worldCatUrls[window.appConfig.vid.replace(/^.*:/,'')] || worldCatUrls.DEFAULT) + encodeURIComponent(terms));

      //google scholar
      angular.element(
        document.getElementById('searchGoogleScholar')
      ).attr('href', 'https://scholar.google.ca/scholar?q=' + encodeURIComponent(terms) + '&inst=' + (gsInstIds[window.appConfig.vid.replace(/^.*:/,'') ] || ''));
    };
  }]);


  //define a <live-help-card> component that draws an <md-card> with "Ask a Librarian" in it.
  //the controller pulls in the requisite LibraryH3lp code to make it work.
  //also define a <live-help-widget> that uses the same controller
  app.component('liveHelpCard', {
    controller: 'LiveHelpController',
    templateUrl: 'custom/01NOVA_NETWORK-CENTRAL_PACKAGE/html/live-help-card.html'
  })
  .component('liveHelpWidget', {
    controller: 'LiveHelpController',
    templateUrl: 'custom/01NOVA_NETWORK-CENTRAL_PACKAGE/html/live-help-widget.html'
  })
  .controller('LiveHelpController', ['$scope', 'angularLoad', function($scope, angularLoad){
    var ctrl       = this,
        chatWindow = null,
        chatUrl    = (function(){
          var url      = 'https://ca.libraryh3lp.com/chat/novanet@chat.ca.libraryh3lp.com',
              skin     = '10162',
              theme    = 'gota',
              title    = 'Live Help',
              identity = 'Librarian',
              css      = 'https://sites.stfx.ca/library/sites/sites.stfx.ca.library/files/libraryh3lp.css';

          url += '?skin='     + encodeURIComponent(skin);
          url += '&theme='    + encodeURIComponent(theme);
          url += '&title='    + encodeURIComponent(title);
          url += '&identity=' + encodeURIComponent(identity);
//          url += '&css='      + encodeURIComponent(css);
          return url;
        })();

    ctrl.$onInit = function (){
      angularLoad.loadScript(
        'https://ca.libraryh3lp.com/js/libraryh3lp.js?multi,poll'
      ).then(
        function(){
          //console.log('Loaded external libraryh3lp script.');
        },
        function(data){
          console.error('Failed to load external libraryh3lp script.');
          console.error(JSON.stringify(data, null, 2));
      });
    };

    $scope.liveHelpText = "Live Help";
    $scope.linkText = window.appConfig.vid == '01NOVA_MTA:MTA' ? "Novanet Live Help" : "Ask a librarian how to start your search.";

    $scope.showChat = function(evt){
      try{
        evt.stopPropagation();

        if (chatWindow && !chatWindow.closed){
          chatWindow.focus();
        }
        else{
          chatWindow = window.open(chatUrl, 'Live Help', 'resizable=1,width=300,height=300,top:100,left:100');
        }
      }
      catch(e){
        console.warn(e);
      }
    };
    $scope.sayOffline = function(evt){
      try{
        evt.stopPropagation();
        alert("Offline");
      }
      catch(e){
        console.warn(e);
      }
    };
  }]); //end definition of LiveHelpController


  //make a <novanet-library-hours> component, institutions can put it on the landing page (or anywhere, or nowhere)
  //to include it write something like: <novanet-library-hours sublibrary="DLKIL,DLAGR"></novanet-library-hours>
  app.component('novanetLibraryHours', {
    templateUrl: 'custom/01NOVA_NETWORK-CENTRAL_PACKAGE/html/library-hours.html',
    controller: 'LibraryHoursController'
  })
  .controller('LibraryHoursController', ['$scope', '$http', '$attrs', function($scope, $http, $attrs){

    $scope.sublibraryString = $attrs.sublibrary;
    $scope.sublibraries = $attrs.sublibrary.split(',');
    $scope.hours = {};

    //turns an object keyed by weekday into an array sorted by weekday.
    var weekdayMap = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    var weekdayHashToArray = function(input){
      var array = [];
      angular.forEach(input, function(hours, days){
        array.push({days:days,hours:hours});
      });
      array.sort(function (a, b) {
        return weekdayMap.indexOf(a.days.substr(0,2)) - weekdayMap.indexOf(b.days.substr(0,2));
      });
      return array;
    };
    //turns an object keyed by dates into an array sorted by date.
    var datesHashToArray = function(input){
      var array = [];
      angular.forEach(input, function(hours, days){
        array.push({days:days,hours:hours});
      });
      array.sort(function (a, b) {
        return a.days.substr(0,8) - b.days.substr(0,8);
      });
      return array;
    };

    $http.get(
      'https://aleph1.novanet.ca/novanet/hours-data.pl?sublibrary=' + $scope.sublibraryString
    ).then(
      function(response){
        $scope.hours = response.data;

        //data doesn't come sorted; convert unordered hashes to sorted arrays
        angular.forEach($scope.sublibraries, function(sublibCode){
          $scope.hours[sublibCode].exceptions.daily = datesHashToArray($scope.hours[sublibCode].exceptions.daily);
          $scope.hours[sublibCode].regular = weekdayHashToArray($scope.hours[sublibCode].regular);
          angular.forEach($scope.hours[sublibCode].exceptions.monthly, function(obj, key){
            $scope.hours[sublibCode].exceptions.monthly[key] = weekdayHashToArray(obj);
          });
        });

        if ($scope.sublibraries.length == 1){
          //if there's only one, move this "up" so we don't have to iterate over it in our templates.
          //N.B. templates have to check sublibraries.length as well.
          $scope.hours = $scope.hours[$scope.sublibraryString];
        }

      },
      function(response){
        console.error("Error fetching hours data from aleph1");
        console.error(JSON.stringify(response, null, 2));
      }
    );

  }])
  .filter('times', function(){
    //converts HHMM-HHMM to HH:MM - HH:MM
    return function(input){
      var start, end, m;
      m = input && input.match(/^(\d{4})-(\d{4})$/);
      if (m){
        start = m[1].substr(0,2) + ':' + m[1].substr(-2);
        end   = m[2].substr(0,2) + ':' + m[2].substr(-2);
        return start + ' - ' + end;
      }
      return input; //if we can't parse it, just write the text.  Probably "Closed".
    };
  })
  .filter('dates', ['$filter', function($filter){
    //converts YYYYMMDD[-YYYYMMDD] to MMM d[ - MMM d]
    //uses built-in angular filter 'date' for the formatting.
    var insertDashes = function(yyyymmdd){
      return yyyymmdd.substr(0,4)+'-'+yyyymmdd.substr(4,2)+'-'+yyyymmdd.substr(6,2);
    };
    return function(input){
      var start  = insertDashes(input.substr(0, 8)),
          end    = insertDashes(input.substr(-8)),
          output = $filter('date')(start, 'MMM d');
      if (end != start){
        output += " - ";
        output += $filter('date')(end, 'MMM d');
      }
      return output;
    };
  }])
  .filter('weekdays', function(){
    //converts Mo[-Fr] to Monday[ - Friday]
    var weekdayMap = {
      'Mo': 'Monday',
      'Tu': 'Tuesday',
      'We': 'Wednesday',
      'Th': 'Thursday',
      'Fr': 'Friday',
      'Sa': 'Saturday',
      'Su': 'Sunday'
    };
    return function(input, opt){
      //use opt for French, maybe?
      var s, e, output;
      s = input.substr(0, 2);
      e = input.substr(-2);
      if (weekdayMap[s]){
        output = weekdayMap[s];
      }
      if (e != s && weekdayMap[e]){
        output += ' - ' + weekdayMap[e];
      }
      return output || input;
    };
  }); // end LibraryHours component definition.


})();

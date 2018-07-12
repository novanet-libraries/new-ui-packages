(function () {
  "use strict";

  var app = angular.module('centralCustom', ['angularLoad']);

  app.component('seasonalNoticeCard', {
    templateUrl: function(){
      var lang = location.search.match(/lang=fr_FR/) ? 'fr_FR' : 'en_US';
      return window.appConfig.vid == 'AST' ? '' : 'custom/CENTRAL_PACKAGE/html/seasonal-notice_' + lang + '.html'; 
    }
  });
  
  app.component('prmAccountOverviewAfter', {
    template: '<seasonal-notice-card></seasonal-notice-card>'
  });
  app.component('prmTopbarAfter', {
    template: '<live-help-widget></live-help-widget>'
  });
  
  //add "try this search elsewhere" options
  app.component('prmSearchResultListAfter', {
    controller: 'SearchElsewhereController',
    bindings: {
      'parentCtrl': '<'
    },
    templateUrl: function(){
      var lang = location.search.match(/lang=fr_FR/) ? 'fr_FR' : 'en_US';
      return 'custom/CENTRAL_PACKAGE/html/search-elsewhere-' + lang + '.html'; 
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
          NSCC:    'https://nscc.on.worldcat.org/search?queryString=',
          NSCAD:   'https://nscad.on.worldcat.org/search?queryString=',
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

      if (searchFields.advancedSearch){
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
      ).attr('href', (worldCatUrls[window.appConfig.vid] || worldCatUrls.DEFAULT) + encodeURIComponent(terms));

      //google scholar
      angular.element(
        document.getElementById('searchGoogleScholar')
      ).attr('href', 'https://scholar.google.ca/scholar?q=' + encodeURIComponent(terms) + '&inst=' + (gsInstIds[window.appConfig.vid] || ''));
    };
  }]);
  
  //alternate, clickable version of the institution logo.
  // see also: the css rules regarding prm-logo.
  app.component('prmLogoAfter', {
    templateUrl : 'custom/CENTRAL_PACKAGE/html/logo-local.html',
    controller  : "LogoController",
    bindings    : {
      'parentCtrl': '='
    }
  }).controller('LogoController', ['$scope', '$http', 'logoInfoService', function($scope, $http, logoInfoService){
    var ctrl = this,
        vid  = window.appConfig.vid || 'NOVANET',
        info = logoInfoService[vid] || {},
        svgUrl = "custom/"+vid+"/img/library-logo.svg",
        pngUrl = "custom/"+vid+"/img/library-logo.png";

    $scope.logoHref  = info.href  || "";
    $scope.logoSrc   = info.usePng ? pngUrl : svgUrl;
    $scope.logoAlt   = info.alt   || "";
    $scope.logoWidth = info.width || "180";

  }]).factory('logoInfoService', function(){
    return {
      ACAD:{
        href: "https://library.acadiau.ca/",
        alt: "Acadia Library",
        width: "247",
        usePng: true
      },
      AST:{
        href: "http://astheology.ns.ca/library/",
        alt: "AST Library",
        width: "237",
        usePng: true
      },
      CBU:{
        href: "https://www.cbu.ca/library/",
        alt: "CBU Library"
//        width: "73"
//        width: "427"
      },
      DAL:{
        href: "https://libraries.dal.ca",
        alt: "Dalhousie Libraries",
        width: "188",
        usePng: true
      },
      KINGS:{
        href: "https://ukings.ca/campus-community/library/",
        alt: "KINGS Library",
        width: "112",
        usePng: true
      },
      MSVU:{
        href: "http://www.msvu.ca/en/home/library/default.aspx",
        alt: "MSVU Library",
        width: "132",
        usePng: true
      },
      NOVANET:{
        href: "http://www.novanet.ca",
        alt: "Novanet Website",
        width: "188"
      },
      NSCAD:{
        href: "http://nscad.ca/en/home/library/default.aspx",
        alt: "NSCAD Library",
        width: "122",
        usePng: true
      },
      NSCC:{
        href: "http://www.library.nscc.ca/",
        alt: "NSCC Libraries",
        width: "202",
        usePng: true
      },
      SMU:{
        href: "https://www.smu.ca/academics/the-patrick-power-library.html",
        alt: "Patrick Power Library",
        width: "202",
        usePng: true
      },
      STFX:{
        href: "https://sites.stfx.ca/library",
        alt: "StFX Library",
        width: "188"
      },
      USA:{
        href: "https://www.usainteanne.ca/bibliotheque",
        alt: "Université Sainte-Anne",
        width: "209"
      }
    };
  });

  //Apply custom sort to the Library facet
  //Our sort order is arbitrary (almost alphabetical, but not really),
  //with libraries of the view hoisted to the top of the list.
  app.component('prmFacetExactAfter', {
    controller: 'LibraryFacetController',
    bindings: {
      'parentCtrl': '='
    }
  })
  .controller('LibraryFacetController', ['libraryFacetService', '$element', function(libraryFacetService, $element){

    var vm = this,
      preferredLibs = libraryFacetService.preferredLibsByView(window.appConfig.vid),
      isPreferred = function(lib){ return preferredLibs.indexOf(lib) >= 0; },
      libCompare = function(a,b){
        var a = a.value, b = b.value; //this function receives objects; get their string values

        if (isPreferred(a)){
          //a is preferred.  If b is also preferred, compare them, otherwise, a comes first (-1).
          return isPreferred(b) ? libraryFacetService.libStringCompare(a,b) : -1;
        }
        else{
          //a is not preferred.  If b is preferred, b comes first (1), otherwise, compare them.
          return isPreferred(b) ? 1 : libraryFacetService.libStringCompare(a,b);
        }
      };


    vm.$onInit = function(){
      var facetGroup = vm.parentCtrl.facetGroup,
          state      = vm.parentCtrl.$state;

      try{
        if (facetGroup.name == "library" && angular.isArray(facetGroup.values)){
          facetGroup.values.sort(libCompare);
        }
      }catch(e){
        console.warn(e);
      }

      try{      
        if (facetGroup.name == "tlevel" && state.params.search_scope.match(/_CR$/)){
          $element.parent().parent().parent().css("display", "none");
        }
      }catch(e){
        console.warn(e);
      }

    };

  }])
  .factory('libraryFacetService', function(){
    //provides functions for sorting the Library facet correctly.

    //define the preferred sort order of all the facet options
    //N.B. every possible value that could appear in the facet group must be in this list.
    var libSortOrder = [
      'NOVA', 'WWW', 'ACAD', 'AST', 'CBU',
      'DAL', 'DLNET', 'DNET', 'DLWKK', 'DLKIL', 'DLLAW', 'DLAGR', 'DLSXT',
      'MSVU', 'MSCBC', 'MSCRC', 'NSCAD',
      'NSCC', 'CCNET', 'CNET', 'CCAK', 'CCAV', 'CCBC', 'CCCU', 'CCIT', 'CCKC',
      'CCLC', 'CCMC', 'CCPC', 'CCSC', 'CCSA', 'CCTR', 'CCWC',
      'STFX', 'SFXMD', 'SFXCO', 'SFCRC', 'SMU', 'USA', 'KINGS'],

    //libraries to hoist to the top when we are in any particular view
    libsByView = {
      'ACAD'  : ['ACAD'],
      'AST'   : ['AST'],
      'CBU'   : ['CBU'],
      'DAL'   : ['DAL', 'DLNET', 'DNET', 'DLKIL', 'DLAGR', 'DLWKK', 'DLLAW', 'DLSXT'],
      'KINGS' : ['KINGS'],
      'MSVU'  : ['MSVU', 'MSCBC', 'MSCRC'],
      'NSCAD' : ['NSCAD'],
      'NSCC'  : ['NSCC', 'CCNET', 'CNET', 'CCAK', 'CCAV', 'CCBC', 'CCCU', 'CCIT', 'CCKC',
                 'CCLC', 'CCMC', 'CCPC', 'CCSC', 'CCSA', 'CCTR', 'CCWC'],
      'SMU'   : ['SMU'],
      'STFX'  : ['STFX', 'SFXMD', 'SFXCO', 'SFCRC'],
      'USA'   : ['USA']
    };

    return {
      preferredLibsByView: function(viewCode){
        viewCode = viewCode || '';
        return libsByView[viewCode] || [];  //make sure returned value is always an Array
      },
      libStringCompare: function(a,b){
        var aIdx = libSortOrder.indexOf(a),
            bIdx = libSortOrder.indexOf(b);

        //if either of these warnings appear in the console, then sort order is undefined.
        if (aIdx < 0){
          console.warn("libStringCompare() encountered unknown library code: '%s'", a);
        }
        if (bIdx < 0){
          console.warn("libStringCompare() encountered unknown library code: '%s'", b);
        }

        return aIdx - bIdx;
      }
    };
  });//end libraryFacet definition

/*
  //add DocDel button to Actions list
  app.component('prmActionListAfter', {
    require: {
      prmActionCtrl: '^prmActionList'
    },
    controller: 'DocDelActionController'
  })
  .controller('DocDelActionController', function(){
    var vm = this;

    vm.windowRef = {};  //keep references to open windows here rather than sending everything to "_blank"

    vm.$onInit = function(){
      //console.log('DocDelActionController $onInit()');

      var actionCtrl = vm.prmActionCtrl,
          idx = Object.keys(actionCtrl.actionListService.actionsToIndex).length -1,
          name = 'RELAIS';

      //no DocDel action configured for this item -- return.
      if (!actionCtrl.item.link.docdelurl){
        return;
      }

      actionCtrl.actionLabelNamesMap[name] = name;
      actionCtrl.actionIconNamesMap[name]  = name;
      actionCtrl.actionIcons[name] = {
        icon: 'ic_local_shipping_24px',
        iconSet: 'maps',
        type: 'svg'
      };
      //the label under this icon is defined in Code Table
      //"Keeping This Item Tile" as fulldisplay.command.RELAIS (because name="RELAIS" here in this controller)

      if (undefined == actionCtrl.actionListService.actionsToIndex[name]){
        actionCtrl.actionListService.requiredActionsList[idx] = name;
        actionCtrl.actionListService.actionsToDisplay.unshift(name);
        actionCtrl.actionListService.actionsToIndex[name] = idx;
      }

      console.log(actionCtrl);
      
      actionCtrl.onToggle[name] = function(){
        var rec_id = actionCtrl.item.pnx.control.recordid;
        if (vm.windowRef[rec_id] && !vm.windowRef[rec_id].closed){
          vm.windowRef[rec_id].focus();
        }
        else{
          //vm.windowRef[rec_id] = window.open(actionCtrl.item.link.docdelurl, name + '_' + rec_id);
          vm.windowRef[rec_id] = window.open(actionCtrl.item.link.openurl, name + '_' + rec_id);
        }
      };

    };
  });
*/

  //define a <live-help-card> component that draws an <md-card> with "Ask a Librarian" in it.
  //the controller pulls in the requisite LibraryH3lp code to make it work.
  //also define a <live-help-widget> that uses the same controller
  app.component('liveHelpCard', {
    controller: 'LiveHelpController',
    templateUrl: 'custom/CENTRAL_PACKAGE/html/live-help-card.html'
  })
  .component('liveHelpWidget', {
    controller: 'LiveHelpController',
    templateUrl: 'custom/CENTRAL_PACKAGE/html/live-help-widget.html'
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

    $scope.liveHelpText = "Live Help";

    $scope.showChat = function(evt){
      evt && evt.stopPropagation();

      if (chatWindow && !chatWindow.closed){
        chatWindow.focus();
      }
      else{
        chatWindow = window.open(chatUrl, 'Live Help', 'resizable=1,width=300,height=300,top:100,left:100');
      }
    };
    $scope.sayOffline = function(evt){
      evt && evt.stopPropagation();
      alert("Offline");
    };

  }]); //end definition of LiveHelpController

/*
  //make a <novanet-library-hours> component, institutions can put it on the landing page (or anywhere, or nowhere)
  //to include it write something like: <novanet-library-hours sublibrary="DLKIL,DLAGR"></novanet-library-hours>
  app.component('novanetLibraryHours', {
    templateUrl: 'custom/CENTRAL_PACKAGE/html/library-hours.html',
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
      'https://aleph1.novanet.ca/cgi-bin/hours-data.pl?sublibrary=' + $scope.sublibraryString
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
*/

})();

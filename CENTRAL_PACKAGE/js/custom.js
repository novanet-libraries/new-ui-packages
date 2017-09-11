(function () {
  "use strict";

  var app = angular.module('centralCustom', []);

//  app.component('prmSpinnerAfter', {
//    template: '<strong>SPINNER-AFTER</strong>'
//  });
  
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
  .controller('LibraryFacetController', ['libraryFacetService', function(libraryFacetService){

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
      var facetGroup = vm.parentCtrl.facetGroup;

      if (facetGroup && facetGroup.name == "library" && angular.isArray(facetGroup.values)){
        facetGroup.values.sort(libCompare);
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

      /* no DocDel action configured for this item -- return. */
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

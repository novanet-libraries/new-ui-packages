(function () {
  "use strict";

  var app = angular.module('viewCustom', ['angularLoad']);

  window.browzine = {
    libraryId:  "1465",
    apiKey:     "cd63e5c7-8877-41b6-bfbd-2e3bfb16003f",

    journalCoverImagesEnabled: true,

    journalBrowZineWebLinkTextEnabled: true,
    journalBrowZineWebLinkText: "View Journal Contents",

    acticleBrowZineWebLinkTextEnabled: true,
    articleBrowZineWebLinkText: "View Issue Contents",

    articlePDFDownloadLinkEnabled: true,
    articlePDFDownloadLinkText: "Download PDF",

    printRecordsIntegrationEnabled: true,
  };

  browzine.script = document.createElement("script");
  browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js";
  document.head.appendChild(browzine.script);

  app.controller('BrowzineAfterAvailabilityController', function($scope) {
    window.browzine.primo.searchResult($scope);
  });

  app.component('prmSearchResultAvailabilityLineAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'BrowzineAfterAvailabilityController'
  });

})();

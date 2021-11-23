"use strict";

exports.onRouteUpdate = function (_ref, _ref2) {
  var prevLocation = _ref.prevLocation;
  var trackPage = _ref2.trackPage,
      _ref2$trackPageDelay = _ref2.trackPageDelay,
      trackPageDelay = _ref2$trackPageDelay === undefined ? 50 : _ref2$trackPageDelay;

  function trackRudderstackPage() {
    var delay = Math.max(0, trackPageDelay);

    window.setTimeout(function () {
      if (trackPage) {
        window.rudderanalytics && window.rudderanalytics.page(document.title);
      }
    }, delay);
  }

  // Track only non-home page views
  if (prevLocation) {
    if (window.rudderSnippetLoaded === false && window.rudderSnippetLoading === false) {
      window.rudderSnippetLoader();
    } else {
      trackRudderstackPage();
    }
  }
};

"use strict";

exports.onRouteUpdate = function (_ref, _ref2) {
  var prevLocation = _ref.prevLocation;
  var trackPage = _ref2.trackPage,
    _ref2$trackPageDelay = _ref2.trackPageDelay,
    trackPageDelay = _ref2$trackPageDelay === void 0 ? 50 : _ref2$trackPageDelay;
  function trackRudderStackPage() {
    if (trackPage) {
      var delay = Math.max(0, trackPageDelay);
      window.setTimeout(function () {
        window.rudderanalytics && window.rudderanalytics.page(document.title);
      }, delay);
    }
  }
  if (window.rudderSnippetLoaded === false) {
    if (window.rudderSnippetLoading === true) {
      window.rudderSnippetLoadedCallback = function () {
        trackRudderStackPage();
      };
    } else {
      if (prevLocation) {
        window.rudderSnippetLoadedCallback = undefined;
        window.rudderSnippetLoader(function () {
          trackRudderStackPage();
        });
      } else {
        window.rudderSnippetLoadedCallback = function () {
          trackRudderStackPage();
        };
      }
    }
  } else {
    trackRudderStackPage();
  }
};
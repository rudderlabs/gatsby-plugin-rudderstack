/* This lets users delay the analytics. */
exports.onRouteUpdate = (
  { prevLocation },
  { trackPage, trackPageDelay = 50 }
) => {
  function trackRudderstackPage() {
    // Adding a delay (defaults to 50ms when not provided by plugin option `trackPageDelay`)
    // ensure that the Rudderstack route tracking is in sync with the actual Gatsby route
    // (otherwise you can end up in a state where the Rudderstack page tracking reports
    // the previous page on route change).
    const delay = Math.max(0, trackPageDelay);

    window.setTimeout(() => {
      if (trackPage) {
        window.rudderanalytics && window.rudderanalytics.page(document.title);
      }
    }, delay);
  }

  // Track only non-home page views
  if (prevLocation) {
    if (window.rudderSnippetLoaded === false && window.rudderSnippetLoading === false) {
      window.rudderSnippetLoader(function () {
        trackRudderstackPage();
      });
    } else {
      trackRudderstackPage();
    }
  }
};
};

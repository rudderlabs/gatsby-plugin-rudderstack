/* This lets users delay the analytics. */
exports.onRouteUpdate = (
  { prevLocation },
  { trackPage, trackPageDelay = 50 }
) => {
  function trackRudderStackPage() {
    if (trackPage) {
      // Adding a delay (defaults to 50ms when not provided by plugin option `trackPageDelay`)
      // ensure that the RudderStack route tracking is in sync with the actual Gatsby route
      // (otherwise you can end up in a state where the RudderStack page tracking reports
      // the previous page on route change).
      var delay = Math.max(0, trackPageDelay);

      window.setTimeout(function () {
        window.rudderanalytics && window.rudderanalytics.page(document.title);
      }, delay);
    }
  }


  if (window.rudderSnippetLoaded === false) {
    if (window.rudderSnippetLoading === true) {
      // As the loading is in progress, set the alternate callback function
      // to track page
      window.rudderSnippetLoadedCallback = function () {
        trackRudderStackPage();
      };
    } else {
      // if it is not the first page
      if (prevLocation) {
        // Trigger the script loader and set the callback function
        // to track page
        window.rudderSnippetLoadedCallback = undefined;
        window.rudderSnippetLoader(function () {
          trackRudderStackPage();
        });
    } else {
        // As this is the first page, set the alternate callback function
        // to track page and wait for the scroll event to occur (for SDK to get loaded)
        window.rudderSnippetLoadedCallback = function () {
          trackRudderStackPage();
        }
      }
    }
  } else {
    trackRudderStackPage();
  }
};

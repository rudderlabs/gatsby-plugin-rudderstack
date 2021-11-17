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
        window.rudderSnippetLoader();
        window.rudderanalytics && window.rudderanalytics.page(document.title);
      }
    }, delay);
  }

  // This `if/then` logic relates to the `delayLoad` functionality to help prevent
  // calling `trackPage` twice. If you don't use that feature, you can ignore.
  // Here call `trackPage` only _after_ we change routes (on the client).
  if (prevLocation && window.rudderSnippetLoaded === false) {
    window.rudderSnippetLoader(() => {
      trackRudderstackPage();
    });
  } else {
    trackRudderstackPage();
  }
};

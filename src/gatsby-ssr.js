import React from "react";

exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  const {
    trackPage,
    prodKey,
    devKey,
    host = "https://cdn.segment.io",
    delayLoad,
    delayLoadTime,
    manualLoad,
  } = pluginOptions;

  // ensures Rudderstack production write key is present
  if (!prodKey || prodKey.length < 10)
    console.error(
      "Your Rudderstack prodKey must be at least 10 char in length."
    );

  // if Rudderstack dev key is present, ensures it is at least 10 characters in length
  if (devKey && devKey.length < 10)
    console.error(
      "If present, your Rudderstack devKey must be at least 10 char in length."
    );

  // use prod write key when in prod env, else use dev write key
  // note below, snippet wont render unless writeKey is truthy
  const writeKey = process.env.NODE_ENV === "production" ? prodKey : devKey;

  // if trackPage option is falsy (undefined or false), remove analytics.page(), else keep it in by default
  // NOTE: do not remove per https://github.com/benjaminhoffman/gatsby-plugin-segment-js/pull/18
  const includeTrackPage = !trackPage ? "" : "analytics.page();";

  /* TODO: update to minified Snippet */
  /* TODO: Use delay feature here like in Segment plugin. */
  const snippet = `rudderanalytics = window.rudderanalytics = [];
	
	var  methods = [
		"load",
		"page",
		"track",
		"identify",
		"alias",
		"group",
		"ready",
		"reset",
		"getAnonymousId",
    "setAnonymousId"
	];

	for (var i = 0; i < methods.length; i++) {
  		var method = methods[i];
  		rudderanalytics[method] = function (methodName) {
    			return function () {
      				rudderanalytics.push([methodName].concat(Array.prototype.slice.call(arguments)));
    			};
  			}(method);
	}
  rudderanalytics.load(${writeKey}, ${host});
  rudderanalytics.page();
`;

  const delayedLoader = `
      window.rudderSnippetLoaded = false;
      window.rudderSnippetLoading = false;
      window.rudderSnippetLoader = function (callback) {
        if (!window.rudderSnippetLoaded && !window.rudderSnippetLoading) {
          window.rudderSnippetLoading = true;
          function loader() {
            window.rudderanalytics.load('${writeKey}');
            window.rudderSnippetLoading = false;
            window.rudderSnippetLoaded = true;
            if(callback) {callback()}
          };
          setTimeout(
            function () {
              "requestIdleCallback" in window
                ? requestIdleCallback(function () {loader()})
                : loader();
            },
            ${delayLoadTime} || 1000
          );
        }
      }
      window.addEventListener('scroll',function () {window.rudderSnippetLoader()}, { once: true });
    `;

  // if `delayLoad` option is true, use the delayed loader
  const snippetToUse = `
      ${delayLoad && !manualLoad ? delayedLoader : ""}
      ${snippet}
    `;

  // only render snippet if write key exists
  if (writeKey) {
    setHeadComponents([
      <script
        key="plugin-rudderstack"
        dangerouslySetInnerHTML={{ __html: snippetToUse }}
      />,
      <script
        key="rudderstack-cdn"
        src="https://cdn.rudderlabs.com/v1/rudder-analytics.min.js"
      ></script>,
    ]);
  }
};

import React from "react";

exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  const {
    trackPage,
    prodKey,
    devKey,
    dataPlaneUrl = "https://hosted.rudderlabs.com",
    controlPlaneUrl,
    delayLoad,
    delayLoadTime,
    manualLoad,
    loadType,
    useNewSDK,
    sdkURL,
    useBetaSDK,
  } = pluginOptions;

  var sdkSrc = "https://cdn.rudderlabs.com/v1/rudder-analytics.min.js";
  if (sdkURL) sdkSrc = sdkURL;
  else if (useBetaSDK) {
    sdkSrc = "https://cdn.rudderlabs.com/v1.1/beta/rudder-analytics.min.js";
  } else if (useNewSDK) {
    sdkSrc = "https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js";
  }

  // ensures RudderStack production write key is present
  if (!prodKey || prodKey.length < 10)
    console.error(
      "Your RudderStack prodKey must be at least 10 char in length."
    );

  // if RudderStack dev key is present, ensures it is at least 10 characters in length
  if (devKey && devKey.length < 10)
    console.error(
      "If present, your RudderStack devKey must be at least 10 char in length."
    );

  // use prod write key when in prod env, else use dev write key
  // note below, snippet wont render unless writeKey is truthy
  const writeKey = process.env.NODE_ENV === "production" ? prodKey : devKey;

  const loadConfig = controlPlaneUrl
    ? `'${writeKey}', '${dataPlaneUrl}', {configUrl: '${controlPlaneUrl}'}`
    : `'${writeKey}', '${dataPlaneUrl}'`;
  /*
    if (controlPlaneUrl) {
      return `'${writeKey}', '${dataPlaneUrl}', {configUrl: '${controlPlaneUrl}'}`;
    } else {
      return `'${writeKey}', '${dataPlaneUrl}'`;
    }
  }; */

  const snippet = `rudderanalytics=window.rudderanalytics=[];for(var methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}
  ${delayLoad || manualLoad ? `` : `rudderanalytics.load(${loadConfig})`};
`;

  const delayedLoader = `
      window.rudderSnippetLoaded = false;
      window.rudderSnippetLoading = false;
      window.rudderSnippetLoadedCallback = undefined;
      window.rudderSnippetLoader = function (callback) {
        if (!window.rudderSnippetLoaded && !window.rudderSnippetLoading) {
          window.rudderSnippetLoading = true;
          function loader() {
            window.rudderanalytics.load(${loadConfig});
            window.rudderSnippetLoading = false;
            window.rudderSnippetLoaded = true;
            if (callback) { callback(); }
            if (window.rudderSnippetLoadedCallback) {
              window.rudderSnippetLoadedCallback();
              window.rudderSnippetLoadedCallback = undefined;
            }
          };

          "requestIdleCallback" in window
            ? requestIdleCallback(function () { loader(); })
            : loader();
        }
      }
      window.addEventListener('scroll',function () {window.rudderSnippetLoader()}, { once: true });
      setTimeout(
        function () {
          "requestIdleCallback" in window
            ? requestIdleCallback(function () { window.rudderSnippetLoader(); })
            : window.rudderSnippetLoader();
        },
        ${delayLoadTime} || 1000
      );
      `;

  // if `delayLoad` option is true, use the delayed loader
  const snippetToUse = `
      ${delayLoad && !manualLoad ? delayedLoader : ""}
      ${snippet}
    `;

  // only render snippet if write key exists
  if (writeKey) {
    let tags = [
      <script
        key="plugin-rudderstack"
        dangerouslySetInnerHTML={{ __html: snippetToUse }}
      />,
    ];

    let tag;

    if (loadType == "async") {
      tag = <script async key="rudderstack-cdn" src={sdkSrc}></script>;
    } else if (loadType == "defer") {
      tag = <script defer key="rudderstack-cdn" src={sdkSrc}></script>;
    } else {
      tag = <script key="rudderstack-cdn" src={sdkSrc}></script>;
    }

    tags.push(tag);
    setHeadComponents(tags);
  }
};

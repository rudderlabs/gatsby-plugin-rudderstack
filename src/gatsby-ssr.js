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
    useNewSDK
  } = pluginOptions;

  var sdkSrc = "https://cdn.rudderlabs.com/v1/rudder-analytics.min.js";
  if (useNewSDK) {
    sdkSrc = "https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js";
  }

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
      window.rudderSnippetLoader = function (callback) {
        if (!window.rudderSnippetLoaded && !window.rudderSnippetLoading) {
          window.rudderSnippetLoading = true;
          function loader() {
            window.rudderanalytics.load(${loadConfig});
            window.rudderSnippetLoading = false;
            window.rudderSnippetLoaded = true;
            window.rudderanalytics.page(document.title);
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
    let tags = [
      <script
        key="plugin-rudderstack"
        dangerouslySetInnerHTML={{ __html: snippetToUse }}
      />
    ]

    let tag;

    if (loadType == 'async') {
      tag = <script async
        key="rudderstack-cdn"
        src={ sdkSrc }
      ></script>
    } else if (loadType == 'defer') {
      tag = <script defer
        key="rudderstack-cdn"
        src={ sdkSrc }
      ></script>
    } else {
      tag = <script
        key="rudderstack-cdn"
        src={ sdkSrc }
    ></script>
    }

    tags.push(tag)
    setHeadComponents(tags);
  }
};

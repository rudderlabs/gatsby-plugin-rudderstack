import React from "react";

exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  const {
    prodKey,
    devKey,
    dataPlaneUrl = "https://hosted.rudderlabs.com",
    controlPlaneUrl,
    delayLoad,
    delayLoadTime,
    manualLoad,
    loadType,
    sdkURL = "https://cdn.rudderlabs.com/beta/3.0.0-beta",
    loadOptions = {},
    useLegacySDK,
  } = pluginOptions;

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

  // Override config URL if provided separately
  const finalLoadOptions = { ...loadOptions, configUrl: controlPlaneUrl || loadOptions.configUrl };

  const loadConfig = `'${writeKey}', '${dataPlaneUrl}', ${JSON.stringify(finalLoadOptions)}`;

  let snippet =  `var sdkBaseUrl="${sdkURL}";var sdkName="rsa.min.js";var asyncScript=true;window.rudderAnalyticsBuildType="legacy",window.rudderanalytics=[];
  var e=["setDefaultInstanceKey","load","ready","page","track","identify","alias","group","reset","getAnonymousId","setAnonymousId","startSession","endSession","getSessionId"];
  for(var n=0;n<e.length;n++){var d=e[n];window.rudderanalytics[d]=function(e){return function(){window.rudderanalytics.push([e].concat(Array.prototype.slice.call(arguments)))}}(d)}
  try{new Function('return import("")'),window.rudderAnalyticsBuildType="modern"}catch(a){}
  if(window.rudderAnalyticsMount=function(){var e=document.createElement("script");e.src="".concat(sdkBaseUrl,"/").concat(window.rudderAnalyticsBuildType,"/").concat(sdkName),e.async=asyncScript,document.head?document.head.appendChild(e):document.body.appendChild(e)},"undefined"==typeof Promise){var t=document.createElement("script");
  t.src="https://polyfill.io/v3/polyfill.min.js?features=globalThis%2CPromise&callback=rudderAnalyticsMount",t.async=asyncScript,document.head?document.head.appendChild(t):document.body.appendChild(t)}else{window.rudderAnalyticsMount()`;

  if (useLegacySDK) {
    let scriptTagStr = `var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = "${sdkURL}";`;
    if (loadType === "async") {
      scriptTagStr += "s.async = true;";
    } else if (loadType === "defer") {
      scriptTagStr += "s.defer = true;";
    }
    scriptTagStr += "document.head.appendChild(s);";

    snippet = `rudderanalytics=window.rudderanalytics=[];for(var methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}
    ${scriptTagStr}`;
  }

  const instantLoader = `${snippet}${manualLoad ? `` : `rudderanalytics.load(${loadConfig})`};`;

  const delayedLoader = `
      window.rudderSnippetLoaded = false;
      window.rudderSnippetLoading = false;
      window.rudderSnippetLoadedCallback = undefined;
      window.rudderSnippetLoader = function (callback) {
        if (!window.rudderSnippetLoaded && !window.rudderSnippetLoading) {
          window.rudderSnippetLoading = true;
          function loader() {
            ${snippet}
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
  const snippetToUse = `${delayLoad && !manualLoad ? delayedLoader : instantLoader}`;

  // only render snippet if write key exists
  if (writeKey) {
    let tags = [
      <script
        key="plugin-rudderstack"
        dangerouslySetInnerHTML={{ __html: snippetToUse }}
      />,
    ];

    setHeadComponents(tags);
  }
};

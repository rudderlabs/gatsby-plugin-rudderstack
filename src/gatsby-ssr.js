exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  const {
    prodKey,
    devKey,
    dataPlaneUrl = 'https://hosted.rudderlabs.com',
    controlPlaneUrl,
    delayLoad,
    delayLoadTime,
    manualLoad,
    loadType,
    sdkURL = 'https://cdn.rudderlabs.com/v3',
    loadOptions = {}
  } = pluginOptions;

  // ensures RudderStack production write key is present
  if (!prodKey || prodKey.length < 10)
    // eslint-disable-next-line no-console
    console.error('Your RudderStack prodKey must be at least 10 char in length.');

  // if RudderStack dev key is present, ensures it is at least 10 characters in length
  if (devKey && devKey.length < 10)
    // eslint-disable-next-line no-console
    console.error('If present, your RudderStack devKey must be at least 10 char in length.');

  // use prod write key when in prod env, else use dev write key
  // note below, snippet wont render unless writeKey is truthy
  const writeKey = process.env.NODE_ENV === 'production' ? prodKey : devKey;

  // Override config URL if provided separately
  const finalLoadOptions = { ...loadOptions, configUrl: controlPlaneUrl || loadOptions.configUrl };

  const loadConfig = `'${writeKey}', '${dataPlaneUrl}', ${JSON.stringify(finalLoadOptions)}`;

  let snippet = `!function(){"use strict";window.RudderSnippetVersion="3.0.3";var sdkBaseUrl=${sdkURL};var sdkName="rsa.min.js";var asyncScript=${loadType === 'async'};var deferScript=${loadType === 'defer'};window.rudderAnalyticsBuildType="legacy",window.rudderanalytics=[]
  ;var e=["setDefaultInstanceKey","load","ready","page","track","identify","alias","group","reset","setAnonymousId","startSession","endSession","consent"]
  ;for(var n=0;n<e.length;n++){var t=e[n];window.rudderanalytics[t]=function(e){return function(){
  window.rudderanalytics.push([e].concat(Array.prototype.slice.call(arguments)))}}(t)}try{
  new Function('return import("")'),window.rudderAnalyticsBuildType="modern"}catch(a){}
  if(window.rudderAnalyticsMount=function(){
  "undefined"==typeof globalThis&&(Object.defineProperty(Object.prototype,"__globalThis_magic__",{get:function get(){
  return this},configurable:true}),__globalThis_magic__.globalThis=__globalThis_magic__,
  delete Object.prototype.__globalThis_magic__);var e=document.createElement("script")
  ;e.src="".concat(sdkBaseUrl,"/").concat(window.rudderAnalyticsBuildType,"/").concat(sdkName);if(asyncScript){e.async=true};if(deferScript){e.defer=true};document.head?document.head.appendChild(e):document.body.appendChild(e)
  },"undefined"==typeof Promise||"undefined"==typeof globalThis){var d=document.createElement("script")
  ;d.src="https://polyfill-fastly.io/v3/polyfill.min.js?version=3.111.0&features=Symbol%2CPromise&callback=rudderAnalyticsMount",
  d.async=asyncScript,document.head?document.head.appendChild(d):document.body.appendChild(d)}else{
  window.rudderAnalyticsMount()}}();`;

  const instantLoader = `${snippet}${
    manualLoad ? `` : `window.rudderanalytics.load(${loadConfig})`
  };`;

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
    const tags = [
      <script key="plugin-rudderstack" dangerouslySetInnerHTML={{ __html: snippetToUse }} />,
    ];

    setHeadComponents(tags);
  }
};

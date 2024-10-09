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
    loadOptions = {},
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

  const snippet = `!function(){"use strict";window.RudderSnippetVersion="3.0.32";var e="rudderanalytics";window[e]||(window[e]=[])
;var rudderanalytics=window[e];if(Array.isArray(rudderanalytics)){
if(true===rudderanalytics.snippetExecuted&&window.console&&console.error){
console.error("RudderStack JavaScript SDK snippet included more than once.")}else{rudderanalytics.snippetExecuted=true,
window.rudderAnalyticsBuildType="legacy";var sdkBaseUrl="${sdkURL}";var sdkName="rsa.min.js"
;var scriptLoadingMode="${loadType}"
;var r=["setDefaultInstanceKey","load","ready","page","track","identify","alias","group","reset","setAnonymousId","startSession","endSession","consent"]
;for(var n=0;n<r.length;n++){var t=r[n];rudderanalytics[t]=function(r){return function(){var n
;Array.isArray(window[e])?rudderanalytics.push([r].concat(Array.prototype.slice.call(arguments))):null===(n=window[e][r])||void 0===n||n.apply(window[e],arguments)
}}(t)}try{
new Function('class Test{field=()=>{};test({prop=[]}={}){return prop?(prop?.property??[...prop]):import("");}}'),
window.rudderAnalyticsBuildType="modern"}catch(o){}var d=document.head||document.getElementsByTagName("head")[0]
;var i=document.body||document.getElementsByTagName("body")[0];window.rudderAnalyticsAddScript=function(e,r,n){
var t=document.createElement("script");t.src=e,t.setAttribute("data-loader","RS_JS_SDK"),r&&n&&t.setAttribute(r,n),
"async"===scriptLoadingMode?t.async=true:"defer"===scriptLoadingMode&&(t.defer=true),
d?d.insertBefore(t,d.firstChild):i.insertBefore(t,i.firstChild)},window.rudderAnalyticsMount=function(){!function(){
if("undefined"==typeof globalThis){var e;var r=function getGlobal(){
return"undefined"!=typeof self?self:"undefined"!=typeof window?window:null}();r&&Object.defineProperty(r,"globalThis",{
value:r,configurable:true})}
}(),window.rudderAnalyticsAddScript("".concat(sdkBaseUrl,"/").concat(window.rudderAnalyticsBuildType,"/").concat(sdkName),"data-rsa-write-key","${writeKey}")
},
"undefined"==typeof Promise||"undefined"==typeof globalThis?window.rudderAnalyticsAddScript("https://polyfill-fastly.io/v3/polyfill.min.js?version=3.111.0&features=Symbol%2CPromise&callback=rudderAnalyticsMount"):window.rudderAnalyticsMount()}}}();`;

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

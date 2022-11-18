"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.onRenderBody = function (_ref, pluginOptions) {
  var setHeadComponents = _ref.setHeadComponents;
  var trackPage = pluginOptions.trackPage,
      prodKey = pluginOptions.prodKey,
      devKey = pluginOptions.devKey,
      _pluginOptions$dataPl = pluginOptions.dataPlaneUrl,
      dataPlaneUrl = _pluginOptions$dataPl === undefined ? "https://hosted.rudderlabs.com" : _pluginOptions$dataPl,
      controlPlaneUrl = pluginOptions.controlPlaneUrl,
      delayLoad = pluginOptions.delayLoad,
      delayLoadTime = pluginOptions.delayLoadTime,
      manualLoad = pluginOptions.manualLoad,
      loadType = pluginOptions.loadType,
      useNewSDK = pluginOptions.useNewSDK,
      sdkURL = pluginOptions.sdkURL,
      useBetaSDK = pluginOptions.useBetaSDK,
      _pluginOptions$loadOp = pluginOptions.loadOptions,
      loadOptions = _pluginOptions$loadOp === undefined ? {} : _pluginOptions$loadOp;


  var sdkSrc = "https://cdn.rudderlabs.com/v1/rudder-analytics.min.js";
  if (sdkURL) sdkSrc = sdkURL;else if (useBetaSDK) {
    sdkSrc = "https://cdn.rudderlabs.com/v1.1/beta/rudder-analytics.min.js";
  } else if (useNewSDK) {
    sdkSrc = "https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js";
  }

  if (!prodKey || prodKey.length < 10) console.error("Your RudderStack prodKey must be at least 10 char in length.");

  if (devKey && devKey.length < 10) console.error("If present, your RudderStack devKey must be at least 10 char in length.");

  var writeKey = process.env.NODE_ENV === "production" ? prodKey : devKey;

  if (controlPlaneUrl) {
    loadOptions.configUrl = controlPlaneUrl;
  }

  var loadConfig = "'" + writeKey + "', '" + dataPlaneUrl + "'," + JSON.stringify(loadOptions);

  var snippet = "rudderanalytics=window.rudderanalytics=[];for(var methods=[\"load\",\"page\",\"track\",\"identify\",\"alias\",\"group\",\"ready\",\"reset\",\"getAnonymousId\",\"setAnonymousId\"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}\n  var s = document.createElement(\"script\");\n    s.type = \"text/javascript\";\n    s.src = \"" + sdkSrc + "\";\n    if (\"" + loadType + "\" == \"async\") {\n      s.async = true;\n    } else if (\"" + loadType + "\" == \"defer\") {\n      s.defer = true;\n    }\n    document.head.appendChild(s);\n";

  var instantLoad = "" + snippet + (delayLoad || manualLoad ? "" : "rudderanalytics.load(" + loadConfig + ")") + ";";

  var delayedLoader = "\n      window.rudderSnippetLoaded = false;\n      window.rudderSnippetLoading = false;\n      window.rudderSnippetLoadedCallback = undefined;\n      window.rudderSnippetLoader = function (callback) {\n        if (!window.rudderSnippetLoaded && !window.rudderSnippetLoading) {\n          window.rudderSnippetLoading = true;\n          " + snippet + "\n          function loader() {\n            window.rudderanalytics.load(" + loadConfig + ");\n            window.rudderSnippetLoading = false;\n            window.rudderSnippetLoaded = true;\n            if (callback) { callback(); }\n            if (window.rudderSnippetLoadedCallback) {\n              window.rudderSnippetLoadedCallback();\n              window.rudderSnippetLoadedCallback = undefined;\n            }\n          };\n\n          \"requestIdleCallback\" in window\n            ? requestIdleCallback(function () { loader(); })\n            : loader();\n        }\n      }\n      window.addEventListener('scroll',function () {window.rudderSnippetLoader()}, { once: true });\n      setTimeout(\n        function () {\n          \"requestIdleCallback\" in window\n            ? requestIdleCallback(function () { window.rudderSnippetLoader(); })\n            : window.rudderSnippetLoader();\n        },\n        " + delayLoadTime + " || 1000\n      );\n      ";

  var snippetToUse = "" + (delayLoad && !manualLoad ? delayedLoader : instantLoad);

  if (writeKey) {
    var tags = [_react2.default.createElement("script", {
      key: "plugin-rudderstack",
      dangerouslySetInnerHTML: { __html: snippetToUse }
    })];

    setHeadComponents(tags);
  }
};
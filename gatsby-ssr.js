"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.onRenderBody = function (_ref, pluginOptions) {
  var setHeadComponents = _ref.setHeadComponents;
  var trackPage = pluginOptions.trackPage,
      prodKey = pluginOptions.prodKey,
      devKey = pluginOptions.devKey,
      _pluginOptions$host = pluginOptions.host,
      host = _pluginOptions$host === undefined ? "https://hosted.rudderlabs.com" : _pluginOptions$host,
      delayLoad = pluginOptions.delayLoad,
      delayLoadTime = pluginOptions.delayLoadTime,
      manualLoad = pluginOptions.manualLoad,
      controlPlaneUrl = pluginOptions.controlPlaneUrl;

  if (!prodKey || prodKey.length < 10) console.error("Your Rudderstack prodKey must be at least 10 char in length.");

  if (devKey && devKey.length < 10) console.error("If present, your Rudderstack devKey must be at least 10 char in length.");

  var writeKey = process.env.NODE_ENV === "production" ? prodKey : devKey;

  var includeTrackPage = !trackPage ? "" : "rudderanalytics.page();";

  var loadConfigurations = "\"" + writeKey + "\", \"" + host + "\", { configUrl: \"" + controlPlaneUrl + "\" }";

  var snippet = "rudderanalytics=window.rudderanalytics=[];for(var methods=[\"load\",\"page\",\"track\",\"identify\",\"alias\",\"group\",\"ready\",\"reset\",\"getAnonymousId\",\"setAnonymousId\"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}\n  " + (delayLoad || manualLoad ? "" : "rudderanalytics.load(" + loadConfigurations + ")") + ";\n";

  var delayedLoader = "\n      window.rudderSnippetLoaded = false;\n      window.rudderSnippetLoading = false;\n      window.rudderSnippetLoader = function (callback) {\n        if (!window.rudderSnippetLoaded && !window.rudderSnippetLoading) {\n          window.rudderSnippetLoading = true;\n          function loader() {\n            window.rudderanalytics.load(" + loadConfigurations + ");\n            window.rudderSnippetLoading = false;\n            window.rudderSnippetLoaded = true;\n            if(callback) {callback()}\n          };\n          setTimeout(\n            function () {\n              \"requestIdleCallback\" in window\n                ? requestIdleCallback(function () {loader()})\n                : loader();\n            },\n            " + delayLoadTime + " || 1000\n          );\n        }\n      }\n      window.addEventListener('scroll',function () {window.rudderSnippetLoader()}, { once: true });\n    ";

  var snippetToUse = "\n      " + (delayLoad && !manualLoad ? delayedLoader : "") + "\n      " + snippet + "\n    ";

  if (writeKey) {
    setHeadComponents([_react2.default.createElement("script", {
      key: "plugin-rudderstack",
      dangerouslySetInnerHTML: { __html: snippetToUse }
    }), _react2.default.createElement("script", {
      key: "rudderstack-cdn",
      src: "https://cdn.rudderlabs.com/v1/rudder-analytics.min.js"
    })]);
  }
};
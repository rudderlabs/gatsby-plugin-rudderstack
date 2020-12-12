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
      manualLoad = pluginOptions.manualLoad;

  if (!prodKey || prodKey.length < 10) console.error("Your Rudderstack prodKey must be at least 10 char in length.");

  if (devKey && devKey.length < 10) console.error("If present, your Rudderstack devKey must be at least 10 char in length.");

  var writeKey = process.env.NODE_ENV === "production" ? prodKey : devKey;

  var includeTrackPage = !trackPage ? "" : "rudderanalytics.page();";

  var snippet = "rudderanalytics = window.rudderanalytics = [];\n\t\n\tvar  methods = [\n\t\t\"load\",\n\t\t\"page\",\n\t\t\"track\",\n\t\t\"identify\",\n\t\t\"alias\",\n\t\t\"group\",\n\t\t\"ready\",\n\t\t\"reset\",\n\t\t\"getAnonymousId\",\n    \"setAnonymousId\"\n\t];\n\n\tfor (var i = 0; i < methods.length; i++) {\n  \t\tvar method = methods[i];\n  \t\trudderanalytics[method] = function (methodName) {\n    \t\t\treturn function () {\n      \t\t\t\trudderanalytics.push([methodName].concat(Array.prototype.slice.call(arguments)));\n    \t\t\t};\n  \t\t\t}(method);\n\t}\n  " + (delayLoad || manualLoad ? "" : "rudderanalytics.load('" + writeKey + "', '" + host + "')") + ";\n";

  var delayedLoader = "\n      window.rudderSnippetLoaded = false;\n      window.rudderSnippetLoading = false;\n      window.rudderSnippetLoader = function (callback) {\n        if (!window.rudderSnippetLoaded && !window.rudderSnippetLoading) {\n          window.rudderSnippetLoading = true;\n          function loader() {\n            window.rudderanalytics.load('" + writeKey + "');\n            window.rudderSnippetLoading = false;\n            window.rudderSnippetLoaded = true;\n            if(callback) {callback()}\n          };\n          setTimeout(\n            function () {\n              \"requestIdleCallback\" in window\n                ? requestIdleCallback(function () {loader()})\n                : loader();\n            },\n            " + delayLoadTime + " || 1000\n          );\n        }\n      }\n      window.addEventListener('scroll',function () {window.rudderSnippetLoader()}, { once: true });\n    ";

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
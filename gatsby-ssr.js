"use strict";

var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
exports.onRenderBody = function (_ref, pluginOptions) {
  var setHeadComponents = _ref.setHeadComponents;
  var prodKey = pluginOptions.prodKey,
    devKey = pluginOptions.devKey,
    _pluginOptions$dataPl = pluginOptions.dataPlaneUrl,
    dataPlaneUrl = _pluginOptions$dataPl === void 0 ? "https://hosted.rudderlabs.com" : _pluginOptions$dataPl,
    controlPlaneUrl = pluginOptions.controlPlaneUrl,
    delayLoad = pluginOptions.delayLoad,
    delayLoadTime = pluginOptions.delayLoadTime,
    manualLoad = pluginOptions.manualLoad,
    loadType = pluginOptions.loadType,
    sdkURL = pluginOptions.sdkURL,
    _pluginOptions$loadOp = pluginOptions.loadOptions,
    loadOptions = _pluginOptions$loadOp === void 0 ? {} : _pluginOptions$loadOp;
  var sdkSrc = sdkURL || "https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js";
  if (sdkURL) sdkSrc = sdkURL;

  if (!prodKey || prodKey.length < 10) console.error("Your RudderStack prodKey must be at least 10 char in length.");

  if (devKey && devKey.length < 10) console.error("If present, your RudderStack devKey must be at least 10 char in length.");

  var writeKey = process.env.NODE_ENV === "production" ? prodKey : devKey;

  var finalLoadOptions = _objectSpread(_objectSpread({}, loadOptions), {}, {
    configUrl: controlPlaneUrl || loadOptions.configUrl
  });
  var loadConfig = "'".concat(writeKey, "', '").concat(dataPlaneUrl, "', ").concat(JSON.stringify(finalLoadOptions));
  var scriptTagStr = "var s = document.createElement(\"script\");\n    s.type = \"text/javascript\";\n    s.src = \"".concat(sdkSrc, "\";");
  if (loadType === "async") {
    scriptTagStr += "s.async = true;";
  } else if (loadType === "defer") {
    scriptTagStr += "s.defer = true;";
  }
  scriptTagStr += "document.head.appendChild(s);";
  var snippet = "rudderanalytics=window.rudderanalytics=[];for(var methods=[\"load\",\"page\",\"track\",\"identify\",\"alias\",\"group\",\"ready\",\"reset\",\"getAnonymousId\",\"setAnonymousId\"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}\n  ".concat(scriptTagStr, "\n");
  var instantLoader = "".concat(snippet).concat(delayLoad || manualLoad ? "" : "rudderanalytics.load(".concat(loadConfig, ")"), ";");
  var delayedLoader = "\n      window.rudderSnippetLoaded = false;\n      window.rudderSnippetLoading = false;\n      window.rudderSnippetLoadedCallback = undefined;\n      window.rudderSnippetLoader = function (callback) {\n        if (!window.rudderSnippetLoaded && !window.rudderSnippetLoading) {\n          window.rudderSnippetLoading = true;\n          function loader() {\n            ".concat(snippet, "\n            window.rudderanalytics.load(").concat(loadConfig, ");\n            window.rudderSnippetLoading = false;\n            window.rudderSnippetLoaded = true;\n            if (callback) { callback(); }\n            if (window.rudderSnippetLoadedCallback) {\n              window.rudderSnippetLoadedCallback();\n              window.rudderSnippetLoadedCallback = undefined;\n            }\n          };\n\n          \"requestIdleCallback\" in window\n            ? requestIdleCallback(function () { loader(); })\n            : loader();\n        }\n      }\n      window.addEventListener('scroll',function () {window.rudderSnippetLoader()}, { once: true });\n      setTimeout(\n        function () {\n          \"requestIdleCallback\" in window\n            ? requestIdleCallback(function () { window.rudderSnippetLoader(); })\n            : window.rudderSnippetLoader();\n        },\n        ").concat(delayLoadTime, " || 1000\n      );\n      ");

  var snippetToUse = "".concat(delayLoad && !manualLoad ? delayedLoader : instantLoader);

  if (writeKey) {
    var tags = [_react["default"].createElement("script", {
      key: "plugin-rudderstack",
      dangerouslySetInnerHTML: {
        __html: snippetToUse
      }
    })];
    setHeadComponents(tags);
  }
};
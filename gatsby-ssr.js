"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.onRenderBody = function (_ref, pluginOptions) {
  var setHeadComponents = _ref.setHeadComponents;
  var trackPage = pluginOptions.trackPage,
    prodKey = pluginOptions.prodKey,
    devKey = pluginOptions.devKey,
    _pluginOptions$dataPl = pluginOptions.dataPlaneUrl,
    dataPlaneUrl =
      _pluginOptions$dataPl === undefined
        ? "https://hosted.rudderlabs.com"
        : _pluginOptions$dataPl,
    controlPlaneUrl = pluginOptions.controlPlaneUrl,
    delayLoad = pluginOptions.delayLoad,
    delayLoadTime = pluginOptions.delayLoadTime,
    manualLoad = pluginOptions.manualLoad,
    loadType = pluginOptions.loadType,
    useNewSDK = pluginOptions.useNewSDK,
    useBetaSDK = pluginOptions.useBetaSDK,
    loadOptions = pluginOptions.loadOptions,
    sdkURL = pluginOptions.sdkURL;

  var sdkSrc = "https://cdn.rudderlabs.com/v1/rudder-analytics.min.js";
  if (sdkURL) sdkSrc = sdkURL;
  else if (useNewSDK) {
    sdkSrc = "https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js";
  } else if (useBetaSDK) {
    sdkSrc = "https://cdn.rudderlabs.com/v1.1/beta/rudder-analytics.min.js";
  }

  if (!prodKey || prodKey.length < 10)
    console.error(
      "Your RudderStack prodKey must be at least 10 char in length."
    );

  if (devKey && devKey.length < 10)
    console.error(
      "If present, your RudderStack devKey must be at least 10 char in length."
    );

  var writeKey = process.env.NODE_ENV === "production" ? prodKey : devKey;

  var loadConfig = "'" + writeKey + "', '" + dataPlaneUrl + "'";

  if (loadOptions) {
    // Override config URL if provided separately
    loadOptions.configUrl = controlPlaneUrl || loadOptions.configUrl;
    loadConfig += ", " + JSON.stringify(loadOptions);
  }

  var snippet =
    'rudderanalytics=window.rudderanalytics=[];for(var methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}\n  ' +
    (delayLoad || manualLoad
      ? ""
      : "rudderanalytics.load(" + loadConfig + ")") +
    ";\n";

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

  var snippetToUse =
    "\n      " +
    (delayLoad && !manualLoad ? delayedLoader : "") +
    "\n      " +
    snippet +
    "\n    ";

  if (writeKey) {
    var tags = [
      _react2.default.createElement("script", {
        key: "plugin-rudderstack",
        dangerouslySetInnerHTML: { __html: snippetToUse },
      }),
    ];

    var tag = void 0;

    if (loadType == "async") {
      tag = _react2.default.createElement("script", {
        async: true,
        key: "rudderstack-cdn",
        src: sdkSrc,
      });
    } else if (loadType == "defer") {
      tag = _react2.default.createElement("script", {
        defer: true,
        key: "rudderstack-cdn",
        src: sdkSrc,
      });
    } else {
      tag = _react2.default.createElement("script", {
        key: "rudderstack-cdn",
        src: sdkSrc,
      });
    }

    tags.push(tag);
    setHeadComponents(tags);
  }
};

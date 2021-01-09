"use strict";

function loadConfiguration(writeKey, dataPlaneUrl, controlPlaneUrl) {
  if (controlPlaneUrl) {
    return "'" + writeKey + "', '" + dataPlaneUrl + "', {configUrl: '" + controlPlaneUrl + "'}";
  } else {
    return "'" + writeKey + "', '" + dataPlaneUrl + "'";
  }
}
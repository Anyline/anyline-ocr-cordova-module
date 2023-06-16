/**
 * anyline.js
 *
 * Copyright 2019 Anyline Inc.
 * MIT licensed
 */

/**
 * This class exposes anyline scanning functionality to JavaScript.
 *
 * @constructor
 */
function Anyline() {}

Anyline.prototype.checkLicense = function(licenseKey, onSuccess, onFailure) {
  cordova.exec(onSuccess, onFailure, "AnylineSDK", "checkLicense", [licenseKey]);
};

Anyline.prototype.initAnylineSDK = function(licenseKey, onSuccess, onFailure) {
  cordova.exec(onSuccess, onFailure, "AnylineSDK", "initAnylineSDK", [licenseKey]);
};

Anyline.prototype.getSDKVersion = function(onSuccess, onFailure) {
  cordova.exec(onSuccess, onFailure, "AnylineSDK", "getSDKVersion", []);
};

Anyline.prototype.scan = function(config, onSuccess, onFailure) {
  cordova.exec(onSuccess, onFailure, "AnylineSDK", "scan", [config]);
};

/**
 * Plugin setup boilerplate.
 */
module.exports = new Anyline();

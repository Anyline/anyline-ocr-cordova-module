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
function Anyline() {

    const pluginVersion = cordova.require("cordova/plugin_list").metadata['io-anyline-cordova'];
    
    cordova.exec(
        function () {

        },
        function (err) {
            console.error("Version error: " + err)
        },
    "AnylineSDK", "setPluginVersion", [pluginVersion]);
}

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

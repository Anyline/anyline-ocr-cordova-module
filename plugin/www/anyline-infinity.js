/**
 * anyline-infinity.js
 *
 * Copyright 2024 Anyline Inc.
 * MIT licensed
 */

/**
 * Typed, schema-driven Anyline Infinity scanning API for Cordova.
 *
 * Passes JSON-serialized WrapperSession request/response objects directly
 * to the native bridge. Type safety is enforced in the caller's JS layer.
 *
 * @constructor
 */
function AnylineInfinity() {
    this.pluginVersion = cordova.require("cordova/plugin_list").metadata['io-anyline-cordova'];
    this._sessionReady = false;
}

function _setupWrapperSessionOnce(instance, onSuccess, onFailure) {
    if (instance._sessionReady) {
        onSuccess();
        return;
    }
    cordova.exec(function() {
        instance._sessionReady = true;
        onSuccess();
    }, onFailure, "AnylineInfinityPlugin", "setupWrapperSession", [instance.pluginVersion]);
}

/// Returns the plugin version string.
AnylineInfinity.prototype.getPluginVersion = function(onSuccess, onFailure) {
    _setupWrapperSessionOnce(this, () => onSuccess(this.pluginVersion), onFailure);
};

/// Returns the native SDK version string.
AnylineInfinity.prototype.getSDKVersion = function(onSuccess, onFailure) {
    _setupWrapperSessionOnce(this, () => {
        cordova.exec(onSuccess, onFailure, "AnylineInfinityPlugin", "getSDKVersion", []);
    }, onFailure);
};

/// Initializes the Anyline SDK with the supplied request parameters.
AnylineInfinity.prototype.requestSdkInitialization = function(request, onSuccess, onFailure) {
    _setupWrapperSessionOnce(this, () => {
        cordova.exec(
            function(json) { onSuccess(JSON.parse(json)); },
            onFailure,
            "AnylineInfinityPlugin", "requestSdkInitialization", [JSON.stringify(request)]
        );
    }, onFailure);
};

/// Starts a scanning session.
///
/// onScanResponse:  invoked once when the session ends — required.
/// callbacks:       optional object with event handlers for the session:
///                    { onScanResults, onUIElementClicked, ... }
///                  New event handlers can be added to this object in future
///                  releases without breaking existing callers.
///
/// The native bridge multiplexes all callbacks through a single Cordova
/// exec channel using typed payloads: { type: string, data: string }.
AnylineInfinity.prototype.requestScanStart = function(request, onScanResponse, callbacks) {
    const { onScanResults, onUIElementClicked } = callbacks || {};
    const onError = function(err) { if (onScanResponse) { onScanResponse(null, err); } };
    cordova.exec(
        function(payload) {
            if (payload.type === 'scanResponse') {
                if (onScanResponse) { onScanResponse(JSON.parse(payload.data)); }
            } else if (payload.type === 'scanResults') {
                if (onScanResults) { onScanResults(JSON.parse(payload.data)); }
            } else if (payload.type === 'uiElementClicked') {
                if (onUIElementClicked) { onUIElementClicked(JSON.parse(payload.data)); }
            }
        },
        onError,
        "AnylineInfinityPlugin", "requestScanStart", [JSON.stringify(request)]
    );
};

/// Stops the active scanning session.
AnylineInfinity.prototype.requestScanStop = function(request) {
    cordova.exec(
        function() {},
        function() {},
        "AnylineInfinityPlugin", "requestScanStop", [request ? JSON.stringify(request) : null]
    );
};

/// Switches to a new scan mode using the provided scan-start request.
AnylineInfinity.prototype.requestScanSwitchWithScanStartRequestParams = function(request) {
    cordova.exec(
        function() {},
        function() {},
        "AnylineInfinityPlugin", "requestScanSwitchWithScanStartRequestParams", [JSON.stringify(request)]
    );
};

/// Switches to a new scan mode using a raw ScanViewConfig JSON string.
AnylineInfinity.prototype.requestScanSwitchWithScanViewConfigContentString = function(scanViewConfigContentString) {
    cordova.exec(
        function() {},
        function() {},
        "AnylineInfinityPlugin", "requestScanSwitchWithScanViewConfigContentString", [scanViewConfigContentString]
    );
};

/// Submits a User Corrected Result (UCR) report.
AnylineInfinity.prototype.requestUCRReport = function(request, onSuccess, onFailure) {
    cordova.exec(
        function(json) { onSuccess(JSON.parse(json)); },
        onFailure,
        "AnylineInfinityPlugin", "requestUCRReport", [JSON.stringify(request)]
    );
};

/// Exports all cached scan events as a ZIP archive.
AnylineInfinity.prototype.requestExportCachedEvents = function(onSuccess, onFailure) {
    cordova.exec(
        function(json) { onSuccess(JSON.parse(json)); },
        onFailure,
        "AnylineInfinityPlugin", "requestExportCachedEvents", []
    );
};

/**
 * Plugin setup boilerplate.
 */
module.exports = new AnylineInfinity();
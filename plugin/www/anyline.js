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

/**
 * Scan a credit card with card.io.
 *
 *
 * @parameter options: an object; may be {}. Sample options object:
 *   {licenseKey: '', config: {...}}
 *
 * @parameter onSuccess: a callback function that accepts a response object; response keys
 * include ...
 *
 * @parameter onFailure: a zero argument callback function that will be called if the user
 * cancels card scanning.
 */
Anyline.prototype.scan = function(options, onSuccess, onFailure) {
  cordova.exec(onSuccess, onFailure, "AnylineSDK", "scan", [options.licenseKey, options.config]);
};

/**
 * Plugin setup boilerplate.
 */
module.exports = new Anyline();

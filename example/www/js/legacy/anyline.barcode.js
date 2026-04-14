/*
 * Anyline Cordova Plugin
 * anyline.barcode.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}

let continuousResultCallback;
const maxContinuousResultCount = 10;

let continuousResults = "";
let continuousCount = 0;

anyline.barcode = {
  onResult: function (result) {
    changeLoadingState(false);
    // this is called with result of the barcode module
    // the result is a string containing the barcode
    let resultStr = "";
    if (continuousResultCallback) {
      result = JSON.parse('[' + continuousResults + ']');
    } else {
      if (result.barcodeResult) {
        resultStr = result.barcodeResult.value;
      }
    }
    insertScanResult(result, resultStr);
  },

  onError: function (error) {
    changeLoadingState(false);
    // called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      // when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("Barcode scanning canceled");
      return;
    }
    alert(error);
  },

  scan: function (type) {
    // start the barcode scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#barcode for barcode module details

    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);

    let config;
    continuousResultCallback = null;
    if (type === 'PDF417') {
      config = this.barcodePDF417Config;
    } else if (type === 'BARCODE_CONTINUOUS') {
      config = this.barcodeContinuousConfig;

      continuousResultCallback = "onResultCallback";
      continuousResults = "";
      continuousCount = 0;
      window.onResultCallback = function(message) {
        if (continuousResults !== "") {
          continuousResults = continuousResults + ", ";
        }
        continuousResults = continuousResults + message;
        continuousCount++;
        if (continuousCount > maxContinuousResultCount) {
          cordova.exec(anyline.barcode.onResult, anyline.barcode.onError, "AnylineSDK", "tryStopScan", null);
        }

      };
    } else {
      config = this.barcodeConfig;
    }

    if (continuousResultCallback) {
      cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config, null, null, { "callbackConfig": { "onResultEventName": continuousResultCallback} }]);
    } else {
      cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config]);
    }
  },

  barcodeConfig: configLoader.loadJsonConfig('barcodeConfig.json'),
  barcodeContinuousConfig: configLoader.loadJsonConfig('barcodeContinuousConfig.json'),
  barcodePDF417Config: configLoader.loadJsonConfig('barcodePDF417Config.json')
};

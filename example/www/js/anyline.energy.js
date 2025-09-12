/*
 * Anyline Cordova Plugin
 * anyline.energy.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */
if (anyline === undefined) {
  var anyline = {};
}

anyline.energy = {
  onResult: function (result) {
    changeLoadingState(false);
    // this is called for every energy scan result
    // the result is a json-object containing the reading, some metadata,
    // and paths to a cropped and a full image.

    // for this use case, expect either a result from a meter plugin or an ocr plugin
    // each of which needs to be accessed differently.
    var resultText = "";
    if (result.meterResult) {
      resultText = result.meterResult.value;
    } else if (result.ocrResult) {
      resultText = result.ocrResult.text;
    }    
    insertScanResult(result, resultText);
  },

  onError: function (error) {
    changeLoadingState(false);
    // called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      // do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("Energy scanning canceled");
      return;
    }

    alert(error);
  },

  scan: function (scanMode) {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(false);
    console.log("start scan with mode " + scanMode);

    // start the Energy scanning for the given scan mode
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#energy for energy-module details
    var config = this.meterConfig;
    if (scanMode == 'DIAL_METER') {
      config = this.dialConfig;
    } else if (scanMode == 'SERIAL_NUMBER') {
      config = this.serialNumberConfig;
    }
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config]);
  },

  meterConfig: configLoader.loadJsonConfig('meterConfig.json'),
  dialConfig: configLoader.loadJsonConfig('dialConfig.json'),
  serialNumberConfig: configLoader.loadJsonConfig('serialNumberConfig.json'),
};

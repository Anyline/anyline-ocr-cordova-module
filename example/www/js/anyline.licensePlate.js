/*
 * Anyline Cordova Plugin
 * anyline.ocr.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.licensePlate = {
  onResult: function (result) {
    changeLoadingState(false);
    // this is called for every mrz scan result
    // the result is a json-object containing all the scaned values and check-digits
    var resultStr = "";
    if (result.licensePlateResult) {
      resultStr = result.licensePlateResult.plateText;
    }
    insertScanResult(result, resultStr);
  },

  onError: function (error) {
    changeLoadingState(false);
    // called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      // do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("AnylineOcr scanning canceled");
      return;
    }
    alert(error);
  },

  scan: function (type) {
    // start the Anyline OCR scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#anylineOcrModule for module details

    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);

    var config = this.licensePlateConfig;
    if (type == 'US') {
      config = this.licensePlateUSConfig;
    } else if (type == 'AFRICA') {
      config = this.licensePlateAFConfig;
    }

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config, null, { "scanViewConfigPath": "www/assets/config"}]);
  },

  licensePlateConfig: configLoader.loadJsonConfig('licensePlateConfig.json'),
  licensePlateUSConfig: configLoader.loadJsonConfig('licensePlateUSConfig.json'),
  licensePlateAFConfig: configLoader.loadJsonConfig('licensePlateAFConfig.json')
};
/*
 * Anyline Cordova Plugin
 * anyline.ocr.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.ocr = {
  onResult: function (result) {
    changeLoadingState(false);
    // this is called for every mrz scan result
    // the result is a json-object containing all the scaned values and check-digits

    var resultText = "";
    if (result.ocrResult) {
      resultText = result.ocrResult.text;
    } else if (result.containerResult) {
      resultText = result.containerResult.text;
    }
    insertScanResult(result, resultText);
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
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);
    // start the Anyline OCR scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#anylineOcrModule for module details

    var config = this.serialNumberConfig;

    if (type == 'SHIPPING_CONTAINER') {
      config = this.shippingContainerConfig;
    } else if (type == 'SHIPPING_CONTAINER_VERTICAL') {
      config = this.shippingContainerVerticalConfig;
    }

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config]);
  },

  serialNumberConfig: configLoader.loadJsonConfig('serialNumberConfig.json'),
  shippingContainerConfig: configLoader.loadJsonConfig('shippingContainerConfig.json'),
  shippingContainerVerticalConfig: configLoader.loadJsonConfig('shippingContainerVerticalConfig.json'),
};
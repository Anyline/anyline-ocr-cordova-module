/*
 * Anyline Cordova Plugin
 * anyline.mrz.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.mrz = {
  onResult: function (result) {
    changeLoadingState(false);
    insertScanResult(result);
  },

  onError: function (error) {
    changeLoadingState(false);
    // called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      // do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("MRZ scanning canceled");
      return;
    }
    alert(error);
  },

  scan: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);

    // start the MRZ scanning
    var config = this.anylineMRZViewConfig;
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config, null, { "scanViewConfigPath": "www/assets/config"}]);
  },

  anylineMRZViewConfig: configLoader.loadJsonConfig('mrzConfig.json')
};



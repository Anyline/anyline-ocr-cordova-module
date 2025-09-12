/*
 * Anyline Cordova Plugin
 * anyline.universalId.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */
if (anyline === undefined) {
  var anyline = {};
}
anyline.universalId = {
  onResult: function (result) {
    changeLoadingState(false);

    // this is called for every Universal ID scan result
    // the result is a json-object containing all the scaned values and check-digits
    insertScanResult(result);
  },

  onError: function (error) {
    changeLoadingState(false);
    //called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      // do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("Universal ID scanning canceled");
      return;
    }

    alert(error);
  },

  scan: function (scanMode) {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);
    // start the UniversalId scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#universalId for module details

    var config = this.universalIDConfig;

    if (scanMode == 'ARABIC') {
      config = this.arabicIDConfig;
    } else if (scanMode == 'CYRILLIC') {
      config = this.cyrillicIDConfig;
    }

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config]);
  },

  universalIDConfig: configLoader.loadJsonConfig('universalIDConfig.json'),
  cyrillicIDConfig: configLoader.loadJsonConfig('cyrillicIDConfig.json'),
  arabicIDConfig: configLoader.loadJsonConfig('arabicIDConfig.json'),
};
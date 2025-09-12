/*
 * Anyline Cordova Plugin
 * anyline.vehicle.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.vehicle = {
  onResult: function (result) {
    changeLoadingState(false);
    // this is called for every vehicle scan result
    // the result is a json-object containing all the scaned values and check-digits

    var resultStr = "";
    if (result.tinResult) {
      resultStr = result.tinResult.text;
    } else if (result.tireSizeResult) {
      resultStr = result.tireSizeResult.text.text;
    } else if (result.commercialTireIdResult) {
      resultStr = result.commercialTireIdResult.text;
    } else if (result.vinResult) {
      resultStr = result.vinResult.text;
    } else if (result.vehicleRegistrationCertificateResult) {
      resultStr = result.vehicleRegistrationCertificateResult.text;
    }
    insertScanResult(result, resultStr);
  },

  onError: function (error) {
    changeLoadingState(false);
    // called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      // do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("Anyline Vehicle scanning canceled");
      return;
    }
    alert(error);
  },

  scan: function (type) {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);
    // start the Anyline Tire Size scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin

    var config = this.vinConfig;
    if (type == 'COMMERCIAL_TIRE') {
      config = this.commercialTireIDConfig;
    } else if (type == 'TIN') {
      config = this.tinConfig;
    } else if (type == 'TIRE_SIZE') {
      config = this.tireSizeConfig;
    } else if (type == 'TIRE_MAKE') {
      config = this.tireMakeConfig;
    } else if (type == 'ODOMETER') {
      config = this.odometerConfig;
    } else if (type == 'VRC') {
      config = this.vrcConfig;
    }
    
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config]);
  },

  commercialTireIDConfig: configLoader.loadJsonConfig('commercialTireIDConfig.json'),
  tinConfig: configLoader.loadJsonConfig('tinConfig.json'),
  tireSizeConfig: configLoader.loadJsonConfig('tireSizeConfig.json'),
  tireMakeConfig: configLoader.loadJsonConfig('tireMakeConfig.json'),
  vinConfig: configLoader.loadJsonConfig('vinConfig.json'),
  odometerConfig: configLoader.loadJsonConfig('odometerConfig.json'),
  vrcConfig: configLoader.loadJsonConfig('vrcConfig.json')
}
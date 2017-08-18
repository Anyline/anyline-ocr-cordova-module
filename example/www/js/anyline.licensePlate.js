/*
 * Anyline Cordova Plugin
 * anyline.ocr.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.licensePlate = {
  scanMode : null,
  onResult: function (result) {
    //this is called for every mrz scan result
    //the result is a json-object containing all the scaned values and check-digits

    console.log("Result: " + JSON.stringify(result));

    var div = document.getElementById('results');
    var plateResult = '';
    var country = 'No Country Found';

    if(result.text.indexOf('-') > 0 ){
        var licensePlateResult = result.text.split('-');

        plateResult = "<b>Country: </b> " + licensePlateResult[0] + "</p>" +
                      "<b>Plate: </b> " + licensePlateResult[1] + "</p>";
    } else {

        if(this.scanMode && this.scanMode  === "LICENSE_PLATE_AT"){
          country = 'A';
        } else if(this.scanMode  && this.scanMode  === "LICENSE_PLATE_DE"){
          country = 'D';
        }
        plateResult = "<b>Country: </b> " + country + "</p>" +
                      "<b>Plate: </b> " + result.text + "</p>";
    }

    div.innerHTML = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
      + plateResult +
      "<br/><i><b>Confidence:</b> " + result.confidence + "</i>" +
      "<br/><i><b>Outline Points:</b> " + result.outline + "</i>" +
      div.innerHTML;

    document.getElementById("details_scan_modes").removeAttribute("open");
    document.getElementById("details_results").setAttribute("open", "");
    window.scrollTo(0, 0);
  },

  onError: function (error) {
    //called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      //do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("AnylineOcr scanning canceled");
      return;
    }

    alert(error);
  },

  licenseKey: "" +
    "eyJzY29wZSI6WyJCQVJDT0RFIiwiTVJaIiwiRU5FUkdZIiwiQU5ZTElORV9PQ1IiLCJET0NVTUVOVCIs" +
    "IkFMTCJdLCJwbGF0Zm9ybSI6WyJpT1MiLCJBbmRyb2lkIiwiV2luZG93cyJdLCJ2YWxpZCI6IjIwMTct" +
    "MDMtMTUiLCJtYWpvclZlcnNpb24iOiIzIiwiaXNDb21tZXJjaWFsIjpmYWxzZSwidG9sZXJhbmNlRGF5" +
    "cyI6NjAsImlvc0lkZW50aWZpZXIiOlsiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIl0sImFuZHJv" +
    "aWRJZGVudGlmaWVyIjpbImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSJdLCJ3aW5kb3dzSWRlbnRp" +
    "ZmllciI6WyJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiXX0KVThWSHd6U295d3RGZ0oxL1pOY011" +
    "ZnBZT0F6eXRoVzA5ZUhIRDEzZ0RwSTUzUXhuMk52bExyWnllZEsvd2t1UUU0My9MUUMreUVSVlZHS2g1" +
    "N29IVlhuOVdqODE2cDQxYnh0cWx0ODk3WGkzcjhxVUdQekhaNzNnYWlsUEtPYmM5TlYyY0x1ZjVNK01m" +
    "RTQ2ZFJoeGlSUDZPcnk2dXB3U0laS1VEVDBDTjBMQWZxcXd2dW5IOFpIdk5HZE4vSmdlbFRkVlNSckNJ" +
    "bHVPaXliVC82N1ZRMVQ4QzVaWWs1VUdSdEFydW0yRmpGQWdiN1BPbnZ6bmhYeTl3NTVrcC9MUFpDM21E" +
    "OTVCdVNCUFZOSFZNdi9taHFlbUlTcGhTVjBpL0hWU3ZtYlp4VnY4ZVRJT29pM2YwNUJIREcrYWoyaDJJ" +
    "aUJBN1VaK0RZSVZrWjhpYXF2Wk5BPT0=",

  anylineLicensePlateViewConfig: {
    "captureResolution": "1080",
    "cutout": {
      "style": "rect",
      "maxWidthPercent": "80%",
      "maxHeightPercent": "80%",
      "alignment": "center",
      "width": 720,
      "ratioFromSize": {
        "width": 5,
        "height": 1
      },
      "strokeWidth": 2,
      "cornerRadius": 10,
      "strokeColor": "FFFFFF",
      "outerColor": "000000",
      "outerAlpha": 0.3,
      "feedbackStrokeColor": "0099FF"
    },
    "flash": {
      "mode": "manual",
      "alignment": "top_left",
      "imageOn": "flash_on",
      "imageOff": "flash_off"
    },
    "beepOnResult": true,
    "vibrateOnResult": true,
    "blinkAnimationOnResult": true,
    "cancelOnResult": true,
    "visualFeedback": {
      "animation": "traverse_multi",
      "animationDuration": 70,
      "style": "contour_rect",
      "strokeWidth": 2,
      "strokeColor": "0099FF"
    }
  },

  anylineLicensePlateOcrConfig: {
    "scanMode": "AUTO",
    "traineddataFiles": ['assets/GL-Nummernschild-Mtl7_uml.traineddata', 'assets/Arial.traineddata', 'assets/Alte.traineddata', 'assets/deu.traineddata'],
    "minConfidence": 65,
  },

  scanLicensePlates: function (scanMode) {
    // start the Anyline OCR scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#anylineOcrModule for module details


    //Get the right ALE File for License PLate Scan Mode
    switch (scanMode) {
      case "LICENSE_PLATE_AT":
        this.anylineLicensePlateOcrConfig["aleFile"] = "assets/ALEs/license_plates_a.ale"
        break;
      case "LICENSE_PLATE_DE":
        this.anylineLicensePlateOcrConfig["aleFile"] = "assets/ALEs/license_plates_d.ale"
        break;
      default:
        this.anylineLicensePlateOcrConfig["aleFile"] = "assets/ALEs/license_plates.ale"
        break;
    }

    this.scanMode = scanMode;
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "ANYLINE_OCR", [this.licenseKey,
      this.anylineLicensePlateViewConfig, this.anylineLicensePlateOcrConfig
    ]);
  }
};
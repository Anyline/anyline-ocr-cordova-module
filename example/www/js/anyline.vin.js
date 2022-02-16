/*
 * Anyline Cordova Plugin
 * anyline.ocr.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.vin = {
  onResult: function (result) {
    changeLoadingState(false);
    //this is called for every mrz scan result
    //the result is a json-object containing all the scaned values and check-digits

    console.log("Result: " + JSON.stringify(result));

    var div = document.getElementById('results');

    if (div.childElementCount >= 3) {
      div.removeChild(div.childNodes[div.childElementCount - 1]);
    }

    div.innerHTML = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>" +
      "<b>Result: </b> " + result.text
      + "<br/><i><b>Confidence:</b> " + result.confidence + "</i>"
      + "<br/><i><b>Outline Points:</b> " + result.outline + "</i>" + "</p>"
      + div.innerHTML;

    document.getElementById("details_scan_modes").removeAttribute("open");
    document.getElementById("details_results").setAttribute("open", "");
    window.scrollTo(0, 0);
  },

  onError: function (error) {
    changeLoadingState(false);
    //called if an error occurred or the user canceled the scanning
    if (error === "Canceled") {
      //do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("AnylineOcr scanning canceled");
      return;
    }

    alert(error);
  },

  licenseKey: "ew0KICAibGljZW5zZUtleVZlcnNpb24iOiAiMy4wIiwNCiAgImRlYnVnUmVwb3J0aW5nIjogInBpbmciLA0KICAibWFqb3JWZXJzaW9uIjogIjM3IiwNCiAgInNjb3BlIjogWw0KICAgICJBTEwiDQogIF0sDQogICJtYXhEYXlzTm90UmVwb3J0ZWQiOiA1LA0KICAiYWR2YW5jZWRCYXJjb2RlIjogdHJ1ZSwNCiAgIm11bHRpQmFyY29kZSI6IHRydWUsDQogICJzdXBwb3J0ZWRCYXJjb2RlRm9ybWF0cyI6IFsNCiAgICAiQUxMIg0KICBdLA0KICAicGxhdGZvcm0iOiBbDQogICAgImlPUyIsDQogICAgIkFuZHJvaWQiLA0KICAgICJXaW5kb3dzIg0KICBdLA0KICAic2hvd1dhdGVybWFyayI6IHRydWUsDQogICJ0b2xlcmFuY2VEYXlzIjogMzAsDQogICJ2YWxpZCI6ICIyMDIyLTEyLTEyIiwNCiAgImlvc0lkZW50aWZpZXIiOiBbDQogICAgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YS5iZXRhIiwNCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiwNCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhLmdpdGh1YiINCiAgXSwNCiAgImFuZHJvaWRJZGVudGlmaWVyIjogWw0KICAgICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiDQogIF0sDQogICJ3aW5kb3dzSWRlbnRpZmllciI6IFsNCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIg0KICBdDQp9CmhWYktnRE1GSis0RWE0ZXU2dEord2c1NjFGR25UdzNSV2dTZGdTZjliTlZyRitiOXdUVGJPVERZazM5UFBuWHAxTXh4bWVrc3BvcXJtcEt3SnlYSHBkOEJnQktHazdKZkxLOTl1d1BYRFpjS2dDNVlOTTFkS0c0TmQzSFdhSHdkOUUvZlZtQ3dNWGtXMFgvaE1FNlpod3NOYzZoaWRmcVZiRVI2SWZoRVhnWHNzS1Y1ckxzSjJYSzZQc01NMG9JbzR4dnp5WGtOS05sL0wxNDgybnFCQ2RZckxBWnBrS1RMT05BcnhLY3poV20rS3ZuV05uRU1JQ2c2NlBLemMwT3VmT05JUFJPeTIzanl6cnM0Wjh1RG92WC9pNmFXenlXS0o2bkpXd0E1OE5CVC9KS0txck1DYXdrT2cxblRiMVM3cEkwU1cvdVZTZzBLY1E1Y3RVaGNPdz09",

  anylineVINViewConfig: {
    "camera": {
      "captureResolution": "720"
    },
    "flash": {
      "mode": "manual",
      "alignment": "bottom_left",
    },
    "viewPlugin": {
      "plugin": {
        "id": "VIN_ID",
        "ocrPlugin": {
          "vinConfig":{
          }
        }
      },
      "cutoutConfig": {
        "style": "rect",
        "width": 720,
        "alignment": "top_half",
        "maxWidthPercent": "70%",
        "ratioFromSize": {
          "width": 62,
          "height": 9
        },
        "strokeWidth": 1,
        "strokeColor": "FFFFFF",
        "cornerRadius": 2,
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedback": {
        "animation": "traverse_multi",
        "animationDuration": 250,
        "style": "contour_rect",
        "strokeWidth": 2,
        "strokeColor": "0099FF",
        "beepOnResult": false,
        "vibrateOnResult": true,
        "blinkAnimationOnResult": true,
        "cancelOnResult": true
      },
      "cancelOnResult": true,
      "reportingEnabled": true
    }

  },

  scan: function () {
    // start the Anyline OCR scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#anylineOcrModule for module details

    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [
      this.licenseKey,
      this.anylineVINViewConfig
    ]);
  }
};

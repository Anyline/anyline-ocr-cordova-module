/*
 * Anyline Cordova Plugin
 * anyline.mrz.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.mrz = {
  onResult: function (result) {
    localStorage.setItem("hasStartedAnyline", false);
    //this is called for every mrz scan result
    //the result is a json-object containing all the scaned values and check-digits

    console.log("MRZ result: " + JSON.stringify(result));
    var div = document.getElementById('results');

    div.innerHTML = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>" +
      "<b>Name:</b> " + result.surNames + " " + result.givenNames + "<br/>" + "<b>Type:</b> " + result.documentType +
      "<br/><b>Number:</b> " + result.documentNumber + " <b>" +
      "<br/>Country:</b> " + result.nationalityCountryCode + "[" + result.issuingCountryCode + "]" +
      "<br/><b>Day of Birth:</b> " + result.dayOfBirth +
      "<br/><b>Expiration:</b> " + result.expirationDate + "<br/>" +
      "<br/><i><b>Confidence:</b> " + result.confidence + "</i>" +
      "<br/><i><b>Outline Points:</b>" + result.outline + "</i>" +
      "<br/><i><b>Checksum:</b>" + result.allCheckDigitsValid + "</i>" +
      "</p>" + div.innerHTML;


    document.getElementById("details_scan_modes").removeAttribute("open");
    document.getElementById("details_results").setAttribute("open", "");
    window.scrollTo(0, 0);
  },

  onError: function (error) {
    localStorage.setItem("hasStartedAnyline", false);
    //called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      //do stuff when user has canceled
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
    localStorage.setItem("hasStartedAnyline", true);
    // start the MRZ scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#mrz for module details

    var licenseKey = "" +
      "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNv\n" +
      "cmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvbiIsICJpb3NJZGVudGlmaWVy\n" +
      "IjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdLCAibGljZW5zZUtl\n" +
      "eVZlcnNpb24iOiAyLCAibWFqb3JWZXJzaW9uIjogIjMiLCAicGluZ1JlcG9ydGlu\n" +
      "ZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiBdLCAic2Nv\n" +
      "cGUiOiBbICJBTEwiIF0sICJzaG93UG9wVXBBZnRlckV4cGlyeSI6IGZhbHNlLCAi\n" +
      "c2hvd1dhdGVybWFyayI6IHRydWUsICJ0b2xlcmFuY2VEYXlzIjogNjAsICJ2YWxp\n" +
      "ZCI6ICIyMDE4LTExLTEwIiB9CmNsdkt3aUN1RkhjNWU2TDF6Sm9nQWVLU1E2SnFP\n" +
      "ZmZKVjhoTnpOQWtHYTQyV2lGMW9GeGNMdXBqaUs4U3NxNDUKMTNsMWh4VnUxSmVG\n" +
      "aVFaSDdOa2E3MTJ0RnloNHQvc055ZEYvWnBRV3N0YXFDNHB3WVl1R2ltQzJoY1Ur\n" +
      "ZEtObgpIbGNMRk5CUUh2THAxUmNXK2ovOStmdzFCblFOdHB6bGxZcDVTTXI5Qlkv\n" +
      "TXZaY2Rlb1NvZmJKN2orZXBwY0dCCkQ5ZGt6eis3SG9lZC9SUk8weXBMMzZtakI2\n" +
      "LzR3VGw2WndyUk03RWhYSmZsTnVhV1Roa3djZTVOcHdyZG9ENWEKNzJPUE9OTVA0\n" +
      "T0RLZ05ZTGJtMnJKN0VHZEpvMzMrOTh3S0hWTDFyYjdtYXlXNFdYN2lZbFVqOEFZ\n" +
      "US9wV21zNwpZaXBOeUkrRGRGbElKWHdIYjJvb2VRPT0K";

    //mode "scanMRZ" is also still available (for backwards compatibility)
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "MRZ", [licenseKey, {
      "captureResolution": "1080",
      "flash": {
        "mode": "auto",
        "alignment": "bottom_right"
      },
      "cutout": {
        "style": "rect",
        "maxWidthPercent": "90%",
        "maxHeightPercent": "90%",
        "alignment": "center",
        "ratioFromSize": {
          "width": 125,
          "height": 85
        },
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "FFFFFF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "cropPadding": {
          "x": -30,
          "y": -90
        },
        "cropOffset": {
          "x": 0,
          "y": 90
        },
        "feedbackStrokeColor": "0099FF",
        "offset": {
          "x": 0,
          "y": 30
        }
      },
      "beepOnResult": true,
      "vibrateOnResult": true,
      "blinkAnimationOnResult": true,
      "cancelOnResult": true,
      "visualFeedback": {
        "style": "rect",
        "strokeColor": "0099FF",
        "strokeWidth": 2
      },
      "mrz": {
        "strictMode": true
      }
    }]);
  }
};

/*
 * Anyline Cordova Plugin
 * anyline.ocr.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.ocr = {
  onResult: function (result) {
    localStorage.setItem("hasStartedAnyline", false);
    //this is called for every mrz scan result
    //the result is a json-object containing all the scaned values and check-digits

    console.log("Result: " + JSON.stringify(result));
    var div = document.getElementById('results');

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
    localStorage.setItem("hasStartedAnyline", false);
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
  "US9wV21zNwpZaXBOeUkrRGRGbElKWHdIYjJvb2VRPT0K",

  ibanViewConfig: {
    "captureResolution": "1080",
    "cutout": {
      "style": "rect",
      "maxWidthPercent": "80%",
      "maxHeightPercent": "80%",
      "alignment": "center",
      "width": 900,
      "ratioFromSize": {
        "width": 10,
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
      "alignment": "bottom_right"
    },
    "beepOnResult": true,
    "vibrateOnResult": true,
    "blinkAnimationOnResult": true,
    "cancelOnResult": true,
    "visualFeedback": {
      "style": "contour_point",
      "strokeColor": "0099FF",
      "strokeWidth": 2,
      "fillColor": "110099FF"
    }
  },

  ibanOcrConfig: {
    scanMode: 'AUTO',
    tesseractLanguages: ['eng_no_dict', 'deu'],
    traineddataFiles: ['assets/eng_no_dict.traineddata', 'assets/deu.traineddata'],
    charWhitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    validationRegex: '^[A-Z]{2}([0-9A-Z]\\s*){13,32}$',
    minConfidence: 65,
    removeSmallContours: true,
    removeWhitespaces: true
  },

  anylineVoucherCodesViewConfig: {
    "captureResolution": "1080",
    "cutout": {
      "style": "rect",
      "maxWidthPercent": "80%",
      "maxHeightPercent": "80%",
      "alignment": "center",
      "width": 540,
      "ratioFromSize": {
        "width": 4,
        "height": 1
      },
      "strokeWidth": 2,
      "cornerRadius": 10,
      "strokeColor": "FFFFFF",
      "outerColor": "000000",
      "outerAlpha": 0.3
    },
    "flash": {
      "mode": "manual",
      "alignment": "bottom_right"
    },
    "beepOnResult": true,
    "vibrateOnResult": true,
    "blinkAnimationOnResult": true,
    "cancelOnResult": true,
    "visualFeedback": {
      "style": "contour_point",
      "strokeColor": "0099FF",
      "strokeWidth": 3
    }
  },

  anylineVoucherCodesOcrConfig: {
    "scanMode": "AUTO",
    "tesseractLanguages": ["anyline_capitals"],
    "traineddataFiles": ["assets/anyline_capitals.traineddata"],
    "charWhitelist": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    "validationRegex": "[A-Z0-9]{8}$",
    "minConfidence": 85
  },

  scanIban: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    localStorage.setItem("hasStartedAnyline", true);
    // start the Anyline OCR scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#anylineOcrModule for module details

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "ANYLINE_OCR", [this.licenseKey, this.ibanViewConfig,
      this.ibanOcrConfig
    ]);
  },

  scanAnylineVoucherCodes: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    localStorage.setItem("hasStartedAnyline", true);
    // start the Anyline OCR scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#anylineOcrModule for module details

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "ANYLINE_OCR", [this.licenseKey,
      this.anylineVoucherCodesViewConfig, this.anylineVoucherCodesOcrConfig
    ]);
  }
};

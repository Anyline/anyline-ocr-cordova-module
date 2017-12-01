/*
 * Anyline Cordova Plugin
 * anyline.document.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.document = {
  onResult: function (result) {
    localStorage.setItem("hasStartedAnyline", false);
    //this is called for every mrz scan result
    //the result is a json-object containing all the scaned values and check-digits

    console.log("Result: " + JSON.stringify(result));
    var div = document.getElementById('results');

    div.innerHTML = "<p>"
        + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
        + "<img src=\"" + result.fullImagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
        + "<br/><i><b>Outline Points:</b> " + result.outline + "</i>"
        + "</p>" + div.innerHTML;

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

  licenseKey: "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNv\n" +
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

  viewConfig: {
    "captureResolution": "1080",
    "pictureResolution": "1080",
    "cutout": {
      "style": "rect",
      "maxWidthPercent": "100%",
      "maxHeightPercent": "100%",
      "ratioFromSize": {
        "width": 10,
        "height": 15
      },
      "alignment": "center",
      "strokeWidth": 2,
      "cornerRadius": 0,
      "outerAlpha": 0.0,
      "outerColor": "00000000",
      "strokeColor": "00000000"
    },
    "flash": {
      "mode": "manual",
      "alignment": "bottom_left",
      "offset": {
        "x": 10,
        "y": 0
      }
    },
    "visualFeedback": {
      "style": "RECT",
      "strokeColor": "FF0000",
      "animationDuration": 150,
      "cornerRadius": 2,
      "strokeWidth": 4,
    },
    "beepOnResult": false,
    "vibrateOnResult": false,
    "blinkAnimationOnResult": true,
    "cancelOnResult": true,
    "document": {
      "quality" : 90,
      "maxOutputResoultion" : {
        "width" : 1920,
        "height" : 1080
      }
    }
  },

  scan: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    localStorage.setItem("hasStartedAnyline", true);
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "DOCUMENT", [this.licenseKey, this.viewConfig]);
  }
};

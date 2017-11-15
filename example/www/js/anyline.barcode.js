/*
 * Anyline Cordova Plugin
 * anyline.barcode.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}


anyline.barcode = {

  onResult: function (result) {
    //set started to false
    localStorage.setItem("hasStartedAnyline", false);
    //this is called with result of the barcode module
    //the result is a string containing the barcode

    var div = document.getElementById('results');
    console.log("Barcode result: " + JSON.stringify(result));


    div.innerHTML = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/>"
        + "<br/><i><b>Outline Points:</b> " + result.outline + "</i>" + "</br>"
        + "<b>Barcode:</b> " + result.value + "</br>" + "<b>Format </b> " + result.format + "</p>" +
        div.innerHTML;

    document.getElementById("details_scan_modes").removeAttribute("open");
    document.getElementById("details_results").setAttribute("open", "");
    window.scrollTo(0, 0);
  },

  onError: function (error) {
    localStorage.setItem("hasStartedAnyline", false);
    //called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      //when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("Barcode scanning canceled");
      return;
    }

    alert(error);
  },

  scan: function () {
    // start the barcode scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#barcode for barcode module details

    if(localStorage.getItem("hasStartedAnyline") === 'true'){
      return;
    }
    localStorage.setItem("hasStartedAnyline", true);

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


    //mode "scanBarcode" is also still available (for backwards compatibility)
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "BARCODE", [licenseKey, {
      "captureResolution": "720p",

      "cutout": {
        "style": "rect",
        "maxWidthPercent": "80%",
        "maxHeightPercent": "80%",
        "alignment": "center",
        "ratioFromSize": {
          "width": 100,
          "height": 80
        },
        "strokeWidth": 1,
        "cornerRadius": 3,
        "strokeColor": "FFFFFF",
        "outerColor": "000000",
        "outerAlpha": 0.3
      },
      "flash": {
        "mode": "auto",
        "alignment": "bottom_right"
      },
      "visualFeedback": {
        "style": "rect",
        "strokeColor": "0099FF",
        "fillColor": "220099FF",
        "animationDuration": 150
      },
      "beepOnResult": true,
      "vibrateOnResult": true,
      "blinkAnimationOnResult": true,
      "cancelOnResult": true,
      "doneButton": { // iOS only. Android uses hardware back button.
        "title": "OK",
        "type": "rect", // fullwidth, rect
        "cornerRadius": 0,
        //"backgroundColor":"#EEEEEE", // default clearcolor
        "textColor": "FFFFFF",
        "textColorHighlighted": "CCCCCC",
        "fontSize": 33,
        "fontName": "HelveticaNeue",
        "positionXAlignment": "center", // left,right,center - no affect on fullwidth
        "positionYAlignment": "bottom", // top, center, bottom
        "offset": {
          "x": 0, // postive -> right
          "y": -88, // postive -> down
        }
      }
    }]);
  }
};

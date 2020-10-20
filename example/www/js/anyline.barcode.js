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
    changeLoadingState(false);
    //this is called with result of the barcode module
    //the result is a string containing the barcode



     if (result.multiBarcodes) {
       var detailsBarcodes = "";
       for (var i = 0; i < result.multiBarcodes.length; i++) {
         detailsBarcodes += result.multiBarcodes[i].value;
         detailsBarcodes += " (" + result.multiBarcodes[i].barcodeFormat + ")";
         if (i < result.multiBarcodes.length - 1) {
           detailsBarcodes += ", ";
         }
       }
     }

      var div = document.getElementById('results');
         console.log("Barcode result: " + JSON.stringify(result));

         if (div.childElementCount >= 3) {
           div.removeChild(div.childNodes[div.childElementCount - 1]);
         }

    div.innerHTML = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/>"
      + "<br/><i><b>Outline Points:</b> " + result.outline + "</i>" + "</br>"
      + (detailsBarcodes ? "<br/><i><b>Detected Barcodes:</b> " + detailsBarcodes + "</i>" : "<b>Barcode:</b> " + result.value + "</br>" + "<b>Format </b> " + result.format + "</p>")+
      div.innerHTML;

    document.getElementById("details_scan_modes").removeAttribute("open");
    document.getElementById("details_results").setAttribute("open", "");
    window.scrollTo(0, 0);
  },

  onError: function (error) {
    changeLoadingState(false);
    //called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      //when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("Barcode scanning canceled");
      return;
    }

    alert(error);
  },

  barcodeConfig: {
    "camera": {
      "captureResolution": "1080p"
    },
    "flash": {
      "mode": "auto",
      "alignment": "bottom_right"
    },
    "viewPlugin": {
      "plugin": {
        "id": "Barcode_ID",
        "barcodePlugin": {
           "barcodeFormatOptions" : ["CODABAR", "EAN_13", "UPC_A"],
           "multiBarcode": false,
        }
      },
      "cutoutConfig": {
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
        "outerAlpha": 0.3,
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedback": {
        "style": "rect",
        "strokeColor": "0099FF",
        "fillColor": "220099FF",
        "animationDuration": 150,
        "blinkOnResult": true,
        "beepOnResult": true,
        "vibrateOnResult": true
      },
      "cancelOnResult": true
    },
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
  },

  barcodePDF417Config: {
    "camera": {
      "captureResolution": "1080p",
      "zoomGesture": "false",
      "zoomRatio": "1",
      "maxZoomRatio": "0"
    },
    "flash": {
      "mode": "auto",
      "alignment": "bottom_right"
    },
    "viewPlugin": {
      "plugin": {
        "id": "Barcode_ID",
        "barcodePlugin": {
          "barcodeFormatOptions": ["PDF_417"]
        }
      },
      "cutoutConfig": {
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
        "outerAlpha": 0.3,
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedback": {
        "style": "rect",
        "strokeColor": "0099FF",
        "fillColor": "220099FF",
        "animationDuration": 150,
        "blinkOnResult": true,
        "beepOnResult": true,
        "vibrateOnResult": true
      },
      "cancelOnResult": true
    },
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
  },

  scan: function (type) {
    // start the barcode scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#barcode for barcode module details

    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);

    var licenseKey = "eyAiYWR2YW5jZWRCYXJjb2RlIjogdHJ1ZSwgImFsbG93ZWRCYXJjb2RlcyI6ICJFQU58UVJfQ09ERSIsICJhbmRyb2lkSWRlbnRpZmllciI6IFsgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIgXSwgImRlYnVnUmVwb3J0aW5nIjogIm9uIiwgImltYWdlUmVwb3J0Q2FjaGluZyI6IGZhbHNlLCAibGljZW5zZUtleVZlcnNpb24iOiAyLCAibWFqb3JWZXJzaW9uIjogIjIwIiwgIm1heERheXNOb3RSZXBvcnRlZCI6IDAsICJtdWx0aUJhcmNvZGUiOiB0cnVlLCAicGluZ1JlcG9ydGluZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiwgIldpbmRvd3MiIF0sICJzY29wZSI6IFsgIkFMTCIgXSwgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogZmFsc2UsICJzaG93V2F0ZXJtYXJrIjogZmFsc2UsICJ0b2xlcmFuY2VEYXlzIjogMCwgInZhbGlkIjogIjIwMjAtMTItMTIiIH0KeDByaU5GNWtWNWhHVEtqZGF0SWl4VjB4WnU0UEgrdGRFaUtHTURrUUNTVTlpTm5xVTlQNWlMaFRFRkVWU2RvLwplVnJCUWdsWTZmLzBQQjh4RkU3dmhEVlgrWUg1bkR2SDdBQmE1NlBpVHpCalFhak1XU3llQU44Mjc1UmtkTnZDCjZxaGdvZGwxN2djQndMbDRnbzVWcGhJY0lVZjFsU3BJeWgxdkRMN1pvV2lWS2J3U3JuTUl2Z0pwREUvMCtxaysKU2dxaG9PNkJRZ0Y4dmFLaStuYWxSRzMzcHBHU09kdlRNTWxVWUNjVnpNZ3Btd1BMVmszelljNTBJKzdVSU9JTgpZZXF1cUFXd2FXQXdFUVZ6aHVEb0Fva2xZWWVvbkM0N3ZCUHl4eDZCTkxyL2ozMG5PWk93UmtMcnFxM0l5OE02CnNpZE5IVklzRzFpQTBvcmdDL1cwZFE9PQo=";
    var options = (type === 'pdf417') ? this.barcodePDF417Config : this.barcodeConfig;


    //mode "scanBarcode" is also still available (for backwards compatibility)
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [licenseKey, options]);
  }
};


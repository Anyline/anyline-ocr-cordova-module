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



     if (result.barcodes) {
       var detailsBarcodes = "";
       for (var i = 0; i < result.barcodes.length; i++) {
         detailsBarcodes += result.barcodes[i].value;
         detailsBarcodes += " (" + result.barcodes[i].barcodeFormat + ")";
         if (i < result.barcodes.length - 1) {
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
      + (detailsBarcodes ? "<br/><i><b>Detected Barcodes:</b> " + detailsBarcodes + "</i>" : "<b>Barcode:</b> " + result.value + "</br>" + "<b>Format </b> " + result.barcodeFormat + "</p>")+
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
          "alignment": "top_left"
      },
      "viewPlugin": {
          "plugin": {
              "id": "Barcode_ID",
              "barcodePlugin": {
                  "barcodeFormatOptions": ["UPC_E", "EAN_13", "UPC_A", "EAN_8", "AZTEC", "CODABAR", "CODE_11", "CODE_32", "CODE_39", "CODE_93", "CODE_128", "DATABAR", "DATA_MATRIX", "GS1_QR_CODE", "GS1_128", "ITF", "ISBT_128", "MSI", "MICRO_QR", "MICRO_PDF", "PDF_417", "POST_UK",
                      "QR_CODE", "RSS_14", "RSS_EXPANDED", "TRIOPTIC", "USPS_4CB", "US_PLANET", "US_POSTNET"
                  ],
                  "multiBarcode": true
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
      "textColor": "FFFFFF",
      "textColorHighlighted": "CCCCCC",
      "fontSize": 33,
      "fontName": "HelveticaNeue",
      "positionXAlignment": "center", // left,right,center - no affect on fullwidth
      "positionYAlignment": "bottom", // top, center, bottom
      "offset": {
        "x": 0, // postive -> right
        "y": -120, // postive -> down
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

    var licenseKey = "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsCiAgImRlYnVnUmVwb3J0aW5nIjogIm9wdC1vdXQiLAogICJpbWFnZVJlcG9ydENhY2hpbmciOiBmYWxzZSwKICAibWFqb3JWZXJzaW9uIjogIjI1IiwKICAibWF4RGF5c05vdFJlcG9ydGVkIjogNSwKICAiYWR2YW5jZWRCYXJjb2RlIjogdHJ1ZSwKICAibXVsdGlCYXJjb2RlIjogdHJ1ZSwKICAic3VwcG9ydGVkQmFyY29kZUZvcm1hdHMiOiBbCiAgICAiQUxMIgogIF0sCiAgInBpbmdSZXBvcnRpbmciOiB0cnVlLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiLAogICAgIldpbmRvd3MiCiAgXSwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogdHJ1ZSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiA5MCwKICAidmFsaWQiOiAiMjAyMi0wNS0zMCIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhLmJldGEiLAogICAgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiCiAgXSwKICAid2luZG93c0lkZW50aWZpZXIiOiBbCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQp1alBHWTFXU2dhajJIejc2dFpYMkptQ29lMGRFNHRsOXBFNkVhcFZMbFZyUU81bEtrUTh3VDJHZDlHS2l4YU4rRmNhdm1QTUZvY0Q3Tlp0RWRBbGZVREQzZXM5WHBVR2VESjRSaDNUbnQ1aWlyZWE3RjhUbUl0dWdrajN0Y3ZqNktReUlwY3NsN3Y0TFZkNHFNRm1mMWIyM1ZCdHVsVjloY092dGRDbzBvT2VqdEJ2cVdmckM3enRwRkNjaTlueHhoTStvRCtxdEpiZ2NVZ2pHQjExZ1dqcU1NMDUvTkdoK0hESHdjN2tmMXNHR3FiWkhxM3hYRk5FZ1FIamdLR2l6ckNrSjhQNDVscjVKb3JrUVFiQVlqL0VaT3Fvdmd1YlNTRzdzeVBpSklvQUFoWGxwOU5uR2pySkl4Mi92bFNqcUFSRnZZUUIwNHozTEQxeW1JTU5Tanc9PQ==";

    var options = this.barcodeConfig;


    //mode "scanBarcode" is also still available (for backwards compatibility)
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [licenseKey, options]);
  }
};


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
           "barcodeFormatOptions" : ["CODABAR", "EAN_13", "UPC_A"]
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


    var licenseKey = "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsCiAgImRlYnVnUmVwb3J0aW5nIjogIm9wdC1vdXQiLAogICJpbWFnZVJlcG9ydENhY2hpbmciOiBmYWxzZSwKICAibWFqb3JWZXJzaW9uIjogIjI1IiwKICAibWF4RGF5c05vdFJlcG9ydGVkIjogNSwKICAiYWR2YW5jZWRCYXJjb2RlIjogdHJ1ZSwKICAibXVsdGlCYXJjb2RlIjogdHJ1ZSwKICAic3VwcG9ydGVkQmFyY29kZUZvcm1hdHMiOiBbCiAgICAiQUxMIgogIF0sCiAgInBpbmdSZXBvcnRpbmciOiB0cnVlLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiLAogICAgIldpbmRvd3MiCiAgXSwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogdHJ1ZSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiA5MCwKICAidmFsaWQiOiAiMjAyMS0wNS0zMCIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhLmJldGEiLAogICAgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiCiAgXSwKICAid2luZG93c0lkZW50aWZpZXIiOiBbCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQpWaEJrYjJpL1JmcTc4c0FyRlByWHAwcXZHb2s3N3VLa2lDaUlGUEMyclliYzhKNm9IeFkvb2hJQUU0UzhTYVByQkh4dmozVDZGaXVrcjhoa05zVEtBUXoxNTk3RHdVeWpRaWJKNHBSNWVhMGdkZzhpempjdVdNaXdNVDVpdWNnSzFicWZtemxjSnpEdGRQWnh5MXpmd2N4L1hPU1RyOGxIcTVkRElBdUJSNmpVSlBacWl1bnI5ZGZ3K3Uzd1BqR24yZHhVMkFENzIwNlo4OTNDbktIQnFqV25JYTVmcXQrcUVVWGYxZ3RwR1JzaytMK0NqR0U0Yk9lSU1CbVdhK3NDVzZuTUV5RjlSYkxFMmMrbkQwdmpTVVI1U281YWh1S2NheGVmOEIxbDNFYldyTFhUL1h1OVJZUDcrK1lYZDhyejlKcTgwbXMrMzVWUXRvdFVoUlBWSWc9PQ==";

    var options = (type === 'pdf417') ? this.barcodePDF417Config : this.barcodeConfig;


    //mode "scanBarcode" is also still available (for backwards compatibility)
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [licenseKey, options]);
  }
};

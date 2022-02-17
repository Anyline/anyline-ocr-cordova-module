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
        if (result.barcodes[i].parsedPDF417) {
          detailsBarcodes += " - Parsed PDF417: " + JSON.stringify(result.barcodes[i].parsedPDF417);
        }
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
      + (detailsBarcodes ? "<br/><i><b>Detected Barcodes:</b> " + detailsBarcodes + "</i>" : "<b>Barcode:</b> " + result.value + "</br>" + "<b>Format </b> " + result.barcodeFormat + "</p>") +
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
          "barcodeFormatOptions": ["UPC_E", "EAN_13", "UPC_A", "EAN_8", "AZTEC", "CODABAR", "CODE_11", "CODE_32", "CODE_39", "CODE_93", "CODE_128", "DATABAR", "DATA_MATRIX", "GS1_QR_CODE", "GS1_128", "ITF", "ISBT_128", "MSI", "MICRO_QR", "MICRO_PDF", "PDF_417", "POST_UK",
            "QR_CODE", "RSS_14", "RSS_EXPANDED", "TRIOPTIC", "USPS_4CB", "US_PLANET", "US_POSTNET"],
          "enablePDF417Parsing": true
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
          "barcodeFormatOptions": ["PDF_417"],
          "enablePDF417Parsing": true
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

    var licenseKey = "ew0KICAibGljZW5zZUtleVZlcnNpb24iOiAiMy4wIiwNCiAgImRlYnVnUmVwb3J0aW5nIjogInBpbmciLA0KICAibWFqb3JWZXJzaW9uIjogIjM3IiwNCiAgInNjb3BlIjogWw0KICAgICJBTEwiDQogIF0sDQogICJtYXhEYXlzTm90UmVwb3J0ZWQiOiA1LA0KICAiYWR2YW5jZWRCYXJjb2RlIjogdHJ1ZSwNCiAgIm11bHRpQmFyY29kZSI6IHRydWUsDQogICJzdXBwb3J0ZWRCYXJjb2RlRm9ybWF0cyI6IFsNCiAgICAiQUxMIg0KICBdLA0KICAicGxhdGZvcm0iOiBbDQogICAgImlPUyIsDQogICAgIkFuZHJvaWQiLA0KICAgICJXaW5kb3dzIg0KICBdLA0KICAic2hvd1dhdGVybWFyayI6IHRydWUsDQogICJ0b2xlcmFuY2VEYXlzIjogMzAsDQogICJ2YWxpZCI6ICIyMDIyLTEyLTEyIiwNCiAgImlvc0lkZW50aWZpZXIiOiBbDQogICAgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YS5iZXRhIiwNCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiwNCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhLmdpdGh1YiINCiAgXSwNCiAgImFuZHJvaWRJZGVudGlmaWVyIjogWw0KICAgICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiDQogIF0sDQogICJ3aW5kb3dzSWRlbnRpZmllciI6IFsNCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIg0KICBdDQp9CmhWYktnRE1GSis0RWE0ZXU2dEord2c1NjFGR25UdzNSV2dTZGdTZjliTlZyRitiOXdUVGJPVERZazM5UFBuWHAxTXh4bWVrc3BvcXJtcEt3SnlYSHBkOEJnQktHazdKZkxLOTl1d1BYRFpjS2dDNVlOTTFkS0c0TmQzSFdhSHdkOUUvZlZtQ3dNWGtXMFgvaE1FNlpod3NOYzZoaWRmcVZiRVI2SWZoRVhnWHNzS1Y1ckxzSjJYSzZQc01NMG9JbzR4dnp5WGtOS05sL0wxNDgybnFCQ2RZckxBWnBrS1RMT05BcnhLY3poV20rS3ZuV05uRU1JQ2c2NlBLemMwT3VmT05JUFJPeTIzanl6cnM0Wjh1RG92WC9pNmFXenlXS0o2bkpXd0E1OE5CVC9KS0txck1DYXdrT2cxblRiMVM3cEkwU1cvdVZTZzBLY1E1Y3RVaGNPdz09";

    var options = (type === 'pdf417') ? this.barcodePDF417Config : this.barcodeConfig;


    //mode "scanBarcode" is also still available (for backwards compatibility)
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [licenseKey, options]);
  }
};


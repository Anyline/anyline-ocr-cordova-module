/*
 * Anyline Cordova Plugin
 * anyline.barcode.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.barcode = {
  onResult: function (result) {
    changeLoadingState(false);
    // this is called with result of the barcode module
    // the result is a string containing the barcode
    var resultStr = "";
    if (result.barcodeResult) {
      resultStr = result.barcodeResult.value;
    }
    insertScanResult(result, resultStr);
  },

  onError: function (error) {
    changeLoadingState(false);
    // called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      // when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("Barcode scanning canceled");
      return;
    }
    alert(error);
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

    var config = (type === 'PDF417') ? this.barcodePDF417Config : this.barcodeConfig;
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config]);
  },

  barcodeConfig: {
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "barcode",
        "barcodeConfig": {
          "parseAAMVA": false,
          "barcodeFormats": [
            "ALL"
          ]
        },
        "cancelOnResult": true,
        "startScanDelay": 1500
      },
      "cutoutConfig": {
        "animation": "none",
        "maxWidthPercent": "70%",
        "maxHeightPercent": "70%",
        "alignment": "center",
        "ratioFromSize": {
          "width": 3,
          "height": 2
        },
        "offset": {
          "x": 0,
          "y": 0
        },
        "cropOffset": {
          "x": 0,
          "y": 0
        },
        "cropPadding": {
          "x": 0,
          "y": 0
        },
        "cornerRadius": 4,
        "strokeColor": "0099ff",
        "strokeWidth": 2,
        "outerColor": "000000",
        "feedbackStrokeColor": "0099FF",
        "outerAlpha": 0.3
      },
      "scanFeedbackConfig": {
        "style": "none",
        "strokeWidth": 0,
        "strokeColor": "0099FF",
        "fillColor": "330099FF",
        "beepOnResult": false,
        "vibrateOnResult": false,
        "blinkAnimationOnResult": false
      }
    },
    "options": {
      "doneButtonConfig": {
        "title": "OK",
        "type": "rect",
        "cornerRadius": 0,
        "textColor": "FFFFFF",
        "textColorHighlighted": "CCCCCC",
        "fontSize": 33,
        "fontName": "HelveticaNeue",
        "positionXAlignment": "center",
        "positionYAlignment": "bottom",
        "offset": {
          "x": 0,
          "y": -88
        }
      }
    }
  },

  barcodePDF417Config: {
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "barcode_pdf417_aamva",
        "barcodeConfig": {
          "barcodeFormats": [
            "PDF_417"
          ],
          "parseAAMVA": true
        },
        "cancelOnResult": true
      },
      "cutoutConfig": {
        "animation": "none",
        "maxWidthPercent": "75%",
        "maxHeightPercent": "50%",
        "width": 0,
        "alignment": "center",
        "ratioFromSize": {
          "width": 4,
          "height": 1
        },
        "offset": {
          "x": 0,
          "y": 0
        },
        "cropOffset": {
          "x": 0,
          "y": 0
        },
        "cropPadding": {
          "x": 0,
          "y": 0
        },
        "cornerRadius": 4,
        "strokeColor": "0099ff",
        "strokeWidth": 2,
        "outerColor": "000000",
        "feedbackStrokeColor": "0099FF",
        "outerAlpha": 0.3
      },
      "scanFeedbackConfig": {
        "style": "animated_rect",
        "strokeWidth": 2,
        "strokeColor": "000000",
        "fillColor": "330099FF",
        "beepOnResult": false,
        "vibrateOnResult": false,
        "blinkAnimationOnResult": false
      }
    },
    "options": {
      "doneButtonConfig": {
        "title": "OK",
        "type": "rect",
        "cornerRadius": 0,
        "textColor": "FFFFFF",
        "textColorHighlighted": "CCCCCC",
        "fontSize": 33,
        "fontName": "HelveticaNeue",
        "positionXAlignment": "center",
        "positionYAlignment": "bottom",
        "offset": {
          "x": 0,
          "y": -88
        }
      }
    }
  }
};

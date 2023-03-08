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

    var licenseKey = "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6ICIzLjAiLAogICJkZWJ1Z1JlcG9ydGluZyI6ICJwaW5nIiwKICAibWFqb3JWZXJzaW9uIjogIjM3IiwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgIm1heERheXNOb3RSZXBvcnRlZCI6IDUsCiAgImFkdmFuY2VkQmFyY29kZSI6IHRydWUsCiAgIm11bHRpQmFyY29kZSI6IHRydWUsCiAgInN1cHBvcnRlZEJhcmNvZGVGb3JtYXRzIjogWwogICAgIkFMTCIKICBdLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiCiAgXSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiAzMCwKICAidmFsaWQiOiAiMjAyMy0xMi0xMiIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiY29tLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJjb20uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQpxUWxkWFVhSVBHaWhUWlVPL3ljSS9rR0UxcXJ5ZEs1cFh4UUJybk81TFZDaExlK1V3N0tGRkNMNnFSNnptUUVMdG1zVkUxZXJORHdYMW5XY3JtdlhKTFd4N2pjc2l3YXc3SUdubCtQRnd1NnpzS3ZjTTNWMk1peFRDZVBodUQrMzFRRTh1ZE84ZTdYS0NGa0lYd3BwOWdTYk03dDBqYitoTWc2S0dPd0dCVElnajIzVzdFZGdRaGlmZ2tOMGYxMHB4SWVZVzFBK21wcjQ1bTA2Ujc2dWZxSXhsc0lnVDhKbjFKV2haczFWOUFwR25zWUU4c3lVcnZuTXQvaTVvWTJ4YUpZdGE4cnJUZ0Rnc1ZHcUhvNjNrWTVQTllyNlRTWnRNcDBJTDFxTlFIakgrR1loQitIZm9hRzBLVXRkcTVsYW5mU2RESEpzV2F4NUtTQ01OdVNOZUE9PQ==";
    var options = (type === 'PDF417') ? this.barcodePDF417Config : this.barcodeConfig;

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [options]);
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

/*
 * Anyline Cordova Plugin
 * anyline.ocr.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.ocr = {
  onResult: function (result) {
    changeLoadingState(false);
    // this is called for every mrz scan result
    // the result is a json-object containing all the scaned values and check-digits

    var resultText = "";
    if (result.ocrResult) {
      resultText = result.ocrResult.text;
    } else if (result.containerResult) {
      resultText = result.containerResult.text;
    }
    insertScanResult(result, resultText);
  },

  onError: function (error) {
    changeLoadingState(false);
    // called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      // do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("AnylineOcr scanning canceled");
      return;
    }
    alert(error);
  },

  scan: function (type) {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);
    // start the Anyline OCR scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#anylineOcrModule for module details

    var config = this.serialNumberConfig;

    if (type == 'SHIPPING_CONTAINER') {
      config = this.shippingContainerConfig;
    } else if (type == 'SHIPPING_CONTAINER_VERTICAL') {
      config = this.shippingContainerVerticalConfig;
    }

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config]);
  },

  licenseKey: "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6ICIzLjAiLAogICJkZWJ1Z1JlcG9ydGluZyI6ICJwaW5nIiwKICAibWFqb3JWZXJzaW9uIjogIjM3IiwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgIm1heERheXNOb3RSZXBvcnRlZCI6IDUsCiAgImFkdmFuY2VkQmFyY29kZSI6IHRydWUsCiAgIm11bHRpQmFyY29kZSI6IHRydWUsCiAgInN1cHBvcnRlZEJhcmNvZGVGb3JtYXRzIjogWwogICAgIkFMTCIKICBdLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiCiAgXSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiAzMCwKICAidmFsaWQiOiAiMjAyMy0xMi0xMiIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiY29tLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJjb20uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQpxUWxkWFVhSVBHaWhUWlVPL3ljSS9rR0UxcXJ5ZEs1cFh4UUJybk81TFZDaExlK1V3N0tGRkNMNnFSNnptUUVMdG1zVkUxZXJORHdYMW5XY3JtdlhKTFd4N2pjc2l3YXc3SUdubCtQRnd1NnpzS3ZjTTNWMk1peFRDZVBodUQrMzFRRTh1ZE84ZTdYS0NGa0lYd3BwOWdTYk03dDBqYitoTWc2S0dPd0dCVElnajIzVzdFZGdRaGlmZ2tOMGYxMHB4SWVZVzFBK21wcjQ1bTA2Ujc2dWZxSXhsc0lnVDhKbjFKV2haczFWOUFwR25zWUU4c3lVcnZuTXQvaTVvWTJ4YUpZdGE4cnJUZ0Rnc1ZHcUhvNjNrWTVQTllyNlRTWnRNcDBJTDFxTlFIakgrR1loQitIZm9hRzBLVXRkcTVsYW5mU2RESEpzV2F4NUtTQ01OdVNOZUE9PQ==",

  serialNumberConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -88
      }
    },
    "cameraConfig": {
      "captureResolution": "1080p",
      "pictureResolution": "1080p",
      "zoomGesture": true
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "top_right"
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "universal_serial_number",
        "ocrConfig": {
          "scanMode": "AUTO",
          "model": "USNr.any"
        },
        "cancelOnResult": true
      },
      "cutoutConfig": {
        "animation": "none",
        "maxWidthPercent": "80%",
        "alignment": "top_half",
        "ratioFromSize": {
          "width": 5,
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
        "style": "rect",
        "strokeWidth": 2,
        "cornerRadius": 2,
        "strokeColor": "0099FF",
        "fillColor": "330099FF",
        "beepOnResult": true,
        "vibrateOnResult": true,
        "blinkAnimationOnResult": false
      }
    }
  },

  shippingContainerConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -88
      }
    },
    "cameraConfig": {
      "captureResolution": "1080p",
      "pictureResolution": "1080p",
      "zoomGesture": true
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "top_right"
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "horizontal_container",
        "containerConfig": {
          "scanMode": "HORIZONTAL"
        },
        "cancelOnResult": true
      },
      "cutoutConfig": {
        "style": "rect",
        "animation": "none",
        "maxWidthPercent": "70%",
        "alignment": "top_half",
        "ratioFromSize": {
          "width": 62,
          "height": 9
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
        "style": "contour_rect",
        "animation": "traverse_multi",
        "animationDuration": 250,
        "strokeWidth": 2,
        "cornerRadius": 2,
        "strokeColor": "0099FF",
        "fillColor": "330099FF",
        "beepOnResult": true,
        "vibrateOnResult": true,
        "blinkAnimationOnResult": true
      }
    }
  },

  shippingContainerVerticalConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -88
      }
    },
    "cameraConfig": {
      "captureResolution": "1080p",
      "pictureResolution": "1080p",
      "zoomGesture": true
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "top_right"
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "vertical_container",
        "containerConfig": {
          "scanMode": "VERTICAL"
        },
        "cancelOnResult": true
      },
      "cutoutConfig": {
        "style": "rect",
        "animation": "none",
        "maxWidthPercent": "10%",
        "alignment": "center",
        "ratioFromSize": {
          "width": 9,
          "height": 62
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
        "style": "contour_rect",
        "animation": "traverse_multi",
        "animationDuration": 250,
        "strokeWidth": 2,
        "cornerRadius": 2,
        "strokeColor": "0099FF",
        "fillColor": "330099FF",
        "beepOnResult": true,
        "vibrateOnResult": true,
        "blinkAnimationOnResult": true
      }
    }
  },
};
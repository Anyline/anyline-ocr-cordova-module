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
        "id": "meter_serial_number",
        "ocrConfig": {
          "scanMode": "auto"
        },
        "cancelOnResult": true
      },
      "cutoutConfig": {
        "animation": "none",
        "maxWidthPercent": "80%",
        "alignment": "top_half",
        "ratioFromSize": {
          "width": 2,
          "height": 1
        },
        "offset": {
          "x": 0,
          "y": -15
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
        "animation": "none",
        "maxWidthPercent": "80%",
        "alignment": "top_half",
        "ratioFromSize": {
          "width": 5,
          "height": 1
        },
        "offset": {
          "x": 0,
          "y": -15
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
        "animation": "none",
        "maxWidthPercent": "10%",
        "alignment": "center",
        "ratioFromSize": {
          "width": 15,
          "height": 100
        },
        "offset": {
          "x": 0,
          "y": -15
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
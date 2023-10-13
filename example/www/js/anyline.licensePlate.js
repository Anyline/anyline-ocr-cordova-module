/*
 * Anyline Cordova Plugin
 * anyline.ocr.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.licensePlate = {
  onResult: function (result) {
    changeLoadingState(false);
    // this is called for every mrz scan result
    // the result is a json-object containing all the scaned values and check-digits
    var resultStr = "";
    if (result.licensePlateResult) {
      resultStr = result.licensePlateResult.plateText;
    }
    insertScanResult(result, resultStr);
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
    // start the Anyline OCR scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#anylineOcrModule for module details

    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);

    var config = this.licensePlateConfig;
    if (type == 'US') {
      config = this.licensePlateUSConfig;
    } else if (type == 'AFRICA') {
      config = this.licensePlateAFConfig;
    }

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config]);
  },

  licensePlateConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -96
      },
      "segmentConfig": {
        "titles": ["Auto", "US", "Africa"],
        "modes": ["auto", "unitedstates", "africa"],
        "offset.y": -24,
        "tintColor": "0099ff"
      }
    },
    "cameraConfig": {
      "captureResolution": "1080p"
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "top_left"
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "license_plate",
        "licensePlateConfig": {
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
          "y": 0
        },
        "cropPadding": {
          "x": 0,
          "y": 0
        },
        "cropOffset": {
          "x": 0,
          "y": 0
        },
        "cornerRadius": 4,
        "strokeColor": "0099ff",
        "strokeWidth": 2,
        "feedbackStrokeColor": "0099ff",
        "outerColor": "000000",
        "outerAlpha": 0.3
      },
      "scanFeedbackConfig": {
        "style": "rect",
        "strokeWidth": 2,
        "animationDuration": 0,
        "strokeColor": "0099ff",
        "cornerRadius": 0,
        "fillColor": "330099ff",
        "beepOnResult": true,
        "vibrateOnResult": true,
        "blinkAnimationOnResult": true
      }
    }
  },

  licensePlateUSConfig: {
    "cameraConfig": {
      "captureResolution": "1080p"
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "top_left"
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "license_plate_us",
        "licensePlateConfig": {
          "scanMode": "unitedstates"
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
          "y": 0
        },
        "cropPadding": {
          "x": 0,
          "y": 0
        },
        "cropOffset": {
          "x": 0,
          "y": 0
        },
        "cornerRadius": 4,
        "strokeColor": "0099ff",
        "strokeWidth": 2,
        "feedbackStrokeColor": "0099ff",
        "outerColor": "000000",
        "outerAlpha": 0.3
      },
      "scanFeedbackConfig": {
        "style": "rect",
        "strokeWidth": 2,
        "animationDuration": 0,
        "strokeColor": "0099ff",
        "cornerRadius": 0,
        "fillColor": "330099ff",
        "beepOnResult": true,
        "vibrateOnResult": true,
        "blinkAnimationOnResult": true
      }
    }
  },

  licensePlateAFConfig: {
    "cameraConfig": {
      "captureResolution": "1080p"
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "top_left"
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "license_plate_africa",
        "licensePlateConfig": {
          "scanMode": "africa"
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
          "y": 0
        },
        "cropPadding": {
          "x": 0,
          "y": 0
        },
        "cropOffset": {
          "x": 0,
          "y": 0
        },
        "cornerRadius": 4,
        "strokeColor": "0099ff",
        "strokeWidth": 2,
        "feedbackStrokeColor": "0099ff",
        "outerColor": "000000",
        "outerAlpha": 0.3
      },
      "scanFeedbackConfig": {
        "style": "rect",
        "strokeWidth": 2,
        "animationDuration": 0,
        "strokeColor": "0099ff",
        "cornerRadius": 0,
        "fillColor": "330099ff",
        "beepOnResult": true,
        "vibrateOnResult": true,
        "blinkAnimationOnResult": true
      }
    }
  }
};
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

    cordova.exec(
      this.onResult,
      this.onError,
      "AnylineSDK",
      "scan", [config]
    );
  },

  licenseKey: "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6ICIzLjAiLAogICJkZWJ1Z1JlcG9ydGluZyI6ICJwaW5nIiwKICAibWFqb3JWZXJzaW9uIjogIjM3IiwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgIm1heERheXNOb3RSZXBvcnRlZCI6IDUsCiAgImFkdmFuY2VkQmFyY29kZSI6IHRydWUsCiAgIm11bHRpQmFyY29kZSI6IHRydWUsCiAgInN1cHBvcnRlZEJhcmNvZGVGb3JtYXRzIjogWwogICAgIkFMTCIKICBdLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiCiAgXSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiAzMCwKICAidmFsaWQiOiAiMjAyMy0xMi0xMiIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiY29tLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJjb20uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQpxUWxkWFVhSVBHaWhUWlVPL3ljSS9rR0UxcXJ5ZEs1cFh4UUJybk81TFZDaExlK1V3N0tGRkNMNnFSNnptUUVMdG1zVkUxZXJORHdYMW5XY3JtdlhKTFd4N2pjc2l3YXc3SUdubCtQRnd1NnpzS3ZjTTNWMk1peFRDZVBodUQrMzFRRTh1ZE84ZTdYS0NGa0lYd3BwOWdTYk03dDBqYitoTWc2S0dPd0dCVElnajIzVzdFZGdRaGlmZ2tOMGYxMHB4SWVZVzFBK21wcjQ1bTA2Ujc2dWZxSXhsc0lnVDhKbjFKV2haczFWOUFwR25zWUU4c3lVcnZuTXQvaTVvWTJ4YUpZdGE4cnJUZ0Rnc1ZHcUhvNjNrWTVQTllyNlRTWnRNcDBJTDFxTlFIakgrR1loQitIZm9hRzBLVXRkcTVsYW5mU2RESEpzV2F4NUtTQ01OdVNOZUE9PQ==",

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
        "maxWidthPercent": "85%",
        "maxHeightPercent": "80%",
        "alignment": "top_half",
        "ratioFromSize": {
          "width": 7,
          "height": 2
        },
        "offset": {
          "x": 0,
          "y": 40
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
        "maxHeightPercent": "80%",
        "alignment": "top_half",
        "ratioFromSize": {
          "width": 3,
          "height": 1
        },
        "offset": {
          "x": 0,
          "y": 40
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
        "maxWidthPercent": "85%",
        "maxHeightPercent": "85%",
        "alignment": "top_half",
        "ratioFromSize": {
          "width": 3,
          "height": 1
        },
        "offset": {
          "x": 0,
          "y": 40
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
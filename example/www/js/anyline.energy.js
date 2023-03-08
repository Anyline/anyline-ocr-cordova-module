/*
 * Anyline Cordova Plugin
 * anyline.energy.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */
if (anyline === undefined) {
  var anyline = {};
}

anyline.energy = {
  onResult: function (result) {
    changeLoadingState(false);
    // this is called for every energy scan result
    // the result is a json-object containing the reading, some metadata,
    // and paths to a cropped and a full image.

    // for this use case, expect either a result from a meter plugin or an ocr plugin
    // each of which needs to be accessed differently.
    var resultText = "";
    if (result.meterResult) {
      resultText = result.meterResult.value;
    } else if (result.ocrResult) {
      resultText = result.ocrResult.text;
    }    
    insertScanResult(result, resultText);
  },

  onError: function (error) {
    changeLoadingState(false);
    // called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      // do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("Energy scanning canceled");
      return;
    }

    alert(error);
  },

  scan: function (scanMode) {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(false);
    console.log("start scan with mode " + scanMode);

    // start the Energy scanning for the given scan mode
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#energy for energy-module details
    var config = this.meterConfig;
    if (scanMode == 'DIAL_METER') {
      config = this.dialConfig;
    } else if (scanMode == 'SERIAL_NUMBER') {
      config = this.serialNumberConfig;
    }
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config]);
  },

  licenseKey: "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6ICIzLjAiLAogICJkZWJ1Z1JlcG9ydGluZyI6ICJwaW5nIiwKICAibWFqb3JWZXJzaW9uIjogIjM3IiwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgIm1heERheXNOb3RSZXBvcnRlZCI6IDUsCiAgImFkdmFuY2VkQmFyY29kZSI6IHRydWUsCiAgIm11bHRpQmFyY29kZSI6IHRydWUsCiAgInN1cHBvcnRlZEJhcmNvZGVGb3JtYXRzIjogWwogICAgIkFMTCIKICBdLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiCiAgXSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiAzMCwKICAidmFsaWQiOiAiMjAyMy0xMi0xMiIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiY29tLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJjb20uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQpxUWxkWFVhSVBHaWhUWlVPL3ljSS9rR0UxcXJ5ZEs1cFh4UUJybk81TFZDaExlK1V3N0tGRkNMNnFSNnptUUVMdG1zVkUxZXJORHdYMW5XY3JtdlhKTFd4N2pjc2l3YXc3SUdubCtQRnd1NnpzS3ZjTTNWMk1peFRDZVBodUQrMzFRRTh1ZE84ZTdYS0NGa0lYd3BwOWdTYk03dDBqYitoTWc2S0dPd0dCVElnajIzVzdFZGdRaGlmZ2tOMGYxMHB4SWVZVzFBK21wcjQ1bTA2Ujc2dWZxSXhsc0lnVDhKbjFKV2haczFWOUFwR25zWUU4c3lVcnZuTXQvaTVvWTJ4YUpZdGE4cnJUZ0Rnc1ZHcUhvNjNrWTVQTllyNlRTWnRNcDBJTDFxTlFIakgrR1loQitIZm9hRzBLVXRkcTVsYW5mU2RESEpzV2F4NUtTQ01OdVNOZUE9PQ==",

  meterConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -96
      },
      "labelConfig": {
        "text": "Position your meter inside the box",
        "color": "f0f0f0",
        "size": 12,
        "offset.y": -10,
      },
      "segmentConfig": {
        "titles": ["Analog", "Digital", "Dial"],
        "modes": ["auto_analog_digital_meter", "auto_analog_digital_meter", "dial_meter"],
        "offset.y": -24,
        "tintColor": "0099ff"
      },
      "nativeBarcodeScanningFormats": [
        "CODE_128",
        "CODE_39",
        "QR_CODE",
        "PDF_417"
      ]
    },
    "cameraConfig": {
      "captureResolution": "1080p",
      "pictureResolution": "1080p"
    },
    "flashConfig": {
      "mode": "manual_off",
      "alignment": "top_left"
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "auto_meter",
        "meterConfig": {
          "scanMode": "auto_analog_digital_meter"
        },
        "cancelOnResult": true
      },
      "cutoutConfig": {
        "style": "rect",
        "maxWidthPercent": "100%",
        "width": 768,
        "alignment": "top_half",
        "ratioFromSize": {
          "width": 9,
          "height": 4
        },
        "offset": {
          "x": 0,
          "y": 80
        },
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "0099FF",
        "outerColor": "000000",
        "outerAlpha": 0.3
      },
      "scanFeedbackConfig": {
        "style": "contour_rect",
        "strokeWidth": 2,
        "strokeColor": "0099FF",
        "fillColor": "220099FF",
        "cornerRadius": 2,
        "beepOnResult": true,
        "vibrateOnResult": true,
        "blinkAnimationOnResult": true,
        "redrawTimeout": 200,
        "animationDuration": 75
      }
    }
  },

  dialConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -96
      },
      "segmentConfig": {
        "titles": ["Analog", "Digital", "Dial"],
        "modes": ["auto_analog_digital_meter", "auto_analog_digital_meter", "dial_meter"],
        "offset.y": -24,
        "tintColor": "0099ff"
      },
      "nativeBarcodeScanningFormats": [
        "CODE_128",
        "CODE_39",
        "QR_CODE",
        "PDF_417"
      ]
    },
    "cameraConfig": {
      "captureResolution": "1080p",
      "pictureResolution": "1080p"
    },
    "flashConfig": {
      "mode": "manual_off",
      "alignment": "top_left"
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "dial_meter",
        "meterConfig": {
          "scanMode": "dial_meter"
        },
        "cancelOnResult": true
      },
      "cutoutConfig": {
        "style": "rect",
        "maxWidthPercent": "100%",
        "width": 768,
        "alignment": "top_half",
        "ratioFromSize": {
          "width": 9,
          "height": 4
        },
        "offset": {
          "x": 0,
          "y": 80
        },
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "0099FF",
        "outerColor": "000000",
        "outerAlpha": 0.3
      },
      "scanFeedbackConfig": {
        "style": "contour_rect",
        "strokeWidth": 2,
        "strokeColor": "0099FF",
        "fillColor": "220099FF",
        "cornerRadius": 2,
        "beepOnResult": true,
        "vibrateOnResult": true,
        "blinkAnimationOnResult": true,
        "redrawTimeout": 200,
        "animationDuration": 75
      }
    }
  },

  serialNumberConfig: {
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
};

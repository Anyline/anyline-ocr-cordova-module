/*
 * Anyline Cordova Plugin
 * anyline.ocr.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.compositeScan = {
  onResult: function (result) {
    changeLoadingState(false);
    // this is called for every mrz scan result
    // the result is a json-object containing all the scaned values and check-digits
    insertScanResult(result);
  },

  onError: function (error) {
    changeLoadingState(false);
    //called if an error occurred or the user canceled the scanning
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

    var config = this.sequentialScanConfig;
    if (type == 'PARALLEL') {
      config = this.parallelScanConfig;
    }

    cordova.exec(
      this.onResult,
      this.onError,
      "AnylineSDK",
      "scan", [config]
    );
  },

  licenseKey: "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6ICIzLjAiLAogICJkZWJ1Z1JlcG9ydGluZyI6ICJwaW5nIiwKICAibWFqb3JWZXJzaW9uIjogIjM3IiwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgIm1heERheXNOb3RSZXBvcnRlZCI6IDUsCiAgImFkdmFuY2VkQmFyY29kZSI6IHRydWUsCiAgIm11bHRpQmFyY29kZSI6IHRydWUsCiAgInN1cHBvcnRlZEJhcmNvZGVGb3JtYXRzIjogWwogICAgIkFMTCIKICBdLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiCiAgXSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiAzMCwKICAidmFsaWQiOiAiMjAyMy0xMi0xMiIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiY29tLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJjb20uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQpxUWxkWFVhSVBHaWhUWlVPL3ljSS9rR0UxcXJ5ZEs1cFh4UUJybk81TFZDaExlK1V3N0tGRkNMNnFSNnptUUVMdG1zVkUxZXJORHdYMW5XY3JtdlhKTFd4N2pjc2l3YXc3SUdubCtQRnd1NnpzS3ZjTTNWMk1peFRDZVBodUQrMzFRRTh1ZE84ZTdYS0NGa0lYd3BwOWdTYk03dDBqYitoTWc2S0dPd0dCVElnajIzVzdFZGdRaGlmZ2tOMGYxMHB4SWVZVzFBK21wcjQ1bTA2Ujc2dWZxSXhsc0lnVDhKbjFKV2haczFWOUFwR25zWUU4c3lVcnZuTXQvaTVvWTJ4YUpZdGE4cnJUZ0Rnc1ZHcUhvNjNrWTVQTllyNlRTWnRNcDBJTDFxTlFIakgrR1loQitIZm9hRzBLVXRkcTVsYW5mU2RESEpzV2F4NUtTQ01OdVNOZUE9PQ==",

  parallelScanConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -88
      }
    },
    "viewPluginCompositeConfig": {
      "id": "meter_serialnumber_parallel",
      "processingMode": "parallel",
      "viewPlugins": [
        {
          "viewPluginConfig": {
            "pluginConfig": {
              "id": "meter",
              "meterConfig": {
                "scanMode": "auto_analog_digital_meter"
              },
              "cancelOnResult": true,
              "startScanDelay": 0
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
        {
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
              "alignment": "center",
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
        }
      ]
    }
  },

  sequentialScanConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -88
      }
    },
    "cameraConfig": {
      "captureResolution": "1080p"
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "top_left"
    },
    "viewPluginCompositeConfig": {
      "id": "licenseplate_driverlicense_vin_sequential",
      "processingMode": "sequential",
      "viewPlugins": [
        {
          "viewPluginConfig": {
            "pluginConfig": {
              "id": "license_plate_eu",
              "licensePlateConfig": {
                "scanMode": "auto"
              },
              "cancelOnResult": true
            },
            "cutoutConfig": {
              "animation": "none",
              "maxWidthPercent": "80%",
              "maxHeightPercent": "80%",
              "alignment": "top_half",
              "ratioFromSize": {
                "width": 4,
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
              "vibrateOnResult": true
            }
          }
        },
        {
          "viewPluginConfig": {
            "pluginConfig": {
              "id": "driver_license_eu",
              "universalIdConfig": {
                "allowedLayouts": {
                  "drivingLicense": []
                },
                "alphabet": "latin"
              },
              "cancelOnResult": true
            },
            "cutoutConfig": {
              "style": "animated_rect",
              "maxWidthPercent": "90%",
              "maxHeightPercent": "90%",
              "alignment": "center",
              "strokeWidth": 2,
              "cornerRadius": 4,
              "strokeColor": "0099FF",
              "outerColor": "000000",
              "outerAlpha": 0.3,
              "ratioFromSize": {
                "width": 50,
                "height": 31
              },
              "cropPadding": {
                "x": 25,
                "y": 25
              },
              "cropOffset": {
                "x": 0,
                "y": 0
              },
              "feedbackStrokeColor": "0099FF"
            },
            "scanFeedbackConfig": {
              "style": "CONTOUR_RECT",
              "visualFeedbackRedrawTimeout": 100,
              "strokeColor": "0099FF",
              "fillColor": "220099FF",
              "beepOnResult": true,
              "vibrateOnResult": true,
              "strokeWidth": 2
            }
          }
        },
        {
          "viewPluginConfig": {
            "pluginConfig": {
              "id": "vin",
              "vinConfig": {},
              "cancelOnResult": true
            },
            "cutoutConfig": {
              "animation": "none",
              "maxWidthPercent": "90%",
              "maxHeightPercent": "100%",
              "width": 0,
              "alignment": "top_half",
              "ratioFromSize": {
                "width": 11,
                "height": 2
              },
              "offset": { "x": 0, "y": 0 },
              "cropOffset": { "x": 0, "y": 0 },
              "cropPadding": { "x": 0, "y": 0 },
              "cornerRadius": 2,
              "strokeColor": "0099ff",
              "strokeWidth": 2,
              "outerColor": "000000",
              "feedbackStrokeColor": "0099FF",
              "outerAlpha": 0.3
            },
            "scanFeedbackConfig": {
              "style": "contour_rect",
              "strokeWidth": 2,
              "cornerRadius": 2,
              "strokeColor": "0099FF",
              "fillColor": "330099FF",
              "beepOnResult": true,
              "vibrateOnResult": true
            }
          }
        }
      ]
    }
  },

};


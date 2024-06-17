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

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config]);
  },

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
              "id": "meter_serial_number",
              "ocrConfig": {
                "scanMode": "auto"
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
            },
            "uiFeedbackConfig": {
              "presets": [
                {
                  "presetName": "simple_instruction_label",
                  "presetAttributes": [
                    {
                      "attributeName": "instruction_text",
                      "attributeValue": "Position the entire License Plate within the cutout"
                    }
                  ]
                }
              ]
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
            },
            "uiFeedbackConfig": {
              "presets": [
                {
                  "presetName": "simple_instruction_label",
                  "presetAttributes": [
                    {
                      "attributeName": "instruction_text",
                      "attributeValue": "Position the entire Driving License within the cutout"
                    }
                  ]
                }
              ]
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
            },
            "uiFeedbackConfig": {
              "presets": [
                {
                  "presetName": "simple_instruction_label",
                  "presetAttributes": [
                    {
                      "attributeName": "instruction_text",
                      "attributeValue": "Position the VIN within the cutout"
                    }
                  ]
                }
              ]
            }
          }
        }
      ]
    }
  },

};


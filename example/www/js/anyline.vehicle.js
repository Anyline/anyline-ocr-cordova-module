/*
 * Anyline Cordova Plugin
 * anyline.vehicle.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.vehicle = {
  onResult: function (result) {
    changeLoadingState(false);
    // this is called for every vehicle scan result
    // the result is a json-object containing all the scaned values and check-digits

    var resultStr = "";
    if (result.tinResult) {
      resultStr = result.tinResult.text;
    } else if (result.tireSizeResult) {
      resultStr = result.tireSizeResult.text.text;
    } else if (result.commercialTireIdResult) {
      resultStr = result.commercialTireIdResult.text;
    } else if (result.vinResult) {
      resultStr = result.vinResult.text;
    } else if (result.vehicleRegistrationCertificateResult) {
      resultStr = result.vehicleRegistrationCertificateResult.text;
    }
    insertScanResult(result, resultStr);
  },

  onError: function (error) {
    changeLoadingState(false);
    // called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      // do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("Anyline Vehicle scanning canceled");
      return;
    }
    alert(error);
  },

  scan: function (type) {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);
    // start the Anyline Tire Size scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin

    var config = this.vinConfig;
    if (type == 'COMMERCIAL_TIRE') {
      config = this.commercialTireIDConfig;
    } else if (type == 'TIN') {
      config = this.tinConfig;
    } else if (type == 'TIRE_SIZE') {
      config = this.tireSizeConfig;
    } else if (type == 'TIRE_MAKE') {
      config = this.tireMakeConfig;
    } else if (type == 'ODOMETER') {
      config = this.odometerConfig;
    } else if (type == 'VRC') {
      config = this.vrcConfig;
    }
    
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config]);
  },

  commercialTireIDConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -88
      }
    },
    "cameraConfig": {
      "captureResolution": "1080p",
      "zoomGesture": true
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "top_left"
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "commercial_tire_id",
        "cancelOnResult": true,
        "commercialTireIdConfig": {}
      },
      "cutoutConfig": {
        "maxWidthPercent": "60%",
        "alignment": "center",
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "0099FF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "ratioFromSize": {
          "width": 5,
          "height": 1
        },
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedbackConfig": {
        "animation": "traverse_multi",
        "animationDuration": 250,
        "style": "rect",
        "strokeColor": "0099FF",
        "beepOnResult": true,
        "vibrateOnResult": false,
        "strokeWidth": 2
      }
    },
  },

  tinConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -96
      },
      "segmentConfig": {
        "titles": ["Universal", "DOT", "DOT-Strict"],
        "modes": ["UNIVERSAL", "DOT", "DOT_STRICT"],
        "offset.y": -24,
        "tintColor": "0099ff"
      }
    },
    "cameraConfig": {
      "captureResolution": "1080p",
      "zoomGesture": true
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "top_left"
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "tire_identification_number",
        "cancelOnResult": true,
        "tinConfig": {
          "scanMode": "UNIVERSAL"
        }
      },
      "cutoutConfig": {
        "maxWidthPercent": "60%",
        "alignment": "center",
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "0099FF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "ratioFromSize": {
          "width": 5,
          "height": 1
        },
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedbackConfig": {
        "animation": "traverse_multi",
        "animationDuration": 250,
        "style": "rect",
        "strokeColor": "0099FF",
        "beepOnResult": true,
        "vibrateOnResult": false,
        "strokeWidth": 2
      },
      "uiFeedbackConfig": {
          "presets": [
              {
                  "presetName": "tin_with_instruction_overlay_image_text_sound_feedback",
                  "presetAttributes": [
                      {
                          "attributeName": "instruction_text",
                          "attributeValue": "Please make sure the entire TIN number is inside the cutout."
                      },
                      {
                          "attributeName": "left_overlay_image",
                          "attributeValue": ""
                      },
                      {
                          "attributeName": "lighting_toodark_image",
                          "attributeValue": "uifeedback_tin_toodark"
                      },
                      {
                          "attributeName": "lighting_toobright_image",
                          "attributeValue": "uifeedback_tin_toobright"
                      },
                      {
                          "attributeName": "distance_moveback_image",
                          "attributeValue": "uifeedback_tin_moveback"
                      },
                      {
                          "attributeName": "distance_movecloser_image",
                          "attributeValue": "uifeedback_tin_movecloser"
                      },
                      {
                          "attributeName": "format_wrong_image",
                          "attributeValue": "uifeedback_tin_wrongformat"
                      },
                      {
                          "attributeName": "date_wrong_image",
                          "attributeValue": "uifeedback_tin_wrongformat"
                      },
                      {
                          "attributeName": "lighting_toodark_text",
                          "attributeValue": ""
                      },
                      {
                          "attributeName": "lighting_toobright_text",
                          "attributeValue": ""
                      },
                      {
                          "attributeName": "distance_moveback_text",
                          "attributeValue": ""
                      },
                      {
                          "attributeName": "distance_movecloser_text",
                          "attributeValue": ""
                      },
                      {
                          "attributeName": "format_wrong_text",
                          "attributeValue": ""
                      },
                      {
                          "attributeName": "date_wrong_text",
                          "attributeValue": ""
                      },
                      {
                          "attributeName": "lighting_toodark_sound",
                          "attributeValue": "info_sound_TIN.wav"
                      },
                      {
                          "attributeName": "lighting_toobright_sound",
                          "attributeValue": "info_sound_TIN.wav"
                      },
                      {
                          "attributeName": "distance_moveback_sound",
                          "attributeValue": "info_sound_TIN.wav"
                      },
                      {
                          "attributeName": "distance_movecloser_sound",
                          "attributeValue": "info_sound_TIN.wav"
                      },
                      {
                          "attributeName": "format_wrong_sound",
                          "attributeValue": "info_sound_TIN.wav"
                      },
                      {
                          "attributeName": "date_wrong_sound",
                          "attributeValue": "info_sound_TIN.wav"
                      }
                  ]
              }
          ]
      }
    }
  },

  tireSizeConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -88
      }
    },
    "cameraConfig": {
      "captureResolution": "1080p",
      "zoomGesture": true
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "top_left"
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "tire_size_configuration",
        "cancelOnResult": true,
        "tireSizeConfig": {
          "upsideDownMode": "AUTO"
        }
      },
      "cutoutConfig": {
        "maxWidthPercent": "60%",
        "alignment": "center",
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "0099FF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "ratioFromSize": {
          "width": 2.5,
          "height": 1
        },
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedbackConfig": {
        "animation": "traverse_multi",
        "animationDuration": 250,
        "style": "rect",
        "strokeColor": "0099FF",
        "beepOnResult": true,
        "vibrateOnResult": false,
        "strokeWidth": 2
      },
      "uiFeedbackConfig": {
          "presets": [
            {
              "presetName": "simple_instruction_label",
              "presetAttributes": [
                {
                  "attributeName": "instruction_text",
                  "attributeValue": "Look for a standardized number sequence, like 205/55 R16"
                }
              ]
            }
          ]
      }
    }
  },

tireMakeConfig: {
      "options": {
          "doneButtonConfig": {
              "offset.y": -88
          }
      },
      "cameraConfig": {
          "captureResolution": "1080p",
          "zoomGesture": true
      },
      "flashConfig": {
          "mode": "manual",
          "alignment": "top_left"
      },
      "viewPluginConfig": {
          "pluginConfig": {
              "id": "tire-make",
              "cancelOnResult": true,
              "tireMakeConfig": {
                  "upsideDownMode": "AUTO"
              }
          },
          "cutoutConfig": {
              "maxWidthPercent": "60%",
              "maxHeightPercent": "60%",
              "alignment": "center",
              "strokeWidth": 2,
              "cornerRadius": 4,
              "strokeColor": "0099FF",
              "outerColor": "000000",
              "outerAlpha": 0.3,
              "ratioFromSize": {
                  "width": 5,
                  "height": 1
              },
              "feedbackStrokeColor": "0099FF"
          },
          "scanFeedbackConfig": {
              "animation": "traverse_multi",
              "animationDuration": 250,
              "style": "rect",
              "strokeColor": "0099FF",
              "beepOnResult": true,
              "vibrateOnResult": false,
              "strokeWidth": 2
          }
      }
    },

  vinConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -88
      }
    },
    "cameraConfig": {
      "captureResolution": "1080p",
      "zoomGesture": true
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "top_left"
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "vehicle_identification_number",
        "cancelOnResult": true,
        "vinConfig": {}
      },
      "cutoutConfig": {
        "maxWidthPercent": "70%",
        "alignment": "top_half",
        "ratioFromSize": {
          "width": 6.89,
          "height": 1
        },
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "strokeWidth": 2,
        "strokeColor": "0099FF",
        "cornerRadius": 4,
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedbackConfig": {
        "animation": "traverse_multi",
        "animationDuration": 250,
        "style": "contour_rect",
        "strokeWidth": 2,
        "strokeColor": "0099FF",
        "fillColor": "220099FF",
        "beepOnResult": true,
        "vibrateOnResult": true,
        "blinkAnimationOnResult": true
      }
    }
  },

  odometerConfig: {
      "options": {
        "doneButtonConfig": {
          "offset.y": -88
        }
      },
      "cameraConfig":{
        "captureResolution" : "1080p",
        "zoomGesture": true
      },
      "flashConfig" : {
        "mode": "manual",
        "alignment": "top_left"
      },
      "viewPluginConfig" : {
        "pluginConfig" : {
          "id" : "Odometer",
          "odometerConfig" : {

          },
          "cancelOnResult" : true
        },
        "cutoutConfig" : {
          "alignment" : "top",
          "strokeWidth" : 2,
          "strokeColor" : "FFFFFF",
          "cornerRadius" : 4,
          "outerColor" : "000000",
          "outerAlpha" : 0.5,
          "feedbackStrokeColor" : "0099FF",
          "maxWidthPercent": "85%",
          "maxHeightPercent": "85%",
          "ratioFromSize": {
            "width": 2.75,
            "height": 1
          },
          "offset": {
            "x": 0,
            "y": 160
          }
        },
        "scanFeedbackConfig" : {
          "style" : "contour_rect",
          "strokeColor" : "0099FF",
          "fillColor" : "220099FF",
          "blinkAnimationOnResult": true,
          "beepOnResult": true,
          "vibrateOnResult": true
        }
      }
  },

  vrcConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -88
      }
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "bottom_right"
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "vehicle_registration_certificate",
        "vehicleRegistrationCertificateConfig": {
          "vehicleRegistrationCertificate": {
            "documentNumber": {
              "scanOption": "optional",
              "minConfidence": 40
            },
            "licensePlate": {
              "scanOption": "mandatory",
              "minConfidence": 40
            },
            "lastName": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "firstName": {
              "scanOption": "optional",
              "minConfidence": 40
            },
            "address": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "firstIssued": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "manufacturerCode": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "vehicleTypeCode": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "vehicleIdentificationNumber": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "brand": {
              "scanOption": "optional",
              "minConfidence": 40
            },
            "vehicleType": {
              "scanOption": "optional",
              "minConfidence": 40
            },
            "displacement": {
              "scanOption": "optional",
              "minConfidence": 40
            },
            "tire": {
              "scanOption": "optional",
              "minConfidence": 50
            }
          }
        },
        "cancelOnResult": true
      },
      "cutoutConfig": {
        "animation": "none",
        "maxWidthPercent": "90%",
        "alignment": "center",
        "ratioFromSize": {
          "width": 2,
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
          "x": -50,
          "y": -50
        },
        "cornerRadius": 4,
        "strokeColor": "0099FF",
        "strokeWidth": 2,
        "outerColor": "000000",
        "feedbackStrokeColor": "0099FF",
        "outerAlpha": 0.3
      },
      "scanFeedbackConfig": {
        "style": "animated_rect",
        "strokeWidth": 0,
        "strokeColor": "0099ff",
        "fillColor": "000099ff",
        "beepOnResult": true,
        "vibrateOnResult": true,
        "blinkAnimationOnResult": false
      }
    },
  }
}
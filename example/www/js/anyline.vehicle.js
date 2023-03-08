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
    } else if (type == 'VRC') {
      config = this.vrcConfig;
    }

    cordova.exec(
      this.onResult,
      this.onError,
      "AnylineSDK",
      "scan", [config]
    );
  },

  licenseKey: "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6ICIzLjAiLAogICJkZWJ1Z1JlcG9ydGluZyI6ICJwaW5nIiwKICAibWFqb3JWZXJzaW9uIjogIjM3IiwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgIm1heERheXNOb3RSZXBvcnRlZCI6IDUsCiAgImFkdmFuY2VkQmFyY29kZSI6IHRydWUsCiAgIm11bHRpQmFyY29kZSI6IHRydWUsCiAgInN1cHBvcnRlZEJhcmNvZGVGb3JtYXRzIjogWwogICAgIkFMTCIKICBdLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiCiAgXSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiAzMCwKICAidmFsaWQiOiAiMjAyMy0xMi0xMiIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiY29tLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJjb20uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQpxUWxkWFVhSVBHaWhUWlVPL3ljSS9rR0UxcXJ5ZEs1cFh4UUJybk81TFZDaExlK1V3N0tGRkNMNnFSNnptUUVMdG1zVkUxZXJORHdYMW5XY3JtdlhKTFd4N2pjc2l3YXc3SUdubCtQRnd1NnpzS3ZjTTNWMk1peFRDZVBodUQrMzFRRTh1ZE84ZTdYS0NGa0lYd3BwOWdTYk03dDBqYitoTWc2S0dPd0dCVElnajIzVzdFZGdRaGlmZ2tOMGYxMHB4SWVZVzFBK21wcjQ1bTA2Ujc2dWZxSXhsc0lnVDhKbjFKV2haczFWOUFwR25zWUU4c3lVcnZuTXQvaTVvWTJ4YUpZdGE4cnJUZ0Rnc1ZHcUhvNjNrWTVQTllyNlRTWnRNcDBJTDFxTlFIakgrR1loQitIZm9hRzBLVXRkcTVsYW5mU2RESEpzV2F4NUtTQ01OdVNOZUE9PQ==",

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
        "style": "animated_rect",
        "maxWidthPercent": "80%",
        "maxHeightPercent": "80%",
        "alignment": "center",
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "0099FF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "width": 720,
        "ratioFromSize": {
          "width": 720,
          "height": 144
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
        "style": "animated_rect",
        "maxWidthPercent": "80%",
        "maxHeightPercent": "80%",
        "alignment": "top_half",
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "0099FF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "width": 800,
        "ratioFromSize": {
          "width": 720,
          "height": 144
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
        "style": "animated_rect",
        "maxWidthPercent": "80%",
        "maxHeightPercent": "80%",
        "alignment": "center",
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "0099FF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "width": 720,
        "ratioFromSize": {
          "width": 720,
          "height": 144
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
        "style": "animated_rect",
        "maxWidthPercent": "70%",
        "maxHeightPercent": "70%",
        "alignment": "top_half",
        "ratioFromSize": {
          "width": 62,
          "height": 9
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
              "scanOption": 1,
              "minConfidence": 40
            },
            "licensePlate": {
              "scanOption": 0,
              "minConfidence": 40
            },
            "lastName": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "firstName": {
              "scanOption": 1,
              "minConfidence": 40
            },
            "address": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "firstIssued": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "manufacturerCode": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "vehicleTypeCode": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "vehicleIdentificationNumber": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "brand": {
              "scanOption": 1,
              "minConfidence": 40
            },
            "vehicleType": {
              "scanOption": 1,
              "minConfidence": 40
            },
            "displacement": {
              "scanOption": 1,
              "minConfidence": 40
            },
            "tire": {
              "scanOption": 1,
              "minConfidence": 50
            }
          }
        },
        "cancelOnResult": true
      },
      "cutoutConfig": {
        "animation": "none",
        "maxWidthPercent": "90%",
        "maxHeightPercent": "80%",
        "alignment": "center",
        "ratioFromSize": {
          "width": 90,
          "height": 46
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
          "x": 50,
          "y": 50
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
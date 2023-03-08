/*
 * Anyline Cordova Plugin
 * anyline.universalId.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */
if (anyline === undefined) {
  var anyline = {};
}
anyline.universalId = {
  onResult: function (result) {
    changeLoadingState(false);

    // this is called for every Universal ID scan result
    // the result is a json-object containing all the scaned values and check-digits
    insertScanResult(result);
  },

  onError: function (error) {
    changeLoadingState(false);
    //called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      // do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("Universal ID scanning canceled");
      return;
    }

    alert(error);
  },

  scan: function (scanMode) {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);
    // start the UniversalId scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#universalId for module details
    var licenseKey = "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6ICIzLjAiLAogICJkZWJ1Z1JlcG9ydGluZyI6ICJwaW5nIiwKICAibWFqb3JWZXJzaW9uIjogIjM3IiwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgIm1heERheXNOb3RSZXBvcnRlZCI6IDUsCiAgImFkdmFuY2VkQmFyY29kZSI6IHRydWUsCiAgIm11bHRpQmFyY29kZSI6IHRydWUsCiAgInN1cHBvcnRlZEJhcmNvZGVGb3JtYXRzIjogWwogICAgIkFMTCIKICBdLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiCiAgXSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiAzMCwKICAidmFsaWQiOiAiMjAyMy0xMi0xMiIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiY29tLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJjb20uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQpxUWxkWFVhSVBHaWhUWlVPL3ljSS9rR0UxcXJ5ZEs1cFh4UUJybk81TFZDaExlK1V3N0tGRkNMNnFSNnptUUVMdG1zVkUxZXJORHdYMW5XY3JtdlhKTFd4N2pjc2l3YXc3SUdubCtQRnd1NnpzS3ZjTTNWMk1peFRDZVBodUQrMzFRRTh1ZE84ZTdYS0NGa0lYd3BwOWdTYk03dDBqYitoTWc2S0dPd0dCVElnajIzVzdFZGdRaGlmZ2tOMGYxMHB4SWVZVzFBK21wcjQ1bTA2Ujc2dWZxSXhsc0lnVDhKbjFKV2haczFWOUFwR25zWUU4c3lVcnZuTXQvaTVvWTJ4YUpZdGE4cnJUZ0Rnc1ZHcUhvNjNrWTVQTllyNlRTWnRNcDBJTDFxTlFIakgrR1loQitIZm9hRzBLVXRkcTVsYW5mU2RESEpzV2F4NUtTQ01OdVNOZUE9PQ==";

    var config = this.universalIDConfig;

    if (scanMode == 'ARABIC') {
      config = this.arabicIDConfig;
    } else if (scanMode == 'CYRILLIC') {
      config = this.cyrillicIDConfig;
    }

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config]);
  },

  universalIDConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -88
      }
    },
    "cameraConfig": {
      "captureResolution": "1080p",
      "pictureResolution": "1080p"
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "top_left",
      "offset": {
        "x": 0,
        "y": 0
      }
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "universal_id_latin",
        "universalIdConfig": {
          "allowedLayouts": {
            "mrz": [],
            "insuranceCard": [],
            "drivingLicense": [],
            "idFront": []
          },
          "alphabet": "latin",
          "insuranceCard": {
            "lastName": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "firstName": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "dateOfBirth": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "personalNumber": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "authority": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "documentNumber": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "dateOfExpiry": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "nationality": {
              "scanOption": 0,
              "minConfidence": 50
            }
          },
          "idFront": {
            "lastName": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "firstName": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "fullName": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "dateOfBirth": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "placeOfBirth": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "dateOfIssue": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "dateOfExpiry": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "cardAccessNumber": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "documentNumber": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "nationality": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "sex": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "personalNumber": {
              "scanOption": 1,
              "minConfidence": 60
            }
          }
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

  cyrillicIDConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -88
      }
    },
    "cameraConfig": {
      "captureResolution": "1080p",
      "pictureResolution": "1080p"
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "top_left",
      "offset": {
        "x": 0,
        "y": 0
      }
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "universal_id_cyrillic",
        "universalIdConfig": {
          "allowedLayouts": {
            "mrz": [],
            "insuranceCard": [],
            "drivingLicense": [],
            "idFront": []
          },
          "alphabet": "cyrillic",
          "insuranceCard": {
            "lastName": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "firstName": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "dateOfBirth": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "personalNumber": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "authority": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "documentNumber": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "dateOfExpiry": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "nationality": {
              "scanOption": 0,
              "minConfidence": 50
            }
          },
          "idFront": {
            "lastName": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "firstName": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "fullName": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "dateOfBirth": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "placeOfBirth": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "dateOfIssue": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "dateOfExpiry": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "cardAccessNumber": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "documentNumber": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "nationality": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "sex": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "personalNumber": {
              "scanOption": 1,
              "minConfidence": 60
            }
          }
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

  arabicIDConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -88
      }
    },
    "cameraConfig": {
      "captureResolution": "1080p",
      "pictureResolution": "1080p"
    },
    "flashConfig": {
      "mode": "manual",
      "alignment": "top_left",
      "offset": {
        "x": 0,
        "y": 0
      }
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "universal_id_arabic",
        "universalIdConfig": {
          "allowedLayouts": {
            "mrz": [],
            "insuranceCard": [],
            "drivingLicense": [],
            "idFront": []
          },
          "alphabet": "arabic",
          "insuranceCard": {
            "lastName": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "firstName": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "dateOfBirth": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "personalNumber": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "authority": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "documentNumber": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "dateOfExpiry": {
              "scanOption": 0,
              "minConfidence": 50
            },
            "nationality": {
              "scanOption": 0,
              "minConfidence": 50
            }
          },
          "idFront": {
            "lastName": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "firstName": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "fullName": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "dateOfBirth": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "placeOfBirth": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "dateOfIssue": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "dateOfExpiry": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "cardAccessNumber": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "documentNumber": {
              "scanOption": 0,
              "minConfidence": 60
            },
            "nationality": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "sex": {
              "scanOption": 1,
              "minConfidence": 60
            },
            "personalNumber": {
              "scanOption": 1,
              "minConfidence": 60
            }
          }
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
};
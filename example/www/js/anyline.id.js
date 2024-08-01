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
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "firstName": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "dateOfBirth": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "personalNumber": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "authority": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "documentNumber": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "dateOfExpiry": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "nationality": {
              "scanOption": "mandatory",
              "minConfidence": 50
            }
          },
          "idFront": {
            "lastName": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "firstName": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "fullName": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "dateOfBirth": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "placeOfBirth": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "dateOfIssue": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "dateOfExpiry": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "cardAccessNumber": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "documentNumber": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "nationality": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "sex": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "personalNumber": {
              "scanOption": "optional",
              "minConfidence": 60
            }
          }
        },
        "cancelOnResult": true
      },
      "cutoutConfig": {
        "maxWidthPercent": "90%",
        "alignment": "center",
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "0099FF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "ratioFromSize": {
          "width": 161,
          "height": 100
        },
        "cropPadding": {
          "x": -50,
          "y": -50
        },
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedbackConfig": {
        "style": "contour_rect",
        "redrawTimeout": 100,
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
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "firstName": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "dateOfBirth": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "personalNumber": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "authority": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "documentNumber": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "dateOfExpiry": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "nationality": {
              "scanOption": "mandatory",
              "minConfidence": 50
            }
          },
          "idFront": {
            "lastName": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "firstName": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "fullName": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "dateOfBirth": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "placeOfBirth": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "dateOfIssue": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "dateOfExpiry": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "cardAccessNumber": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "documentNumber": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "nationality": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "sex": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "personalNumber": {
              "scanOption": "optional",
              "minConfidence": 60
            }
          }
        },
        "cancelOnResult": true
      },
      "cutoutConfig": {
        "maxWidthPercent": "90%",
        "alignment": "center",
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "0099FF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "ratioFromSize": {
          "width": 161,
          "height": 100
        },
        "cropPadding": {
          "x": -50,
          "y": -50
        },
        "cropOffset": {
          "x": 0,
          "y": 0
        },
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedbackConfig": {
        "style": "contour_rect",
        "redrawTimeout": 100,
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
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "firstName": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "dateOfBirth": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "personalNumber": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "authority": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "documentNumber": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "dateOfExpiry": {
              "scanOption": "mandatory",
              "minConfidence": 50
            },
            "nationality": {
              "scanOption": "mandatory",
              "minConfidence": 50
            }
          },
          "idFront": {
            "lastName": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "firstName": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "fullName": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "dateOfBirth": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "placeOfBirth": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "dateOfIssue": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "dateOfExpiry": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "cardAccessNumber": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "documentNumber": {
              "scanOption": "mandatory",
              "minConfidence": 60
            },
            "nationality": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "sex": {
              "scanOption": "optional",
              "minConfidence": 60
            },
            "personalNumber": {
              "scanOption": "optional",
              "minConfidence": 60
            }
          }
        },
        "cancelOnResult": true
      },
      "cutoutConfig": {
        "maxWidthPercent": "90%",
        "alignment": "center",
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "0099FF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "ratioFromSize": {
          "width": 161,
          "height": 100
        },
        "cropPadding": {
          "x": -50,
          "y": -50
        },
        "cropOffset": {
          "x": 0,
          "y": 0
        },
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedbackConfig": {
        "style": "contour_rect",
        "redrawTimeout": 100,
        "strokeColor": "0099FF",
        "fillColor": "220099FF",
        "beepOnResult": true,
        "vibrateOnResult": true,
        "strokeWidth": 2
      }
    }
  },
};
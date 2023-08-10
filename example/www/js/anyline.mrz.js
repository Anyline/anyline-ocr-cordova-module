/*
 * Anyline Cordova Plugin
 * anyline.mrz.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.mrz = {
  onResult: function (result) {
    changeLoadingState(false);
    insertScanResult(result);
  },

  onError: function (error) {
    changeLoadingState(false);
    // called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      // do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("MRZ scanning canceled");
      return;
    }
    alert(error);
  },

  scan: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);

    // start the MRZ scanning
    var config = this.anylineMRZViewConfig;
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [config]);
  },

  anylineMRZViewConfig: {
    "options": {
      "doneButtonConfig": {
        "offset.y": -88
      }
    },
    "viewPluginConfig": {
      "pluginConfig": {
        "id": "mrz",
        "mrzConfig": {
          "strictMode": false,
          "cropAndTransformID": false
        }
      },
      "cutoutConfig": {
        "animation": "none",
        "maxWidthPercent": "90%",
        "alignment": "center",
        "ratioFromSize": {
          "width": 161,
          "height": 100
        },
        "offset": {
          "x": 0,
          "y": 25
        },
        "cropPadding": {
          "x": -30,
          "y": -90
        },
        "cropOffset": {
          "x": 0,
          "y": 90
        },
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "strokeWidth": 2,
        "strokeColor": "0099FF",
        "cornerRadius": 2,
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedbackConfig": {
        "style": "rect",
        "strokeWidth": 2,
        "strokeColor": "0099FF",
        "fillColor": "220099FF",
        "beepOnResult": false,
        "vibrateOnResult": false,
        "blinkAnimationOnResult": false
      }
    }
  }
};



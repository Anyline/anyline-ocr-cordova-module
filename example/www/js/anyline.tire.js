/*
 * Anyline Cordova Plugin
 * anyline.tire.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.tire = {
  onResult: function (result) {
    changeLoadingState(false);
    //this is called for every mrz scan result
    //the result is a json-object containing all the scaned values and check-digits

    console.log("Result: " + JSON.stringify(result));
    var div = document.getElementById('results');

    if (div.childElementCount >= 3) {
      div.removeChild(div.childNodes[div.childElementCount - 1]);
    }

    div.innerHTML = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>" +
      "<b>Result: </b> " + result.text
      + "<br/><i><b>Confidence:</b> " + result.confidence + "</i>"
      + "<br/><i><b>Outline Points:</b> " + result.outline + "</i>" + "</p>"
      + div.innerHTML;

    document.getElementById("details_scan_modes").removeAttribute("open");
    document.getElementById("details_results").setAttribute("open", "");
    window.scrollTo(0, 0);
  },

  onError: function (error) {
    changeLoadingState(false);
    //called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      //do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("Anyline Tire scanning canceled");
      return;
    }

    alert(error);
  },

  licenseKey: "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6ICIzLjAiLAogICJkZWJ1Z1JlcG9ydGluZyI6ICJwaW5nIiwKICAibWFqb3JWZXJzaW9uIjogIjM3IiwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgIm1heERheXNOb3RSZXBvcnRlZCI6IDUsCiAgImFkdmFuY2VkQmFyY29kZSI6IHRydWUsCiAgIm11bHRpQmFyY29kZSI6IHRydWUsCiAgInN1cHBvcnRlZEJhcmNvZGVGb3JtYXRzIjogWwogICAgIkFMTCIKICBdLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiCiAgXSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiAzMCwKICAidmFsaWQiOiAiMjAyMy0xMi0xMiIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiY29tLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJjb20uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQpxUWxkWFVhSVBHaWhUWlVPL3ljSS9rR0UxcXJ5ZEs1cFh4UUJybk81TFZDaExlK1V3N0tGRkNMNnFSNnptUUVMdG1zVkUxZXJORHdYMW5XY3JtdlhKTFd4N2pjc2l3YXc3SUdubCtQRnd1NnpzS3ZjTTNWMk1peFRDZVBodUQrMzFRRTh1ZE84ZTdYS0NGa0lYd3BwOWdTYk03dDBqYitoTWc2S0dPd0dCVElnajIzVzdFZGdRaGlmZ2tOMGYxMHB4SWVZVzFBK21wcjQ1bTA2Ujc2dWZxSXhsc0lnVDhKbjFKV2haczFWOUFwR25zWUU4c3lVcnZuTXQvaTVvWTJ4YUpZdGE4cnJUZ0Rnc1ZHcUhvNjNrWTVQTllyNlRTWnRNcDBJTDFxTlFIakgrR1loQitIZm9hRzBLVXRkcTVsYW5mU2RESEpzV2F4NUtTQ01OdVNOZUE9PQ==",

  anylineTinConfig:{
      "camera": {
          "captureResolution": "720p"
      },
      "flash": {
          "mode": "manual",
          "alignment": "bottom_right"
      },
      "viewPlugin" : {

          "plugin": {
            "id": "TIN",
            "tirePlugin": {
              "tinConfig":{
              }
            }
          },
          "cutoutConfig" : {
              "style": "rect",
              "width": 720,
              "alignment": "center",
              "maxWidthPercent": "80%",
              "ratioFromSize": {
                  "width": 720,
                  "height": 144
              },
              "outerColor": "000000",
              "outerAlpha": 0.3,
              "strokeWidth": 2,
              "strokeColor": "FFFFFF",
              "cornerRadius": 2,
              "feedbackStrokeColor": "0099FF"
          },
          "scanFeedback" : {
              "animation": "traverse_multi",
              "animationDuration" : 250,
              "style": "contour_rect",
              "strokeWidth": 2,
              "strokeColor": "0099FF",
              "beepOnResult": true,
              "vibrateOnResult": true,
              "blinkAnimationOnResult": true
          },
          "cancelOnResult" : true
      }
  },

  anylineTireSizeConfig:{
    "camera": {
        "captureResolution": "720p"
    },
    "flash": {
        "mode": "manual",
        "alignment": "bottom_right"
    },
    "viewPlugin" : {
  
        "plugin": {
          "id": "TIRE_SIZE",
          "tirePlugin": {
            "tireSizeConfig":{
            }
          }
        },
        "cutoutConfig" : {
            "style": "rect",
            "width": 720,
            "alignment": "center",
            "maxWidthPercent": "80%",
            "ratioFromSize": {
                "width": 720,
                "height": 144
            },
            "outerColor": "000000",
            "outerAlpha": 0.3,
            "strokeWidth": 2,
            "strokeColor": "FFFFFF",
            "cornerRadius": 2,
            "feedbackStrokeColor": "0099FF"
        },
        "scanFeedback" : {
            "animation": "traverse_multi",
            "animationDuration" : 250,
            "style": "rect",
            "strokeWidth": 2,
            "strokeColor": "0099FF",
            "beepOnResult": true,
            "vibrateOnResult": true,
            "blinkAnimationOnResult": true
        },
        "cancelOnResult" : true
    }
  },

  anylineCommercialTireIdConfig:{
    "camera": {
        "captureResolution": "720p"
    },
    "flash": {
        "mode": "manual",
        "alignment": "bottom_right"
    },
    "viewPlugin" : {
  
        "plugin": {
          "id": "COMMERCIAL_TIRE_ID",
          "tirePlugin": {
            "commercialTireIdConfig":{
            }
          }
        },
        "cutoutConfig" : {
            "style": "rect",
            "width": 720,
            "alignment": "center",
            "maxWidthPercent": "80%",
            "ratioFromSize": {
                "width": 720,
                "height": 144
            },
            "outerColor": "000000",
            "outerAlpha": 0.3,
            "strokeWidth": 2,
            "strokeColor": "FFFFFF",
            "cornerRadius": 2,
            "feedbackStrokeColor": "0099FF"
        },
        "scanFeedback" : {
            "animation": "traverse_multi",
            "animationDuration" : 250,
            "style": "contour_rect",
            "strokeWidth": 2,
            "strokeColor": "0099FF",
            "beepOnResult": true,
            "vibrateOnResult": true,
            "blinkAnimationOnResult": true
        },
        "cancelOnResult" : true
    }
  },

  scanTin: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);
    // start the Anyline TIN scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [this.licenseKey, this.anylineTinConfig]);
  },

  scanTireSize: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);
    // start the Anyline Tire Size scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
  
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [this.licenseKey, this.anylineTireSizeConfig]);
  },

  scanCommercialTireId: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);
    // start the Anyline Commercial Tire Id scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
  
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [this.licenseKey, this.anylineCommercialTireIdConfig]);
  }
};
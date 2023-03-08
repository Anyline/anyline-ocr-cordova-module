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

    // this is called for every mrz scan result
    // the result is a json-object containing all the scaned values and check-digits
    
    // ACO disabling: problem is that it's a bit long
    // var resultText = "";
    // if (result.mrzResult) {
    //   resultText = safe_tags(result.mrzResult.mrzString);
    // }
    // insertScanResult(result, resultText);

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
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#mrz for module details

    var licenseKey = "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6ICIzLjAiLAogICJkZWJ1Z1JlcG9ydGluZyI6ICJwaW5nIiwKICAibWFqb3JWZXJzaW9uIjogIjM3IiwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgIm1heERheXNOb3RSZXBvcnRlZCI6IDUsCiAgImFkdmFuY2VkQmFyY29kZSI6IHRydWUsCiAgIm11bHRpQmFyY29kZSI6IHRydWUsCiAgInN1cHBvcnRlZEJhcmNvZGVGb3JtYXRzIjogWwogICAgIkFMTCIKICBdLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiCiAgXSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiAzMCwKICAidmFsaWQiOiAiMjAyMy0xMi0xMiIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiY29tLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJjb20uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQpxUWxkWFVhSVBHaWhUWlVPL3ljSS9rR0UxcXJ5ZEs1cFh4UUJybk81TFZDaExlK1V3N0tGRkNMNnFSNnptUUVMdG1zVkUxZXJORHdYMW5XY3JtdlhKTFd4N2pjc2l3YXc3SUdubCtQRnd1NnpzS3ZjTTNWMk1peFRDZVBodUQrMzFRRTh1ZE84ZTdYS0NGa0lYd3BwOWdTYk03dDBqYitoTWc2S0dPd0dCVElnajIzVzdFZGdRaGlmZ2tOMGYxMHB4SWVZVzFBK21wcjQ1bTA2Ujc2dWZxSXhsc0lnVDhKbjFKV2haczFWOUFwR25zWUU4c3lVcnZuTXQvaTVvWTJ4YUpZdGE4cnJUZ0Rnc1ZHcUhvNjNrWTVQTllyNlRTWnRNcDBJTDFxTlFIakgrR1loQitIZm9hRzBLVXRkcTVsYW5mU2RESEpzV2F4NUtTQ01OdVNOZUE9PQ==";
    //mode "scanMRZ" is also still available (for backwards compatibility)
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [this.anylineMRZViewConfig]);
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
        "maxWidthPercent": "85%",
        "maxHeightPercent": "70%",
        "width": 0,
        "alignment": "top_half",
        "ratioFromSize": {
          "width": 86,
          "height": 54
        },
        "offset": {
          "x": 0,
          "y": 25
        },
        "cropPadding": {
          "x": 25,
          "y": 25
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



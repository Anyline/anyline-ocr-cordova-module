/*
 * Anyline Cordova Plugin
 * anyline.document.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
    var anyline = {};
}
anyline.document = {
    onResult: function (result) {
        changeLoadingState(false);
        //this is called for every mrz scan result
        //the result is a json-object containing all the scaned values and check-digits

        console.log("Result: " + JSON.stringify(result));
        var div = document.getElementById('results');

        if (div.childElementCount >= 3) {
            div.removeChild(div.childNodes[div.childElementCount - 1]);
        }

        div.innerHTML = "<p>"
            + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
            + "<img src=\"" + result.fullImagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
            + "<br/><i><b>Outline Points:</b> " + result.outline + "</i>"
            + "</p>" + div.innerHTML;

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
            console.log("AnylineOcr scanning canceled");
            return;
        }

        alert(error);
    },

    licenseKey: "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6ICIzLjAiLAogICJkZWJ1Z1JlcG9ydGluZyI6ICJwaW5nIiwKICAibWFqb3JWZXJzaW9uIjogIjM3IiwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgIm1heERheXNOb3RSZXBvcnRlZCI6IDUsCiAgImFkdmFuY2VkQmFyY29kZSI6IHRydWUsCiAgIm11bHRpQmFyY29kZSI6IHRydWUsCiAgInN1cHBvcnRlZEJhcmNvZGVGb3JtYXRzIjogWwogICAgIkFMTCIKICBdLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiCiAgXSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiAzMCwKICAidmFsaWQiOiAiMjAyMy0xMi0xMiIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiY29tLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJjb20uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQpxUWxkWFVhSVBHaWhUWlVPL3ljSS9rR0UxcXJ5ZEs1cFh4UUJybk81TFZDaExlK1V3N0tGRkNMNnFSNnptUUVMdG1zVkUxZXJORHdYMW5XY3JtdlhKTFd4N2pjc2l3YXc3SUdubCtQRnd1NnpzS3ZjTTNWMk1peFRDZVBodUQrMzFRRTh1ZE84ZTdYS0NGa0lYd3BwOWdTYk03dDBqYitoTWc2S0dPd0dCVElnajIzVzdFZGdRaGlmZ2tOMGYxMHB4SWVZVzFBK21wcjQ1bTA2Ujc2dWZxSXhsc0lnVDhKbjFKV2haczFWOUFwR25zWUU4c3lVcnZuTXQvaTVvWTJ4YUpZdGE4cnJUZ0Rnc1ZHcUhvNjNrWTVQTllyNlRTWnRNcDBJTDFxTlFIakgrR1loQitIZm9hRzBLVXRkcTVsYW5mU2RESEpzV2F4NUtTQ01OdVNOZUE9PQ==",

    viewConfig: {
        "camera": {
            "captureResolution": "720p",
            "pictureResolution": "1080p",
            "pictureAspectRatios": ["16:9"]
        },
        "flash": {
            "mode": "manual",
            "alignment": "bottom_left",
            "offset": {
                "x": 10,
                "y": 0
            }
        },

        "viewPlugin": {
            "plugin": {
                "id": "DOCUMENT",
                "documentPlugin": {
                }
            },
            "cutoutConfig": {
                "style": "rect",
                "maxWidthPercent": "100%",
                "maxHeightPercent": "100%",
                "widthPercent": "100%",
                "width": 1080,
                "ratioFromSize": {
                    "width": 10,
                    "height": 18
                },
                "alignment": "center",
                "strokeWidth": 2,
                "cornerRadius": 0,
                "strokeColor": "00000000"
            },
            "scanFeedback": {
                "beepOnResult": true,
                "vibrateOnResult": true,
                "blinkAnimationOnResult": true
            },
            "cancelOnResult": false
        },
      	"document": {
  	        "manualCaptureButton": {
  		        "buttonColor": "0099ff"
  	        },
  	        "finishedButton": {
  		        "buttonColor": "0099ff"
  	        },
  	    },
      quality: 90
    },

    scan: function () {
        if (localStorage.getItem("hasStartedAnyline") === 'true') {
            return;
        }
        changeLoadingState(true);
        cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [this.licenseKey, this.viewConfig]);
    }
};

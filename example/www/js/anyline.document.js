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

    licenseKey: "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsCiAgImRlYnVnUmVwb3J0aW5nIjogIm9wdC1vdXQiLAogICJpbWFnZVJlcG9ydENhY2hpbmciOiBmYWxzZSwKICAibWFqb3JWZXJzaW9uIjogIjI1IiwKICAibWF4RGF5c05vdFJlcG9ydGVkIjogNSwKICAiYWR2YW5jZWRCYXJjb2RlIjogdHJ1ZSwKICAibXVsdGlCYXJjb2RlIjogdHJ1ZSwKICAic3VwcG9ydGVkQmFyY29kZUZvcm1hdHMiOiBbCiAgICAiQUxMIgogIF0sCiAgInBpbmdSZXBvcnRpbmciOiB0cnVlLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiLAogICAgIldpbmRvd3MiCiAgXSwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogdHJ1ZSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiA5MCwKICAidmFsaWQiOiAiMjAyMi0wNS0zMCIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhLmJldGEiLAogICAgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiCiAgXSwKICAid2luZG93c0lkZW50aWZpZXIiOiBbCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQp1alBHWTFXU2dhajJIejc2dFpYMkptQ29lMGRFNHRsOXBFNkVhcFZMbFZyUU81bEtrUTh3VDJHZDlHS2l4YU4rRmNhdm1QTUZvY0Q3Tlp0RWRBbGZVREQzZXM5WHBVR2VESjRSaDNUbnQ1aWlyZWE3RjhUbUl0dWdrajN0Y3ZqNktReUlwY3NsN3Y0TFZkNHFNRm1mMWIyM1ZCdHVsVjloY092dGRDbzBvT2VqdEJ2cVdmckM3enRwRkNjaTlueHhoTStvRCtxdEpiZ2NVZ2pHQjExZ1dqcU1NMDUvTkdoK0hESHdjN2tmMXNHR3FiWkhxM3hYRk5FZ1FIamdLR2l6ckNrSjhQNDVscjVKb3JrUVFiQVlqL0VaT3Fvdmd1YlNTRzdzeVBpSklvQUFoWGxwOU5uR2pySkl4Mi92bFNqcUFSRnZZUUIwNHozTEQxeW1JTU5Tanc9PQ==",

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

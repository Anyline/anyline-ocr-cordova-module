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

    licenseKey: "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvcHQtb3V0IiwgImltYWdlUmVwb3J0Q2FjaGluZyI6IGZhbHNlLCAiaW9zSWRlbnRpZmllciI6IFsgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YS5iZXRhIiwgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIgXSwgImxpY2Vuc2VLZXlWZXJzaW9uIjogMiwgIm1ham9yVmVyc2lvbiI6ICI0IiwgIm1heERheXNOb3RSZXBvcnRlZCI6IDAsICJwaW5nUmVwb3J0aW5nIjogdHJ1ZSwgInBsYXRmb3JtIjogWyAiaU9TIiwgIkFuZHJvaWQiLCAiV2luZG93cyIgXSwgInNjb3BlIjogWyAiQUxMIiBdLCAic2hvd1BvcFVwQWZ0ZXJFeHBpcnkiOiB0cnVlLCAic2hvd1dhdGVybWFyayI6IHRydWUsICJ0b2xlcmFuY2VEYXlzIjogOTAsICJ2YWxpZCI6ICIyMDIwLTEwLTIwIiwgIndpbmRvd3NJZGVudGlmaWVyIjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdIH0KRnoxUmNxbUJ0YVRBRVl6NlNFQlhPRWxlLzlXNFVOVlJjdEJjTVhDTGVQMlRGV0dUTDdzWlB1WnJnTWkwOHlFVwpTUlp6emVNNTN2UnRoLzFVMGd5TGxzVmF0clZTd0lCMkRQbmxldnpUK3VHcGdRUUorS2w5N1dRRmljUlJ0di9VCnFjMU5md3RRMWVQREtMR05XaVZwbU94a2xIUzJ3OWV5c0ZHRHo4M20xRDZ5V2s0SkJ2MG9zOWhvak02bUtsU0MKVDZQYnJZcTkycFZRenFNUFdhZ3FoTXpvdGRDNE1YcktJY3FQbTBhc3FxRXM2VzkrM1d6aWI4NjRaSDVrM1ZqRgp3UGIzaVZqWW9aTVZFYVFGK1pQUmFoU3ZhNEhhMnhKakt0NXpkWTVtbkFKb1ZyaGVmNGYzNlFDME5ncnlkT0w3CkNFYzZxMk5acUNKSjhPLzBUT2trNmc9PQo=",

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
            "cancelOnResult": true
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

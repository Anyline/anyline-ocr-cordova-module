/*
 * Anyline Cordova Plugin
 * anyline.mrz.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */

if (anyline === undefined) {
    var anyline = {};
}
anyline.nfc = {
    onResult: function (result) {
        changeLoadingState(false);

        // this is called for every mrz scan result
        // the result is a json-object containing all the scaned values and check-digits
        insertScanResult(result, "", true);
    },

    onError: function (error) {
        changeLoadingState(false);
        // called if an error occurred or the user canceled the scanning
        if (error == "Canceled") {
            // do stuff when user has canceled
            // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
            console.log("MRZ+NFC scanning canceled");
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
        cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [anyline.nfc.anylineMRZAndNFCViewConfig]);
    },
    anylineMRZAndNFCViewConfig: {
        "options": {
            "enableNFCWithMRZ": true,
            "labelConfig": {
                "text": "Scan Passport",
                "size": 22,
                "offset.x": 0,
                "offset.y": -10
            },
            "doneButtonConfig": {
                "offset.y": -88
            }
        },
        "cameraConfig": {
            "captureResolution": "1080p"
        },
        "flashConfig": {
            "mode": "manual",
            "alignment": "bottom_left"
        },
        "viewPluginConfig": {
            "pluginConfig": {
                "id": "id_nfc",
                "mrzConfig": {
                    "strictMode": false,
                    "cropAndTransformID": false
                }
            },
            "cutoutConfig": {
                "animation": "none",
                "maxWidthPercent": "90%",
                "maxHeightPercent": "70%",
                "alignment": "center",
                "ratioFromSize": {
                  "width": 161,
                  "height": 100
                },
                "offset": {
                    "x": 0,
                    "y": 90
                },
                "cropPadding": {
                  "x": -30,
                  "y": -90
                },
                "outerColor": "000000",
                "outerAlpha": 0.3,
                "strokeWidth": 2,
                "strokeColor": "0099FF",
                "cornerRadius": 4,
                "feedbackStrokeColor": "0099FF"
            },
            "scanFeedbackConfig": {
                "style": "rect",
                "strokeWidth": 2,
                "strokeColor": "0099FF",
                "fillColor": "220099FF",
                "beepOnResult": true,
                "vibrateOnResult": true,
                "blinkAnimationOnResult": false
            }
        }
    }
};
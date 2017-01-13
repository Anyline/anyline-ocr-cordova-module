/*
 * Anyline Cordova Plugin
 * anyline.barcode.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
    var anyline = {};
}
anyline.barcode = {

    onResult: function(result) {
        //this is called with result of the barcode module
        //the result is a string containing the barcode

        var div = document.getElementById('results');
        console.log("Barcode result: " + JSON.stringify(result));


        div.innerHTML = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>" +
            "<b>Barcode:</b> " + result.value + "</br>" + "<b>Format </b> " + result.format + "</p>" +
            div.innerHTML;

        document.getElementById("details_scan_modes").removeAttribute("open");
        document.getElementById("details_results").setAttribute("open", "");
    },

    onError: function(error) {
        //called if an error occurred or the user canceled the scanning
        if (error == "Canceled") {
            //when user has canceled
            // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
            console.log("Barcode scanning canceled");
            return;
        }

        alert(error);
    },

    scan: function() {
        // start the barcode scanning
        // pass the success and error callbacks, as well as the license key and the config to the plugin
        // see http://documentation.anyline.io/#anyline-config for config details
        // and http://documentation.anyline.io/#barcode for barcode module details

        var licenseKey = "" +
            "eyJzY29wZSI6WyJCQVJDT0RFIiwiTVJaIiwiRU5FUkdZIiwiQU5ZTElORV9PQ1IiLCJET0NVTUVOVCIs" +
            "IkFMTCJdLCJwbGF0Zm9ybSI6WyJpT1MiLCJBbmRyb2lkIiwiV2luZG93cyJdLCJ2YWxpZCI6IjIwMTct" +
            "MDMtMTUiLCJtYWpvclZlcnNpb24iOiIzIiwiaXNDb21tZXJjaWFsIjpmYWxzZSwidG9sZXJhbmNlRGF5" +
            "cyI6NjAsImlvc0lkZW50aWZpZXIiOlsiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIl0sImFuZHJv" +
            "aWRJZGVudGlmaWVyIjpbImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSJdLCJ3aW5kb3dzSWRlbnRp" +
            "ZmllciI6WyJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiXX0KVThWSHd6U295d3RGZ0oxL1pOY011" +
            "ZnBZT0F6eXRoVzA5ZUhIRDEzZ0RwSTUzUXhuMk52bExyWnllZEsvd2t1UUU0My9MUUMreUVSVlZHS2g1" +
            "N29IVlhuOVdqODE2cDQxYnh0cWx0ODk3WGkzcjhxVUdQekhaNzNnYWlsUEtPYmM5TlYyY0x1ZjVNK01m" +
            "RTQ2ZFJoeGlSUDZPcnk2dXB3U0laS1VEVDBDTjBMQWZxcXd2dW5IOFpIdk5HZE4vSmdlbFRkVlNSckNJ" +
            "bHVPaXliVC82N1ZRMVQ4QzVaWWs1VUdSdEFydW0yRmpGQWdiN1BPbnZ6bmhYeTl3NTVrcC9MUFpDM21E" +
            "OTVCdVNCUFZOSFZNdi9taHFlbUlTcGhTVjBpL0hWU3ZtYlp4VnY4ZVRJT29pM2YwNUJIREcrYWoyaDJJ" +
            "aUJBN1VaK0RZSVZrWjhpYXF2Wk5BPT0=";


        //mode "scanBarcode" is also still available (for backwards compatibility)
        cordova.exec(this.onResult, this.onError, "AnylineSDK", "BARCODE", [licenseKey, {
            "captureResolution": "720p",

            "cutout": {
                "style": "rect",
                "maxWidthPercent": "80%",
                "maxHeightPercent": "80%",
                "alignment": "center",
                "ratioFromSize": {
                    "width": 100,
                    "height": 80
                },
                "strokeWidth": 1,
                "cornerRadius": 3,
                "strokeColor": "FFFFFF",
                "outerColor": "000000",
                "outerAlpha": 0.3
            },
            "flash": {
                "mode": "auto",
                "alignment": "bottom_right"
            },
            "beepOnResult": true,
            "vibrateOnResult": true,
            "blinkAnimationOnResult": true,
            "cancelOnResult": false,
            "doneButton": { // iOS only. Android uses hardware back button.
                "title": "OK",
                "type": "rect", // fullwidth, rect
                "cornerRadius": 0,
                //"backgroundColor":"#EEEEEE", // default clearcolor
                "textColor": "FFFFFF",
                "textColorHighlighted": "CCCCCC",
                "fontSize": 33,
                "fontName": "HelveticaNeue",
                "positionXAlignment": "center", // left,right,center - no affect on fullwidth
                "positionYAlignment": "bottom", // top, center, bottom
                "offset": {
                    "x": 0, // postive -> right
                    "y": -88, // postive -> down
                }
            }
        }]);
    }
};

/*
 * Anyline Cordova Plugin
 * anyline.mrz.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
    var anyline = {};
}
anyline.mrz = {
    onResult: function(result) {
        //this is called for every mrz scan result
        //the result is a json-object containing all the scaned values and check-digits

        console.log("MRZ result: " + JSON.stringify(result));
        var div = document.getElementById('results');

        div.innerHTML = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>" +
            "<b>Name:</b> " + result.surNames + " " + result.givenNames + "<br/>" + "<b>Type:</b> " + result.documentType +
            " <b>Number:</b> " + result.documentNumber + " <b>Country:</b> " + result.nationalityCountryCode +
            " [" + result.issuingCountryCode + "]" + "<br/>" + "<b>Day of Birth:</b> " + result.dayOfBirth +
            " <b>Expiration:</b> " + result.expirationDate + "</p>" + div.innerHTML;

        document.getElementById("details_scan_modes").removeAttribute("open");
        document.getElementById("details_results").setAttribute("open", "");
    },

    onError: function(error) {
        //called if an error occurred or the user canceled the scanning
        if (error == "Canceled") {
            //do stuff when user has canceled
            // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
            console.log("MRZ scanning canceled");
            return;
        }

        alert(error);
    },

    scan: function() {
        // start the MRZ scanning
        // pass the success and error callbacks, as well as the license key and the config to the plugin
        // see http://documentation.anyline.io/#anyline-config for config details
        // and http://documentation.anyline.io/#mrz for module details

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

        //mode "scanMRZ" is also still available (for backwards compatibility)
        cordova.exec(this.onResult, this.onError, "AnylineSDK", "MRZ", [licenseKey, {
            "captureResolution": "1080p",

            "cutout": {
                "style": "rect",
                "maxWidthPercent": "90%",
                "maxHeightPercent": "90%",
                "alignment": "top_half",
                "strokeWidth": 2,
                "cornerRadius": 4,
                "strokeColor": "FFFFFF",
                "outerColor": "000000",
                "outerAlpha": 0.3
            },
            "flash": {
                "mode": "manual",
                "alignment": "bottom_right"
            },
            "beepOnResult": true,
            "vibrateOnResult": true,
            "blinkAnimationOnResult": true,
            "cancelOnResult": true
        }]);
    }
};

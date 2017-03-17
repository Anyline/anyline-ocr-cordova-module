/*
 * Anyline Cordova Plugin
 * anyline.energy.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
    var anyline = {};
}
anyline.energy = {
    onResult: function (result) {
        //this is called for every energy scan result
        //the result is a json-object containing the reading the meter type and a path to a cropped and a full image.

        console.log("Energy result: " + JSON.stringify(result));

        if (result.detectedBarcodes) {
            var detailsBarcodes = "";
            for (var i = 0; i < result.detectedBarcodes.length; i++) {
                detailsBarcodes += result.detectedBarcodes[i].value;
                detailsBarcodes += " (" + result.detectedBarcodes[i].format + ")";
                if (i < result.detectedBarcodes.length - 1) {
                    detailsBarcodes += ", ";
                }
            }
        }
        var div = document.getElementById('results');

        div.innerHTML = "<p>"
            + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
            + "<b>" + result.meterType + ":</b> " + result.reading
            + (detailsBarcodes ? "<br/><i><b>Detected Barcodes:</b> " + detailsBarcodes + "</i>" : "")
            + "<br/><i><b>Confidence:</b> " + result.confidence + "</i>"
            + "<br/><i><b>Outline Points:</b> " + result.outline + "</i>"
            + "</p>"
            + div.innerHTML;

        document.getElementById("details_scan_modes").removeAttribute("open");
        document.getElementById("details_results").setAttribute("open", "");
        window.scrollTo(0, 0);
    },

    onError: function (error) {
        //called if an error occurred or the user canceled the scanning
        if (error == "Canceled") {
            //do stuff when user has canceled
            // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
            console.log("Energy scanning canceled");
            return;
        }

        alert(error);
    },

    energyConfig: [
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
        "aUJBN1VaK0RZSVZrWjhpYXF2Wk5BPT0=",
        {
            "captureResolution": "720p",

            "cutout": {
                "style": "rect",
                "alignment": "top",
                "offset": {
                    "x": 0,
                    "y": 120
                },
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
            "cancelOnResult": true,
            "reportingEnabled": true
        },
        {"nativeBarcodeEnabled": true}

    ],

    energyConfigWithSegment: [
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
        "aUJBN1VaK0RZSVZrWjhpYXF2Wk5BPT0=",
        {
            "captureResolution": "720p",

            "cutout": {
                "style": "rect",
                "alignment": "top",
                "offset": {
                    "x": 0,
                    "y": 120
                },
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
            "cancelOnResult": true,
            "reportingEnabled": true,
            "segment": {
                "titles": ["Analog", "Digital"],
                "modes": ["ELECTRIC_METER", "DIGITAL_METER"],
                "tintColor": "CCCCCC",
                "offset": {
                    "x": 0,
                    "y": 400
                }
            }
        },
        {"nativeBarcodeEnabled": true}
    ],

    heatConfigWithSegment: [
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
        "aUJBN1VaK0RZSVZrWjhpYXF2Wk5BPT0=",
        {
            "captureResolution": "720p",

            "cutout": {
                "style": "rect",
                "alignment": "top",
                "offset": {
                    "x": 0,
                    "y": 120
                },
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
            "cancelOnResult": true,
            "reportingEnabled": true,
            "segment": {
                "titles": ["Heat Meter 4", "Heat Meter 5", "Heat Meter 6"],
                "modes": ["HEAT_METER_4", "HEAT_METER_5", "HEAT_METER_6"],
                "tintColor": "CCCCCC",
                "offset": {
                    "x": 0,
                    "y": 400
                }
            }
        },
        {"nativeBarcodeEnabled": true}
    ],

    scan: function (scanMode) {
        console.log("start scan with mode " + scanMode);
        // start the Energy scanning for the given scan mode
        // pass the success and error callbacks, as well as the license key and the config to the plugin
        // see http://documentation.anyline.io/#anyline-config for config details
        // and http://documentation.anyline.io/#energy for energy-module details

        cordova.exec(this.onResult, this.onError, "AnylineSDK", scanMode, this.energyConfig);
    },

    scanElectricDigitalSegment: function () {
        // start the Energy scanning for the given scan mode
        // pass the success and error callbacks, as well as the license key and the config to the plugin
        // see http://documentation.anyline.io/#anyline-config for config details
        // and http://documentation.anyline.io/#energy for energy-module details
        cordova.exec(this.onResult, this.onError, "AnylineSDK", "ELECTRIC_METER", this.energyConfigWithSegment);
    },

    scanHeatMeterWithSegment: function () {
        // start the Energy scanning for the given scan mode
        // pass the success and error callbacks, as well as the license key and the config to the plugin
        // see http://documentation.anyline.io/#anyline-config for config details
        // and http://documentation.anyline.io/#energy for energy-module details
        cordova.exec(this.onResult, this.onError, "AnylineSDK", "HEAT_METER_4", this.heatConfigWithSegment);
    },

    scanElectricMeter: function () {
        //scanmode scanElectricMeter can also be used for backwards compatibility)
        this.execMode("ELECTRIC_METER");
    },

    scanGasMeter: function () {
        //scanmode scanGasMeter can also be used for backwards compatibility)
        this.execMode("GAS_METER");
    }
};

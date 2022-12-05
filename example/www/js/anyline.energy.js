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
    changeLoadingState(false);
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

    if (div.childElementCount >= 3) {
      div.removeChild(div.childNodes[div.childElementCount - 1]);
    }

    div.innerHTML = "<p>"
      + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
      + "<img src=\"" + result.fullImagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
      + "<b>" + result.meterType + ":</b> " + result.reading
      + (detailsBarcodes ? "<br/><i><b>Detected Barcodes:</b> " + detailsBarcodes + "</i>" : "")
      + ((result.confidence && result.confidence >= 0) ? "<br/><i><b>Confidence:</b> " + result.confidence + "</i>" : "")
      + "<br/><i><b>Outline Points:</b> " + result.outline + "</i>"
      + "</p>"
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
      console.log("Energy scanning canceled");
      return;
    }

    alert(error);
  },

  licenseKey: "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6ICIzLjAiLAogICJkZWJ1Z1JlcG9ydGluZyI6ICJwaW5nIiwKICAibWFqb3JWZXJzaW9uIjogIjM3IiwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgIm1heERheXNOb3RSZXBvcnRlZCI6IDUsCiAgImFkdmFuY2VkQmFyY29kZSI6IHRydWUsCiAgIm11bHRpQmFyY29kZSI6IHRydWUsCiAgInN1cHBvcnRlZEJhcmNvZGVGb3JtYXRzIjogWwogICAgIkFMTCIKICBdLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiCiAgXSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiAzMCwKICAidmFsaWQiOiAiMjAyMy0xMi0xMiIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiY29tLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJjb20uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQpxUWxkWFVhSVBHaWhUWlVPL3ljSS9rR0UxcXJ5ZEs1cFh4UUJybk81TFZDaExlK1V3N0tGRkNMNnFSNnptUUVMdG1zVkUxZXJORHdYMW5XY3JtdlhKTFd4N2pjc2l3YXc3SUdubCtQRnd1NnpzS3ZjTTNWMk1peFRDZVBodUQrMzFRRTh1ZE84ZTdYS0NGa0lYd3BwOWdTYk03dDBqYitoTWc2S0dPd0dCVElnajIzVzdFZGdRaGlmZ2tOMGYxMHB4SWVZVzFBK21wcjQ1bTA2Ujc2dWZxSXhsc0lnVDhKbjFKV2haczFWOUFwR25zWUU4c3lVcnZuTXQvaTVvWTJ4YUpZdGE4cnJUZ0Rnc1ZHcUhvNjNrWTVQTllyNlRTWnRNcDBJTDFxTlFIakgrR1loQitIZm9hRzBLVXRkcTVsYW5mU2RESEpzV2F4NUtTQ01OdVNOZUE9PQ==",

  serialNumber: {
    "id": "Meter_ID",
    "meterPlugin": {
      "scanMode": "SERIAL_NUMBER",
      "serialNumberCharWhitelist": '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      "serialNumberValidationRegex": '^[0-9A-Z]{5,}$'
    }
  },

  meterViewPluginConfig: {
    "camera": {
      "captureResolution": "720p"
    },
    "flash": {
      "mode": "manual",
      "alignment": "bottom_right",
    },
    "viewPlugin": {
      "plugin": {
        "id": "Meter_ID",
        "meterPlugin": {
        }
      },
      "cutoutConfig": {
        "style": "rect",
        "alignment": "top_half",
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "FFFFFF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedback": {
        "style": "CONTOUR_RECT",
        "strokeColor": "0099FF",
        "fillColor": "220099FF",
        "blinkOnResult": true,
        "beepOnResult": true,
        "vibrateOnResult": true
      },
      "cancelOnResult": true
    }
  },

  energyAnalogConfigWithSegment:
  {
    "camera": {
      "captureResolution": "720p"
    },
    "flash": {
      "mode": "manual",
      "alignment": "bottom_right",
    },
    "viewPlugin": {
      "plugin": {
        "id": "Meter_ID",
        "meterPlugin": {
          "scanMode": "AUTO_ANALOG_DIGITAL_METER"
        }
      },
      "cutoutConfig": {
        "style": "rect",
        "alignment": "top_half",
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "FFFFFF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedback": {
        "style": "CONTOUR_RECT",
        "strokeColor": "0099FF",
        "fillColor": "220099FF",
        "blinkOnResult": true,
        "beepOnResult": true,
        "vibrateOnResult": true
      },
      "cancelOnResult": true
    },
    "nativeBarcodeEnabled": true,
  },

  energyDigitalConfigWithSegment:
  {
    "camera": {
      "captureResolution": "720p"
    },
    "flash": {
      "mode": "manual",
      "alignment": "bottom_right",
    },
    "viewPlugin": {
      "plugin": {
        "id": "Meter_ID",
        "meterPlugin": {
          "scanMode": "AUTO_ANALOG_DIGITAL_METER"
        }
      },
      "cutoutConfig": {
        "style": "rect",
        "alignment": "top_half",
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "FFFFFF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedback": {
        "style": "CONTOUR_RECT",
        "strokeColor": "0099FF",
        "fillColor": "220099FF",
        "blinkOnResult": true,
        "beepOnResult": true,
        "vibrateOnResult": true
      },
      "cancelOnResult": true,
    },
    "nativeBarcodeEnabled": true,
  },

  dialConfig:
  {
        "camera": {
            "captureResolution": "720p"
        },
        "flash": {
            "mode": "manual",
            "alignment": "top_left",
        },
        "viewPlugin": {
            "plugin": {
                "id": "DIAL_METER",
                "meterPlugin": {
                    "scanMode": "DIAL_METER"
                }
            },
            "cutoutConfig": {
                "style": "rect",
                "maxWidthPercent": "90%",
                "maxHeightPercent": "90%",
                "alignment": "top_half",
                "ratioFromSize": {
                    "width": 125,
                    "height": 85
                },
                "offset": {
                    "x": 0,
                    "y": 15
                },
                "cropPadding": {
                    "x": 0,
                    "y": 0
                },
                "cropOffset": {
                    "x": 0,
                    "y": 0
                },
                "strokeWidth": 2,
                "cornerRadius": 4,
                "strokeColor": "FFFFFF",
                "outerColor": "000000",
                "outerAlpha": 0.3,
	            "feedbackStrokeColor": "0099FF"
            },
            "scanFeedback": {
	        "style": "CONTOUR_RECT",
        	"strokeColor": "0099FF",
	        "fillColor": "220099FF",
                "blinkOnResult": true,
                "beepOnResult": true,
                "vibrateOnResult": true
            },
            "cancelOnResult": true,
        },
        "nativeBarcodeEnabled": true

  },

  scan: function (scanMode) {

    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);

    this.meterViewPluginConfig.viewPlugin.plugin.meterPlugin.scanMode = scanMode;

    console.log("start scan with mode " + scanMode);

    if (scanMode == 'SERIAL_NUMBER') {
      this.meterViewPluginConfig.viewPlugin.plugin.meterPlugin.serialNumberCharWhitelist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      this.meterViewPluginConfig.viewPlugin.plugin.meterPlugin.serialNumberValidationRegex = '^[0-9A-Z]{5,}$';
    }

    console.log("your message here" + this.meterViewPluginConfig);
    // start the Energy scanning for the given scan mode
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#energy for energy-module details

    if (scanMode == 'DIAL_METER') {
        cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [this.licenseKey, this.dialConfig]);
    }
    else {
        cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [this.licenseKey, this.meterViewPluginConfig]);
    }
  },

  scanElectricAnalogSegment: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);
    // start the Energy scanning for the given scan mode
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#energy for energy-module details
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [this.licenseKey, this.energyAnalogConfigWithSegment]);
    // cordova.exec(this.onResult, this.onError, "AnylineSDK", scanMode, this.energyConfigWithSegment);
  },

  scanElectricDigitalSegment: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);
    // start the Energy scanning for the given scan mode
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#energy for energy-module details
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [this.licenseKey, this.energyDigitalConfigWithSegment]);
    // cordova.exec(this.onResult, this.onError, "AnylineSDK", scanMode, this.energyConfigWithSegment);
  },

  scanHeatMeterWithSegment: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);

    // start the Energy scanning for the given scan mode
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#energy for energy-module details
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "HEAT_METER_4", this.heatConfigWithSegment);
  },
  scanSerialNumber: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    changeLoadingState(true);

    // start the Energy scanning for the given scan mode
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#energy for energy-module details
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", this.serialNumberConfig);
  },
};

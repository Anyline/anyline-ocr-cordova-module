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
    localStorage.setItem("hasStartedAnyline", false);
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
    localStorage.setItem("hasStartedAnyline", false);
    //called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      //do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("Energy scanning canceled");
      return;
    }

    alert(error);
  },

  licenseKey: "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvcHQtb3V0IiwgImlvc0lkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsICJtYWpvclZlcnNpb24iOiAiNCIsICJtYXhEYXlzTm90UmVwb3J0ZWQiOiAwLCAicGluZ1JlcG9ydGluZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiwgIldpbmRvd3MiIF0sICJzY29wZSI6IFsgIkFMTCIgXSwgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogZmFsc2UsICJzaG93V2F0ZXJtYXJrIjogdHJ1ZSwgInRvbGVyYW5jZURheXMiOiA5MCwgInZhbGlkIjogIjIwMjAtMTAtMjAiLCAid2luZG93c0lkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0gfQpJYzVHSWVpdTBUYmJoQjE4T2poeHllY1g3Q296NWorR1o2azVtanJTUUtxVFYrYWRKODk4MHA2QmZ6UVdoK1ZyCnF6UE4yTURuWnFNSTcwUk13NHFGV0VJek16Z1J2ZUg3ZzhYM3RHbUcyUTdzazh0Y1Q1Zk5aditNNmpTeXQ1WG4KM010Ry9yZnp2YVRiQlo5VnV5ektsVXdDakZVdVhqd2xIVm1QZS9hc2ljMkVpbWhMU2JTam9PN0Nzajhjd0ZNVApKZDJTTnBncmdQYUtSUzZrdlNFMEJJU3ltVnAvb1VIcm9xUGtlUWRxa2owQk1ZU3Z4VmM4L0p3L1RvdHNvY1IvCmxIWi93VG03UldGRDVhZXpIdjJDcjNVN1ArSW1KdkNUb3JCc3VUa3B6VzF1dHIvQlNkckI3dVJNVFpPOW84UjcKS1ZhaUlmNmZYSExQanBkbkpmQXdqUT09Cg==",

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
          "scanMode": "ANALOG_METER"
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
    "segment": {
      "titles": ["Analog", "Digital"],
      "modes": ["ANALOG_METER", "DIGITAL_METER"],
      "tintColor": "CCCCCC",
      "offset": {
        "x": 0,
        "y": 400
      }
    }
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
          "scanMode": "DIGITAL_METER"
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
    "segment": {
      "titles": ["Analog", "Digital"],
      "modes": ["ANALOG_METER", "DIGITAL_METER"],
      "tintColor": "CCCCCC",
      "offset": {
        "x": 0,
        "y": 400
      }
    }
  },


  //  energyConfigWithSegment: [
  //    "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvcHQtb3V0IiwgImlvc0lkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsICJtYWpvclZlcnNpb24iOiAiNCIsICJtYXhEYXlzTm90UmVwb3J0ZWQiOiAwLCAicGluZ1JlcG9ydGluZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiwgIldpbmRvd3MiIF0sICJzY29wZSI6IFsgIkFMTCIgXSwgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogZmFsc2UsICJzaG93V2F0ZXJtYXJrIjogdHJ1ZSwgInRvbGVyYW5jZURheXMiOiA5MCwgInZhbGlkIjogIjIwMjAtMTAtMjAiLCAid2luZG93c0lkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0gfQpJYzVHSWVpdTBUYmJoQjE4T2poeHllY1g3Q296NWorR1o2azVtanJTUUtxVFYrYWRKODk4MHA2QmZ6UVdoK1ZyCnF6UE4yTURuWnFNSTcwUk13NHFGV0VJek16Z1J2ZUg3ZzhYM3RHbUcyUTdzazh0Y1Q1Zk5aditNNmpTeXQ1WG4KM010Ry9yZnp2YVRiQlo5VnV5ektsVXdDakZVdVhqd2xIVm1QZS9hc2ljMkVpbWhMU2JTam9PN0Nzajhjd0ZNVApKZDJTTnBncmdQYUtSUzZrdlNFMEJJU3ltVnAvb1VIcm9xUGtlUWRxa2owQk1ZU3Z4VmM4L0p3L1RvdHNvY1IvCmxIWi93VG03UldGRDVhZXpIdjJDcjNVN1ArSW1KdkNUb3JCc3VUa3B6VzF1dHIvQlNkckI3dVJNVFpPOW84UjcKS1ZhaUlmNmZYSExQanBkbkpmQXdqUT09Cg==",
  //    {
  //      "captureResolution": "1080p",
  //      "visualFeedback": {
  //        "style": "CONTOUR_RECT",
  //        "strokeColor": "0099FF",
  //        "fillColor": "220099FF"
  //      },
  //      "cutout": {
  //        "style": "rect",
  //        "alignment": "top_half",
  //        "strokeWidth": 2,
  //        "cornerRadius": 4,
  //        "strokeColor": "FFFFFF",
  //        "outerColor": "000000",
  //        "outerAlpha": 0.3,
  //        "feedbackStrokeColor": "0099FF",
  //      },
  //      "flash": {
  //        "mode": "manual",
  //        "alignment": "bottom_right"
  //      },
  //      "beepOnResult": true,
  //      "vibrateOnResult": true,
  //      "blinkAnimationOnResult": true,
  //      "cancelOnResult": true,
  //      "reportingEnabled": true,
  //      "segment": {
  //        "titles": ["Analog", "Digital"],
  //        "modes": ["ANALOG_METER", "DIGITAL_METER"],
  //        "tintColor": "CCCCCC",
  //        "offset": {
  //          "x": 0,
  //          "y": 400
  //        }
  //      }
  //    },
  //    {"nativeBarcodeEnabled": true}
  //  ],

  //no heat anymore as anyline4 does not support heater meters
  //  heatConfigWithSegment: [
  //    "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvcHQtb3V0IiwgImlvc0lkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsICJtYWpvclZlcnNpb24iOiAiNCIsICJtYXhEYXlzTm90UmVwb3J0ZWQiOiAwLCAicGluZ1JlcG9ydGluZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiwgIldpbmRvd3MiIF0sICJzY29wZSI6IFsgIkFMTCIgXSwgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogZmFsc2UsICJzaG93V2F0ZXJtYXJrIjogdHJ1ZSwgInRvbGVyYW5jZURheXMiOiA5MCwgInZhbGlkIjogIjIwMjAtMTAtMjAiLCAid2luZG93c0lkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0gfQpJYzVHSWVpdTBUYmJoQjE4T2poeHllY1g3Q296NWorR1o2azVtanJTUUtxVFYrYWRKODk4MHA2QmZ6UVdoK1ZyCnF6UE4yTURuWnFNSTcwUk13NHFGV0VJek16Z1J2ZUg3ZzhYM3RHbUcyUTdzazh0Y1Q1Zk5aditNNmpTeXQ1WG4KM010Ry9yZnp2YVRiQlo5VnV5ektsVXdDakZVdVhqd2xIVm1QZS9hc2ljMkVpbWhMU2JTam9PN0Nzajhjd0ZNVApKZDJTTnBncmdQYUtSUzZrdlNFMEJJU3ltVnAvb1VIcm9xUGtlUWRxa2owQk1ZU3Z4VmM4L0p3L1RvdHNvY1IvCmxIWi93VG03UldGRDVhZXpIdjJDcjNVN1ArSW1KdkNUb3JCc3VUa3B6VzF1dHIvQlNkckI3dVJNVFpPOW84UjcKS1ZhaUlmNmZYSExQanBkbkpmQXdqUT09Cg==",
  //    {
  //      "captureResolution": "1080p",
  //      "visualFeedback": {
  //        "style": "RECT",
  //        "strokeColor": "0099FF",
  //        "fillColor": "220099FF"
  //      },
  //      "cutout": {
  //        "style": "rect",
  //        "alignment": "top_half",
  //        "strokeWidth": 2,
  //        "cornerRadius": 4,
  //        "strokeColor": "FFFFFF",
  //        "outerColor": "000000",
  //        "outerAlpha": 0.3,
  //        "feedbackStrokeColor": "0099FF",
  //      },
  //      "flash": {
  //        "mode": "manual",
  //        "alignment": "bottom_right"
  //      },
  //      "beepOnResult": true,
  //      "vibrateOnResult": true,
  //      "blinkAnimationOnResult": true,
  //      "cancelOnResult": true,
  //      "reportingEnabled": true,
  //      "segment": {
  //        "titles": ["4 Digits", "5 Digits", "6 Digits"],
  //        "modes": ["HEAT_METER_4", "HEAT_METER_5", "HEAT_METER_6"],
  //        "tintColor": "CCCCCC",
  //        "offset": {
  //          "x": 0,
  //          "y": 500
  //        }
  //      }
  //    },
  //    {"nativeBarcodeEnabled": true}
  //  ],

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
        "id": "Meter_ID",
        "meterPlugin": {
          "scanMode": "DIGITAL_METER"
        }
      },
      "cutout": {
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
        "outerAlpha": 0.3
      },
      "scanFeedback": {
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
    localStorage.setItem("hasStartedAnyline", true);

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

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [this.licenseKey, this.meterViewPluginConfig]);
  },

  scanElectricAnalogSegment: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    localStorage.setItem("hasStartedAnyline", true);
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
    localStorage.setItem("hasStartedAnyline", true);
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
    localStorage.setItem("hasStartedAnyline", true);

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
    localStorage.setItem("hasStartedAnyline", true);

    // start the Energy scanning for the given scan mode
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#energy for energy-module details
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", this.serialNumberConfig);
  },
};

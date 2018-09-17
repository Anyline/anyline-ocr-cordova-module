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

    if(div.childElementCount >= 3) {
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

  energyConfig: [
    "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNv\n" +
    "cmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvbiIsICJpb3NJZGVudGlmaWVy\n" +
    "IjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdLCAibGljZW5zZUtl\n" +
    "eVZlcnNpb24iOiAyLCAibWFqb3JWZXJzaW9uIjogIjMiLCAicGluZ1JlcG9ydGlu\n" +
    "ZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiBdLCAic2Nv\n" +
    "cGUiOiBbICJBTEwiIF0sICJzaG93UG9wVXBBZnRlckV4cGlyeSI6IGZhbHNlLCAi\n" +
    "c2hvd1dhdGVybWFyayI6IHRydWUsICJ0b2xlcmFuY2VEYXlzIjogNjAsICJ2YWxp\n" +
    "ZCI6ICIyMDE4LTExLTEwIiB9CmNsdkt3aUN1RkhjNWU2TDF6Sm9nQWVLU1E2SnFP\n" +
    "ZmZKVjhoTnpOQWtHYTQyV2lGMW9GeGNMdXBqaUs4U3NxNDUKMTNsMWh4VnUxSmVG\n" +
    "aVFaSDdOa2E3MTJ0RnloNHQvc055ZEYvWnBRV3N0YXFDNHB3WVl1R2ltQzJoY1Ur\n" +
    "ZEtObgpIbGNMRk5CUUh2THAxUmNXK2ovOStmdzFCblFOdHB6bGxZcDVTTXI5Qlkv\n" +
    "TXZaY2Rlb1NvZmJKN2orZXBwY0dCCkQ5ZGt6eis3SG9lZC9SUk8weXBMMzZtakI2\n" +
    "LzR3VGw2WndyUk03RWhYSmZsTnVhV1Roa3djZTVOcHdyZG9ENWEKNzJPUE9OTVA0\n" +
    "T0RLZ05ZTGJtMnJKN0VHZEpvMzMrOTh3S0hWTDFyYjdtYXlXNFdYN2lZbFVqOEFZ\n" +
    "US9wV21zNwpZaXBOeUkrRGRGbElKWHdIYjJvb2VRPT0K",
    {
      "captureResolution": "1080p",
      "cutout": {
        "style": "rect",
        "alignment": "top_half",
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "FFFFFF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "feedbackStrokeColor": "0099FF",
      },
      "flash": {
        "mode": "manual",
        "alignment": "bottom_right"
      },
      "visualFeedback": {
        "style": "CONTOUR_RECT",
        "strokeColor": "0099FF",
        "fillColor": "220099FF"
      },
      "beepOnResult": true,
      "vibrateOnResult": true,
      "blinkAnimationOnResult": true,
      "cancelOnResult": true,
      "reportingEnabled": true,
    },
    {"nativeBarcodeEnabled": true}

  ],
  serialNumberConfig: [
    "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNv\n" +
    "cmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvbiIsICJpb3NJZGVudGlmaWVy\n" +
    "IjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdLCAibGljZW5zZUtl\n" +
    "eVZlcnNpb24iOiAyLCAibWFqb3JWZXJzaW9uIjogIjMiLCAicGluZ1JlcG9ydGlu\n" +
    "ZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiBdLCAic2Nv\n" +
    "cGUiOiBbICJBTEwiIF0sICJzaG93UG9wVXBBZnRlckV4cGlyeSI6IGZhbHNlLCAi\n" +
    "c2hvd1dhdGVybWFyayI6IHRydWUsICJ0b2xlcmFuY2VEYXlzIjogNjAsICJ2YWxp\n" +
    "ZCI6ICIyMDE4LTExLTEwIiB9CmNsdkt3aUN1RkhjNWU2TDF6Sm9nQWVLU1E2SnFP\n" +
    "ZmZKVjhoTnpOQWtHYTQyV2lGMW9GeGNMdXBqaUs4U3NxNDUKMTNsMWh4VnUxSmVG\n" +
    "aVFaSDdOa2E3MTJ0RnloNHQvc055ZEYvWnBRV3N0YXFDNHB3WVl1R2ltQzJoY1Ur\n" +
    "ZEtObgpIbGNMRk5CUUh2THAxUmNXK2ovOStmdzFCblFOdHB6bGxZcDVTTXI5Qlkv\n" +
    "TXZaY2Rlb1NvZmJKN2orZXBwY0dCCkQ5ZGt6eis3SG9lZC9SUk8weXBMMzZtakI2\n" +
    "LzR3VGw2WndyUk03RWhYSmZsTnVhV1Roa3djZTVOcHdyZG9ENWEKNzJPUE9OTVA0\n" +
    "T0RLZ05ZTGJtMnJKN0VHZEpvMzMrOTh3S0hWTDFyYjdtYXlXNFdYN2lZbFVqOEFZ\n" +
    "US9wV21zNwpZaXBOeUkrRGRGbElKWHdIYjJvb2VRPT0K",
    {
      "captureResolution": "1080p",
      "cutout": {
        "style": "rect",
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
      "visualFeedback": {
        "style": "CONTOUR_RECT",
        "strokeColor": "0099FF",
        "fillColor": "220099FF"
      },
      "beepOnResult": true,
      "vibrateOnResult": true,
      "blinkAnimationOnResult": true,
      "cancelOnResult": true,
      "reportingEnabled": true,
      "serialNumber": {
        "numberCharWhitelist": '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        "validationRegex": '^[0-9A-Z]{5,}$'
      }
    },
    {"nativeBarcodeEnabled": true}

  ],

  energyConfigWithSegment: [
    "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNv\n" +
    "cmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvbiIsICJpb3NJZGVudGlmaWVy\n" +
    "IjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdLCAibGljZW5zZUtl\n" +
    "eVZlcnNpb24iOiAyLCAibWFqb3JWZXJzaW9uIjogIjMiLCAicGluZ1JlcG9ydGlu\n" +
    "ZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiBdLCAic2Nv\n" +
    "cGUiOiBbICJBTEwiIF0sICJzaG93UG9wVXBBZnRlckV4cGlyeSI6IGZhbHNlLCAi\n" +
    "c2hvd1dhdGVybWFyayI6IHRydWUsICJ0b2xlcmFuY2VEYXlzIjogNjAsICJ2YWxp\n" +
    "ZCI6ICIyMDE4LTExLTEwIiB9CmNsdkt3aUN1RkhjNWU2TDF6Sm9nQWVLU1E2SnFP\n" +
    "ZmZKVjhoTnpOQWtHYTQyV2lGMW9GeGNMdXBqaUs4U3NxNDUKMTNsMWh4VnUxSmVG\n" +
    "aVFaSDdOa2E3MTJ0RnloNHQvc055ZEYvWnBRV3N0YXFDNHB3WVl1R2ltQzJoY1Ur\n" +
    "ZEtObgpIbGNMRk5CUUh2THAxUmNXK2ovOStmdzFCblFOdHB6bGxZcDVTTXI5Qlkv\n" +
    "TXZaY2Rlb1NvZmJKN2orZXBwY0dCCkQ5ZGt6eis3SG9lZC9SUk8weXBMMzZtakI2\n" +
    "LzR3VGw2WndyUk03RWhYSmZsTnVhV1Roa3djZTVOcHdyZG9ENWEKNzJPUE9OTVA0\n" +
    "T0RLZ05ZTGJtMnJKN0VHZEpvMzMrOTh3S0hWTDFyYjdtYXlXNFdYN2lZbFVqOEFZ\n" +
    "US9wV21zNwpZaXBOeUkrRGRGbElKWHdIYjJvb2VRPT0K",
    {
      "captureResolution": "1080p",
      "visualFeedback": {
        "style": "CONTOUR_RECT",
        "strokeColor": "0099FF",
        "fillColor": "220099FF"
      },
      "cutout": {
        "style": "rect",
        "alignment": "top_half",
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "FFFFFF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "feedbackStrokeColor": "0099FF",
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
        "modes": ["ANALOG_METER", "DIGITAL_METER"],
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
    "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNv\n" +
    "cmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvbiIsICJpb3NJZGVudGlmaWVy\n" +
    "IjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdLCAibGljZW5zZUtl\n" +
    "eVZlcnNpb24iOiAyLCAibWFqb3JWZXJzaW9uIjogIjMiLCAicGluZ1JlcG9ydGlu\n" +
    "ZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiBdLCAic2Nv\n" +
    "cGUiOiBbICJBTEwiIF0sICJzaG93UG9wVXBBZnRlckV4cGlyeSI6IGZhbHNlLCAi\n" +
    "c2hvd1dhdGVybWFyayI6IHRydWUsICJ0b2xlcmFuY2VEYXlzIjogNjAsICJ2YWxp\n" +
    "ZCI6ICIyMDE4LTExLTEwIiB9CmNsdkt3aUN1RkhjNWU2TDF6Sm9nQWVLU1E2SnFP\n" +
    "ZmZKVjhoTnpOQWtHYTQyV2lGMW9GeGNMdXBqaUs4U3NxNDUKMTNsMWh4VnUxSmVG\n" +
    "aVFaSDdOa2E3MTJ0RnloNHQvc055ZEYvWnBRV3N0YXFDNHB3WVl1R2ltQzJoY1Ur\n" +
    "ZEtObgpIbGNMRk5CUUh2THAxUmNXK2ovOStmdzFCblFOdHB6bGxZcDVTTXI5Qlkv\n" +
    "TXZaY2Rlb1NvZmJKN2orZXBwY0dCCkQ5ZGt6eis3SG9lZC9SUk8weXBMMzZtakI2\n" +
    "LzR3VGw2WndyUk03RWhYSmZsTnVhV1Roa3djZTVOcHdyZG9ENWEKNzJPUE9OTVA0\n" +
    "T0RLZ05ZTGJtMnJKN0VHZEpvMzMrOTh3S0hWTDFyYjdtYXlXNFdYN2lZbFVqOEFZ\n" +
    "US9wV21zNwpZaXBOeUkrRGRGbElKWHdIYjJvb2VRPT0K",
    {
      "captureResolution": "1080p",
      "visualFeedback": {
        "style": "RECT",
        "strokeColor": "0099FF",
        "fillColor": "220099FF"
      },
      "cutout": {
        "style": "rect",
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
      "cancelOnResult": true,
      "reportingEnabled": true,
      "segment": {
        "titles": ["4 Digits", "5 Digits", "6 Digits"],
        "modes": ["HEAT_METER_4", "HEAT_METER_5", "HEAT_METER_6"],
        "tintColor": "CCCCCC",
        "offset": {
          "x": 0,
          "y": 500
        }
      }
    },
    {"nativeBarcodeEnabled": true}
  ],

  dialConfig: [
    "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNv\n" +
    "cmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvbiIsICJpb3NJZGVudGlmaWVy\n" +
    "IjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdLCAibGljZW5zZUtl\n" +
    "eVZlcnNpb24iOiAyLCAibWFqb3JWZXJzaW9uIjogIjMiLCAicGluZ1JlcG9ydGlu\n" +
    "ZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiBdLCAic2Nv\n" +
    "cGUiOiBbICJBTEwiIF0sICJzaG93UG9wVXBBZnRlckV4cGlyeSI6IGZhbHNlLCAi\n" +
    "c2hvd1dhdGVybWFyayI6IHRydWUsICJ0b2xlcmFuY2VEYXlzIjogNjAsICJ2YWxp\n" +
    "ZCI6ICIyMDE4LTExLTEwIiB9CmNsdkt3aUN1RkhjNWU2TDF6Sm9nQWVLU1E2SnFP\n" +
    "ZmZKVjhoTnpOQWtHYTQyV2lGMW9GeGNMdXBqaUs4U3NxNDUKMTNsMWh4VnUxSmVG\n" +
    "aVFaSDdOa2E3MTJ0RnloNHQvc055ZEYvWnBRV3N0YXFDNHB3WVl1R2ltQzJoY1Ur\n" +
    "ZEtObgpIbGNMRk5CUUh2THAxUmNXK2ovOStmdzFCblFOdHB6bGxZcDVTTXI5Qlkv\n" +
    "TXZaY2Rlb1NvZmJKN2orZXBwY0dCCkQ5ZGt6eis3SG9lZC9SUk8weXBMMzZtakI2\n" +
    "LzR3VGw2WndyUk03RWhYSmZsTnVhV1Roa3djZTVOcHdyZG9ENWEKNzJPUE9OTVA0\n" +
    "T0RLZ05ZTGJtMnJKN0VHZEpvMzMrOTh3S0hWTDFyYjdtYXlXNFdYN2lZbFVqOEFZ\n" +
    "US9wV21zNwpZaXBOeUkrRGRGbElKWHdIYjJvb2VRPT0K",
    {
      "captureResolution": "1080p",
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
      "flash": {
        "mode": "manual",
        "alignment": "top_left"
      },
      "beepOnResult": true,
      "vibrateOnResult": true,
      "blinkAnimationOnResult": true,
      "cancelOnResult": true
    },
    {
      "nativeBarcodeEnabled": true
    }
  ],

  scan: function (scanMode) {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    localStorage.setItem("hasStartedAnyline", true);

    console.log("start scan with mode " + scanMode);

    var config = this.energyConfig;

    if (scanMode === 'DIAL_METER') {
      config = this.dialConfig;
    }

    // start the Energy scanning for the given scan mode
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#energy for energy-module details

    cordova.exec(this.onResult, this.onError, "AnylineSDK", scanMode, config);
  },

  scanElectricDigitalSegment: function (scanMode) {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    localStorage.setItem("hasStartedAnyline", true);

    // start the Energy scanning for the given scan mode
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#energy for energy-module details
    cordova.exec(this.onResult, this.onError, "AnylineSDK", scanMode, this.energyConfigWithSegment);
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
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "SERIAL_NUMBER", this.serialNumberConfig);
  },
};

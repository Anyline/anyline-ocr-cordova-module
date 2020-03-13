/*
 * Anyline Cordova Plugin
 * anyline.ocr.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
    var anyline = {};
}
anyline.parallelScan = {
onResult: function (result) {
    changeLoadingState(false);
    //this is called for every mrz scan result
    //the result is a json-object containing all the scaned values and check-digits
    
    console.log("Result: " + JSON.stringify(result));
    var div = document.getElementById('results');
    
    if (div.childElementCount >= 3) {
        div.removeChild(div.childNodes[div.childElementCount - 1]);
    }


      if (result.METER_PLUGIN.detectedBarcodes) {
        var detailsBarcodes = "";
        for (var i = 0; i < result.METER_PLUGIN.detectedBarcodes.length; i++) {
          detailsBarcodes += result.METER_PLUGIN.detectedBarcodes[i].value;
          detailsBarcodes += " (" + result.METER_PLUGIN.detectedBarcodes[i].format + ")";
          if (i < result.METER_PLUGIN.detectedBarcodes.length - 1) {
            detailsBarcodes += ", ";
          }
        }
      }

      div.innerHTML = "<h2>Energy Result</h2>" + "<p>"
        + "<img src=\"" + result.METER_PLUGIN.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
        + "<img src=\"" + result.METER_PLUGIN.fullImagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
        + "<b>" + result.METER_PLUGIN.meterType + ":</b> " + result.METER_PLUGIN.reading
        + (detailsBarcodes ? "<br/><i><b>Detected Barcodes:</b> " + detailsBarcodes + "</i>" : "")
        + ((result.METER_PLUGIN.confidence && result.METER_PLUGIN.confidence >= 0) ? "<br/><i><b>Confidence:</b> " + result.METER_PLUGIN.confidence + "</i>" : "")
        + "<br/><i><b>Outline Points:</b> " + result.METER_PLUGIN.outline + "</i>"
        + "</p>"
        + "<h2>Universal Serial Number Result</h2>" + "<p>"
        + "<img src=\"" + result.USNR_ID.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
        + "<b>Result: </b> " + result.USNR_ID.text
        + "<br/><i><b>Confidence:</b> " + result.USNR_ID.confidence + "</i>"
        + "<br/><i><b>Outline Points:</b> " + result.USNR_ID.outline + "</i>" + "</p>"
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
        console.log("AnylineOcr scanning canceled");
        return;
    }
    
    alert(error);
},
    
licenseKey: "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvcHQtb3V0IiwgImltYWdlUmVwb3J0Q2FjaGluZyI6IGZhbHNlLCAiaW9zSWRlbnRpZmllciI6IFsgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YS5iZXRhIiwgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIgXSwgImxpY2Vuc2VLZXlWZXJzaW9uIjogMiwgIm1ham9yVmVyc2lvbiI6ICI0IiwgIm1heERheXNOb3RSZXBvcnRlZCI6IDAsICJwaW5nUmVwb3J0aW5nIjogdHJ1ZSwgInBsYXRmb3JtIjogWyAiaU9TIiwgIkFuZHJvaWQiLCAiV2luZG93cyIgXSwgInNjb3BlIjogWyAiQUxMIiBdLCAic2hvd1BvcFVwQWZ0ZXJFeHBpcnkiOiB0cnVlLCAic2hvd1dhdGVybWFyayI6IHRydWUsICJ0b2xlcmFuY2VEYXlzIjogOTAsICJ2YWxpZCI6ICIyMDIwLTEwLTIwIiwgIndpbmRvd3NJZGVudGlmaWVyIjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdIH0KRnoxUmNxbUJ0YVRBRVl6NlNFQlhPRWxlLzlXNFVOVlJjdEJjTVhDTGVQMlRGV0dUTDdzWlB1WnJnTWkwOHlFVwpTUlp6emVNNTN2UnRoLzFVMGd5TGxzVmF0clZTd0lCMkRQbmxldnpUK3VHcGdRUUorS2w5N1dRRmljUlJ0di9VCnFjMU5md3RRMWVQREtMR05XaVZwbU94a2xIUzJ3OWV5c0ZHRHo4M20xRDZ5V2s0SkJ2MG9zOWhvak02bUtsU0MKVDZQYnJZcTkycFZRenFNUFdhZ3FoTXpvdGRDNE1YcktJY3FQbTBhc3FxRXM2VzkrM1d6aWI4NjRaSDVrM1ZqRgp3UGIzaVZqWW9aTVZFYVFGK1pQUmFoU3ZhNEhhMnhKakt0NXpkWTVtbkFKb1ZyaGVmNGYzNlFDME5ncnlkT0w3CkNFYzZxMk5acUNKSjhPLzBUT2trNmc9PQo=",
    
parallelScan: {
  "camera": {
    "captureResolution": "1080p"
  },
  "flash": {
    "mode": "manual",
    "alignment": "top_right"
  },
  "parallelViewPluginComposite": {
    "id": "DOUBLE_TARIFF_SEQUENTIAL",
    "cancelOnResult": true,
    "viewPlugins": [
      {
        "viewPlugin": {
          "plugin": {
            "id": "METER_PLUGIN",
            "meterPlugin": {
              "scanMode": "AUTO_ANALOG_DIGITAL_METER"
            }
          },
          "cutoutConfig": {
            "style": "rect",
            "alignment": "top",
            "strokeWidth": 2,
            "strokeColor": "FFFFFF",
            "cornerRadius": 4,
            "outerColor": "000000",
            "outerAlpha": 0.5,
            "feedbackStrokeColor": "0099FF",
            "offset": {
              "x": 0,
              "y": 120
            }
          },
          "scanFeedback": {
            "style": "CONTOUR_RECT",
            "strokeColor": "0099FF",
            "strokeWidth": 2,
            "fillColor": "220099FF",
            "cornerRadius": 2,
            "redrawTimeout": 200,
            "animationDuration": 75,
            "blinkOnResult": true,
            "beepOnResult": true,
            "vibrateOnResult": true
          },
          "cancelOnResult": true
        }
      },
      {
        "viewPlugin": {
          "plugin": {
            "id": "USNR_ID",
            "ocrPlugin": {
              "ocrConfig": {}
            },
            "delayStartScanTime": 1000
          },
          "cutoutConfig": {
            "style": "rect",
            "width": 720,
            "alignment": "center",
            "maxWidthPercent": "80%",
            "ratioFromSize": {
              "width": 720,
              "height": 144
            },
            "strokeWidth": 2,
            "strokeColor": "FFFFFF",
            "cornerRadius": 4,
            "outerColor": "000000",
            "outerAlpha": 0.5,
            "feedbackStrokeColor": "0099FF",
            "offset": {
              "x": 0,
              "y": 0
            }
          },
          "scanFeedback": {
            "style": "CONTOUR_RECT",
            "strokeColor": "0099FF",
            "fillColor": "220099FF",
            "beepOnResult": true,
            "vibrateOnResult": true,
            "blinkAnimationOnResult": true
          },
          "cancelOnResult": true
        }
      }
    ]
  }
            },
    
scan: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
        return;
    }
    changeLoadingState(true);
    // start the Anyline OCR scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#anylineOcrModule for module details
    
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [this.licenseKey, this.parallelScan]);
}
};


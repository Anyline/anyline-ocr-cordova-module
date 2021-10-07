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
    
licenseKey: "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsCiAgImRlYnVnUmVwb3J0aW5nIjogIm9wdC1vdXQiLAogICJpbWFnZVJlcG9ydENhY2hpbmciOiBmYWxzZSwKICAibWFqb3JWZXJzaW9uIjogIjI1IiwKICAibWF4RGF5c05vdFJlcG9ydGVkIjogNSwKICAiYWR2YW5jZWRCYXJjb2RlIjogdHJ1ZSwKICAibXVsdGlCYXJjb2RlIjogdHJ1ZSwKICAic3VwcG9ydGVkQmFyY29kZUZvcm1hdHMiOiBbCiAgICAiQUxMIgogIF0sCiAgInBpbmdSZXBvcnRpbmciOiB0cnVlLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiLAogICAgIldpbmRvd3MiCiAgXSwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogdHJ1ZSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiA5MCwKICAidmFsaWQiOiAiMjAyMi0wNS0zMCIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhLmJldGEiLAogICAgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIsCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhLmdpdGh1YiIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiCiAgXSwKICAid2luZG93c0lkZW50aWZpZXIiOiBbCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQppUHBkbWNiZlpSL2VkYlpCVUs0a2JObm1TdXV0eVFKS3p6aGRpWk5KaTdnZUszcUNmemEyQ1JnTnA2b3lSSjhUSGJzWDd6eWR1eW1XZmdXTEdHQTBJb0pMMmZNUEtiRE1DUitVNmhML0xGMVJpV0hXOXlrQ2x6S1dzd2VsZG1EN2U2RmlGeG8xY3cxckI2SUFLdEJsU05lQXZra1FPM1U4Ym5LbWtVUHRFaWl6Ylk1M3RvaSsreTc0bW0zeEVkY0tNQ0wwZXozb01NdWtETFoza3hmZU5Db3F5bXFwak05MCt6OWFWTVY1OHp4MFRzL0VsNXcyUEJoU1BWUDZ6STZUN3NzQm1HMjg4YWpGMEFQUm9BVVFjeWx4VndlWjFkbGcxQUZ5WVBPNGs3bjVBVk1GbDBYK1VjcWJQcVdac0hIbGRXaERGZkQ1ZG5zcHVUZVdBTVZ4akE9PQ==",
    
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


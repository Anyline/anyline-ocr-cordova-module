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

  onResult: function (result) {
    //set started to false
    localStorage.setItem("hasStartedAnyline", false);
    //this is called with result of the barcode module
    //the result is a string containing the barcode

    var div = document.getElementById('results');
    console.log("Barcode result: " + JSON.stringify(result));

    if (div.childElementCount >= 3) {
      div.removeChild(div.childNodes[div.childElementCount - 1]);
    }

    div.innerHTML = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/>"
      + "<br/><i><b>Outline Points:</b> " + result.outline + "</i>" + "</br>"
      + "<b>Barcode:</b> " + result.value + "</br>" + "<b>Format </b> " + result.format + "</p>" +
      div.innerHTML;

    document.getElementById("details_scan_modes").removeAttribute("open");
    document.getElementById("details_results").setAttribute("open", "");
    window.scrollTo(0, 0);
  },

  onError: function (error) {
    localStorage.setItem("hasStartedAnyline", false);
    //called if an error occurred or the user canceled the scanning
    if (error == "Canceled") {
      //when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("Barcode scanning canceled");
      return;
    }

    alert(error);
  },

  scan: function () {
    // start the barcode scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#barcode for barcode module details

    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    localStorage.setItem("hasStartedAnyline", true);

    var licenseKey = "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvcHQtb3V0IiwgImlvc0lkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsICJtYWpvclZlcnNpb24iOiAiNCIsICJtYXhEYXlzTm90UmVwb3J0ZWQiOiAwLCAicGluZ1JlcG9ydGluZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiwgIldpbmRvd3MiIF0sICJzY29wZSI6IFsgIkFMTCIgXSwgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogZmFsc2UsICJzaG93V2F0ZXJtYXJrIjogdHJ1ZSwgInRvbGVyYW5jZURheXMiOiA5MCwgInZhbGlkIjogIjIwMjAtMTAtMjAiLCAid2luZG93c0lkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0gfQpJYzVHSWVpdTBUYmJoQjE4T2poeHllY1g3Q296NWorR1o2azVtanJTUUtxVFYrYWRKODk4MHA2QmZ6UVdoK1ZyCnF6UE4yTURuWnFNSTcwUk13NHFGV0VJek16Z1J2ZUg3ZzhYM3RHbUcyUTdzazh0Y1Q1Zk5aditNNmpTeXQ1WG4KM010Ry9yZnp2YVRiQlo5VnV5ektsVXdDakZVdVhqd2xIVm1QZS9hc2ljMkVpbWhMU2JTam9PN0Nzajhjd0ZNVApKZDJTTnBncmdQYUtSUzZrdlNFMEJJU3ltVnAvb1VIcm9xUGtlUWRxa2owQk1ZU3Z4VmM4L0p3L1RvdHNvY1IvCmxIWi93VG03UldGRDVhZXpIdjJDcjNVN1ArSW1KdkNUb3JCc3VUa3B6VzF1dHIvQlNkckI3dVJNVFpPOW84UjcKS1ZhaUlmNmZYSExQanBkbkpmQXdqUT09Cg==";

    //mode "scanBarcode" is also still available (for backwards compatibility)
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [licenseKey, {
        "camera" : {
            "captureResolution" : "1080p"
        },
        "flash" : {
            "mode" : "auto",
            "alignment" : "bottom_right"
        },
        "viewPlugin" : {
            "plugin" : {
                "id" : "Barcode_ID",
                "barcodePlugin" : {
                    "barcodeFormatOptions" : ["CODABAR", "EAN_13", "UPC_A"]
                }
            },
            "cutoutConfig" : {
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
                "outerAlpha": 0.3,
                "feedbackStrokeColor": "0099FF"
            },
            "scanFeedback" : {
                "style": "rect",
                "strokeColor": "0099FF",
                "fillColor": "220099FF",
                "animationDuration": 150,
                "blinkOnResult": true,
                "beepOnResult": true,
                "vibrateOnResult": true
            },
            "cancelOnResult" : true
        },
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

/*
 * Anyline Cordova Plugin
 * anyline.document.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.document = {
  onResult: function (result) {
    localStorage.setItem("hasStartedAnyline", false);
    //this is called for every mrz scan result
    //the result is a json-object containing all the scaned values and check-digits

    console.log("Result: " + JSON.stringify(result));
    var div = document.getElementById('results');

    if(div.childElementCount >= 3) {
      div.removeChild(div.childNodes[div.childElementCount - 1]);
    }

    div.innerHTML = "<p>"
        + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
        + "<img src=\"" + result.fullImagePath + "\" width=\"100%\" height=\"auto\"/><br/>"
        + "<br/><i><b>Outline Points:</b> " + result.outline + "</i>"
        + "</p>" + div.innerHTML;

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
      console.log("AnylineOcr scanning canceled");
      return;
    }

    alert(error);
  },

  licenseKey: "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvcHQtb3V0IiwgImlvc0lkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsICJtYWpvclZlcnNpb24iOiAiNCIsICJtYXhEYXlzTm90UmVwb3J0ZWQiOiAwLCAicGluZ1JlcG9ydGluZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiwgIldpbmRvd3MiIF0sICJzY29wZSI6IFsgIkFMTCIgXSwgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogZmFsc2UsICJzaG93V2F0ZXJtYXJrIjogdHJ1ZSwgInRvbGVyYW5jZURheXMiOiA5MCwgInZhbGlkIjogIjIwMjAtMTAtMjAiLCAid2luZG93c0lkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0gfQpJYzVHSWVpdTBUYmJoQjE4T2poeHllY1g3Q296NWorR1o2azVtanJTUUtxVFYrYWRKODk4MHA2QmZ6UVdoK1ZyCnF6UE4yTURuWnFNSTcwUk13NHFGV0VJek16Z1J2ZUg3ZzhYM3RHbUcyUTdzazh0Y1Q1Zk5aditNNmpTeXQ1WG4KM010Ry9yZnp2YVRiQlo5VnV5ektsVXdDakZVdVhqd2xIVm1QZS9hc2ljMkVpbWhMU2JTam9PN0Nzajhjd0ZNVApKZDJTTnBncmdQYUtSUzZrdlNFMEJJU3ltVnAvb1VIcm9xUGtlUWRxa2owQk1ZU3Z4VmM4L0p3L1RvdHNvY1IvCmxIWi93VG03UldGRDVhZXpIdjJDcjNVN1ArSW1KdkNUb3JCc3VUa3B6VzF1dHIvQlNkckI3dVJNVFpPOW84UjcKS1ZhaUlmNmZYSExQanBkbkpmQXdqUT09Cg==",

  viewConfig: {
      "camera" : {
          "pictureResolution": "1080p",
          "captureResolution" : "720p"
      },
      "flash" : {
          "mode": "manual",
          "alignment": "bottom_left",
          "offset": {
              "x": 10,
              "y": 0
          }
      },
      "viewPlugin" : {
          "plugin" : {
              "id" : "Document_ID",
              "documentPlugin" : {
                  "documentRatios" : [0.707, 1.41, 1.58, 0.633, 1.296, 0.772],
                  "maxDocumentRatioDeviation" : 0.15,
                  "maxOutputResolution" : {
                      "width" : 1920,
                      "height" : 1080
                  }
              }
          },
          "cutoutConfig" : {
              "style": "rect",
              "maxWidthPercent": "100%",
              "maxHeightPercent": "100%",
              "ratioFromSize": {
                  "width": 10,
                  "height": 15
              },
              "alignment": "center",
              "strokeWidth": 2,
              "cornerRadius": 0,
              "outerAlpha": 0.0,
              "outerColor": "00000000",
              "strokeColor": "00000000"
          },
          "scanFeedback" : {
              "style": "RECT",
              "strokeColor": "FF0000",
              "animationDuration": 150,
              "cornerRadius": 2,
              "strokeWidth": 4,
              "blinkOnResult": true,
              "beepOnResult": false,
              "vibrateOnResult": false
          },
          "cancelOnResult" : true
      },
      "quality" : 90
  },

  scan: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    localStorage.setItem("hasStartedAnyline", true);
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [this.licenseKey, this.viewConfig]);
  }
};

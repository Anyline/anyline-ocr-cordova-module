/*
 * Anyline Cordova Plugin
 * anyline.ocr.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
  var anyline = {};
}
anyline.drivingLicense = {
  onResult: function (result) {
    localStorage.setItem("hasStartedAnyline", false);
    //this is called for every mrz scan result
    //the result is a json-object containing all the scaned values and check-digits

    console.log("Result: " + JSON.stringify(result));
    var div = document.getElementById('results');

    if(div.childElementCount >= 3) {
      div.removeChild(div.childNodes[div.childElementCount - 1]);
    }

    div.innerHTML = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>" +
            "<b>Name:</b> " + result.surNames + " " + result.givenNames + "<br/>" +
            "<br/><b>Number:</b> " + result.documentNumber + " <b>" +
            "<br/><b>Date of Birth:</b> " + result.dayOfBirth +
            "<br/><b>Expiration Date:</b> " + result.expirationDate + "<br/>" +
            "<br/><b>Issuing Date:</b> " + result.issuingDate + "<br/>" +
            "<br/><b>Authority:</b> " + result.authority +
            "<br/><b>Categories:</b> " + result.categories + "<br/>" +
            "<br/><b>Place of Birth:</b> " + result.placeOfBirth + "<br/>"
      + "<br/><i><b>Confidence:</b> " + result.confidence + "</i>"
      + "<br/><i><b>Outline Points:</b> " + result.outline + "</i>" + "</p>"
      + div.innerHTML;

    document.getElementById("details_scan_modes").removeAttribute("open");
    document.getElementById("details_results").setAttribute("open", "");
    window.scrollTo(0, 0);
  },

  onError: function (error) {
    localStorage.setItem("hasStartedAnyline", false);
    //called if an error occurred or the user canceled the scanning
    if (error === "Canceled") {
      //do stuff when user has canceled
      // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
      console.log("Anyline ID scanning canceled");
      return;
    }

    alert(error);
  },

licenseKey: "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvcHQtb3V0IiwgImlvc0lkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsICJtYWpvclZlcnNpb24iOiAiNCIsICJtYXhEYXlzTm90UmVwb3J0ZWQiOiAwLCAicGluZ1JlcG9ydGluZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiwgIldpbmRvd3MiIF0sICJzY29wZSI6IFsgIkFMTCIgXSwgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogZmFsc2UsICJzaG93V2F0ZXJtYXJrIjogdHJ1ZSwgInRvbGVyYW5jZURheXMiOiA5MCwgInZhbGlkIjogIjIwMjAtMTAtMjAiLCAid2luZG93c0lkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0gfQpJYzVHSWVpdTBUYmJoQjE4T2poeHllY1g3Q296NWorR1o2azVtanJTUUtxVFYrYWRKODk4MHA2QmZ6UVdoK1ZyCnF6UE4yTURuWnFNSTcwUk13NHFGV0VJek16Z1J2ZUg3ZzhYM3RHbUcyUTdzazh0Y1Q1Zk5aditNNmpTeXQ1WG4KM010Ry9yZnp2YVRiQlo5VnV5ektsVXdDakZVdVhqd2xIVm1QZS9hc2ljMkVpbWhMU2JTam9PN0Nzajhjd0ZNVApKZDJTTnBncmdQYUtSUzZrdlNFMEJJU3ltVnAvb1VIcm9xUGtlUWRxa2owQk1ZU3Z4VmM4L0p3L1RvdHNvY1IvCmxIWi93VG03UldGRDVhZXpIdjJDcjNVN1ArSW1KdkNUb3JCc3VUa3B6VzF1dHIvQlNkckI3dVJNVFpPOW84UjcKS1ZhaUlmNmZYSExQanBkbkpmQXdqUT09Cg==",
  
drivingLicenseConfig: {
    "camera" : {
        "captureResolution" : "1080p"
    },
    "flash" : {
        "mode" : "manual",
        "alignment" : "bottom_left"
    },
    "viewPlugin" : {
        "plugin" : {
            "id" : "IDPlugin_ID",
            "idPlugin" : {
                "drivingLicenseConfig" : {
                    "scanMode" : "AUTO"
                }
            }
        },
        "cutoutConfig" : {
            "style": "rect",
            "maxWidthPercent": "100%",
            "maxHeightPercent": "100%",
            "alignment": "center",
            "ratioFromSize": {
                "width": 134,
                "height": 85
            },
            "strokeWidth": 2,
            "cornerRadius": 4,
            "strokeColor": "FFFFFF",
            "outerAlpha": 0.3,
            "outerColor": "000000",
            "feedbackStrokeColor": "0099FF"
        },
        "scanFeedback" : {
            "style": "CONTOUR_POINT",
            "strokeColor": "0099FF",
            "strokeWidth": 2,
            "blinkOnResult": true,
            "beepOnResult": true,
            "vibrateOnResult": true
        },
        "cancelOnResult" : true
    }
},

  scan: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }

    localStorage.setItem("hasStartedAnyline", true);
    // start the Anyline ID scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // see https://documentation.anyline.com/toc/products/id/driving_license/index.html for plugin details

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [
                                                                     this.licenseKey,
                                                                     this.drivingLicenseConfig
                                                                     ]);
  },
};

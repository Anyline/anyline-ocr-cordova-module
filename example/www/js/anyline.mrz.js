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
  onResult: function (result) {
    localStorage.setItem("hasStartedAnyline", false);
    //this is called for every mrz scan result
    //the result is a json-object containing all the scaned values and check-digits

    console.log("MRZ result: " + JSON.stringify(result));
    var div = document.getElementById('results');

    if (div.childElementCount >= 3) {
      div.removeChild(div.childNodes[div.childElementCount - 1]);
    }

    div.innerHTML = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>" +
      "<b>Name:</b> " + result.surNames + " " + result.givenNames + "<br/>" + "<b>Type:</b> " + result.documentType +
      "<br/><b>Number:</b> " + result.documentNumber + " <b>" +
      "<br/>Country:</b> " + result.nationalityCountryCode + "[" + result.issuingCountryCode + "]" +
      "<br/><b>Date of Birth:</b> " + result.dayOfBirth +
      "<br/><b>Expiration Date:</b> " + result.expirationDate + "<br/>" +
      "<br/><b>Date of Birth Date Object:</b> " + result.dayOfBirthObject +
      "<br/><b>Expiration Date Object:</b> " + result.expirationDateObject +
      (result.address ? "<br/><b>Address:</b>" + result.address : "") + "<br/>" +
      "<br/><i><b>Confidence:</b> " + result.confidence + "</i>" +
      "<br/><i><b>Outline Points:</b>" + result.outline + "</i>" +
      "<br/><i><b>Checksum:</b>" + result.allCheckDigitsValid + "</i>"+
      "</p>" + div.innerHTML;


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
      console.log("MRZ scanning canceled");
      return;
    }

    alert(error);
  },
    
anylineMRZViewConfig: {
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
                "mrzConfig" : {
                    "strictMode" : false,
                    "cropAndTransformID" : false
                }
            }
        },
        "cutoutConfig" : {
            "style": "rect",
            "maxWidthPercent": "90%",
            "maxHeightPercent": "90%",
            "alignment": "center",
            "ratioFromSize": {
                "width": 125,
                "height": 85
            },
            "strokeWidth": 2,
            "cornerRadius": 4,
            "strokeColor": "FFFFFF",
            "outerColor": "000000",
            "outerAlpha": 0.3,
            "cropPadding": {
                "x": 0,
                "y": 0
            },
            "cropOffset": {
                "x": 0,
                "y": 0
            },
            "feedbackStrokeColor": "0099FF",
            "offset": {
                "x": 0,
                "y": 30
            }
        },
        "scanFeedback" : {
            "style": "rect",
            "strokeColor": "0099FF",
            "strokeWidth": 2,
            "blinkOnResult": true,
            "beepOnResult": true,
            "vibrateOnResult": true
        },
        "cancelOnResult" : true
    },
    "cropAndTransformErrorMessage": "Edges are not detected"
},

  scan: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
      return;
    }
    localStorage.setItem("hasStartedAnyline", true);
    // start the MRZ scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#mrz for module details

    var licenseKey = "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvcHQtb3V0IiwgImlvc0lkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsICJtYWpvclZlcnNpb24iOiAiNCIsICJtYXhEYXlzTm90UmVwb3J0ZWQiOiAwLCAicGluZ1JlcG9ydGluZyI6IHRydWUsICJwbGF0Zm9ybSI6IFsgImlPUyIsICJBbmRyb2lkIiwgIldpbmRvd3MiIF0sICJzY29wZSI6IFsgIkFMTCIgXSwgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogZmFsc2UsICJzaG93V2F0ZXJtYXJrIjogdHJ1ZSwgInRvbGVyYW5jZURheXMiOiA5MCwgInZhbGlkIjogIjIwMjAtMTAtMjAiLCAid2luZG93c0lkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0gfQpJYzVHSWVpdTBUYmJoQjE4T2poeHllY1g3Q296NWorR1o2azVtanJTUUtxVFYrYWRKODk4MHA2QmZ6UVdoK1ZyCnF6UE4yTURuWnFNSTcwUk13NHFGV0VJek16Z1J2ZUg3ZzhYM3RHbUcyUTdzazh0Y1Q1Zk5aditNNmpTeXQ1WG4KM010Ry9yZnp2YVRiQlo5VnV5ektsVXdDakZVdVhqd2xIVm1QZS9hc2ljMkVpbWhMU2JTam9PN0Nzajhjd0ZNVApKZDJTTnBncmdQYUtSUzZrdlNFMEJJU3ltVnAvb1VIcm9xUGtlUWRxa2owQk1ZU3Z4VmM4L0p3L1RvdHNvY1IvCmxIWi93VG03UldGRDVhZXpIdjJDcjNVN1ArSW1KdkNUb3JCc3VUa3B6VzF1dHIvQlNkckI3dVJNVFpPOW84UjcKS1ZhaUlmNmZYSExQanBkbkpmQXdqUT09Cg==";
      
      

    //mode "scanMRZ" is also still available (for backwards compatibility)
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [licenseKey, this.anylineMRZViewConfig]);
  }
};

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
    changeLoadingState(false);
    //this is called for every mrz scan result
    //the result is a json-object containing all the scaned values and check-digits
    
    console.log("MRZ result: " + JSON.stringify(result));
    var div = document.getElementById('results');
    
    if (div.childElementCount >= 3) {
        div.removeChild(div.childNodes[div.childElementCount - 1]);
    }


    div.innerHTML = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>" +
    "<b>Name:</b> " + result.surname + " " + result.givenNames + "<br/>" + "<b>Type:</b> " + result.documentType +
    "<br/><b>Number:</b> " + result.documentNumber + " <b>" +
    "<br/>Country:</b> " + result.nationalityCountryCode + "[" + result.issuingCountryCode + "]" +
    "<br/><b>Date of Birth:</b> " + result.dateOfBirth +
    "<br/><b>Expiration Date:</b> " + result.dateOfExpiry + "<br/>" +
    "<br/><b>Date of Birth Date Object:</b> " + result.dateOfBirthObject +
    "<br/><b>Date Of Expiry Object:</b> " + result.dateOfExpiryObject +
    "</p>" +
    "<p>" +
    (result.vizSurname ? "<br/><b>VIZ Surname:</b> " + result.vizSurname : "") + "<div/>" +
    (result.vizGivenNames ? "<br/><b>VIZ Given Names:</b> " + result.vizGivenNames : "") + "<div/>" +
    (result.vizDateOfIssue ? "<br/><b>VIZ Date of issue:</b> " + result.vizDateOfIssue : "") + "<div/>" +
    (result.vizDateOfIssueObject ? "<br/><b>VIZ Date of issue object:</b> " + result.vizDateOfIssueObject : "") + "<div/>" +
    (result.vizDateOfBirth ? "<br/><b>VIZ Date of birth:</b> " + result.vizDateOfBirth : "") + "<div/>" +
    (result.vizDateOfBirthObject ? "<br/><b>VIZ Date of birth object:</b> " + result.vizDateOfBirthObject : "") + "<div/>" +
    (result.vizDateOfExpiry ? "<br/><b>VIZ Date of Expiry:</b> " + result.vizDateOfExpiry : "") + "<div/>" +
    (result.vizDateOfExpiryObject ? "<br/><b>VIZ Date of Expiry object:</b> " + result.vizDateOfExpiryObject : "") + "<div/>" +
    (result.vizAddress ? "<br/><b>VIZ Address:</b> " + result.vizAddress : "") + "<div />" +
    "</p>" +

    "<p>" +
        "<br/><b>CONFIDENCE:</b>" +
        "<br/><b>Surname:</b> " + result.fieldConfidences.surname +
        "<br/><b>GivenNames :</b> " + result.fieldConfidences.givenNames +
        "<br/><b>Sex:</b> " + result.fieldConfidences.sex +
        "<br/><b>Personal Number:</b> " + result.fieldConfidences.personalNumber +
        "<br/><b>Optional Data:</b> " + result.fieldConfidences.optionalData +
        "<br/><b>Issuing Country Code:</b> " + result.fieldConfidences.issuingCountryCode +
        "<br/><b>Document Type:</b> " + result.fieldConfidences.documentType +
        "<br/><b>Document Number:</b> " + result.fieldConfidences.documentNumber +
        "<br/><b>Date Of Expiry:</b> " + result.fieldConfidences.dateOfExpiry +
        "<br/><b>Date Of Birth:</b> " + result.fieldConfidences.dateOfBirth +
        "<br/><b>Check Digit Personal Number:</b> " + result.fieldConfidences.checkDigitPersonalNumber +
        "<br/><b>Check Digit Final:</b> " + result.fieldConfidences.checkDigitFinal +
        "<br/><b>Check Digit Document Number:</b> " + result.fieldConfidences.checkDigitDocumentNumber +
        "<br/><b>Check Digit Date Of Expiry:</b> " + result.fieldConfidences.checkDigitDateOfExpiry +
        "<br/><b>Check Digit Date Of Birth:</b> " + result.fieldConfidences.checkDigitDateOfBirth +
        "<br/><b>Viz Date Of Issue :</b> " + result.fieldConfidences.vizDateOfIssue +
        "<br/><b>viz Date Of Birth:</b> " + result.fieldConfidences.vizDateOfBirth +
        "<br/><b>viz Date Of Expiry:</b> " + result.fieldConfidences.vizDateOfExpiry +
        "<br/><b>viz Address:</b> " + result.fieldConfidences.vizAddress +
        "<br/><b>viz GivenNames:</b> " + result.fieldConfidences.vizGivenNames +
        "<br/><b>viz Surname:</b> " + result.fieldConfidences.vizSurname +

    "</p>" +
    "<p>" +
    "<br/><i><b>Confidence:</b> " + result.confidence + "</i>" +
    "<br/><i><b>Outline Points:</b> " + result.outline + "</i>" +
    "<br/><i><b>Checksum:</b> " + result.allCheckDigitsValid + "</i>"+
    "</p>" + div.innerHTML;
    
    
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
        console.log("MRZ scanning canceled");
        return;
    }
    
    alert(error);
},
    
anylineMRZViewConfig: {
    "camera": {
      "captureResolution": "1080p"
    },
    "flash": {
      "mode": "manual",
      "alignment": "bottom_left"
    },
    "viewPlugin" : {
      "plugin" : {
          "id" : "IDPlugin_ID",
          "idPlugin" : {
              "mrzConfig" : {
                "strictMode" : false,
                 "cropAndTransformID" : false,
                 "mrzFieldScanOptions": {
                   "vizAddress" : "default",
                   "vizDateOfIssue" : "default",
                   "vizSurname" : "default",
                   "vizGivenNames" : "default",
                   "vizDateOfBirth" : "default",
                   "vizDateOfExpiry" : "default",
                  }
              }
          }
      },
      "cutoutConfig": {
        "style": "rect",
        "maxWidthPercent": "90%",
        "maxHeightPercent": "90%",
        "width" : 972,
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
          "x": -30,
          "y": -90
        },
        "cropOffset": {
          "x": 0,
          "y": 90
        },
        "feedbackStrokeColor": "0099FF",
        "offset": {
          "x": 0,
          "y": 30
        }
      },
      "scanFeedback": {
        "style": "rect",
        "strokeColor": "0099FF",
        "strokeWidth": 2,
        "blinkOnResult": true,
        "beepOnResult": true,
        "vibrateOnResult": true
      },
      "cancelOnResult": true
    },
    "cropAndTransformErrorMessage": "Edges are not detected"
},
    
scan: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
        return;
    }
    changeLoadingState(true);
    // start the MRZ scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#mrz for module details
    
    var licenseKey = "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsCiAgImRlYnVnUmVwb3J0aW5nIjogIm9wdC1vdXQiLAogICJpbWFnZVJlcG9ydENhY2hpbmciOiBmYWxzZSwKICAibWFqb3JWZXJzaW9uIjogIjQiLAogICJtYXhEYXlzTm90UmVwb3J0ZWQiOiAwLAogICJhZHZhbmNlZEJhcmNvZGUiOiBmYWxzZSwKICAicGluZ1JlcG9ydGluZyI6IHRydWUsCiAgInBsYXRmb3JtIjogWwogICAgImlPUyIsCiAgICAiQW5kcm9pZCIsCiAgICAiV2luZG93cyIKICBdLAogICJzY29wZSI6IFsKICAgICJBTEwiCiAgXSwKICAic2hvd1BvcFVwQWZ0ZXJFeHBpcnkiOiB0cnVlLAogICJzaG93V2F0ZXJtYXJrIjogdHJ1ZSwKICAidG9sZXJhbmNlRGF5cyI6IDkwLAogICJ2YWxpZCI6ICIyMDIyLTEwLTIwIiwKICAiaW9zSWRlbnRpZmllciI6IFsKICAgICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEuYmV0YSIsCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0sCiAgImFuZHJvaWRJZGVudGlmaWVyIjogWwogICAgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJ3aW5kb3dzSWRlbnRpZmllciI6IFsKICAgICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiCiAgXQp9Ck50KzdSZkhqWTdqMVZUeGdBeDR6bG5jdTl3b2N5eVhOOWhlcHlZaTB2a013M0FiZmJmYmd1TUNHaGFBVWdCam1WOHppcDMySTFJSUQ5VmlQYTdHdDlMTkk5dXgrTmVaY1NTSmtBSm5jZm9QNXdWTlBWV3BFT1ZSaXFRU0Q2eUpuOTRpTUpWczlpZ2xyQmlldjIvdG9BTUxwT2h1ejY5b3pGNG9jU0x1dk1Bem1Zck1aZ0NlU2h3cWNrVzl1aENZK2VxNjU1dmhVdjV3ZitPT3ZkR0VBVGhvS0t2ZklkM1NjNEhEQzB5L0tES2NLZHlVWFd4YVhlaTBZaWkxM1dWVkxMWHNwZkNXS1hxbFZMUGhDR3hyY21SSWtlYmFobVhSZjRRbWNEcWJscks1NlNRbU4wK0FTaElBVzBNVFNkNDlScGZpblZkVzU4SmpCdmt1U2VlMmc5Zz09";
    
    
    
    //mode "scanMRZ" is also still available (for backwards compatibility)
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [licenseKey, this.anylineMRZViewConfig]);
}
};



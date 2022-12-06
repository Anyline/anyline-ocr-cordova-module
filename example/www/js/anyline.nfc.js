/*
 * Anyline Cordova Plugin
 * anyline.mrz.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
    var anyline = {};
}
anyline.nfc = {
onResult: function (result) {
    changeLoadingState(false);
    //this is called for every mrz scan result
    //the result is a json-object containing all the scaned values and check-digits
    
    console.log("MRZ+NFC result: " + JSON.stringify(result));
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
        "<br/><b>nfcResult DataGroup1:</b>" +
        "<br/><b>Date Of Birth:</b> " + result.nfcResult.dataGroup1.dateOfBirth +
        "<br/><b>Date Of Expiry :</b> " + result.nfcResult.dataGroup1.dateOfExpiry +
        "<br/><b>documentNumber:</b> " + result.nfcResult.dataGroup1.documentNumber +
        "<br/><b>documentType:</b> " + result.nfcResult.dataGroup1.documentType +
        "<br/><b>firstName:</b> " + result.nfcResult.dataGroup1.firstName +
        "<br/><b>gender:</b> " + result.nfcResult.dataGroup1.gender +
        "<br/><b>issuingStateCode:</b> " + result.nfcResult.dataGroup1.issuingStateCode +
        "<br/><b>Document Number:</b> " + result.nfcResult.dataGroup1.documentNumber +
        "<br/><b>lastName:</b> " + result.nfcResult.dataGroup1.lastName +
        "<br/><b>nationality:</b> " + result.nfcResult.dataGroup1.nationality +
    
        "<br/><b>nfcResult DataGroup2: NFC Image</b>" +
        "<img src=\"" + result.nfcResult.dataGroup2.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>" +
    "</p>" +
    "<p>" +
    "<br/><i><b>MRZ Confidence:</b> " + result.confidence + "</i>" +
    "<br/><i><b>MRZ Outline Points:</b> " + result.outline + "</i>" +
    "<br/><i><b>MRZ Checksum:</b> " + result.allCheckDigitsValid + "</i>"+
    "</p>"
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
        console.log("MRZ+NFC scanning canceled");
        return;
    }
    
    alert(error);
},
    
anylineMRZAndNFCViewConfig: {
    "camera" : {
        "captureResolution" : "1080p"
    },
    "flash" : {
        "mode" : "manual",
        "alignment" : "bottom_left"
    },
    "viewPlugin" : {
        "plugin": {
		    "id": "ID_NFC",
		    "nfcPlugin": {
		      "mrzConfig": {
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
    changeLoadingState(true);
    // start the MRZ scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#mrz for module details
    
    var licenseKey = "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6ICIzLjAiLAogICJkZWJ1Z1JlcG9ydGluZyI6ICJwaW5nIiwKICAibWFqb3JWZXJzaW9uIjogIjM3IiwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgIm1heERheXNOb3RSZXBvcnRlZCI6IDUsCiAgImFkdmFuY2VkQmFyY29kZSI6IHRydWUsCiAgIm11bHRpQmFyY29kZSI6IHRydWUsCiAgInN1cHBvcnRlZEJhcmNvZGVGb3JtYXRzIjogWwogICAgIkFMTCIKICBdLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiCiAgXSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiAzMCwKICAidmFsaWQiOiAiMjAyMy0xMi0xMiIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiY29tLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJjb20uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQpxUWxkWFVhSVBHaWhUWlVPL3ljSS9rR0UxcXJ5ZEs1cFh4UUJybk81TFZDaExlK1V3N0tGRkNMNnFSNnptUUVMdG1zVkUxZXJORHdYMW5XY3JtdlhKTFd4N2pjc2l3YXc3SUdubCtQRnd1NnpzS3ZjTTNWMk1peFRDZVBodUQrMzFRRTh1ZE84ZTdYS0NGa0lYd3BwOWdTYk03dDBqYitoTWc2S0dPd0dCVElnajIzVzdFZGdRaGlmZ2tOMGYxMHB4SWVZVzFBK21wcjQ1bTA2Ujc2dWZxSXhsc0lnVDhKbjFKV2haczFWOUFwR25zWUU4c3lVcnZuTXQvaTVvWTJ4YUpZdGE4cnJUZ0Rnc1ZHcUhvNjNrWTVQTllyNlRTWnRNcDBJTDFxTlFIakgrR1loQitIZm9hRzBLVXRkcTVsYW5mU2RESEpzV2F4NUtTQ01OdVNOZUE9PQ==";
    
    
    
    //mode "scanMRZ" is also still available (for backwards compatibility)
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [licenseKey, this.anylineMRZAndNFCViewConfig]);
}
};



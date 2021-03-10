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
      changeLoadingState(false);
      //this is called for every mrz scan result
      //the result is a json-object containing all the scaned values and check-digits
  
      console.log("Result: " + JSON.stringify(result));
      var div = document.getElementById('results');
  
      if(div.childElementCount >= 3) {
        div.removeChild(div.childNodes[div.childElementCount - 1]);
      }
  
      div.innerHTML = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>" +
              "<b>Name:</b> " + result.surname + " " + result.givenNames + "<br/>" +
              "<br/><b>Number:</b> " + result.documentNumber + " <b>" +
              "<br/><b>Date of Birth:</b> " + result.dateOfBirth +
              "<br/><b>Expiration Date:</b> " + result.dateOfExpiry + "<br/>" +
              "<br/><b>Issuing Date:</b> " + result.dateOfIssue + "<br/>" +
              "<br/><b>Authority:</b> " + result.authority +
              "<br/><b>Categories:</b> " + result.categories + "<br/>" +
              "<br/><b>Day of Birth Object:</b> " + result.dateOfBirthObject +
              "<br/><b>Place Of Birth:</b> " + result.placeOfBirth +
              "<br/><b>Issuing Date Object:</b> " + result.dateOfIssueObject +
               (result.dateOfExpiryObject ? "<br/><b>Expiration Date Object:</b>" + result.dateOfExpiryObject : "") + "<br/>" +
         "<p>" +
                "<br/><b>CONFIDENCE:</b>" +
                "<br/><b>Document Number:</b> " + result.fieldConfidences.documentNumber +
                "<br/><b>GivenNames :</b> " + result.fieldConfidences.givenNames +
                "<br/><b>Surname:</b> " + result.fieldConfidences.surname +
                "<br/><b>Date of Birth:</b> " + result.fieldConfidences.dateOfBirth +
                "<br/><b>Expiration Date:</b> " + result.fieldConfidences.dateOfExpiry +
                "<br/><b>Issuing Date:</b> " + result.fieldConfidences.dateOfIssue +
                "<br/><b>Authority:</b> " + result.fieldConfidences.authority +
                "<br/><b>Categories:</b> " + result.fieldConfidences.categories +
                "<br/><b>Place Of Birth:</b> " + result.fieldConfidences.placeOfBirth +
            "</p>" +
  
        + "<br/><i><b>Confidence:</b> " + result.confidence + "</i>"
        + "<br/><i><b>Outline Points:</b> " + result.outline + "</i>" + "</p>"
        + div.innerHTML;
  
      document.getElementById("details_scan_modes").removeAttribute("open");
      document.getElementById("details_results").setAttribute("open", "");
      window.scrollTo(0, 0);
    },
  
    onError: function (error) {
      changeLoadingState(false);
      //called if an error occurred or the user canceled the scanning
      if (error === "Canceled") {
        //do stuff when user has canceled
        // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
        console.log("Anyline ID scanning canceled");
        return;
      }
  
      alert(error);
    },
  
  licenseKey: "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsCiAgImRlYnVnUmVwb3J0aW5nIjogIm9wdC1vdXQiLAogICJpbWFnZVJlcG9ydENhY2hpbmciOiBmYWxzZSwKICAibWFqb3JWZXJzaW9uIjogIjI1IiwKICAibWF4RGF5c05vdFJlcG9ydGVkIjogNSwKICAiYWR2YW5jZWRCYXJjb2RlIjogdHJ1ZSwKICAibXVsdGlCYXJjb2RlIjogdHJ1ZSwKICAic3VwcG9ydGVkQmFyY29kZUZvcm1hdHMiOiBbCiAgICAiQUxMIgogIF0sCiAgInBpbmdSZXBvcnRpbmciOiB0cnVlLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiLAogICAgIldpbmRvd3MiCiAgXSwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogdHJ1ZSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiA5MCwKICAidmFsaWQiOiAiMjAyMi0wNS0zMCIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhLmJldGEiLAogICAgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiCiAgXSwKICAid2luZG93c0lkZW50aWZpZXIiOiBbCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQp1alBHWTFXU2dhajJIejc2dFpYMkptQ29lMGRFNHRsOXBFNkVhcFZMbFZyUU81bEtrUTh3VDJHZDlHS2l4YU4rRmNhdm1QTUZvY0Q3Tlp0RWRBbGZVREQzZXM5WHBVR2VESjRSaDNUbnQ1aWlyZWE3RjhUbUl0dWdrajN0Y3ZqNktReUlwY3NsN3Y0TFZkNHFNRm1mMWIyM1ZCdHVsVjloY092dGRDbzBvT2VqdEJ2cVdmckM3enRwRkNjaTlueHhoTStvRCtxdEpiZ2NVZ2pHQjExZ1dqcU1NMDUvTkdoK0hESHdjN2tmMXNHR3FiWkhxM3hYRk5FZ1FIamdLR2l6ckNrSjhQNDVscjVKb3JrUVFiQVlqL0VaT3Fvdmd1YlNTRzdzeVBpSklvQUFoWGxwOU5uR2pySkl4Mi92bFNqcUFSRnZZUUIwNHozTEQxeW1JTU5Tanc9PQ==",
    
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
              "maxWidthPercent": "99%",
              "maxHeightPercent": "99%",
              "alignment": "center",
              "offset": {
                  "x": 1,
                  "y": 0
              },
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
  
      changeLoadingState(true);
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
  


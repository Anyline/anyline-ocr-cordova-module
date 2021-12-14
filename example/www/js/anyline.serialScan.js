/*
 * Anyline Cordova Plugin
 * anyline.ocr.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
    var anyline = {};
}
anyline.serialScan = {
onResult: function (result) {
    changeLoadingState(false);
    //this is called for every mrz scan result
    //the result is a json-object containing all the scaned values and check-digits
    
    console.log("Result: " + JSON.stringify(result));
    var div = document.getElementById('results');
    
    if (div.childElementCount >= 3) {
        div.removeChild(div.childNodes[div.childElementCount - 1]);
    }
    
    div.innerHTML = "<h2>LicensePlate Result</h2>" + "<p>" +
    "<img src=\"" + result.LPT.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>" +
    "<b>Result (LicensePlate): </b> " + result.LPT.licensePlate + "<br/>" +
    "<b>Country (LicensePlate): </b> " + result.LPT.country + "<br/>" +
    "</p>" +
    "<h2>DrivingLicense Result (snippet)</h2>" + "<p>" +
    "<img src=\"" + result.DRIVING_LICENSE.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>" +
    "<b>Surname (DrivingLicense): </b> " + result.DRIVING_LICENSE.surname + "<br/>" +
    "<b>GivenNames (DrivingLicense): </b> " + result.DRIVING_LICENSE.givenNames + "<br/>" +
    "<b>Date of Birth (DrivingLicense): </b> " + result.DRIVING_LICENSE.dateOfBirth + "<br/>" +
    "</p>" +
    "<h2>Vehicle Identification Number Result</h2>" + "<p>" +
    "<img src=\"" + result.VIN.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>" +
    "<b>Result (VIN): </b> " + result.VIN.text + "<br/>" +
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
        console.log("AnylineOcr scanning canceled");
        return;
    }
    
    alert(error);
},
    
licenseKey: "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsCiAgImRlYnVnUmVwb3J0aW5nIjogIm9wdC1vdXQiLAogICJpbWFnZVJlcG9ydENhY2hpbmciOiBmYWxzZSwKICAibWFqb3JWZXJzaW9uIjogIjI1IiwKICAibWF4RGF5c05vdFJlcG9ydGVkIjogNSwKICAiYWR2YW5jZWRCYXJjb2RlIjogdHJ1ZSwKICAibXVsdGlCYXJjb2RlIjogdHJ1ZSwKICAic3VwcG9ydGVkQmFyY29kZUZvcm1hdHMiOiBbCiAgICAiQUxMIgogIF0sCiAgInBpbmdSZXBvcnRpbmciOiB0cnVlLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiLAogICAgIldpbmRvd3MiCiAgXSwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogdHJ1ZSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiA5MCwKICAidmFsaWQiOiAiMjAyMi0wNS0zMCIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhLmJldGEiLAogICAgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIsCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhLmdpdGh1YiIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiCiAgXSwKICAid2luZG93c0lkZW50aWZpZXIiOiBbCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQppUHBkbWNiZlpSL2VkYlpCVUs0a2JObm1TdXV0eVFKS3p6aGRpWk5KaTdnZUszcUNmemEyQ1JnTnA2b3lSSjhUSGJzWDd6eWR1eW1XZmdXTEdHQTBJb0pMMmZNUEtiRE1DUitVNmhML0xGMVJpV0hXOXlrQ2x6S1dzd2VsZG1EN2U2RmlGeG8xY3cxckI2SUFLdEJsU05lQXZra1FPM1U4Ym5LbWtVUHRFaWl6Ylk1M3RvaSsreTc0bW0zeEVkY0tNQ0wwZXozb01NdWtETFoza3hmZU5Db3F5bXFwak05MCt6OWFWTVY1OHp4MFRzL0VsNXcyUEJoU1BWUDZ6STZUN3NzQm1HMjg4YWpGMEFQUm9BVVFjeWx4VndlWjFkbGcxQUZ5WVBPNGs3bjVBVk1GbDBYK1VjcWJQcVdac0hIbGRXaERGZkQ1ZG5zcHVUZVdBTVZ4akE9PQ==",
    
serialScan: {
               "camera":{
                  "captureResolution":"1080p",
                  "pictureResolution":"1080p"
               },
               "flash":{
                  "mode":"manual",
                  "alignment":"top_right"
               },
               "serialViewPluginComposite":{
                  "id":"LP_DL_VIN",
                  "cancelOnResult":true,
                  "viewPlugins":[
                     {
                        "viewPlugin":{
                           "plugin":{
                              "id":"LPT",
                              "licensePlatePlugin":{
                                 "scanMode":"AUTO"
                              }
                           },
                           "cutoutConfig":{
                              "style":"rect",
                              "maxWidthPercent":"80%",
                              "maxHeightPercent":"80%",
                              "alignment":"top_half",
                              "width":720,
                              "ratioFromSize":{
                                 "width":2,
                                 "height":1
                              },
                              "strokeWidth":2,
                              "cornerRadius":10,
                              "strokeColor":"FFFFFF",
                              "outerColor":"000000",
                              "outerAlpha":0.3,
                              "feedbackStrokeColor":"0099FF"
                           },
                           "scanFeedback":{
                              "style":"rect",
                              "strokeWidth":2,
                              "strokeColor":"0099FF",
                              "fillColor":"330099FF",
                              "cornerRadius":0,
                              "beepOnResult":true,
                              "vibrateOnResult":true,
                              "blinkAnimationOnResult":true
                           },
                           "cancelOnResult":true
                        }
                     },
                     {
                        "viewPlugin":{
                           "plugin":{
                              "id":"DRIVING_LICENSE",
                              "idPlugin": {
                                 "universalIdConfig": {
                                   "allowedLayouts": {
                                     "drivingLicense": []
                                   },
                                   "drivingLicense": {
                                     "surname": {"scanOption": 0, "minConfidence": 40},
                                     "givenNames": {"scanOption": 0, "minConfidence": 40},
                                     "dateOfBirth": {"scanOption": 0, "minConfidence": 50},
                                     "placeOfBirth": {"scanOption": 1, "minConfidence": 50},
                                     "dateOfIssue": {"scanOption": 0, "minConfidence": 50},
                                     "dateOfExpiry": {"scanOption": 1, "minConfidence": 50},
                                     "authority": {"scanOption": 1, "minConfidence": 30},
                                     "documentNumber": {"scanOption": 0, "minConfidence": 40},
                                     "categories": {"scanOption": 1, "minConfidence": 30},
                                     "address": {"scanOption": 1}
                                   }
                                 }
                              }
                           },
                           "cutoutConfig":{
                              "style":"rect",
                              "maxWidthPercent":"99%",
                              "maxHeightPercent":"100%",
                              "alignment":"center",
                              "ratioFromSize":{
                                 "width":560,
                                 "height":354
                              },
                              "strokeWidth":2,
                              "cornerRadius":4,
                              "strokeColor":"FFFFFF",
                              "outerColor":"000000",
                              "outerAlpha":0.3,
                              "feedbackStrokeColor":"0099FF"
                           },
                           "scanFeedback":{
                              "fillColor":"220099FF",
                              "style":"CONTOUR_POINT",
                              "strokeColor":"0099FF",
                              "strokeWidth":2,
                              "blinkOnResult":true,
                              "beepOnResult":true,
                              "vibrateOnResult":true
                           },
                           "cancelOnResult":true
                        }
                     },
                     {
                        "viewPlugin":{
                           "plugin":{
                              "id":"VIN",
                              "ocrPlugin":{
                                 "vinConfig":{

                                 }
                              }

                           },
                           "cutoutConfig":{
                              "style":"rect",
                              "maxWidthPercent":"70%",
                              "alignment":"top_half",
                              "ratioFromSize":{
                                 "width":62,
                                 "height":9
                              },
                              "outerColor":"000000",
                              "outerAlpha":0.3,
                              "strokeWidth":2,
                              "strokeColor":"FFFFFF",
                              "cornerRadius":4,
                              "feedbackStrokeColor":"0099FF"
                           },
                           "scanFeedback":{
                              "animation":"traverse_multi",
                              "animationDuration":250,
                              "style":"contour_rect",
                              "strokeWidth":2,
                              "strokeColor":"0099FF",
                              "fillColor":"220099FF",
                              "beepOnResult":true,
                              "vibrateOnResult":true,
                              "blinkAnimationOnResult":true
                           },
                           "cancelOnResult":true
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
    
    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [this.licenseKey, this.serialScan]);
}
};


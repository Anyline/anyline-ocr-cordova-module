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
    
    div.innerHTML = "<h2>LicensePlace Result</h2>" + "<p>" +
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
    
licenseKey: "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvcHQtb3V0IiwgImltYWdlUmVwb3J0Q2FjaGluZyI6IGZhbHNlLCAiaW9zSWRlbnRpZmllciI6IFsgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YS5iZXRhIiwgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIgXSwgImxpY2Vuc2VLZXlWZXJzaW9uIjogMiwgIm1ham9yVmVyc2lvbiI6ICI0IiwgIm1heERheXNOb3RSZXBvcnRlZCI6IDAsICJwaW5nUmVwb3J0aW5nIjogdHJ1ZSwgInBsYXRmb3JtIjogWyAiaU9TIiwgIkFuZHJvaWQiLCAiV2luZG93cyIgXSwgInNjb3BlIjogWyAiQUxMIiBdLCAic2hvd1BvcFVwQWZ0ZXJFeHBpcnkiOiB0cnVlLCAic2hvd1dhdGVybWFyayI6IHRydWUsICJ0b2xlcmFuY2VEYXlzIjogOTAsICJ2YWxpZCI6ICIyMDIwLTEwLTIwIiwgIndpbmRvd3NJZGVudGlmaWVyIjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdIH0KRnoxUmNxbUJ0YVRBRVl6NlNFQlhPRWxlLzlXNFVOVlJjdEJjTVhDTGVQMlRGV0dUTDdzWlB1WnJnTWkwOHlFVwpTUlp6emVNNTN2UnRoLzFVMGd5TGxzVmF0clZTd0lCMkRQbmxldnpUK3VHcGdRUUorS2w5N1dRRmljUlJ0di9VCnFjMU5md3RRMWVQREtMR05XaVZwbU94a2xIUzJ3OWV5c0ZHRHo4M20xRDZ5V2s0SkJ2MG9zOWhvak02bUtsU0MKVDZQYnJZcTkycFZRenFNUFdhZ3FoTXpvdGRDNE1YcktJY3FQbTBhc3FxRXM2VzkrM1d6aWI4NjRaSDVrM1ZqRgp3UGIzaVZqWW9aTVZFYVFGK1pQUmFoU3ZhNEhhMnhKakt0NXpkWTVtbkFKb1ZyaGVmNGYzNlFDME5ncnlkT0w3CkNFYzZxMk5acUNKSjhPLzBUT2trNmc9PQo=",
    
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
                              "idPlugin":{
                                 "drivingLicenseConfig":{
                                    "scanMode":"AUTO"
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


/*
 * Anyline Cordova Plugin
 * anyline.universalId.js
 *
 * Copyright (c) 2016 Anyline GmbH
 */

if (anyline === undefined) {
    var anyline = {};
}
anyline.universalId = {
onResult: function (result) {
    changeLoadingState(false);
    //this is called for every universal Id scan result
    //the result is a json-object containing all the scaned values and check-digits
    console.log("Universal Id result: " + JSON.stringify(result));
    var div = document.getElementById('results');

    if (div.childElementCount >= 3) {
        div.removeChild(div.childNodes[div.childElementCount - 1]);
    }

    var s = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>";
    console.log("s 1: " + s);
    console.log("result length: " + result.length);

//    for (var i = 0; i < result.length; i++){
//        var obj = result[i];
//        for (var key in obj){
//            var attrName = key;
//            var attrValue = obj[key];
//    console.log("name, value: " + attrName + " - " + attrValue);
//            s = s.concat("<br/><b>" + attrName + ": </b>" + attrValue);
//    console.log("s 2: " + s);
//        }
//    }


    for (var key in result) {
      if (result.hasOwnProperty(key)) {
        var val = result[key];
        if (key != "imagePath" && key != "fullImagePath" )
            s = s.concat("<br/><b>" + key + ": </b>" + val);
        console.log("-------------- key, value: " + key + " - " + val);
      }
    }



    s = s.concat ("</p>");
    console.log("s 3: " + s);
    div.innerHTML = s;

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
        console.log("Universal Id scanning canceled");
        return;
    }
    
    alert(error);
},
    
anylineUniversalIdViewConfig: {
  "camera" : {
    "captureResolution" : "1080p",
    "zoomGesture": true
  },
  "flash" : {
    "mode": "manual",
    "alignment": "bottom_right"
  },
  "viewPlugin" : {
    "plugin":{
      "id":"ID",
      "idPlugin": {
        "universalIdConfig": {
          "allowedLayouts": {
            "mrz": [],
            "drivingLicense": [],
            "idFront": []
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
          },
          "idFront": {
            "surname": {"scanOption": 0, "minConfidence": 60},
            "givenNames": {"scanOption": 0, "minConfidence": 60},
            "dateOfBirth": {"scanOption": 0, "minConfidence": 60},
            "placeOfBirth": {"scanOption": 1, "minConfidence": 60},
            "dateOfExpiry": {"scanOption": 1, "minConfidence": 60},
            "cardAccessNumber": {"scanOption": 1, "minConfidence": 60},
            "documentNumber": {"scanOption": 0, "minConfidence": 60},
            "nationality": {"scanOption": 1, "minConfidence": 60}
          }
        }
      }
    },
    "cutoutConfig" : {
      "style": "rect",
      "maxWidthPercent": "90%",
      "maxHeightPercent": "90%",
      "alignment": "center",
      "strokeWidth": 2,
      "cornerRadius": 4,
      "strokeColor": "FFFFFF",
      "outerColor": "000000",
      "outerAlpha": 0.3,
      "ratioFromSize" : {
        "width": 50,
        "height": 31
      },
      "cropPadding": {
        "x": -50,
        "y": -50
      },
      "cropOffset": {
        "x": 0,
        "y": 0
      },
      "feedbackStrokeColor": "0099FF"
    },
    "scanFeedback" : {
      "style": "CONTOUR_RECT",
      "visualFeedbackRedrawTimeout": 100,
      "strokeColor": "0099FF",
      "fillColor" : "220099FF",
      "beepOnResult": true,
      "vibrateOnResult": true,
      "strokeWidth": 2
    },
    "cancelOnResult" : true
  }
},
    
scan: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
        return;
    }
    changeLoadingState(true);
    // start the UniversalId scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#universalId for module details
    
    var licenseKey = "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiIF0sICJkZWJ1Z1JlcG9ydGluZyI6ICJvcHQtb3V0IiwgImltYWdlUmVwb3J0Q2FjaGluZyI6IGZhbHNlLCAiaW9zSWRlbnRpZmllciI6IFsgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YS5iZXRhIiwgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIgXSwgImxpY2Vuc2VLZXlWZXJzaW9uIjogMiwgIm1ham9yVmVyc2lvbiI6ICI0IiwgIm1heERheXNOb3RSZXBvcnRlZCI6IDAsICJwaW5nUmVwb3J0aW5nIjogdHJ1ZSwgInBsYXRmb3JtIjogWyAiaU9TIiwgIkFuZHJvaWQiLCAiV2luZG93cyIgXSwgInNjb3BlIjogWyAiQUxMIiBdLCAic2hvd1BvcFVwQWZ0ZXJFeHBpcnkiOiB0cnVlLCAic2hvd1dhdGVybWFyayI6IHRydWUsICJ0b2xlcmFuY2VEYXlzIjogOTAsICJ2YWxpZCI6ICIyMDIwLTEwLTIwIiwgIndpbmRvd3NJZGVudGlmaWVyIjogWyAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIiBdIH0KRnoxUmNxbUJ0YVRBRVl6NlNFQlhPRWxlLzlXNFVOVlJjdEJjTVhDTGVQMlRGV0dUTDdzWlB1WnJnTWkwOHlFVwpTUlp6emVNNTN2UnRoLzFVMGd5TGxzVmF0clZTd0lCMkRQbmxldnpUK3VHcGdRUUorS2w5N1dRRmljUlJ0di9VCnFjMU5md3RRMWVQREtMR05XaVZwbU94a2xIUzJ3OWV5c0ZHRHo4M20xRDZ5V2s0SkJ2MG9zOWhvak02bUtsU0MKVDZQYnJZcTkycFZRenFNUFdhZ3FoTXpvdGRDNE1YcktJY3FQbTBhc3FxRXM2VzkrM1d6aWI4NjRaSDVrM1ZqRgp3UGIzaVZqWW9aTVZFYVFGK1pQUmFoU3ZhNEhhMnhKakt0NXpkWTVtbkFKb1ZyaGVmNGYzNlFDME5ncnlkT0w3CkNFYzZxMk5acUNKSjhPLzBUT2trNmc9PQo=";
    

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [licenseKey, this.anylineUniversalIdViewConfig]);
}
};



/*
 * Anyline Cordova Plugin
 * anyline.japaneseLandingPermit.js
 *
 * Copyright (c) 2021 Anyline GmbH
 */

if (anyline === undefined) {
    var anyline = {};
}
anyline.japaneseLandingPermit = {
onResult: function (result) {
    changeLoadingState(false);
    //this is called for every japaneseLandingPermit scan result
    //the result is a json-object containing all the scaned values and check-digits
    console.log("japaneseLandingPermit Id result: " + JSON.stringify(result));
    var div = document.getElementById('results');

    if (div.childElementCount >= 3) {
        div.removeChild(div.childNodes[div.childElementCount - 1]);
    }

    var s = "<p>" + "<img src=\"" + result.imagePath + "\" width=\"100%\" height=\"auto\"/><br/>";
    console.log("s 1: " + s);
    console.log("result length: " + result.length);

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
        console.log("japaneseLandingPermit Id scanning canceled");
        return;
    }
    
    alert(error);
},
    
anylineJapaneseLandingPermitViewConfig: {
  "camera" : {
    "captureResolution" : "1080p",
    "zoomGesture": true
  },
  "flash" : {
    "mode": "manual",
    "alignment": "bottom_right",
    "imageOn": "flash_on",
    "imageOff": "flash_off"
  },
  "viewPlugin" : {
    "plugin":{
      "id":"ID",
      "idPlugin": {
        "japaneseLandingPermissionConfig": {}
      }
    },
    "cutoutConfig" : {
      "strokeWidth": 2,
      "cornerRadius": 4,
      "strokeColor": "FFFFFF",
      "outerColor": "000000",
      "outerAlpha": 0.3,
      "style": "rect",
      "maxWidthPercent": "70%",
      "maxHeightPercent": "70%",
      "alignment": "center",
      "ratioFromSize": {
        "width": 440,
        "height": 615
      },
      "feedbackStrokeColor": "0099FF"
    },
    "scanFeedback" : { },
    "cancelOnResult" : true
  }
},
    
scan: function () {
    if (localStorage.getItem("hasStartedAnyline") === 'true') {
        return;
    }
    changeLoadingState(true);
    // start the japaneseLandingPermit scanning
    // pass the success and error callbacks, as well as the license key and the config to the plugin
    // see http://documentation.anyline.io/#anyline-config for config details
    // and http://documentation.anyline.io/#universalId for module details
    
    var licenseKey = "ewogICJsaWNlbnNlS2V5VmVyc2lvbiI6IDIsCiAgImRlYnVnUmVwb3J0aW5nIjogIm9wdC1vdXQiLAogICJpbWFnZVJlcG9ydENhY2hpbmciOiBmYWxzZSwKICAibWFqb3JWZXJzaW9uIjogIjI1IiwKICAibWF4RGF5c05vdFJlcG9ydGVkIjogNSwKICAiYWR2YW5jZWRCYXJjb2RlIjogdHJ1ZSwKICAibXVsdGlCYXJjb2RlIjogdHJ1ZSwKICAic3VwcG9ydGVkQmFyY29kZUZvcm1hdHMiOiBbCiAgICAiQUxMIgogIF0sCiAgInBpbmdSZXBvcnRpbmciOiB0cnVlLAogICJwbGF0Zm9ybSI6IFsKICAgICJpT1MiLAogICAgIkFuZHJvaWQiLAogICAgIldpbmRvd3MiCiAgXSwKICAic2NvcGUiOiBbCiAgICAiQUxMIgogIF0sCiAgInNob3dQb3BVcEFmdGVyRXhwaXJ5IjogdHJ1ZSwKICAic2hvd1dhdGVybWFyayI6IHRydWUsCiAgInRvbGVyYW5jZURheXMiOiA5MCwKICAidmFsaWQiOiAiMjAyMi0wNS0zMCIsCiAgImlvc0lkZW50aWZpZXIiOiBbCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhLmJldGEiLAogICAgImlvLmFueWxpbmUuZXhhbXBsZXMuY29yZG92YSIKICBdLAogICJhbmRyb2lkSWRlbnRpZmllciI6IFsKICAgICJpby5hbnlsaW5lLmV4YW1wbGVzLmNvcmRvdmEiCiAgXSwKICAid2luZG93c0lkZW50aWZpZXIiOiBbCiAgICAiaW8uYW55bGluZS5leGFtcGxlcy5jb3Jkb3ZhIgogIF0KfQp1alBHWTFXU2dhajJIejc2dFpYMkptQ29lMGRFNHRsOXBFNkVhcFZMbFZyUU81bEtrUTh3VDJHZDlHS2l4YU4rRmNhdm1QTUZvY0Q3Tlp0RWRBbGZVREQzZXM5WHBVR2VESjRSaDNUbnQ1aWlyZWE3RjhUbUl0dWdrajN0Y3ZqNktReUlwY3NsN3Y0TFZkNHFNRm1mMWIyM1ZCdHVsVjloY092dGRDbzBvT2VqdEJ2cVdmckM3enRwRkNjaTlueHhoTStvRCtxdEpiZ2NVZ2pHQjExZ1dqcU1NMDUvTkdoK0hESHdjN2tmMXNHR3FiWkhxM3hYRk5FZ1FIamdLR2l6ckNrSjhQNDVscjVKb3JrUVFiQVlqL0VaT3Fvdmd1YlNTRzdzeVBpSklvQUFoWGxwOU5uR2pySkl4Mi92bFNqcUFSRnZZUUIwNHozTEQxeW1JTU5Tanc9PQ==";
    

    cordova.exec(this.onResult, this.onError, "AnylineSDK", "scan", [licenseKey, this.japaneseLandingPermit]);
}
};



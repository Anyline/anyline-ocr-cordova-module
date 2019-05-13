/*
 * Anyline Cordova Plugin
 * anyline.general.js
 *
 * Copyright (c) 2018 Anyline GmbH
 */


setTimeout(function () {
    localStorage.setItem("hasStartedAnyline", true);
    cordova.exec(
        (sdkVersion) => {
            localStorage.setItem("hasStartedAnyline", false);
            var div = document.getElementById('SDK');
            div.innerHTML = "<p>Anyline SDK Version: " + sdkVersion + "</p>"
        },
        function (err) {
            localStorage.setItem("hasStartedAnyline", false);
            console.error(err)
        },
        "AnylineSDK",
        "GET_SDK_VERSION"
    );
}, 2000);
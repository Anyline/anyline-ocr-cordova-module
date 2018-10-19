/*
 * Anyline Cordova Plugin
 * anyline.general.js
 *
 * Copyright (c) 2018 Anyline GmbH
 */


setTimeout(function () {
    cordova.exec(
        (sdkVersion) => {
            var div = document.getElementById('SDK');
            div.innerHTML = "<p>Anyline SDK Version: " + sdkVersion + "</p>"
        },
        function (err) { console.error(err) },
        "AnylineSDK",
        "GET_SDK_VERSION"
    );
}, 2000);
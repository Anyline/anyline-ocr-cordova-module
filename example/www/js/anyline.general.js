/*
 * Anyline Cordova Plugin
 * anyline.general.js
 *
 * Copyright (c) 2018 Anyline GmbH
 */


setTimeout(function () {
    changeLoadingState(true);
    cordova.exec(
        function (sdkVersion) {
            changeLoadingState(false);
            var div = document.getElementById('SDK');
            div.innerHTML = "<p>Anyline SDK Version: " + sdkVersion + "</p>"
        },
        function (err) {
            changeLoadingState(false);
            console.error(err)
        },
        "AnylineSDK",
        "GET_SDK_VERSION"
    );
}, 2000);
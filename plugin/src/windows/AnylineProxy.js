cordova.commandProxy.add("AnylineSDK",{
    LICENSE_PLATE: function (onSuccess, onError, configArray) {
        const license = configArray[0];
        const viewConfig = configArray[1];
        window.anyline.sdk.init(license, 'LICENSE_PLATE', viewConfig, onSuccess, onError, "");
    },
    ANYLINE_OCR: function (onSuccess, onError, configArray) {
        const license = configArray[0];
        const viewConfig = configArray[1];
        const ocrConfig = configArray[2];
        window.anyline.sdk.init(license, 'LICENSE_PLATE', viewConfig, onSuccess, onError, ocrConfig);
    },
    MRZ: function (onSuccess, onError, configArray) {
        const license = configArray[0];
        const viewConfig = configArray[1];
        window.anyline.sdk.init(license, 'LICENSE_PLATE', viewConfig, onSuccess, onError, "");
    },
});
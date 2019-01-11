cordova.commandProxy.add("AnylineSDK", {
	scan: function(onSuccess, onError, configArray) {
		const license = configArray[0];
        const viewConfig = configArray[1];
        window.anyline.sdk.init(license, 'scan', viewConfig, onSuccess, onError, "");
	},
    AUTO_ANALOG_DIGITAL_METER: function (onSuccess, onError, configArray) {
        onError('This mode is not implemented yet in UWP');
        //const license = configArray[0];
        //const viewConfig = configArray[1];
        //window.anyline.sdk.init(license, 'AUTO_ANALOG_DIGITAL_METER', viewConfig, onSuccess, onError, "");
    },
    ANALOG_METER: function (onSuccess, onError, configArray) {
        onError('This mode is not implemented yet in UWP');
        //const license = configArray[0];
        //const viewConfig = configArray[1];
        //window.anyline.sdk.init(license, 'ANALOG_METER', viewConfig, onSuccess, onError, "");
    },
    DIGITAL_METER: function (onSuccess, onError, configArray) {
        onError('This mode is not implemented yet in UWP');
        //const license = configArray[0];
        //const viewConfig = configArray[1];
        //window.anyline.sdk.init(license, 'DIGITAL_METER', viewConfig, onSuccess, onError, "");
    },
    DIAL_METER: function (onSuccess, onError, configArray) {
        onError('This mode is not implemented yet in UWP');
        //const license = configArray[0];
        //const viewConfig = configArray[1];
        //window.anyline.sdk.init(license, 'DIAL_METER', viewConfig, onSuccess, onError, "");
    },
    BARCODE: function (onSuccess, onError, configArray) {
        const license = configArray[0];
        const viewConfig = configArray[1];
        window.anyline.sdk.init(license, 'BARCODE', viewConfig, onSuccess, onError, "");
    },
    DOCUMENT: function (onSuccess, onError, configArray) {
        onError('This mode is not implemented yet in UWP');

        //const license = configArray[0];
        //const viewConfig = configArray[1];
        //window.anyline.sdk.init(license, 'DOCUMENT', viewConfig, onSuccess, onError, "");
    },
    SERIAL_NUMBER: function (onSuccess, onError, configArray) {
        onError('This mode is not implemented yet in UWP');

        //const license = configArray[0];
        //const viewConfig = configArray[1];
        //window.anyline.sdk.init(license, 'SERIAL_NUMBER', viewConfig, onSuccess, onError, "");
    },
    DOT_MATRIX_METER: function (onSuccess, onError, configArray) {
        onError('This mode is not implemented yet in UWP');

        //const license = configArray[0];
        //const viewConfig = configArray[1];
        //window.anyline.sdk.init(license, 'DOT_MATRIX_METER', viewConfig, onSuccess, onError, "");
    },
    LICENSE_PLATE: function (onSuccess, onError, configArray) {
        const license = configArray[0];
        const viewConfig = configArray[1];
        window.anyline.sdk.init(license, 'LICENSE_PLATE', viewConfig, onSuccess, onError, "");
    },
    ANYLINE_OCR: function (onSuccess, onError, configArray) {
        const license = configArray[0];
        const viewConfig = configArray[1];
        const ocrConfig = configArray[2];

        //// ReMap OCR Assets
        if (ocrConfig.traineddataFiles) {
            ocrConfig.languages = ocrConfig.traineddataFiles.map(function (lang) { return "www/" + lang });
            delete ocrConfig.tesseractLanguages;
        }
        window.anyline.sdk.init(license, 'ANYLINE_OCR', viewConfig, onSuccess, onError, ocrConfig);
    },
    MRZ: function (onSuccess, onError, configArray) {
        const license = configArray[0];
        const viewConfig = configArray[1];
        window.anyline.sdk.init(license, 'MRZ', viewConfig, onSuccess, onError, "");
    },
}); 
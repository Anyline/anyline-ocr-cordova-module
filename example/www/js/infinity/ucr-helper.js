// www/js/infinity/ucr-helper.js
// Mirrors the Android Kotlin implementation in ExportedScanResultExtension.kt.

// --- Anyline: getPluginResultValueForUCR ---
function getPluginResultValueForUCR(pluginResult) {
    if (!pluginResult) return '';
    if (pluginResult.barcodeResult?.barcodes?.[0]) {
        return pluginResult.barcodeResult.barcodes[0].value || '';
    }
    const extractors = [
        function (r) { return r.mrzResult?.mrzString; },
        function (r) { return r.licensePlateResult?.plateText; },
        function (r) { return r.japaneseLandingPermissionResult?.result?.status?.text; },
        function (r) { return r.meterResult?.value; },
        function (r) { return r.odometerResult?.value; },
        function (r) { return r.ocrResult?.text; },
        function (r) { return r.tinResult?.text; },
        function (r) { return r.tireSizeResult?.text?.text; },
        function (r) { return r.tireMakeResult?.text; },
        function (r) { return r.commercialTireIdResult?.text; },
        function (r) { return r.containerResult?.text; },
        function (r) { return r.vinResult?.text; },
    ];
    for (const extract of extractors) {
        const value = extract(pluginResult);
        if (value) return value;
    }
    return '';
}
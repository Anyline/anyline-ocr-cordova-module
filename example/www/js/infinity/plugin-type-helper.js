// www/js/infinity/plugin-type-helper.js

const GROUPS = {
    BARCODE: 'Barcode',
    IDENTITY_DOCUMENTS: 'Identity Documents',
    VEHICLE: 'Vehicle',
    METER_READING: 'Meter Reading',
    OTHERS: 'Others',
    MULTI_PLUGIN: 'Multi-Plugin',
};

const GROUP_ORDER = [
    GROUPS.BARCODE,
    GROUPS.IDENTITY_DOCUMENTS,
    GROUPS.VEHICLE,
    GROUPS.METER_READING,
    GROUPS.OTHERS,
    GROUPS.MULTI_PLUGIN,
];

// --- Anyline: groupFromConfig ---
function groupFromConfig(config) {
    if (config.viewPluginCompositeConfig) return GROUPS.MULTI_PLUGIN;
    const pc = config.viewPluginConfig?.pluginConfig;
    if (!pc) return GROUPS.OTHERS;
    if (pc.barcodeConfig) return GROUPS.BARCODE;
    if (pc.mrzConfig || pc.universalIdConfig || pc.japaneseLandingPermissionConfig) {
        return GROUPS.IDENTITY_DOCUMENTS;
    }
    if (
        pc.licensePlateConfig ||
        pc.vinConfig ||
        pc.vehicleRegistrationCertificateConfig ||
        pc.odometerConfig ||
        pc.tinConfig ||
        pc.tireSizeConfig ||
        pc.tireMakeConfig ||
        pc.commercialTireIdConfig
    ) {
        return GROUPS.VEHICLE;
    }
    if (pc.meterConfig) return GROUPS.METER_READING;
    return GROUPS.OTHERS;
}

function labelFromConfig(config, fallbackFilename) {
    const compositeId = config.viewPluginCompositeConfig?.id;
    const pluginId = config.viewPluginConfig?.pluginConfig?.id;
    return compositeId || pluginId || fallbackFilename;
}

const _RESULT_LABELS = [
    ['barcodeResult',                       'Barcode'],
    ['mrzResult',                           'MRZ'],
    ['licensePlateResult',                  'License Plate'],
    ['vinResult',                           'VIN'],
    ['vehicleRegistrationCertificateResult','VRC'],
    ['meterResult',                         'Meter'],
    ['odometerResult',                      'Odometer'],
    ['tinResult',                           'TIN'],
    ['tireSizeResult',                      'Tire Size'],
    ['tireMakeResult',                      'Tire Make'],
    ['commercialTireIdResult',              'Commercial Tire ID'],
    ['containerResult',                     'Container'],
    ['ocrResult',                           'OCR'],
    ['japaneseLandingPermissionResult',     'JLP'],
    ['universalIdResult',                   'Universal ID'],
];

function pluginResultMap(pluginResult) {
    if (!pluginResult) return null;
    for (const [key] of _RESULT_LABELS) {
        if (pluginResult[key]) return pluginResult[key];
    }
    return null;
}

function pluginTypeLabel(pluginResult) {
    if (!pluginResult) return 'Unknown';
    for (const [key, label] of _RESULT_LABELS) {
        if (pluginResult[key]) return label;
    }
    return 'Result';
}
// www/js/infinity/scan-options.js

const SCAN_VIEW_CONFIG_PATH = 'www/assets/anyline_assets/config/infinity';

// Resolves the platform documents directory to a raw file path (no 'file://' prefix).
// cordova.file.documentsDirectory is a synchronous string constant available after deviceready.
function _resolveImageSavePath() {
    if (!window.cordova || !cordova.file) return null;
    const baseDir = cordova.file.documentsDirectory || cordova.file.dataDirectory;
    if (!baseDir) return null;
    return baseDir.replace(/^file:\/\//, '').replace(/\/$/, '') + '/results/';
}

function defaultScanResultConfig(imageSavePath) {
    return {
        cleanStrategy: AnylineEnums.WrapperSessionScanResultCleanStrategyConfig.CleanFolderOnStartScanning,
        imageContainer: (imageSavePath !== null && imageSavePath !== undefined)
            ? { saved: { path: imageSavePath } }
            : { encoded: {} },
        imageParameters: {
            format: AnylineEnums.ExportedScanResultImageFormat.Png,
            quality: 50,
        },
    };
}

function defaultScanOptions() {
    const imageSavePath = _resolveImageSavePath();
    return {
        imageSavePath,
        scanResultConfig: defaultScanResultConfig(imageSavePath),
        initializationParameters: null,
        platformOptions: null,
    };
}

function buildScanStartRequest(options, configJson) {
    const req = {
        scanViewConfigContentString: configJson,
        scanViewConfigPath: SCAN_VIEW_CONFIG_PATH,
        scanResultConfig: options.scanResultConfig,
    };
    if (options.initializationParameters) {
        req.scanViewInitializationParameters = options.initializationParameters;
    }
    if (options.platformOptions) {
        req.platformOptions = options.platformOptions;
    }
    return req;
}
// www/js/infinity/main.js
// Main orchestration for infinity.html — SDK init, scan session, config browser, result list.

const ASSET_PATH_PREFIX = 'www/assets/anyline_assets';
const OPTIONS_STORAGE_KEY = 'infinity_scan_options';
const USER_CONFIGS_KEY = 'infinity_user_configs';

let _isInitializing = false;
let _initError = null;
let _sdkInitSucceedInfo = null;
let _pluginVersion = '';
let _sdkVersion = '';
let _isScanning = false;
let _activeGroupIndex = 0;
let _results = [];
let _userConfigs = [];
let _currentOptions = null;
let _allBundledConfigs = [];
let _configsByGroup = {};

// ─── Startup ──────────────────────────────────────────────────────────────────

document.addEventListener('deviceready', function () {
    _currentOptions = _loadOptions();

    ConfigBrowser.init(document.getElementById('config-browser'));
    ResultList.init(document.getElementById('content-area'));

    _loadUserConfigs();

    document.getElementById('btn-back').addEventListener('click', function () {
        if (!_isScanning) {
            if (cordova.platformId === 'android') {
                navigator.app.exitApp();
            }
            // iOS: programmatic exit is not supported by Apple.
            // The user exits via the home button / app switcher.
        }
    });

    // Android physical back button: close the topmost overlay, or exit the app.
    // (This event is Android-only and never fires on iOS.)
    document.addEventListener('backbutton', function () {
        if (document.getElementById('editor-overlay').style.display !== 'none') {
            document.getElementById('editor-overlay').style.display = 'none';
            document.getElementById('editor-iframe').src = '';
            _loadUserConfigs();
            return;
        }
        if (document.getElementById('options-overlay').style.display !== 'none') {
            document.getElementById('options-overlay').style.display = 'none';
            document.getElementById('options-iframe').src = '';
            sessionStorage.removeItem('infinity_options_prefill');
            _currentOptions = _loadOptions();
            _loadUserConfigs();
            return;
        }
        if (!_isScanning) { navigator.app.exitApp(); }
    }, false);
    document.getElementById('btn-options').addEventListener('click', function () {
        if (!_isScanning) {
            _saveOptions(_currentOptions);
            sessionStorage.setItem('infinity_options_prefill', JSON.stringify(_currentOptions));
            sessionStorage.setItem('infinity_plugin_version', _pluginVersion);
            document.getElementById('options-iframe').src = 'infinity-options.html?' + Date.now();
            document.getElementById('options-overlay').style.display = '';
        }
    });
    document.getElementById('btn-info').addEventListener('click', _showInfo);

    // Callbacks used by ConfigBrowser
    window._onGroupChange = function (index) {
        _activeGroupIndex = index;
        _renderConfigBrowser();
    };
    window._onConfigTap = _onConfigTap;
    window._onEditSaveAs = _onEditSaveAs;
    window._onDeleteUserConfig = _onDeleteUserConfig;
    window._onStopScanning = _stopScanning;

    _pluginVersion = AnylineInfinity.pluginVersion || '';
    AnylineInfinity.getSDKVersion(
        function (v) { _sdkVersion = v || ''; },
        function () { /* ignore — version is optional */ }
    );

    _loadAllBundledConfigs(function () {
        _buildConfigsByGroup();
        _renderConfigBrowser();
        _initializeSdk();
    });
}, false);

// Handle messages from options/editor iframes.
window.addEventListener('message', function (e) {
    if (e.origin !== window.location.origin) return;
    if (!e.data?.type) return;
    if (e.data.type === 'infinity-options-done') {
        document.getElementById('options-overlay').style.display = 'none';
        document.getElementById('options-iframe').src = '';
        sessionStorage.removeItem('infinity_options_prefill');
        _currentOptions = _loadOptions();
        _restoreDefaultImageSavePathIfEmpty(_currentOptions);
        _saveOptions(_currentOptions);
        _loadUserConfigs();
    } else if (e.data.type === 'infinity-editor-done') {
        document.getElementById('editor-overlay').style.display = 'none';
        document.getElementById('editor-iframe').src = '';
        _loadUserConfigs();
    }
});

// ─── Config loading ───────────────────────────────────────────────────────────

function _loadAllBundledConfigs(onDone) {
    const basePath = 'assets/anyline_assets/config/infinity';
    let remaining = INFINITY_CONFIGS.length;
    if (remaining === 0) { onDone([]); return; }

    INFINITY_CONFIGS.forEach(function (cfg) {
        fetch(basePath + '/' + cfg.filename)
            .then(function (r) { return r.json(); })
            .then(function (parsed) {
                cfg.configJson = JSON.stringify(parsed);
                cfg.label = labelFromConfig(parsed, cfg.filename.replace(/\.json$/, ''));
                cfg.group = groupFromConfig(parsed);
            })
            .catch(function () { /* skip configs that fail to load */ })
            .finally(function () {
                remaining--;
                if (remaining === 0) { onDone(INFINITY_CONFIGS.filter(function (c) { return c.configJson; })); }
            });
    });
}

function _buildConfigsByGroup() {
    _allBundledConfigs = INFINITY_CONFIGS.filter(function (c) { return c.configJson; });
    _configsByGroup = {};
    GROUP_ORDER.forEach(function (g) { _configsByGroup[g] = []; });
    _allBundledConfigs.forEach(function (c) {
        if (_configsByGroup[c.group]) { _configsByGroup[c.group].push(c); }
    });
    _userConfigs.forEach(function (c) {
        if (_configsByGroup[c.group]) { _configsByGroup[c.group].push(c); }
    });
}

// ─── User config storage (localStorage) ──────────────────────────────────────

function _listUserConfigs() {
    try {
        const map = JSON.parse(localStorage.getItem(USER_CONFIGS_KEY) || '{}');
        return Object.entries(map).map(function (entry) {
            const filename = entry[0];
            const configJson = entry[1];
            try {
                const parsed = JSON.parse(configJson);
                return {
                    filename: filename,
                    configJson: configJson,
                    label: labelFromConfig(parsed, filename.replace(/\.json$/, '')),
                    group: groupFromConfig(parsed),
                    source: 'user',
                };
            } catch (e) { return null; }
        }).filter(Boolean);
    } catch (e) { return []; }
}

function _deleteUserConfig(filename) {
    try {
        const map = JSON.parse(localStorage.getItem(USER_CONFIGS_KEY) || '{}');
        delete map[filename];
        localStorage.setItem(USER_CONFIGS_KEY, JSON.stringify(map));
    } catch (e) { /* localStorage may be unavailable */ }
}

function _loadUserConfigs() {
    _userConfigs = _listUserConfigs();
    _buildConfigsByGroup();
    _renderConfigBrowser();
}

// ─── Options (localStorage) ───────────────────────────────────────────────────

function _loadOptions() {
    try {
        const stored = localStorage.getItem(OPTIONS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : defaultScanOptions();
    } catch (e) { return defaultScanOptions(); }
}

function _saveOptions(options) {
    try { localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options)); } catch (e) { /* ignore */ }
}

function _restoreDefaultImageSavePathIfEmpty(options) {
    const saved = options?.scanResultConfig?.imageContainer?.saved;
    if (saved && (saved.path === '' || saved.path == null)) {
        saved.path = _resolveImageSavePath();
    }
}

// ─── Render helpers ───────────────────────────────────────────────────────────

function _renderConfigBrowser() {
    ConfigBrowser.render(_configsByGroup, _activeGroupIndex);
}

function _renderResultList() {
    ResultList.render(_results, _isScanning);
}

function _setScanning(value) {
    _isScanning = value;
    const optionsBtn = document.getElementById('btn-options');
    if (optionsBtn) { optionsBtn.disabled = value; }
    _renderResultList();
}

// ─── SDK init overlay ─────────────────────────────────────────────────────────

function _showInitOverlay() {
    _removeOverlay();
    const el = document.createElement('div');
    el.id = 'sdk-overlay';
    el.className = 'sdk-overlay';
    el.innerHTML = '<div class="sdk-overlay-text">Initializing SDK…</div>';
    document.body.appendChild(el);
}

function _showErrorOverlay(message) {
    _removeOverlay();
    const el = document.createElement('div');
    el.id = 'sdk-overlay';
    el.className = 'sdk-overlay';
    el.innerHTML =
        '<div class="sdk-overlay-title">SDK Initialization Failed</div>' +
        '<div class="sdk-overlay-error">' + _esc(message) + '</div>' +
        '<button class="sdk-retry-btn" id="btn-retry">Retry</button>';
    document.body.appendChild(el);
    document.getElementById('btn-retry').addEventListener('click', _initializeSdk);
}

function _removeOverlay() {
    const existing = document.getElementById('sdk-overlay');
    if (existing) { existing.remove(); }
}

// ─── Anyline: requestSdkInitialization ───────────────────────────────────────

function _initializeSdk() {
    _isInitializing = true;
    _initError = null;
    _showInitOverlay();

    AnylineInfinity.requestSdkInitialization(
        { licenseKey: anyline.license.key, assetPathPrefix: ASSET_PATH_PREFIX },
        function (response) {
            _isInitializing = false;
            if (response.initialized && response.succeedInfo) {
                _sdkInitSucceedInfo = response.succeedInfo;
                _removeOverlay();
            } else {
                _initError = response.failInfo?.lastError || 'SDK initialization failed.';
                _showErrorOverlay(_initError);
            }
        },
        function (err) {
            _isInitializing = false;
            _initError = String(err || 'SDK initialization failed.');
            _showErrorOverlay(_initError);
        }
    );
}

// ─── Anyline: requestScanStart ────────────────────────────────────────────────

function _startScanning(config) {
    _setScanning(true);
    // --- Anyline: requestScanStart ---
    AnylineInfinity.requestScanStart(
        buildScanStartRequest(_currentOptions, config.configJson),
        function onScanResponse(response) {
            _setScanning(false);
            if (response && response.status === AnylineEnums.WrapperSessionScanResponseStatus.ScanFailed && response.failInfo) {
                alert('Scan failed: ' + (response.failInfo.lastError || 'Unknown error'));
            }
        },
        {
            onScanResults: function (resultsResponse) {
                // --- Anyline: onScanResults ---
                const batch = resultsResponse.exportedScanResults || [];
                _results = batch.slice().reverse().concat(_results);
                _renderResultList();
            },
            onUIElementClicked: function (_event) {},
        }
    );
}

// ─── Anyline: requestScanStop ─────────────────────────────────────────────────

function _stopScanning() {
    // --- Anyline: requestScanStop ---
    AnylineInfinity.requestScanStop();
}

// ─── Anyline: requestScanSwitchWithScanStartRequestParams ─────────────────────

function _switchScanning(config) {
    // --- Anyline: requestScanSwitchWithScanStartRequestParams ---
    AnylineInfinity.requestScanSwitchWithScanStartRequestParams(
        buildScanStartRequest(_currentOptions, config.configJson)
    );
}

// ─── Config tap ───────────────────────────────────────────────────────────────

function _onConfigTap(config) {
    if (_isScanning) {
        _switchScanning(config);
    } else {
        _startScanning(config);
    }
}

// ─── Long-press actions ───────────────────────────────────────────────────────

function _onEditSaveAs(config) {
    sessionStorage.setItem('infinity_edit_config', JSON.stringify(config));
    sessionStorage.setItem('infinity_plugin_version', _pluginVersion);
    document.getElementById('editor-iframe').src = 'infinity-editor.html?' + Date.now();
    document.getElementById('editor-overlay').style.display = '';
}

function _onDeleteUserConfig(config) {
    if (confirm('Delete "' + config.label + '"?')) {
        _deleteUserConfig(config.filename);
        _loadUserConfigs();
    }
}

// ─── Info ─────────────────────────────────────────────────────────────────────

function _showInfo() {
    const initInfo = JSON.stringify(_sdkInitSucceedInfo || {}, null, 2);
    alert(
        'Plugin version: ' + (_pluginVersion || '…') + '\n' +
        'SDK version: ' + (_sdkVersion || '…') + '\n\n' +
        'SDK init info:\n' + initInfo
    );
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function _esc(s) {
    return String(s)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
}
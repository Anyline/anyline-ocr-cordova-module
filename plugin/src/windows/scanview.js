/*
    Anyline ScanView
*/
const webUIApp = Windows.UI.WebUI.WebUIApplication;
const urlutil = require('cordova/urlutil');
let scanViewController = null;
let onErrorGlobal;
let baseConfig;
let skipFocus = false;
let TORCH_OFF = "<img src=\"img\\torch_off.png\" style=\"vertical-align:middle\" />";
let TORCH_ON = "<img src=\"img\\torch_on.png\" style=\"vertical-align:middle\" />";
module.exports = {

    init: function (licenseKey, mode, config, onSuccess, onError, ocrConfig) {

        // enable for debug purposes only!
        /*Anyline.JS.Util.Debug.verbosity = 4;
        
        Anyline.JS.Util.Debug.onlog = function (args) {
            printLog(args.toString());
        }*/

        baseConfig = config;
        onErrorGlobal = onError;
        scanViewController = new Anyline.JS.ScanViewController();

        // set this if you're experiencing memory issues
        scanViewController.setMemoryCollectionMode(2);

        scanViewController.onnotifyexception = function (args) {
            printLog(args);
        }

        try {
            scanViewController.setup(licenseKey, mode, JSON.stringify(config), ocrConfig);
        } catch (e) {
            printError(e);
            onError(e);
            return;
        }

        createPreview(config.doneButton);
        
        if (ocrConfig || ocrConfig !== '') {
            ocrConfig = JSON.stringify(ocrConfig);
        }


        // start scanning here
        scanViewController.captureManager.onpreviewstarted = function (args) {
            try {
                calcVideoRelation();

                scanViewController.startScanning();
            } catch (e) {
                printError(e);
                onError(e);
            }
            printLog("started scanning");
        }

        // stop scanning here
        scanViewController.captureManager.onpreviewstopped = function (args) {
            const argsString = args.toString();
            printLog('onPreviewStopped', argsString);
        }

        // stop scanning also here (if possible)
        scanViewController.captureManager.onpreviewerror = function (args) {
            const argsString = args.toString();
            printError('onPreviewError', argsString);
            closeCamera();
            destroyPreview();
            delete scanViewController;
            onError(argsString);
        }

        // Event triggered if screen is rotated
        scanViewController.captureManager.onpreviewrotated = () => {
            calcVideoRelation();
        }

        scanViewController.onnotifyupdatevisualfeedback = function (args) {
            if (args) {

                const argsString = args.toString();
                const functionName = argsString.split('(')[0];
                if (functionName === 'publish') {
                    const webViewUI = document.getElementById("webViewReactUI");
                    if (webViewUI != undefined) {
                        const asyncOp = webViewUI.invokeScriptAsync("eval", argsString);
                        asyncOp.start();
                    }
                }
            }
        }

        // Open the camera first
        openCamera();

        // handle errors
        scanViewController.onnotifyexception = function (args) {
            const argsString = args.toString();
            printError('onNotifyExcepction', argsString);
            closeCamera();
            destroyPreview();
            delete scanViewController;
            onError(argsString);
        };

        // handle scan result
        scanViewController.onnotifyscanresult = function (args) {
            const argsString = args.toString();
            printLog(argsString);
            //return;
            closeCamera();
            destroyPreview();
            delete scanViewController;
            const result = JSON.parse(argsString);
            if (mode === 'ANYLINE_OCR') {
                result.text = result.result;
            } else if (mode === 'BARCODE') {
                result.value = result.result;
                result.format = result.barcodeFormat;
            } else {
                result.text = result.result;
            }
            // Remap for relative paths
            result.imagePath = "ms-appdata:///temp/SavedImages/" + result.imagePath.substr(result.imagePath.lastIndexOf('\\') + 1);
            result.fullImagePath = "ms-appdate:///temp/SavedImages/" + result.fullImagePath.substr(result.fullImagePath.lastIndexOf('\\') + 1);
            onSuccess(result);
        };
    },
}

/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////        Preview                ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

function createPreview(cancelButton) {

    // CSS
    if (!document.getElementById('anylineStylecutout')) {
        createCSSLink("anylineCutout");
    }
    if (!document.getElementById('anylineStyledefault')) {
        createCSSLink("anylineDefault");
    }

    // Scripts
    if (!document.getElementById("anylineUtilScript")) {
        includeScript(urlutil.makeAbsolute("/www/js/util.js"), 'anylineUtilScript');
    }
    // Root
    const anylineRoot = document.createElement('div')
    anylineRoot.id = 'anylineRoot';

    // Video
    const videoElement = document.createElement("video");
    videoElement.id = "anylineVideoElement";

    const cancelBtnElement = document.createElement("button");
    cancelBtnElement.id = "anylineCancelButton";
    cancelBtnElement.innerHTML = 'CANCEL';
    cancelBtnElement.onclick = function () {
        closeCamera();
        destroyPreview();
        delete scanViewController;
        onErrorGlobal('Canceled');
    }
    anylineRoot.appendChild(cancelBtnElement);

    // Cutout
    const backgroundElement = document.createElement('div');
    backgroundElement.style.left = 0 + 'px';
    backgroundElement.style.top = 0 + 'px';
    backgroundElement.id = "anylineBackground";

    var webview = document.createElement('x-ms-webview');
    webview.id = "webViewReactUI";
    webview.style.background = "transparent";
    webview.setAttribute("height", "100%");
    webview.setAttribute("width", "100%");
    webview.settings.isScriptNotifyAllowed = true;
    webview.navigate('ms-appx-web:///www/plugins/io-anyline-cordova/src/windows/assets/ui/index.html');

    backgroundElement.appendChild(webview)

    // Canvas
    const canvasElement = document.createElement('canvas');
    canvasElement.id = "anylineCanvas";

    // Torch
    const flashButtonRoot = document.createElement('div');
    flashButtonRoot.id = "anylineFlashButtonRoot";
    anylineRoot.appendChild(flashButtonRoot);

    // Torch
    const flashButton = document.createElement("button");
    flashButton.id = "anylineFlashButton";
    flashButton.style.visibility = "hidden";
    flashButton.innerHTML = TORCH_OFF;
    flashButton.onclick = function () {

        skipFocus = true;
        setTimeout(function () { skipFocus = false; }, 1000);

        if (scanViewController == null) return;
        if (scanViewController.isFlashSupported()) {
            if (!scanViewController.captureManager.mediaCapture.videoDeviceController.flashControl.enabled) {
                var success = scanViewController.enableFlash();
                scanViewController.captureManager.mediaCapture.videoDeviceController.flashControl.enabled = true;
                // flash is enabled:
                if (success == true) {
                    flashButton.innerHTML = TORCH_ON;
                    printLog("Torch enabled.");
                }
            } else {
                var success = scanViewController.disableFlash();
                scanViewController.captureManager.mediaCapture.videoDeviceController.flashControl.enabled = false;
                // flash is disabled:
                if (success == true) {
                    flashButton.innerHTML = TORCH_OFF;
                    printLog("Torch disabled.");
                }
            }
        }

    };
    flashButtonRoot.appendChild(flashButton);

    [videoElement, backgroundElement, canvasElement].forEach(function (element) {
        anylineRoot.appendChild(element);
    });

    document.body.appendChild(anylineRoot);
    disableZoomAndScroll();

    webview.addEventListener("MSWebViewNavigationCompleted", () => {
        var cutoutConfig = scanViewController.makeSetupCutoutFromConfig();
        const asyncOp = webview.invokeScriptAsync("eval", cutoutConfig);
        asyncOp.start();
    });
    webview.addEventListener("MSWebViewScriptNotify", eventInfo => {
        var rectInfo = eventInfo.value;
        printLog(rectInfo);

        var obj = JSON.parse(rectInfo);

        // Update Cutout from SDK
		for( let cutout in obj ){
			scanViewController.updateJSCutout(obj[cutout].x, obj[cutout].y, obj[cutout].width, obj[cutout].height);
		}

        const canvasElement = document.getElementById("anylineCanvas");
        if (canvasElement != undefined) {
            scanViewController.updateForSize(canvasElement.width, canvasElement.height);
        }
    });

}

function destroyPreview() {

    try {
        // Root Element
        var _anylineCanvas = document.getElementById("anylineCanvas");
        if (_anylineCanvas != null) {
            document.getElementById("anylineCanvas").remove();
        }
        var _anylineRoot = document.getElementById("anylineRoot");
        if (_anylineRoot != null) {
            document.getElementById("anylineRoot").remove();
        }

        // Zoom/Scroll
        enableZoomAndScroll();

        //Events
        scanViewController.onnotifyupdatevisualfeedback = null;
        scanViewController.onnotifyexception = null;
        scanViewController.onnotifyscanresult = null;
    }
    catch (exception) {
        printLog(exception);
    }
}

// Utils
function createCSSLink(name) {
    var styleElement = document.createElement('link');
    styleElement.rel = "stylesheet";
    styleElement.type = "text/css";
    styleElement.id = "anylineStyle" + name;
    styleElement.href = urlutil.makeAbsolute("/www/css/" + name + ".css");
    document.head.appendChild(styleElement);
}


function disableZoomAndScroll() {
    document.body.classList.add('no-zoom');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('no-scroll');
}

function enableZoomAndScroll() {
    document.body.classList.remove('no-zoom');
    document.body.style.overflow = '';
    document.body.classList.remove('no-scroll');
}

function includeScript(path, id) {
    if (!(window.MSApp && window.MSApp.execUnsafeLocalFunction)) {
        var node = document.createElement("script"),
            okHandler, errHandler;

        node.src = path;
        node.id = id;

        okHandler = function () {
            this.removeEventListener("load", okHandler);
            this.removeEventListener("error", errHandler);
        };
        errHandler = function (error) {
            this.removeEventListener("load", okHandler);
            this.removeEventListener("error", errHandler);
        };

        node.addEventListener("load", okHandler);
        node.addEventListener("error", errHandler);

        document.body.appendChild(node);
    } else {
        readLocalFile(path, function (err, result) {
            MSApp.execUnsafeLocalFunction(function () {
                var node = document.createElement("script");
                node.text = result;
                document.body.appendChild(node);
            });
        });
    }
}

function readLocalFile(path, cb) {
    window.requestFileSystem(window.PERSISTENT, 0, function (fs) {
        fs.root.getFile(path, {}, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    if (this.error) {
                        cb(this.error);
                    } else {
                        cb(null, this.result);
                    }
                };

                reader.readAsText(file);
            }, cb);
        }, cb);
    }, cb);
}

/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////        Camera                 ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

function focus() {
    try {

        if (skipFocus)
            return;

        if (scanViewController != null) {
            if (scanViewController.captureManager.mediaCapture.videoDeviceController.focusControl.supported == true) {
                scanViewController.captureManager.mediaCapture.videoDeviceController.focusControl.focusAsync();
                //printLog("Focused successfully.");
            } else {
                //printLog("Focus is not supported on this device.");
            }
        }
    }
    catch (exception) {
        printLog("Unable to focus: " + exception);
    }
}

// starts the camera (only works after init is called because the config must already be loaded etc.)
function openCamera() {
    scanViewController.captureManager.initializeCamera().then(function (result) {
        const videoElement = document.getElementById("anylineVideoElement");

        if (videoElement == null) {
            printError("VideoElement not found!");
        }

        videoElement.src = URL.createObjectURL(scanViewController.captureManager.mediaCapture, { oneTimeOnly: true });
        try {
            videoElement.play();

            // tap to focus
            const anylineRoot = document.getElementById("anylineRoot");
            anylineRoot.onclick = function () {
                focus();
            };
        }
        catch (ex) {
            printLog(ex);
        }
    });

    updateFlashButton();

    // Event onResize Window
    window.addEventListener("resize", calcVideoRelation);
    webUIApp.addEventListener('enteredbackground', msVisibilityChangeHandler, false);
}

// stops the camera
function closeCamera() {
    const anylineRoot = document.getElementById("anylineRoot");
    if (anylineRoot)
        anylineRoot.onclick = null;

    scanViewController.cancelScanning();
    if (scanViewController.captureManager.mediaCapture == null)
        return;
    const videoElement = document.getElementById("anylineVideoElement");
    if (videoElement) {
        videoElement.src = null;
    }

    window.removeEventListener('resize', calcVideoRelation);
    webUIApp.removeEventListener('enteredbackground', msVisibilityChangeHandler);

    scanViewController.captureManager.terminateCamera().then(function (success) {
        printLog("Stopped: " + success);
    });
}

function msVisibilityChangeHandler() {
    closeCamera();
    destroyPreview();
    delete scanViewController;
    onErrorGlobal('Canceled');
}

// align & update button from config
function updateFlashButton() {

    const flashButton = document.getElementById("anylineFlashButton");

    if (flashButton == null)
        return;

    var margin = 10;

    switch (baseConfig.flash.mode) {
        case "manual":
        case "auto":
            flashButton.style.visibility = "visible";
            break;
        case "none":
            flashButton.style.visibility = "hidden";
            break;
    }

    switch (baseConfig.flash.alignment) {
        case "top":
            flashButton.style.transform = "translate(-50%)";
            flashButton.style.left = 50 + '%';
            flashButton.style.top = margin + 'px';
            break;
        case "top_left":
            flashButton.style.left = margin + 'px';
            flashButton.style.top = margin + 'px';
            break;
        case "top_right":
            flashButton.style.top = margin + 'px';
            flashButton.style.right = margin + 'px';
            break;
        case "bottom":
            flashButton.style.transform = "translate(-50%)";
            flashButton.style.left = 50 + '%';
            flashButton.style.bottom = margin + 'px';
            break;
        case "bottom_left":
            flashButton.style.left = margin + 'px';
            flashButton.style.bottom = margin + 'px';
            break;
        case "bottom_right":
            flashButton.style.bottom = margin + 'px';
            flashButton.style.right = margin + 'px';
            break;
    }
}

// Calculate the Video and Webview width and height
function calcVideoRelation() {
    let props = scanViewController.captureManager.getResolution();
    const camRelation = props.width / props.height;
    const windowRelation = window.innerWidth / window.innerHeight;
    const canvasElement = document.getElementById("anylineCanvas");
    const backgroundElement = document.getElementById("anylineBackground");
    const videoElement = document.getElementById("anylineVideoElement");
    const flashElement = document.getElementById("anylineFlashButton");

    if (canvasElement == null || backgroundElement == null || videoElement == null)
        return;

    if (flashElement != null) {
        flashElement.style.opacity = scanViewController.captureManager.mediaCapture.videoDeviceController.flashControl.supported ? 1.0 : 0.3;
    }

    if (windowRelation < camRelation) {
        // Video
        videoElement.style.height = window.innerHeight + 'px';
        videoElement.style.width = window.innerHeight * camRelation + 'px';

        // Canvas
        canvasElement.height = window.innerHeight;
        canvasElement.width = window.innerHeight * camRelation;
    } else {
        // Video
        videoElement.style.width = window.innerWidth + 'px';
        videoElement.style.height = window.innerWidth / camRelation + 'px';

        // Canvas
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerWidth / camRelation;
    }
    scanViewController.updateForSize(canvasElement.width, canvasElement.height);
    updateFlashButton();
}

function printLog(message) {
	if(console.log === 'function') {
		console.log(message);
	}
}

function printError(message) {
	if(console.error === 'function') {
		console.error(message);
	}
}
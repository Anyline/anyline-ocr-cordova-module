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
            console.log(args.toString());
        }*/

        baseConfig = config;
        onErrorGlobal = onError;
        scanViewController = new Anyline.JS.ScanViewController();

        // set this if you're experiencing memory issues
        scanViewController.setMemoryCollectionMode(2);

        scanViewController.onnotifyexception = function (args) {
            console.log(args);
        }

        createPreview(config.doneButton);

        if (ocrConfig || ocrConfig !== '') {
            ocrConfig = JSON.stringify(ocrConfig);
        }

        scanViewController.setup(licenseKey, mode, JSON.stringify(config), ocrConfig);

        // start scanning here
        scanViewController.captureManager.onpreviewstarted = function (args) {
            try {
                calcVideoRelation();

                scanViewController.startScanning();
            } catch (e) {
                console.error(e);
                onError(e);
            }
            console.log("started scanning");
        }

        // stop scanning here
        scanViewController.captureManager.onpreviewstopped = function (args) {
            const argsString = args.toString();
            console.log('onPreviewStopped', argsString);
        }

        // stop scanning also here (if possible)
        scanViewController.captureManager.onpreviewerror = function (args) {
            const argsString = args.toString();
            console.error('onPreviewError', argsString);
            closeCamera();
            destroyPreview();
            delete scanViewController;
            onError(argsString);
        }

        scanViewController.onnotifyupdatecutout = (args) => {
            const argsString = args.toString();
            const functionName = argsString.split('(')[0];
            const functionArgs = argsString.split('(')[1].split(')')[0];
            window[functionName](JSON.parse(functionArgs));
        }

        scanViewController.onnotifyclearvisualfeedback = (args) => {
            const argsString = args.toString();
            window['setCutoutBorders'](argsString);
            window['clearVF']();
        }

        // Event triggered if screen is rotated
        scanViewController.captureManager.onpreviewrotated = () => {
            calcVideoRelation();
        }
        
        scanViewController.onnotifyupdatevisualfeedback = function (args) {
            if (args) {

                const argsString = args.toString();
                const functionName = argsString.split('(')[0];
                const functionArgs = argsString.split('(')[1].split(')')[0];
                if (functionName === 'setCutoutBorders') {
                    window[functionName](functionArgs.replace(/['"]+/g, ''));
                } else {
                    window[functionName](JSON.parse(functionArgs));
                }
            }
        }

        // Open the camera first
        openCamera();

        // handle errors
        scanViewController.onnotifyexception = function (args) {
            const argsString = args.toString();
            console.error('onNotifyExcepction', argsString);
            closeCamera();
            destroyPreview();
            delete scanViewController;
            onError(argsString);
        };

        // handle scan result
        scanViewController.onnotifyscanresult = function (args) {
            const argsString = args.toString();
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
    if (!document.getElementById("anylineCutoutScript")) {
        includeScript(urlutil.makeAbsolute("/www/js/cutout.js"), 'anylineCutoutScript');
    }
    if (!document.getElementById("anylineVFScript")) {
        includeScript(urlutil.makeAbsolute("/www/js/visualFeedback.js"), 'anylineVFScript');
    }
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
    backgroundElement.id = "anylineBackground";
    const cutoutElement = document.createElement('div');
    cutoutElement.id = "anylineCutout";
    backgroundElement.appendChild(cutoutElement)

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
                    console.log("Torch enabled.");
                }
            } else {
                var success = scanViewController.disableFlash();
                scanViewController.captureManager.mediaCapture.videoDeviceController.flashControl.enabled = false;
                // flash is disabled:
                if (success == true) {
                    flashButton.innerHTML = TORCH_OFF;
                    console.log("Torch disabled.");
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
}

function destroyPreview() {

    try
    {
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
        scanViewController.onnotifyclearvisualfeedback = null;
        scanViewController.onnotifyupdatecutout = null;
        scanViewController.onnotifyexception = null;
        scanViewController.onnotifyscanresult = null;
    }
    catch (exception) {
        console.log(exception);
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
                //console.log("Focused successfully.");
            } else {
                //console.log("Focus is not supported on this device.");
            }
        }
    }
    catch (exception) {
        console.log("Unable to focus: " + exception);
    }
}

// Visual Feedback
let VFRender = null;

// starts the camera (only works after init is called because the config must already be loaded etc.)
function openCamera() {
    scanViewController.captureManager.initializeCamera().then(function (result) {
        const videoElement = document.getElementById("anylineVideoElement");

        if (videoElement == null) {
            console.error("VideoElement not found!");
        }

        videoElement.src = URL.createObjectURL(scanViewController.captureManager.mediaCapture, { oneTimeOnly: true });
        try {
            videoElement.onplay = function () {
                console.log("Playing.");
                VFRender = setInterval(function () {
                    updateFrames();
                }, 100);
            };
            videoElement.play();

            // tap to focus
            const anylineRoot = document.getElementById("anylineRoot");
            anylineRoot.onclick = function () {
                focus();
            };
        }
        catch (ex) {
            console.log(ex);
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

    clearInterval(VFRender);
    window.removeEventListener('resize', calcVideoRelation);
    webUIApp.removeEventListener('enteredbackground', msVisibilityChangeHandler);

    scanViewController.captureManager.terminateCamera().then(function (success) {
        console.log("Stopped: " + success);
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

    // mirror preview & VF when the camera is front-facing
    if (scanViewController.captureManager.isPreviewMirrored) {

        var mirror = "-moz-transform: scale(-1, 1); \
                                -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
                                transform: scale(-1, 1); filter: FlipH;";

        videoElement.style.cssText = mirror;
        canvasElement.style.cssText = mirror;
    }

    if (windowRelation < camRelation) {
        // Video
        videoElement.style.height = window.innerHeight + 'px';
        videoElement.style.width = window.innerHeight * camRelation + 'px';

        // Canvas
        canvasElement.height = window.innerHeight;
        canvasElement.width = window.innerHeight * camRelation;

        const overflowWidth = window.innerHeight * camRelation - window.innerWidth;

        videoElement.style.top = 0;
        backgroundElement.style.top = 0;
        canvasElement.style.top = 0;
        var ow = -(overflowWidth / 2) + 'px';
        videoElement.style.left = ow;
        backgroundElement.style.left = ow;
        canvasElement.style.left = ow;

    } else {
        // Video
        videoElement.style.width = window.innerWidth + 'px';
        videoElement.style.height = window.innerWidth / camRelation + 'px';

        // Canvas
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerWidth / camRelation;

        const overflowHeight = window.innerWidth / camRelation - window.innerHeight;

        videoElement.style.left = 0 + 'px';
        backgroundElement.style.left = 0 + 'px';
        canvasElement.style.left = 0 + 'px';
        var oh = -(overflowHeight / 2) + 'px';
        backgroundElement.style.top = oh;

        videoElement.style.top = oh;

    }

    // Update Cutout from SDK
    var w = window.innerWidth;
    var h = window.innerHeight;
    scanViewController.updateForSize(w, h);

    updateFlashButton();

}
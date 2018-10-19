/*
    Anyline ScanView
*/
const webUIApp = Windows.UI.WebUI.WebUIApplication;
const urlutil = require('cordova/urlutil');
let scanViewController = null;
let onErrorGlobal;


module.exports = {

    init: function (licenseKey, mode, config, onSuccess, onError, ocrConfig) {

        onErrorGlobal = onError;
        scanViewController = new Anyline.JS.ScanViewController();
        scanViewController.setMemoryCollectionMode(2);
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
            console.error('onPreviewStopped', argsString);
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

        // Open the camera!!!
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

        // handle scan result..
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
        includeScript(urlutil.makeAbsolute("/www/js/cutout.js"), console.log, 'anylineCutoutScript');
    }
    if (!document.getElementById("anylineVFScript")) {
        includeScript(urlutil.makeAbsolute("/www/js/visualFeedback.js"), console.log, 'anylineVFScript');
    }
    if (!document.getElementById("anylineUtilScript")) {
        includeScript(urlutil.makeAbsolute("/www/js/util.js"), console.log, 'anylineUtilScript');
    }
    if (!document.getElementById("anylineTorchScript")) {
        includeScript(urlutil.makeAbsolute("/www/js/torch.js"), console.log, 'anylineTorchScript');
    }
    // Root
    const anylineRoot = document.createElement('div')
    anylineRoot.id = 'anylineRoot';

    // Video
    const videoElement = document.createElement("video");
    videoElement.id = "anylineVideoElement";

    //if (cancelButton) { TODO uncomment if config is wanted

    const cancelBtnElement = document.createElement("button");
    cancelBtnElement.id = "anylineCancelButton";
    cancelBtnElement.innerHTML = 'CANCEL';
    cancelBtnElement.onclick = function () {
        closeCamera();
        destroyPreview();
        delete scanViewController;
        onErrorGlobal('canceled');
    }
    anylineRoot.appendChild(cancelBtnElement);
    //}

    // Torch
    // const torchBtnElement = document.createElement("button");
    // torchBtnElement.id = "anylineTorchButton";
    // torchBtnElement.innerHTML = 'TORCH';
    // torchBtnElement.onclick = function () {
    //     enableTorch();
    // }
    // anylineRoot.appendChild(torchBtnElement);


    // Cutout
    const backgroundElement = document.createElement('div');
    backgroundElement.id = "anylineBackground";
    const cutoutElement = document.createElement('div');
    cutoutElement.id = "anylineCutout";
    backgroundElement.appendChild(cutoutElement)

    // Canvas
    const canvasElement = document.createElement('canvas');
    canvasElement.id = "anylineCanvas";

    [videoElement, backgroundElement, canvasElement].forEach(function (element) {
        anylineRoot.appendChild(element);
    });
    document.body.appendChild(anylineRoot);
    disableZoomAndScroll();
}

function destroyPreview() {

    // Root Element
    document.getElementById("anylineCanvas").remove();
    document.getElementById("anylineRoot").remove();

    // Zoom/Scroll
    enableZoomAndScroll();

    //Events
    scanViewController.onnotifyupdatevisualfeedback = null;
    scanViewController.onnotifyclearvisualfeedback = null;
    scanViewController.onnotifyupdatecutout = null;
    scanViewController.onnotifyexception = null;
    scanViewController.onnotifyscanresult = null;
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

function includeScript(path, cb, id) {
    if (!(window.MSApp && window.MSApp.execUnsafeLocalFunction)) {
        var node = document.createElement("script"),
            okHandler, errHandler;

        node.src = path;
        node.id = id;

        okHandler = function () {
            this.removeEventListener("load", okHandler);
            this.removeEventListener("error", errHandler);
            cb(path, 'success');
        };
        errHandler = function (error) {
            this.removeEventListener("load", okHandler);
            this.removeEventListener("error", errHandler);
            cb("Error loading script: " + path);
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
                cb();
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

// Visual Feedback
let VFRender = null;

// starts the camera (only works after init is called because the config must already be loaded etc.)
function openCamera() {
    scanViewController.captureManager.initializeCamera().then(function (result) {
        const videoElement = document.getElementById("anylineVideoElement");

        videoElement.src = URL.createObjectURL(scanViewController.captureManager.mediaCapture, { oneTimeOnly: true });

        videoElement.play().then(function () {
            console.log("Playing.");
            VFRender = setInterval(function () {
                updateFrames();
            }, 100);
        });
    });

    // Event onResize Window
    window.addEventListener("resize", calcVideoRelation);
    webUIApp.addEventListener('enteredbackground', msVisibilityChangeHandler, false);
}

// stops the camera
function closeCamera() {
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
    onErrorGlobal('canceled');
}

// Calculate the Video and Webview width and height
function calcVideoRelation() {
    let props = scanViewController.captureManager.getResolution();
    const camRelation = props.width / props.height;
    const windowRelation = window.innerWidth / window.innerHeight;
    const canvasElement = document.getElementById("anylineCanvas");
    const backgroundElement = document.getElementById("anylineBackground");
    const videoElement = document.getElementById("anylineVideoElement");

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

        videoElement.style.left = 0;
        backgroundElement.style.left = 0;
        canvasElement.style.left = 0;
        var oh = -(overflowHeight / 2) + 'px';
        //videoElement.style.top = oh;
        backgroundElement.style.top = oh;
        //canvasElement.style.top = oh;
    }

    //// Update Cutout from SDK
    var w = window.innerWidth;
    var h = window.innerHeight;
    scanViewController.updateForSize(w, h);
}

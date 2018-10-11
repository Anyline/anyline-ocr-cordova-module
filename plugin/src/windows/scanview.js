/*
    Anyline ScanView
*/
const urlutil = require('cordova/urlutil');
let camHeight = null;
let camWidth = null;
let scanViewController;

module.exports = {

    init: function (licenseKey, mode, config, onSuccess, onError, ocrConfig) {
        scanViewController = new Anyline.JS.ScanViewController();
        createPreview();

        if (!ocrConfig) {
            ocrConfig = "";
        }

        scanViewController.setup(licenseKey, mode, JSON.stringify(config), "");

        // start scanning here
        scanViewController.captureManager.onpreviewstarted = function (args) {
            try {
                scanViewController.startScanning();
            } catch (e) {
                console.error(e);
                onError(e);
            }
            console.log("started scanning");
        }

        // stop scanning here
        scanViewController.captureManager.onpreviewstopped = function (args) {
            scanViewController.cancelScanning();
            console.log("stopped scanning");
        }

        // stop scanning also here (if possible)
        scanViewController.captureManager.onpreviewerror = function (args) {
            console.log(args);
        }

        scanViewController.onnotifyupdatecutout = (args) => {
            console.log(args.toString());
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

        scanViewController.onnotifyupdatevisualfeedback = function (args) {
            if (args) {
                const argsString = args.toString();
                const functionName = argsString.split('(')[0];
                const functionArgs = argsString.split('(')[1].split(')')[0];

                if (functionName === 'setCutoutBorders') {
                    window[functionName](functionArgs.replace(/['"]+/g, ''));
                } else if (functionName === 'al_loadConfig' || functionName === 'al_polygon') {
                    window[functionName](JSON.parse(functionArgs));
                }
            }
        }
        // Open the camera!!!
        openCamera();

        // handle scan result..
        scanViewController.onnotifyscanresult = function (args) {
            const argsString = args.toString();
            closeCamera();
            destroyPreview();
            scanViewController.cancelScanning();
            delete scanViewController;
            onSuccess(JSON.parse(argsString));
        };
    },
}

/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////        Preview                ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

function createPreview() {

    // CSS
    if (!document.getElementById('anylineStylecutout')) {
        createCSSLink("cutout");
    }
    if (!document.getElementById('anylineStyledefault')) {
        createCSSLink("default");
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
    // Root
    const anylineRoot = document.createElement('div')
    anylineRoot.id = 'anylineRoot';

    // Video
    const videoElement = document.createElement("video");
    videoElement.id = "videoElement";

    // Cutout
    const backgroundElement = document.createElement('div');
    backgroundElement.id = "background";
    const cutoutElement = document.createElement('div');
    cutoutElement.id = "cutout";
    backgroundElement.appendChild(cutoutElement)

    // Canvas
    const canvasElement = document.createElement('canvas');
    canvasElement.id = "myCanvas";

    [videoElement, backgroundElement, canvasElement].forEach(function (element) {
        anylineRoot.appendChild(element);
    });
    document.body.appendChild(anylineRoot);
    disableZoomAndScroll();
}

function destroyPreview() {

    // Root Element
    document.getElementById("anylineRoot").remove();

    // Zoom/Scroll
    enableZoomAndScroll();

    //Events
    scanViewController.onnotifyupdatevisualfeedback = null;
    scanViewController.onnotifyclearvisualfeedback = null;
    scanViewController.onnotifyupdatecutout = null;
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
        const videoElement = document.getElementById("videoElement");

        let props = scanViewController.captureManager.mediaCapture.videoDeviceController.getMediaStreamProperties(Windows.Media.Capture.MediaStreamType.videoPreview);
        console.log(props.width + " x " + props.height);
        camHeight = props.height;
        camWidth = props.width;
        videoElement.src = URL.createObjectURL(scanViewController.captureManager.mediaCapture, { oneTimeOnly: true });

        calcVideoRelation();
        videoElement.play().then(function () {
            console.log("Playing.");
            VFRender = setInterval(function () {
                updateFrames();
            }, 100);
        });
    });

    // Event onResize Window
    window.addEventListener("resize", () => {
        calcVideoRelation();
    });
}

// stops the camera
function closeCamera() {

    if (scanViewController.captureManager.mediaCapture == null)
        return;
    const videoElement = document.getElementById("videoElement");
    videoElement.src = null;

    clearInterval(VFRender);
    window.removeEventListener('resize');

    scanViewController.captureManager.terminateCamera().then(function (success) {
        console.log("Stopped: " + success);
    });
}

// Calculate the Video and Webview width and height
function calcVideoRelation() {
    const camRelation = camWidth / camHeight;
    const windowRelation = window.innerWidth / window.innerHeight;
    const canvasElement = document.getElementById("myCanvas");
    const backgroundElement = document.getElementById("background");
    const videoElement = document.getElementById("videoElement");

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
        if (overflowWidth > 0 && window.innerWidth < camWidth) {
            var ow = -(overflowWidth / 2) + 'px';
            videoElement.style.left = ow;
            backgroundElement.style.left = ow;
            canvasElement.style.left = ow;
        }
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
        if (overflowHeight > 0 && window.innerHeight < camHeight) {

            var oh = -(overflowHeight / 2) + 'px';

            videoElement.style.top = oh;
            backgroundElement.style.top = oh;
            canvasElement.style.top = oh;
        }
    }

    //// Update Cutout from SDK
    var w = window.innerWidth;
    var h = window.innerHeight;
    scanViewController.updateForSize(w, h);
}

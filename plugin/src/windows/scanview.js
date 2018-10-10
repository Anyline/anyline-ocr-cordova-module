
// EVERYTHING ANYLINE <-> JS /HTML RELATED GOES HERE (FOR NOW)

// TODO:
/*
    the scanview should create the DOM elements here, right?
 
    watermark etc.
*/
const urlutil = require('cordova/urlutil');
let camHeight = null;
let camWidth = null;
const scanViewController = new Anyline.JS.ScanViewController();

const licensePlateConfig = {
    "captureResolution": "720",
    "cutout": {
        "style": "rect",
        "maxWidthPercent": "100%",
        "maxHeightPercent": "100%",
        "alignment": "center",
        "width": 0,
        "ratioFromSize": {
            "width": 2,
            "height": 1
        },
        "strokeWidth": 2,
        "cornerRadius": 10,
        "strokeColor": "FFFFFF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "feedbackStrokeColor": "0099FF"
    },
    "flash": {
        "mode": "manual",
        "alignment": "bottom_right",
        "imageOn": "flash_on",
        "imageOff": "flash_off"
    },
    "beepOnResult": true,
    "vibrateOnResult": true,
    "blinkAnimationOnResult": true,
    "cancelOnResult": false,
    "visualFeedback": {
        "style": "rect",
        "strokeWidth": 2,
        "strokeColor": "0099FF",
        "fillColor": "330099FF",
        "cornerRadius": 0
    }
}

module.exports = {

    createPreview: function () {

        console.log('preview');
        // CSS
        createCSSLink("cutout");
        createCSSLink("default");

        // Video
        videolElement = document.createElement("video");
        videolElement.id = "videoElement";

        // Cutout
        backgroundElement = document.createElement('div');
        backgroundElement.id = "background";
        coutoutElement = document.createElement('div');
        coutoutElement.id = "coutout";
        backgroundElement.appendChild(coutoutElement)

        // Canvas
        canvasElement = document.createElement('canvas');
        canvasElement.id = "myCanvas";
    },

    init: function (licenseKey) {


        scanViewController.setup(licenseKey, "LICENSE_PLATE", JSON.stringify(licensePlateConfig), "");

        // start scanning here
        scanViewController.captureManager.onpreviewstarted = function (args) {
            scanViewController.startScanning();
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

        // TODO: make calls in JS
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

        // handle scan result..
        scanViewController.onnotifyscanresult = function (args) {
            const argsString = args.toString();
            console.log('Result', argsString);
        };
    },

    // starts the camera (only works after init is called because the config must already be loaded etc.)
    openCamera: function () {

        scanViewController.captureManager.initializeCamera().then(function (result) {

            const videoElement = document.getElementById("videoElement");

            let props = scanViewController.captureManager.mediaCapture.videoDeviceController.getMediaStreamProperties(Windows.Media.Capture.MediaStreamType.videoPreview);
            console.log(props.width + " x " + props.height);
            camHeight = props.height;
            camWidth = props.width;
            videoElement.src = URL.createObjectURL(scanViewController.captureManager.mediaCapture, { oneTimeOnly: true });

            calcVideoRelation();

            videoElement.play().then(function () {
                //console.log("Playing.");
                setInterval(function () {
                    updateFrames();
                }, 100);
            });
        });

        // Event onResize Window
        window.addEventListener("resize", () => {
            calcVideoRelation();
        });
    },

    // stops the camera
    closeCamera: function () {

        if (scanViewController.captureManager.mediaCapture == null)
            return;
        const videoElement = document.getElementById("videoElement");

        videoElement.src = null;

        scanViewController.captureManager.terminateCamera().then(function (success) {
            console.log("Stopped: " + success);
        });
    },

}

// Utils
function createCSSLink(name) {
    var styleElement = document.createElement('link');
    styleElement.rel = "stylesheet";
    styleElement.type = "text/css";
    styleElement.href = urlutil.makeAbsolute("/www/css/" + name + ".css");
    document.head.appendChild(styleElement);
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

    // Update Cutout from SDK
    var w = window.innerWidth;
    var h = window.innerHeight;
    scanViewController.updateForSize(w, h);
}



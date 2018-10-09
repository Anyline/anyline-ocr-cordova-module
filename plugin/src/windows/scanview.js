// EVERYTHING ANYLINE <-> JS /HTML RELATED GOES HERE (FOR NOW)

// TODO:
/*
    the scanview should create the DOM elements here, right?

    watermark etc.
*/

const scanViewController = new Anyline.JS.ScanViewController();
const videoElement = document.getElementById("videoElement");
const canvasElement = document.getElementById("myCanvas");
const cutoutElement = document.getElementById("cutout");
const backgroundElement = document.getElementById("background");

let camHeight = null;
let camWidth = null;

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

function createElements() {
    console.log('Hasdasd');
}

function init(licenseKey) {
    
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
}

// starts the camera (only works after init is called because the config must already be loaded etc.)
function openCamera() {

    scanViewController.captureManager.initializeCamera().then(function (result) {

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
}

// stops the camera
function closeCamera() {

    if (scanViewController.captureManager.mediaCapture == null)
        return;

    videoElement.src = null;

    scanViewController.captureManager.terminateCamera().then(function (success) {
        console.log("Stopped: " + success);
    });
}

// Calculate the Video and Webview width and height
const calcVideoRelation = function () {  
    const camRelation = camWidth / camHeight;
    const windowRelation = window.innerWidth / window.innerHeight;

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


// Event onResize Window
window.addEventListener("resize", () => {
    calcVideoRelation();
});
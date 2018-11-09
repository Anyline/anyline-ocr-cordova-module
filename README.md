	 _____         _ _         
	|  _  |___ _ _| |_|___ ___ 
	|     |   | | | | |   | -_|
	|__|__|_|_|_  |_|_|_|_|___|
	          |___|            
              
# Anyline SDK Cordova Plugin 

Anyline provides an easy-to-use SDK for applications to enable Optical Character Recognition (OCR) on mobile devices.

### Available Products
- [**Barcode:**](https://documentation.anyline.com/toc/products/barcode/index.html)  Scan 23 types of international barcode & QR code formats.
- [**Energy:**](https://documentation.anyline.com/toc/products/meter/index.html) Scan meter readings of various electric, gas, and water meters.
- [**License Plate:**](https://documentation.anyline.com/toc/products/license_plate/index.html)  Scan license plates of different sizes and from different countries.
- [**Document:**](https://documentation.anyline.com/toc/products/document/index.html) Detect document outlines, validate the angles of the document to ensure it is not too skewed, validates the document ratio, determine the sharpness of the text and rectifie the document.
- [**ID:**](https://documentation.anyline.com/toc/products/id/index.html)  Reliable scanning of data from passports, Driving Licenses and IDs machine readable zones (MRZ)
- [**Anyline OCR:**](https://documentation.anyline.com/toc/products/anyline_ocr/index.html) Create a custom use case with LINE or GRID recognition

###UWP

UWP is currently available in a Beta phase. You can use it with <b>x86</b>.
Available products are: 
    - <b>Anyline OCR</b>
    - <b>Barcode</b>
    - <b>License Plate</b>
    - <b>MRZ</b>

### Requirements

#### Android
- Android device with SDK >= 15
- decent camera functionality (recommended: 720p and adequate auto focus)

#### iOS
- minimum iOS 8
- minimum iPhone4s
- minimum Camera of 1080p
- Cordova iOS v4.3.0 (Cocoapod support)


### Quick Start - Setup
This is just a simple setup guide to integrate the anylinesdk-plugin in an existing Cordova project.<br/>
For more information about Cordova, how to use plugins, etc. see <a target="_blank" href="https://cordova.apache.org/">https://cordova.apache.org/</a>.

##### 1. Add the anylinesdk-plugin to your existing cordova project
```
cordova plugin add io-anyline-cordova
```

Or use plugman. E.g. for android:  

```
plugman install --platform android --project platforms/android --plugin io-anyline-cordova
```

if you get this error:

```
Error: CocoaPods was not found. Please install version 1.0.1 or greater from https://cocoapods.org/
```
please install [Cocoapods](https://guides.cocoapods.org/using/getting-started.html)

If you'd like to clone the repository you will have to use git-lfs. Use the following commands to install git-lfs.
```
brew install git-lfs
git lfs install
```
If you prefer downloading a package, use the provided `zip` package on the [releases page](https://github.com/Anyline/anyline-ocr-cordova-module/releases). Be aware that the github download zip button does not work for projects with git-lfs.

##### 2. Plugin Usage

```javaScript
cordova.exec(onResult, onError, "AnylineSDK", scanMode, config);
```

- <b>onResult</b>: a function that is called on a scan result
- <b>onError</b>: a function that is called on error or when the user canceled the scanning
- <b>AnylineSDK</b>: add this *string* to make sure the anyline-sdk plugin is called
- <b>scanMode</b>: "<i>scan</i>"
- <b>config</b>: an array
    * <b>config[0]</b>: the license key
    * <b>config[1]</b>: the [view config](https://documentation.anyline.com/toc/view_configuration/)

> Example for **config** from MRZ:

```json
[
    "YOUR_LICENSE_KEY",
    {
    "camera": {
      "captureResolution": "1080p"
    },
    "flash": {
      "mode": "manual",
      "alignment": "bottom_left"
    },
    "viewPlugin": {
      "plugin": {
        "id": "IDPlugin_ID",
        "idPlugin": {
          "mrzConfig": {
            "strictMode": false,
            "cropAndTransformID": false
          }
        }
      },
      "cutoutConfig": {
        "style": "rect",
        "maxWidthPercent": "90%",
        "maxHeightPercent": "90%",
        "alignment": "center",
        "ratioFromSize": {
          "width": 125,
          "height": 85
        },
        "strokeWidth": 2,
        "cornerRadius": 4,
        "strokeColor": "FFFFFF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "cropPadding": {
          "x": 0,
          "y": 0
        },
        "cropOffset": {
          "x": 0,
          "y": 0
        },
        "feedbackStrokeColor": "0099FF",
        "offset": {
          "x": 0,
          "y": 30
        }
      },
      "scanFeedback": {
        "style": "rect",
        "strokeColor": "0099FF",
        "strokeWidth": 2,
        "blinkOnResult": true,
        "beepOnResult": true,
        "vibrateOnResult": true
      },
      "cancelOnResult": true
    },
    "cropAndTransformErrorMessage": "Edges are not detected"
  }
]
```


##### 3. Run your cordova project: Enjoy scanning and have fun :)

Checkout our <a href="https://documentation.anyline.com/">online documentation</a>  for more details.

## Known Issues

### iOS
```
Error: data parameter is nil
```
This can happen, when the Cocoapod installation is not correctly linked. You can fix this by going into
**myCordovaApp/platforms/ios** and run:

``` bash
pod install
```

## Additional Functions

#### getLicenseExpiryDate
Check till when the provided License is or was valid. Returns a string.
```
cordova.exec(console.log, console.log, "AnylineSDK", "CHECK_LICENSE", [licenseKey]); // YYYY-MM-DD
```

## License

See LICENSE file.

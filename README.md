	 _____         _ _         
	|  _  |___ _ _| |_|___ ___ 
	|     |   | | | | |   | -_|
	|__|__|_|_|_  |_|_|_|_|___|
	          |___|            
              
# Anyline SDK Cordova Plugin 

Anyline provides an easy-to-use SDK for applications to enable Optical Character Recognition (OCR) on mobile devices.

## Anyline Cordova Plugin Documentation Resources
- Cordova [Documentation]( https://documentation.anyline.com/toc/platforms/cordova/getting_started.html)
- Newest Anyline Cordova [Release Notes](https://documentation.anyline.com/toc/platforms/cordova/release_guide/index.html)

## Attention - Update to AndroidX!

As of version 19 (March 2020), Anyline will use <b>AndroidX</b> libraries, which may lead to conflicts in case you are still using support libraries. Please consider updating your project to also use AndroidX, as we will not have support for conflicts caused by these dependencies.

Please ensure that the AndroidXEnabled preference name is set to true in config.xml:
```
<preference name="AndroidXEnabled" value="true" />"
```

## Update to >= 5.0

If you use this plugin with a equal or greater version then 5.0, you can use our new Anyline structure, which will provide the whole
configuration of every SDK Feature through the config file. If you use the the 'scan' call in your Javascript files, you have to 
use a new config style.
The old calls with the old configurations will still work.

### Available Products
- [**Barcode:**](https://documentation.anyline.com/toc/products/barcode/index.html)  Scan 23 types of international barcode & QR code formats.
- [**Energy:**](https://documentation.anyline.com/toc/products/meter/index.html) Scan meter readings of various electric, gas, and water meters.
- [**License Plate:**](https://documentation.anyline.com/toc/products/license_plate/index.html)  Scan license plates of different sizes and from different countries.
- [**Document:**](https://documentation.anyline.com/toc/products/document/index.html) Detect document outlines, validate the angles of the document to ensure it is not too skewed, validates the document ratio, determine the sharpness of the text and rectifie the document.
- [**ID:**](https://documentation.anyline.com/toc/products/id/index.html)  Reliable scanning of data from passports, Driving Licenses and IDs machine readable zones (MRZ)
- [**Anyline OCR:**](https://documentation.anyline.com/toc/products/anyline_ocr/index.html) Create a custom use case with LINE or GRID recognition

### Requirements

#### Android
- Android device with SDK >= 21
- decent camera functionality (recommended: 720p and adequate auto focus)

#### iOS
- minimum iOS 12
- minimum iPhone 5s 
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
cordova.exec(onResult, onError, "AnylineSDK", "scan", config);
```

- <b>onResult</b>: a function that is called on a scan result
- <b>onError</b>: a function that is called on error or when the user canceled the scanning
- <b>AnylineSDK</b>: add this *string* to make sure the anyline-sdk plugin is called
- <b>scanMode</b>: "<i>scan</i>"
- <b>config</b>: an array
    * <b>config[0]</b>: the license key
    * <b>config[1]</b>: the [view config](https://documentation.anyline.com/toc/view_configuration/index.html)


##### OCR sample configuration
For more examples, check the [example configurations](https://github.com/Anyline/anyline-ocr-cordova-module/tree/master/example/www/js).

```json
[
  "YOUR_LICENSE_KEY",
  {
    "camera": {
      "captureResolution": "1080"
    },
    "flash": {
      "mode": "manual",
      "alignment": "bottom_right"
    },
    "viewPlugin": {
      "plugin" : {
        "id" : "OCR_VC",
        "ocrPlugin" : {
          "scanMode" : "AUTO",
          "languages" : ["www/assets/anyline_capitals.traineddata"],
          "charWhitelist": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
          "validationRegex": "[A-Z0-9]{8}$",
          "minConfidence": 85

        }
      },
      "cutoutConfig": {
        "style": "rect",
        "maxWidthPercent": "80%",
        "maxHeightPercent": "80%",
        "alignment": "center",
        "width": 540,
        "ratioFromSize": {
          "width": 5,
          "height": 1
        },
        "strokeWidth": 2,
        "cornerRadius": 10,
        "strokeColor": "FFFFFF",
        "outerColor": "000000",
        "outerAlpha": 0.3,
        "feedbackStrokeColor": "0099FF"
      },
      "scanFeedback": {
        "style": "contour_point",
        "strokeWidth": 3,
        "strokeColor": "0099FF",
        "fillColor": "220099FF",
        "beepOnResult": true,
        "vibrateOnResult": true,
        "blinkAnimationOnResult": true
      },
      "cancelOnResult": true
    }
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

If Anyline was not installed via pods, please make sure that your Podfile (./platform/ios/Podfile) contains the following line within your build target: 
```
pod 'Anyline'
```

#### Access to app denied | missing architectures 

Please make sure that your XCode Project has the build setting "Valid Architectures" set. This has to be set in your Build Target and in the Pods build target. 

Project Settings --> Build Settings --> Search for Valid Architecture --> Add the following value: "$(inherited) arm64 arm64e armv7 armv7s"

```
"VALID_ARCHS" = "$(inherited) arm64 arm64e armv7 armv7s"
```

## Additional Functions

#### getLicenseExpiryDate
Check till when the provided License is or was valid. Returns a string.
```
cordova.exec(console.log, console.log, "AnylineSDK", "CHECK_LICENSE", [licenseKey]); // YYYY-MM-DD
```
## Images

Keep in mind, all the images are saved in the cache directory of the app. For performance reasons, we only provide the 
path as string, so we don't have to transfer the whole image through the bridge. Please be aware,  that you should not 
use the images in the cache directory for persistent storage, but store the images in a location of your choice for persistence.

## Get Help (Support)

We don't actively monitor the Github Issues, please raise a support request using the [Anyline Helpdesk](https://anyline.atlassian.net/servicedesk/customer/portal/2/group/6).
When raising a support request based on this Github Issue, please fill out and include the following information:

```
Support request concerning Anyline Github Repository: anyline-ocr-cordova-module
```

Thank you!

## License

See LICENSE file.

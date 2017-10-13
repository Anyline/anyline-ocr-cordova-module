## Anyline SDK Cordova Plugin ##

Anyline provides an easy-to-use SDK for applications to enable Optical Character Recognition (OCR) on mobile devices.

### Available Modules
- [**Barcode:**](https://documentation.anyline.io/toc/modules/barcode/index.html)  Scan 23 types of international barcode & QR code formats.
- [**Energy:**](https://documentation.anyline.io/toc/modules/energy/index.html) Scan meter readings of various electric, gas, and water meters.
- [**License Plate:**](https://documentation.anyline.io/toc/modules/license_plate/index.html)  Scan license plates of different sizes and from different countries.
- [**Document:**](https://documentation.anyline.io/toc/modules/document/index.html) Detect document outlines, validate the angles of the document to ensure it is not too skewed, validates the document ratio, determine the sharpness of the text and rectifie the document.
- [**MRZ:**](https://documentation.anyline.io/toc/modules/mrz/index.html)  Reliable scanning of data from passports' and IDs' machine readable zones (MRZ)
- [**Anyline OCR:**](https://documentation.anyline.io/toc/modules/anyline_ocr/index.html) Create a custom use case with LINE or GRID recognition

### Requirements

#### Android
- Android device with SDK >= 15
- decent camera functionality (recommended: 720p and adequate auto focus)

#### iOS
- minimum iOS 8.2
- minimum iPhone4s


### Quick Start - Setup
This is just a simple setup guide to integrate the anylinesdk-plugin in an existing Cordova project.<br/>
For more information about Cordova, how to use plugins, etc. see <a target="_blank" href="https://cordova.apache.org/">https://cordova.apache.org/</a>.

###### 1. Add the anylinesdk-plugin to your existing cordova project
```
cordova plugin add io-anyline-cordova
```

Or use plugman. E.g. for android:  

```
plugman install --platform android --project platforms/android --plugin io-anyline-cordova
```

If you'd like to clone the repository you will have to use git-lfs. Use the following commands to install git-lfs.
```
brew install git-lfs
git lfs install
```
If you prefer downloading a package, use the provided `zip` package on the [releases page](https://github.com/Anyline/anyline-ocr-cordova-module/releases). Be aware that the github download zip button does not work for projects with git-lfs.




###### 2. Plugin Usage

```javaScript
cordova.exec(onResult, onError, "AnylineSDK", scanMode, config);
```

- <b>onResult</b>: a function that is called on a scan result
- <b>onError</b>: a function that is called on error or when the user canceled the scanning
- <b>AnylineSDK</b>: add this *string* to make sure the anyline-sdk plugin is called
- <b>scanMode</b>: "<i>MRZ</i>", "<i>LICENSE_PLATE</i>", "<i>BARCODE</i>", "<i>ANYLINE_OCR</i>", "<i>ELECTRIC_METER</i>" (more Energy modes can be found [here](https://documentation.anyline.io/#energy))
- <b>config</b>: an array
    * <b>config[0]</b>: the license key
    * <b>config[1]</b>: the [view config](https://documentation.anyline.io/#anyline-config)
    * <b>config[2]</b>: the [ocr config](https://documentation.anyline.io/#anyline-ocr) (only uses with mode ANYLINE_OCR)


> Example for **config** from MRZ:

```json
[
    "YOUR_LICENSE_KEY",
    {
        "captureResolution": "1080p",
        "cutout": {
            "style": "rect",
            "maxWidthPercent": "90%",
            "maxHeightPercent": "90%",
            "alignment": "top_half",
            "strokeWidth": 2,
            "cornerRadius": 4,
            "strokeColor": "FFFFFF",
            "outerColor": "000000",
            "outerAlpha": 0.3
        },
        "flash": {
            "mode": "manual",
            "alignment": "bottom_right"
        },
        "beepOnResult": true,
        "vibrateOnResult": true,
        "blinkAnimationOnResult": true,
        "cancelOnResult": true
    }
]
```


###### 3. Run your cordova project: Enjoy scanning and have fun :)

Checkout our <a href="https://documentation.anyline.io/">online documentation</a>  for more details.


## License

See LICENSE file.

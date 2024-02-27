	 _____         _ _
	|  _  |___ _ _| |_|___ ___
	|     |   | | | | |   | -_|
	|__|__|_|_|_  |_|_|_|_|___|
	          |___|

## Anyline Cordova Example App ##

This example Cordova app for Android and iOS integrates the `io-anyline-cordova` plugin, and showcases the
different scanning possibilities that come with Anyline.

### Quick Start

Android:
```
npm run reinstall
```

iOS:
```
npm run reinstall-ios
```

See **package.json** for more commands.


### Running The Example App

IMPORTANT: Before running the example app, replace the string defined in anyline.license.js with a valid license key. To find out how to obtain a license key, see License.

Android:
```
cordova run android --device
```

iOS:
```
cordova run ios --device
```

On iOS, a [build configuration file](https://cordova.apache.org/docs/en/12.x/guide/platforms/ios/#using-buildjson) may be more convenient to allow you to build the examples app in the way you want. To do so, create a build.json file in the `example` directory containing the following:

```
{
    "ios": {
        "debug": {
            "codeSignIdentity": "Apple Development",
            "developmentTeam": "<YOUR_TEAM_ID>",
            "automaticProvisioning": true,
            "packageType": "development"
        },
        "release": {
            "codeSignIdentity": "Apple Development",
            "developmentTeam": "<YOUR_TEAM_ID>",
            "packageType": "app-store",
            "automaticProvisioning": true,
            "buildFlag": ["-UseModernBuildSystem=0", "-allowProvisioningUpdates"]
        }
    }
}
```

## License 

To claim a free developer / trial license, go to: [Anyline SDK Register Form](https://anyline.com/free-demos/)
The software underlies the MIT License. As Anyline is a paid software for Commercial Projects, the License Agreement of Anyline GmbH applies, when used commercially.
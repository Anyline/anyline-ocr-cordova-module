	 _____         _ _
	|  _  |___ _ _| |_|___ ___
	|     |   | | | | |   | -_|
	|__|__|_|_|_  |_|_|_|_|___|
	          |___|

## Anyline Cordova Example App ##

This example Cordova app for Android and iOS integrates the `io-anyline-cordova` plugin, and showcases the
different scanning possibilities that come with Anyline.

### Prerequisites

Before starting, check that your development environment is properly configured:

```bash
./scripts/check-environment.sh
```

This validates:
- Node.js (v20+), Cordova CLI (v12+), npm
- Android: Java, Gradle, Android SDK, Build Tools 35.0.0
- iOS: Xcode, Command Line Tools, xcrun devicectl (macOS only)

### Quick Start

**1. Install dependencies and add plugins:**
```bash
npm install
npm run addPlugins
```

**2. Add platforms:**

Android:
```bash
npm run reinstall
```

iOS (macOS only):
```bash
npm run reinstall-ios
```

**3. Set your license key:**

Set the license key in your shell profile (`~/.zshrc` or `~/.bashrc`):
```bash
export ANYLINE_MOBILE_SDK_LICENSE_KEY="your-anyline-license-key"
```

Then reload your shell or run: `source ~/.zshrc`

**Option A: Auto-generation (via Cordova hook)**

The license file is automatically generated when you run `cordova prepare` or `cordova build`.

**Option B: Manual generation (via bash script)**
```bash
./scripts/generate_license_key.sh
```

See [License](#license) section for how to obtain a key.

### Running The Example App

**Android:**
```bash
cordova run android --device
```

**iOS:**
```bash
npm run run-ios
```

The `npm run run-ios` script automates the complete iOS deployment workflow:
- Detects connected devices
- Builds with xcodebuild
- Installs with xcrun devicectl
- Launches the app

**Note:** iOS deployment requires the device to be unlocked.

### Available npm Scripts

See `package.json` for all available commands:
- `npm run addPlugins` - Install Cordova plugins
- `npm run reinstall` - Reinstall Android platform
- `npm run reinstall-ios` - Reinstall iOS platform
- `npm run run-ios` - Build, install, and launch on iOS device
- `npm run build-ios` - Build iOS release with code signing
- `npm run overwrite` - Copy Android changes back to plugin
- `npm run overwrite-ios` - Copy iOS changes back to plugin
- `npm run cleanup` - Remove all platforms and plugins

### iOS Build Configuration

A pre-configured `build.json` file is included for iOS code signing with automatic provisioning. The configuration uses Team ID `35RHL53WRE` (Anyline GmbH).

If you need to customize code signing, edit `build.json` and replace the team ID with your own.

## License 

To claim a free developer / trial license, go to: [Anyline SDK Register Form](https://anyline.com/free-demos/)
The software underlies the MIT License. As Anyline is a paid software for Commercial Projects, the License Agreement of Anyline GmbH applies, when used commercially.
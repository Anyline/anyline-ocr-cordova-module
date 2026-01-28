#!/bin/bash

################################################################################
# Anyline Cordova Example - Environment Check Script
################################################################################
# This script validates your development environment for building and running
# the Anyline Cordova example app on Android and iOS.
#
# Usage:
#   ./scripts/check-environment.sh           # Interactive mode with colors
#   ./scripts/check-environment.sh --ci      # CI mode (plain text, strict)
#   ./scripts/check-environment.sh --help    # Show help
#
# This script checks for:
#   - Node.js version (minimum version from .nvmrc if present)
#   - Cordova CLI (version 12.0.0+)
#   - Java (for Android builds)
#   - Gradle (for Android builds)
#   - Android SDK and environment variables
#   - Android Build Tools 35.0.0 (required for Cordova Android 14+)
#   - Xcode and iOS development tools (macOS only)
#   - xcrun devicectl (recommended for iOS device deployment)
#   - CocoaPods (optional - Cordova-iOS 8+ uses SPM)
#   - ANYLINE_MOBILE_SDK_LICENSE_KEY environment variable
#   - Cordova platforms and iOS configuration
#
# Exit codes:
#   0 - All required prerequisites are met (warnings allowed)
#   1 - One or more required prerequisites are missing
################################################################################

set -e  # Exit on error in strict mode (can be overridden)
set +e  # Allow continuing through checks

# Detect CI environment
CI_MODE=false
if [[ "$1" == "--ci" ]] || [[ -n "${CI:-}" ]]; then
    CI_MODE=true
fi

if [[ "$1" == "--help" ]] || [[ "$1" == "-h" ]]; then
    cat << EOF
Anyline Cordova Example - Environment Check Script

Usage:
  ./scripts/check-environment.sh           # Interactive mode with colors
  ./scripts/check-environment.sh --ci      # CI mode (plain text, strict)
  ./scripts/check-environment.sh --help    # Show this help

This script checks for:
  - Node.js version (minimum version from .nvmrc if present)
  - Cordova CLI (version 12.0.0+)
  - Java (for Android builds)
  - Gradle (for Android builds)
  - Android SDK and environment variables
  - Android Build Tools 35.0.0 (required for Cordova Android 14+)
  - Xcode and iOS development tools (macOS only)
  - xcrun devicectl (recommended for iOS device deployment)
  - CocoaPods (optional - Cordova-iOS 8+ uses SPM)
  - ANYLINE_MOBILE_SDK_LICENSE_KEY environment variable
  - Cordova platforms and iOS configuration

Exit codes:
  0 - All required prerequisites met (warnings allowed)
  1 - One or more required prerequisites missing
EOF
    exit 0
fi

# Find repository root and change to it
if git rev-parse --git-dir > /dev/null 2>&1; then
    REPO_ROOT=$(git rev-parse --show-toplevel)
    cd "$REPO_ROOT" || {
        echo "Error: Could not change to repository root: $REPO_ROOT" >&2
        exit 1
    }
else
    echo "Warning: Not in a git repository. Assuming current directory is repository root."
fi

# Color codes (disabled in CI mode)
if [[ "$CI_MODE" == "true" ]]; then
    RED=""
    GREEN=""
    YELLOW=""
    BLUE=""
    RESET=""
    CHECK="[OK]"
    CROSS="[FAIL]"
    WARN="[WARN]"
    INFO="[INFO]"
else
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    RESET='\033[0m'
    CHECK="✅"
    CROSS="❌"
    WARN="⚠️ "
    INFO="ℹ️ "
fi

# Track overall status
HAS_ERRORS=false
HAS_WARNINGS=false

# Platform constants
readonly PLATFORM_MACOS="darwin"

# Helper functions
print_header() {
    local message="$1"
    echo ""
    echo "=========================================="
    echo "$message"
    echo "=========================================="
    return 0
}

print_success() {
    local message="$1"
    echo -e "${GREEN}${CHECK}${RESET} $message"
    return 0
}

print_error() {
    local message="$1"
    echo -e "${RED}${CROSS}${RESET} $message"
    HAS_ERRORS=true
    return 0
}

print_warning() {
    local message="$1"
    echo -e "${YELLOW}${WARN}${RESET} $message"
    HAS_WARNINGS=true
    return 0
}

print_info() {
    local message="$1"
    echo -e "${BLUE}${INFO}${RESET} $message"
    return 0
}

print_fix() {
    local message="$1"
    echo -e "   ${BLUE}→${RESET} Fix: $message"
    return 0
}

# Start checks
print_header "Anyline Cordova Plugin - Environment Check"

if [[ "$CI_MODE" == "true" ]]; then
    echo "Running in CI mode"
else
    echo "Running in local mode"
fi

################################################################################
# Check 1: Node.js and NVM
################################################################################
print_header "Checking Node.js and NVM"

# Read expected version from .nvmrc
EXPECTED_NODE_VERSION=""
if [[ -f ".nvmrc" ]]; then
    EXPECTED_NODE_VERSION=$(cat .nvmrc | tr -d '[:space:]')
    print_info "Project requires Node.js version: $EXPECTED_NODE_VERSION"
else
    print_warning ".nvmrc file not found in repository root"
fi

# Check Node.js installation
if command -v node &> /dev/null; then
    CURRENT_NODE_VERSION=$(node --version | sed 's/v//')
    CURRENT_NODE_MAJOR=$(echo "$CURRENT_NODE_VERSION" | cut -d. -f1)

    print_success "Node.js is installed: v$CURRENT_NODE_VERSION"

    # Validate against .nvmrc if available (minimum version check)
    if [[ -n "$EXPECTED_NODE_VERSION" ]]; then
        EXPECTED_MAJOR=$(echo "$EXPECTED_NODE_VERSION" | cut -d. -f1)

        if [[ "$CURRENT_NODE_MAJOR" -lt "$EXPECTED_MAJOR" ]]; then
            print_warning "Node.js version below recommended: Expected >= v$EXPECTED_NODE_VERSION, Got: v$CURRENT_NODE_VERSION"
            print_fix "Update Node.js: nvm install && nvm use"
            print_fix "Or install Node.js v$EXPECTED_NODE_VERSION+ from https://nodejs.org/"
            print_info "Older versions may cause compatibility issues"
        elif [[ "$CURRENT_NODE_MAJOR" -gt "$EXPECTED_MAJOR" ]]; then
            print_success "Node.js version exceeds minimum requirement (v$CURRENT_NODE_VERSION >= v$EXPECTED_MAJOR)"
            print_info "Newer Node.js versions are generally compatible"
        else
            print_success "Node.js version matches .nvmrc requirement (v$EXPECTED_MAJOR)"
        fi
    fi
else
    print_error "Node.js is not installed"
    if [[ -n "$EXPECTED_NODE_VERSION" ]]; then
        print_fix "Install Node.js v$EXPECTED_NODE_VERSION from https://nodejs.org/"
        print_fix "Or use NVM: nvm install $EXPECTED_NODE_VERSION"
    else
        print_fix "Install Node.js from https://nodejs.org/"
    fi
fi

# Check npm (bundled with Node.js)
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: $NPM_VERSION"
else
    print_error "npm is not installed (should be bundled with Node.js)"
    print_fix "Reinstall Node.js to restore npm"
fi

# Check NVM (warning only - system Node.js is acceptable)
if command -v nvm &> /dev/null; then
    NVM_VERSION=$(nvm --version 2>&1 || true)
    print_success "NVM is installed: $NVM_VERSION"
elif [[ -s "$HOME/.nvm/nvm.sh" ]]; then
    print_warning "NVM is installed but not activated in this shell"
    print_fix "Source NVM: source ~/.nvm/nvm.sh"
    print_fix "Or add to shell profile: https://github.com/nvm-sh/nvm#installing-and-updating"
else
    print_warning "NVM is not installed (optional but recommended)"
    print_fix "Install NVM from https://github.com/nvm-sh/nvm"
    print_info "NVM allows switching Node.js versions per project"
fi

################################################################################
# Check 2: Cordova CLI
################################################################################
print_header "Checking Cordova CLI"

if command -v cordova &> /dev/null; then
    CORDOVA_VERSION=$(cordova --version 2>&1 | head -n 1 || true)

    # Extract version number (handle both "12.0.0" and "cordova 12.0.0" formats)
    CORDOVA_VERSION_NUM=$(echo "$CORDOVA_VERSION" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n 1)

    if [[ -n "$CORDOVA_VERSION_NUM" ]]; then
        CORDOVA_MAJOR=$(echo "$CORDOVA_VERSION_NUM" | cut -d. -f1)

        print_success "Cordova CLI is installed: $CORDOVA_VERSION_NUM"

        if [[ "$CORDOVA_MAJOR" -lt 12 ]]; then
            print_error "Cordova version too old: $CORDOVA_VERSION_NUM (require 12.0.0+)"
            print_fix "Update Cordova: npm update -g cordova"
            print_fix "Or reinstall: npm install -g cordova@latest"
        else
            print_success "Cordova version meets minimum requirement (12.0.0+)"
        fi
    else
        print_warning "Could not determine Cordova version from: $CORDOVA_VERSION"
    fi
else
    print_error "Cordova CLI is not installed"
    print_fix "Install Cordova globally: npm install -g cordova"
    print_fix "Minimum required version: 12.0.0"
fi

################################################################################
# Check 3: Java (for Android builds)
################################################################################
print_header "Checking Java"

if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    print_success "Java is installed: $JAVA_VERSION"

    if [[ -n "${JAVA_HOME:-}" ]]; then
        print_success "JAVA_HOME is set: $JAVA_HOME"
    else
        print_warning "JAVA_HOME environment variable is not set"
        print_fix "Set JAVA_HOME in your shell profile (~/.zshrc or ~/.bashrc)"
        print_info "JAVA_HOME may be required by some Android build tools"
    fi
else
    print_error "Java is not installed"
    print_fix "Install Java 8 or higher for Android builds"
    print_fix "Using Homebrew: brew install openjdk@21"
    print_fix "Or download from: https://adoptium.net/"
fi

################################################################################
# Check 4: Gradle (for Android builds)
################################################################################
print_header "Checking Gradle"

if command -v gradle &> /dev/null; then
    GRADLE_VERSION=$(gradle --version 2>&1 | grep "Gradle" | head -n 1)
    print_success "Gradle is installed: $GRADLE_VERSION"
else
    print_error "Gradle is not installed"
    print_fix "Install Gradle via SDKMAN: sdk install gradle"
    print_fix "Or via Homebrew: brew install gradle"
    print_info "Gradle is required for Android builds with Cordova"
fi

################################################################################
# Check 5: Android SDK
################################################################################
print_header "Checking Android SDK"

ANDROID_SDK_FOUND=false
ANDROID_SDK_PATH=""

# Check environment variables
if [[ -n "${ANDROID_HOME:-}" ]] && [[ -d "$ANDROID_HOME" ]]; then
    print_success "ANDROID_HOME is set: $ANDROID_HOME"
    ANDROID_SDK_FOUND=true
    ANDROID_SDK_PATH="$ANDROID_HOME"
elif [[ -n "${ANDROID_SDK_ROOT:-}" ]] && [[ -d "$ANDROID_SDK_ROOT" ]]; then
    print_success "ANDROID_SDK_ROOT is set: $ANDROID_SDK_ROOT"
    ANDROID_SDK_FOUND=true
    ANDROID_SDK_PATH="$ANDROID_SDK_ROOT"
elif [[ -d "$HOME/Library/Android/sdk" ]]; then
    print_warning "Android SDK found at $HOME/Library/Android/sdk, but ANDROID_HOME not set"
    print_fix "Add to your shell profile: export ANDROID_HOME=\$HOME/Library/Android/sdk"
    print_fix "Add to PATH: export PATH=\$ANDROID_HOME/platform-tools:\$PATH"
    ANDROID_SDK_FOUND=true
    ANDROID_SDK_PATH="$HOME/Library/Android/sdk"
elif [[ -d "$HOME/Android/Sdk" ]]; then
    print_warning "Android SDK found at $HOME/Android/Sdk, but ANDROID_HOME not set"
    print_fix "Add to your shell profile: export ANDROID_HOME=\$HOME/Android/Sdk"
    print_fix "Add to PATH: export PATH=\$ANDROID_HOME/platform-tools:\$PATH"
    ANDROID_SDK_FOUND=true
    ANDROID_SDK_PATH="$HOME/Android/Sdk"
else
    print_error "Android SDK not found"
    print_fix "Install Android SDK via Android Studio"
    print_fix "Or install command line tools: https://developer.android.com/studio"
fi

# Check for platform-tools (adb)
if [[ "$ANDROID_SDK_FOUND" == "true" ]]; then
    if command -v adb &> /dev/null; then
        ADB_VERSION=$(adb --version 2>&1 | head -n 1)
        print_success "Android Platform Tools: $ADB_VERSION"
    else
        print_warning "adb not in PATH"
        print_fix "Add to PATH: export PATH=\$ANDROID_HOME/platform-tools:\$PATH"
    fi

    # Check for build-tools (required version: 35.0.0 for Cordova Android 14+)
    if [[ -d "$ANDROID_SDK_PATH/build-tools" ]]; then
        LATEST_BUILD_TOOLS=$(ls -1 "$ANDROID_SDK_PATH/build-tools" 2>/dev/null | sort -V | tail -n 1 || true)
        if [[ -n "$LATEST_BUILD_TOOLS" ]]; then
            print_success "Android Build Tools installed: $LATEST_BUILD_TOOLS"

            # Check specifically for version 35.x (required by Cordova Android 14+)
            if ls -1 "$ANDROID_SDK_PATH/build-tools" 2>/dev/null | grep -q "^35\."; then
                BUILD_TOOLS_35=$(ls -1 "$ANDROID_SDK_PATH/build-tools" 2>/dev/null | grep "^35\." | sort -V | tail -n 1)
                print_success "Build Tools 35.x found: $BUILD_TOOLS_35 (required for Cordova)"
            else
                print_error "Build Tools 35.0.0 not found (required for Cordova Android 14+)"
                print_fix "Install via Android Studio: Settings → SDK → SDK Tools → Android SDK Build-Tools 35"
                print_fix "Or via command line: \$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager 'build-tools;35.0.0'"
            fi
        fi
    else
        print_error "Android Build Tools directory not found"
        print_fix "Install Build Tools via Android Studio SDK Manager"
    fi
fi

################################################################################
# Check 6: Xcode and iOS Development Tools (macOS only)
################################################################################
if [[ "$OSTYPE" == "$PLATFORM_MACOS"* ]]; then
    print_header "Checking Xcode and iOS Tools"

    # Check Xcode
    if command -v xcodebuild &> /dev/null; then
        XCODE_VERSION=$(xcodebuild -version | head -n 1)
        print_success "$XCODE_VERSION is installed"

        # Check command line tools
        if xcode-select -p &> /dev/null; then
            XCODE_PATH=$(xcode-select -p)
            print_success "Xcode Command Line Tools: $XCODE_PATH"

            # Check if pointing to standalone tools instead of Xcode
            if [[ "$XCODE_PATH" == "/Library/Developer/CommandLineTools" ]]; then
                print_warning "Command line tools pointing to standalone installation"
                print_fix "Point to Xcode: sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer"
            fi
        else
            print_error "Xcode Command Line Tools not configured"
            print_fix "Run: sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer"
            print_fix "Or install standalone tools: xcode-select --install"
        fi
    else
        print_error "Xcode is not installed"
        print_fix "Install Xcode from the Mac App Store"
        print_fix "Or download from https://developer.apple.com/xcode/"
    fi

    # Check CocoaPods (optional - Cordova-iOS 8+ uses SPM)
    if command -v pod &> /dev/null; then
        POD_VERSION=$(pod --version 2>&1)
        print_success "CocoaPods is installed: $POD_VERSION"
        print_info "Note: Cordova-iOS 8+ uses Swift Package Manager (SPM) instead of CocoaPods"
    else
        print_info "CocoaPods is not installed (optional - Cordova-iOS 8+ uses SPM)"
        print_info "Only install if using Cordova-iOS < 8.0: sudo gem install cocoapods"
    fi

    # Check xcrun devicectl (recommended for iOS device deployment)
    if command -v xcrun &> /dev/null; then
        if xcrun devicectl --version &> /dev/null 2>&1 || xcrun devicectl --help &> /dev/null 2>&1; then
            print_success "xcrun devicectl is available (recommended for device deployment)"
        else
            print_warning "xcrun devicectl not available"
            print_info "Update Xcode to latest version for improved device deployment"
        fi
    fi

    # Check ios-deploy (optional - may not work on modern Xcode/iOS)
    if command -v ios-deploy &> /dev/null; then
        IOS_DEPLOY_VERSION=$(ios-deploy --version 2>&1)
        print_success "ios-deploy is installed: $IOS_DEPLOY_VERSION"
        print_info "Note: ios-deploy may not work reliably on modern iOS. Use xcodebuild + devicectl instead"
    else
        print_info "ios-deploy is not installed (optional - alternative workflow recommended)"
        print_info "Use xcodebuild + xcrun devicectl for device deployment (see README.md)"
    fi
else
    print_info "Skipping iOS checks (not on macOS)"
fi

################################################################################
# Check 7: ANYLINE_MOBILE_SDK_LICENSE_KEY Environment Variable
################################################################################
print_header "Checking ANYLINE_MOBILE_SDK_LICENSE_KEY"

if [[ -n "${ANYLINE_MOBILE_SDK_LICENSE_KEY:-}" ]]; then
    # Show first and last 4 characters for verification
    LICENSE_PREFIX="${ANYLINE_MOBILE_SDK_LICENSE_KEY:0:4}"
    LICENSE_SUFFIX="${ANYLINE_MOBILE_SDK_LICENSE_KEY: -4}"
    print_success "ANYLINE_MOBILE_SDK_LICENSE_KEY is set ($LICENSE_PREFIX...$LICENSE_SUFFIX)"
else
    print_warning "ANYLINE_MOBILE_SDK_LICENSE_KEY environment variable not set"
    print_fix "Set for example app: export ANYLINE_MOBILE_SDK_LICENSE_KEY=\"your-anyline-license-key\""
    print_info "Note: Only required for running example app, not for building plugin"
fi

################################################################################
# Check 8: Cordova Platforms (local mode only)
################################################################################
if [[ "$CI_MODE" == "false" ]]; then
    print_header "Checking Cordova Platforms (Optional)"

    # Check if example app directory exists
    if [[ -d "Source/example" ]]; then
        cd Source/example

        # Check Android platform
        if [[ -d "platforms/android" ]]; then
            print_success "Android platform is added to example app"
        else
            print_info "Android platform not yet added"
            print_fix "Add platform: cd Source/example && cordova platform add android@latest"
            print_fix "Or use npm script: cd Source/example && npm run reinstall"
        fi

        # Check iOS platform (macOS only)
        if [[ "$OSTYPE" == "$PLATFORM_MACOS"* ]]; then
            if [[ -d "platforms/ios" ]]; then
                print_success "iOS platform is added to example app"

                # Check Cordova-iOS version
                if [[ -f "platforms/ios/cordova/version" ]]; then
                    IOS_PLATFORM_VERSION=$(node platforms/ios/cordova/version 2>/dev/null)
                    if [[ -n "$IOS_PLATFORM_VERSION" ]]; then
                        IOS_MAJOR=$(echo "$IOS_PLATFORM_VERSION" | cut -d. -f1)
                        print_info "Cordova-iOS version: $IOS_PLATFORM_VERSION"

                        if [[ "$IOS_MAJOR" -ge 8 ]]; then
                            print_info "Using Swift Package Manager (SPM) for dependencies"
                        else
                            print_info "Using CocoaPods for dependencies (consider upgrading to Cordova-iOS 8+)"
                        fi
                    fi
                fi

                # Check iOS deployment target in config.xml
                if [[ -f "config.xml" ]]; then
                    DEPLOYMENT_TARGET=$(grep -o 'deployment-target.*value="[0-9.]*"' config.xml | grep -o '[0-9][0-9.]*' | head -n 1)
                    if [[ -n "$DEPLOYMENT_TARGET" ]]; then
                        DEPLOYMENT_MAJOR=$(echo "$DEPLOYMENT_TARGET" | cut -d. -f1)
                        if [[ "$DEPLOYMENT_MAJOR" -lt 13 ]]; then
                            print_warning "iOS deployment target is $DEPLOYMENT_TARGET (recommended: 13.0+)"
                            print_info "Swift compilation requires iOS 13.0+ for modern features"
                        else
                            print_success "iOS deployment target: $DEPLOYMENT_TARGET"
                        fi
                    fi
                fi
            else
                print_info "iOS platform not yet added"
                print_fix "Add platform: cd Source/example && npm run reinstall-ios"
            fi
        fi

        # Return to repo root
        cd "$REPO_ROOT"
    else
        print_info "Example app directory not found (Source/example)"
    fi
fi

################################################################################
# Check 9: iOS Simulators (local mode only, macOS only)
################################################################################
if [[ "$CI_MODE" == "false" ]] && [[ "$OSTYPE" == "darwin"* ]]; then
    print_header "Checking iOS Simulators (Optional)"

    if command -v xcrun &> /dev/null; then
        SIMULATOR_COUNT=$(xcrun simctl list devices available 2>/dev/null | grep -c "iPhone" || true)

        if [[ "$SIMULATOR_COUNT" -gt 0 ]]; then
            print_success "Found $SIMULATOR_COUNT iOS simulator(s)"
        else
            print_warning "No iOS simulators found"
            print_fix "Open Xcode and install iOS simulators via Settings > Platforms"
        fi
    fi
fi

################################################################################
# Check 10: Android Devices/Emulators (local mode only)
################################################################################
if [[ "$CI_MODE" == "false" ]] && [[ "$ANDROID_SDK_FOUND" == "true" ]]; then
    print_header "Checking Android Devices/Emulators (Optional)"

    # Check for connected devices
    if command -v adb &> /dev/null; then
        DEVICE_COUNT=$(adb devices 2>/dev/null | grep -v "List of devices" | grep -c "device" || true)

        if [[ "$DEVICE_COUNT" -gt 0 ]]; then
            print_success "Found $DEVICE_COUNT connected Android device(s)/emulator(s)"
        else
            print_warning "No Android devices or emulators connected"
            print_fix "Connect a device or start an emulator via Android Studio AVD Manager"
        fi
    fi
fi

################################################################################
# Summary
################################################################################
print_header "Summary"

if [[ "$HAS_ERRORS" == "true" ]]; then
    echo -e "${RED}${CROSS} Some required prerequisites are missing${RESET}"
    echo ""
    echo "Please fix the errors above and run this script again."
    echo ""

    if [[ "$CI_MODE" == "false" ]]; then
        echo "Quick setup guide:"
        echo "  1. Install Node.js (version from .nvmrc): nvm install && nvm use"
        echo "  2. Install Cordova CLI: npm install -g cordova"
        echo "  3. Install Java 8+: brew install openjdk@21"
        echo "  4. Install Android SDK via Android Studio"
        if [[ "$OSTYPE" == "$PLATFORM_MACOS"* ]]; then
            echo "  5. Install Xcode from Mac App Store"
            echo "  6. Install CocoaPods: sudo gem install cocoapods"
        fi
        echo "  7. Run this script again: ./scripts/check-environment.sh"
    fi

    exit 1
elif [[ "$HAS_WARNINGS" == "true" ]]; then
    echo -e "${YELLOW}${WARN} Environment check passed with warnings${RESET}"
    echo ""
    echo "You can proceed with development, but some optional features may not work."
    echo "Review the warnings above to enable all functionality."

    if [[ "$CI_MODE" == "false" ]]; then
        echo ""
        echo "Recommended next steps:"
        echo "  1. Set license key: export ANYLINE_MOBILE_SDK_LICENSE_KEY=\"your-license-key\""
        echo "  2. Install dependencies: cd Source/example && npm install"
        echo "  3. Add plugins: cd Source/example && npm run addPlugins"
        echo "  4. Add platform: cd Source/example && cordova platform add android@latest"
        echo "  5. Build: cd Source/example && cordova build android"
        echo ""
        if [[ "$OSTYPE" == "$PLATFORM_MACOS"* ]]; then
            echo "For iOS development:"
            echo "  1. Add iOS platform: cd Source/example && npm run reinstall-ios"
            echo "  2. Build: cd Source/example && cordova build ios"
            echo "  3. Deploy to device: See iOS Device Deployment section in README.md"
            echo ""
        fi
        echo "For more information, see README.md"
    fi

    exit 0
else
    echo -e "${GREEN}${CHECK} All prerequisites are met!${RESET}"
    echo ""

    if [[ "$CI_MODE" == "false" ]]; then
        echo "Next steps:"
        echo "  1. Set license key: export ANYLINE_MOBILE_SDK_LICENSE_KEY=\"your-license-key\""
        echo "  2. Install dependencies: cd Source/example && npm install"
        echo "  3. Add plugins: cd Source/example && npm run addPlugins"
        echo "  4. Add platform: cd Source/example && cordova platform add android@latest"
        echo "  5. Build: cd Source/example && cordova build android"
        echo ""
        if [[ "$OSTYPE" == "$PLATFORM_MACOS"* ]]; then
            echo "For iOS development:"
            echo "  1. Add iOS platform: cd Source/example && npm run reinstall-ios"
            echo "  2. Build: cd Source/example && cordova build ios"
            echo "  3. Deploy to device: See iOS Device Deployment section in README.md"
            echo ""
        fi
        echo "For more information, see README.md"
    else
        echo "Environment ready for CI build"
    fi

    exit 0
fi

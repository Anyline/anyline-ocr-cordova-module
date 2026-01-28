#!/bin/bash

################################################################################
# iOS Device Deployment Automation Script
################################################################################
# This script automates the deployment of the Cordova app to iOS devices using
# xcodebuild and xcrun devicectl (modern Apple tooling for Xcode 15+).
#
# Usage:
#   ./scripts/ios-deploy.sh              # Interactive device selection
#   ./scripts/ios-deploy.sh --device-id <id>  # Deploy to specific device
#
# The script performs these steps:
#   1. Lists connected iOS devices
#   2. Allows selection if multiple devices found
#   3. Builds the app with xcodebuild
#   4. Installs the app with xcrun devicectl
#   5. Launches the app on the device
################################################################################

set -e  # Exit on error

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

# Helper functions
print_error() {
    local message="$1"
    echo -e "${RED}❌ ${message}${RESET}" >&2
    return 0
}

print_success() {
    local message="$1"
    echo -e "${GREEN}✅ ${message}${RESET}"
    return 0
}

print_info() {
    local message="$1"
    echo -e "${BLUE}ℹ️  ${message}${RESET}"
    return 0
}

print_step() {
    local message="$1"
    echo -e "\n${BLUE}==>${RESET} ${message}"
    return 0
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script only works on macOS"
    exit 1
fi

# Check for required tools
if ! command -v xcrun &> /dev/null; then
    print_error "xcrun not found. Please install Xcode Command Line Tools"
    exit 1
fi

if ! command -v xcodebuild &> /dev/null; then
    print_error "xcodebuild not found. Please install Xcode"
    exit 1
fi

# Parse command line arguments
SPECIFIED_DEVICE_ID=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --device-id)
            SPECIFIED_DEVICE_ID="$2"
            shift 2
            ;;
        --help|-h)
            echo "iOS Device Deployment Script"
            echo ""
            echo "Usage:"
            echo "  ./scripts/ios-deploy.sh              # Interactive device selection"
            echo "  ./scripts/ios-deploy.sh --device-id <id>  # Deploy to specific device"
            echo ""
            echo "Environment Variables:"
            echo "  IOS_DEVICE_ID    - CoreDevice ID to deploy to (if not specified via --device-id)"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

print_step "Step 1: Listing connected iOS devices"

# Get list of connected devices
DEVICE_LIST=$(xcrun devicectl list devices 2>&1 || true)

if [[ -z "$DEVICE_LIST" ]] || echo "$DEVICE_LIST" | grep -q "No devices found"; then
    print_error "No iOS devices connected"
    print_info "Please connect an iOS device via USB and unlock it"
    exit 1
fi

# Parse device list (skip header lines) - compatible with bash 3.2+
declare -a DEVICE_NAMES
declare -a COREDEVICE_IDS

# Read devices into arrays (using heredoc for bash 3.2 compatibility)
DEVICE_COUNT=0
while IFS= read -r line; do
    if [[ -n "$line" ]]; then
        # Parse: Name   Hostname   CoreDeviceID   State   Model
        NAME=$(echo "$line" | awk '{print $1}')
        COREDEVICE_ID=$(echo "$line" | awk '{print $3}')

        DEVICE_NAMES[$DEVICE_COUNT]="$NAME"
        COREDEVICE_IDS[$DEVICE_COUNT]="$COREDEVICE_ID"
        ((DEVICE_COUNT++))
    fi
done <<EOF
$(echo "$DEVICE_LIST" | tail -n +2 | grep -v "^-" | grep -E "(connected|available)")
EOF

if [[ ${#DEVICE_NAMES[@]} -eq 0 ]]; then
    print_error "No available iOS devices found"
    print_info "Please connect an iOS device via USB, unlock it, and trust this computer"
    exit 1
fi

print_success "Found ${#DEVICE_NAMES[@]} connected device(s)"

# Device selection
SELECTED_INDEX=0
SELECTED_COREDEVICE_ID=""

if [[ -n "$SPECIFIED_DEVICE_ID" ]]; then
    # Use specified device ID
    print_info "Using specified device ID: $SPECIFIED_DEVICE_ID"
    SELECTED_COREDEVICE_ID="$SPECIFIED_DEVICE_ID"
elif [[ -n "${IOS_DEVICE_ID:-}" ]]; then
    # Use environment variable
    print_info "Using device ID from IOS_DEVICE_ID environment variable"
    SELECTED_COREDEVICE_ID="$IOS_DEVICE_ID"
elif [[ ${#DEVICE_NAMES[@]} -eq 1 ]]; then
    # Only one device, use it automatically
    SELECTED_COREDEVICE_ID="${COREDEVICE_IDS[0]}"
    print_success "Using device: ${DEVICE_NAMES[0]} (${COREDEVICE_IDS[0]})"
else
    # Multiple devices, show selection menu
    echo ""
    echo "Multiple devices found. Please select one:"
    for i in "${!DEVICE_NAMES[@]}"; do
        echo "  $((i+1)). ${DEVICE_NAMES[$i]} (${COREDEVICE_IDS[$i]})"
    done
    echo ""

    while true; do
        read -p "Enter device number (1-${#DEVICE_NAMES[@]}): " selection
        if [[ "$selection" =~ ^[0-9]+$ ]] && [[ "$selection" -ge 1 ]] && [[ "$selection" -le "${#DEVICE_NAMES[@]}" ]]; then
            SELECTED_INDEX=$((selection-1))
            SELECTED_COREDEVICE_ID="${COREDEVICE_IDS[$SELECTED_INDEX]}"
            print_success "Selected: ${DEVICE_NAMES[$SELECTED_INDEX]}"
            break
        else
            print_error "Invalid selection. Please enter a number between 1 and ${#DEVICE_NAMES[@]}"
        fi
    done
fi

# Get xcodebuild device ID from xcodebuild -destination list
print_step "Step 2: Resolving device IDs for xcodebuild"

# Try to get xcodebuild ID by matching device name
XCODEBUILD_DEVICE_ID=""
if command -v xcodebuild &> /dev/null; then
    # Get list of destinations and find matching device
    DESTINATIONS=$(xcodebuild -workspace platforms/ios/App.xcworkspace -scheme App -showdestinations 2>/dev/null | grep "platform:iOS" | grep "name:${DEVICE_NAMES[$SELECTED_INDEX]}" || true)

    if [[ -n "$DESTINATIONS" ]]; then
        # Extract ID from destination string
        XCODEBUILD_DEVICE_ID=$(echo "$DESTINATIONS" | grep -oE "id:[A-Za-z0-9-]+" | head -1 | cut -d: -f2)
    fi
fi

if [[ -z "$XCODEBUILD_DEVICE_ID" ]]; then
    print_error "Could not resolve xcodebuild device ID"
    print_info "Please ensure the device is trusted and unlocked"
    exit 1
fi

print_success "xcodebuild device ID: $XCODEBUILD_DEVICE_ID"
print_success "CoreDevice ID: $SELECTED_COREDEVICE_ID"

print_step "Step 3: Building app with xcodebuild"

cd platforms/ios

BUILD_OUTPUT=$(mktemp)
if xcodebuild -workspace App.xcworkspace \
    -scheme App \
    -configuration Debug \
    -destination "platform=iOS,id=$XCODEBUILD_DEVICE_ID" \
    build > "$BUILD_OUTPUT" 2>&1; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    echo ""
    echo "Build output (last 30 lines):"
    tail -30 "$BUILD_OUTPUT"
    rm -f "$BUILD_OUTPUT"
    exit 1
fi

rm -f "$BUILD_OUTPUT"

print_step "Step 4: Finding built .app bundle"

# Find the .app in DerivedData
APP_PATH=$(find ~/Library/Developer/Xcode/DerivedData/App-*/Build/Products/Debug-iphoneos -name "*.app" -type d ! -name "*.appex" 2>/dev/null | head -1)

if [[ -z "$APP_PATH" ]] || [[ ! -d "$APP_PATH" ]]; then
    print_error "Could not find built .app bundle in DerivedData"
    print_info "Expected path: ~/Library/Developer/Xcode/DerivedData/App-*/Build/Products/Debug-iphoneos/*.app"
    exit 1
fi

print_success "Found app bundle: $APP_PATH"

print_step "Step 5: Installing app on device"

if xcrun devicectl device install app --device "$SELECTED_COREDEVICE_ID" "$APP_PATH" 2>&1; then
    print_success "App installed successfully"
else
    print_error "Failed to install app"
    print_info "Make sure the device is unlocked and trusted"
    exit 1
fi

print_step "Step 6: Launching app"

if xcrun devicectl device process launch --device "$SELECTED_COREDEVICE_ID" com.anyline.examples.cordova 2>&1; then
    print_success "App launched successfully"
else
    print_error "Failed to launch app"
    print_info "You may need to manually launch the app from the device"
    exit 1
fi

print_success "Deployment complete! 🎉"
echo ""
print_info "The app is now running on ${DEVICE_NAMES[$SELECTED_INDEX]}"

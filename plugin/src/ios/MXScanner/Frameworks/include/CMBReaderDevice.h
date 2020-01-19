//
//  ReaderDevice.h
//  MX_SDK_FW
//
//  Created by Gyula Hatalyak on 09/01/17.
//  Copyright © 2017 Gyula Hatalyak. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "CMBReadResults.h"
#import "CDMDataManSystem.h"

/**
 * Indicates the connection state of a {@link CDMDataManSystem} object.
 */
typedef enum : NSUInteger {
    /**
     * The {@link CDMDataManSystem} object is not connected to any remote system.
     */
    CMBConnectionStateDisconnected,
    /**
     * The {@link CDMDataManSystem} object is in the process of establishing a connection to a remote system.
     */
    CMBConnectionStateConnecting,
    /**
     * The {@link CDMDataManSystem} object is connected to a remote system.
     */
    CMBConnectionStateConnected,
    /**
     * The {@link CDMDataManSystem} object is in the process of disconnecting from a remote system.
     */
    CMBConnectionStateDisconnecting,
    /**
     * The {@link CDMDataManSystem} object's connection state is unavailable.
     */
    CMBConnectionStateUnavailable
} CMBConnectionState;

/**
 * Enum values for supported barcode symbologies
 */
typedef enum : NSUInteger {
    CMBSymbologyUnknown,
    CMBSymbologyDataMatrix,
    CMBSymbologyQR,
    CMBSymbologyC128,
    CMBSymbologyUpcEan,
    CMBSymbologyC11,
    CMBSymbologyC39,
    CMBSymbologyC93,
    CMBSymbologyI2o5,
    CMBSymbologyCodaBar,
    CMBSymbologyEanUcc,
    CMBSymbologyPharmaCode,
    CMBSymbologyMaxicode,
    CMBSymbologyPdf417,
    CMBSymbologyMicropdf417,
    CMBSymbologyDatabar,
    CMBSymbologyPlanet,
    CMBSymbologyPostnet,
    CMBSymbologyFourStateJap,
    CMBSymbologyFourStateAus,
    CMBSymbologyFourStateUpu,
    CMBSymbologyFourStateImb,
    CMBSymbologyVericode,
    CMBSymbologyRpc,
    CMBSymbologyMsi,
    CMBSymbologyAzteccode,
    CMBSymbologyDotcode,
    CMBSymbologyC25,
    CMBSymbologyC39ConvertToC32,
    CMBSymbologyOcr,
    CMBSymbologyFourStateRmc
} CMBSymbology;

/**
 * Enum values for {@link CMBReaderDevice} availability
 */
typedef enum : NSUInteger {
    CMBReaderAvailibilityUnknown,
    CMBReaderAvailibilityAvailable,
    CMBReaderAvailibilityUnavailable
} CMBReaderAvailibility;

@class CMBReaderDevice;

/**
 * Delagate protocol for receiving events from a {@link CMBReaderDevice} object
 */
@protocol CMBReaderDeviceDelegate <NSObject>

@optional

/**
 * Called if the {@link CMBReaderDevice} availability state has been changed
 * @param reader The caller {@link CMBReaderDevice} instance
 */
- (void)availabilityDidChangeOfReader:(CMBReaderDevice *)reader;
/**
 * Called if the {@link CMBReaderDevice} connection state has been changed
 * @param reader The caller {@link CMBReaderDevice} instance
 */
- (void)connectionStateDidChangeOfReader:(CMBReaderDevice *)reader;

/**
 * Called if {@link CMBReadResults} arrived from the reader
 * @param reader The caller {@link CMBReaderDevice} instance
 * @param readResults The {@link CMBReadResults} object containing the results from the reader
 */
- (void)didReceiveReadResultFromReader:(CMBReaderDevice *)reader results:(CMBReadResults *)readResults;

@end

/**
 * Represents a Phone Camera or MX barcode reader
 * You should instantiate this class using readerOfDeviceCameraWithCameraMode... or readerOfMXDevice class level methods.
 */
@interface CMBReaderDevice : NSObject

/**
 * Tells the connection type of the {@link CMBReaderDevice} object
 */
@property (readonly) DataManDeviceClass deviceClass;

/**
 * Returns the availability of the reader
 * @return {@link CMBReaderAvailibility} state of the reader
 * @see CMBReaderAvailibility
 */
@property (readonly) CMBReaderAvailibility availability;

/**
 * Returns the current connection state of the reader
 * @return the current {@link CMBConnectionState} of the reader
 * @see CMBConnectionState
 */
@property (readonly) CMBConnectionState connectionState;

/**
 * Enable or disable image results from reader
 */
@property (readwrite) BOOL imageResultEnabled;

/**
 * Enable or disable SVG image graphics results from reader
 */
@property (readwrite) BOOL SVGResultEnabled;

/**
 * Delagte object to receive events from the {@link CMBReaderDevice} object
 * @see CMBReaderDeviceDelegate
 */
@property (weak) id<CMBReaderDeviceDelegate> delegate;

/**
 * Creates a {@link ReaderDevice} object for a connected MX barcode reader.
 * @return The newly created {@link ReaderDevice} object.
 */
+ (instancetype) readerOfMXDevice;

/**
* Creates a {@link ReaderDevice} object for a Phone Camera barcode reader.
* @param cameraMode		The {@link CDMCameraMode} when using the Mobile device camera.
* @param previewOptions	The {@link CDMPreviewOption} when using the Mobile device camera.
* @param previewContainer	The container where the camera preview will be placed.
* @return					The newly created {@link ReaderDevice} object.
*/
+ (instancetype) readerOfDeviceCameraWithCameraMode:(CDMCameraMode)cameraMode
                                     previewOptions:(CDMPreviewOption)previewOptions
                                        previewView:(UIView*)previewContainer;

/**
 * Connects to the barcode reader.
 * @param completionBlock the block to invoke as the connection process is completed.
 */
- (void) connectWithCompletion:(void (^)(NSError *error))completionBlock;

/**
 * Disconnects from a connected barcode reader.
 */
- (void) disconnect;

/**
 * Starts triggering
 */
- (void) startScanning;

/**
 * Stops triggering
 */
- (void) stopScanning;

/**
 * Sets the previewContainer where the camera view is displayed.
 * @param previewContainer The container where the camera preview will be placed.
 */
- (void) setPreviewContainer:(UIView*)previewContainer;

/**
 * Retrieves the current battery percentage level of the reader.
 * @param completionBlock The block to be called as the information is available
 */
- (void) getDeviceBatteryLevelWithCompletion:(void (^)(int batteryLevel, NSError *error))completionBlock;

/**
 * Enable or disable the provided symbology on the reader
 * @param symbology The {@link CMBSymbology} to enable or disable
 * @param enabled true to enable, false to disable
 * @param completionBlock The block to be called as the setting completes
 */
- (void) setSymbology:(CMBSymbology)symbology
              enabled:(bool)enabled
           completion:(void (^)(NSError *error))completionBlock;

/**
 * Retrieves whether the specified symbology is enabled or disabled
 * @param symbology The {@link CMBSymbology} to check
 * @param completionBlock The block to be invoked as the information is available
 */
- (void) isSymbologyEnabled:(CMBSymbology)symbology
                 completion:(void (^)(BOOL enabled, NSError *error))completionBlock;

/**
 * Turns on or off all internal lights of the reader
 * @param on true, to turn on the lights, false to turn off the lights
 * @param completionBlock The block to be invoked as the method completes
 */
- (void) setLightsON:(bool)on completion:(void (^)(NSError *error))completionBlock;

/**
 * Retrieves whether all lights of the barcode reader are turned on or off.
 * @param completionBlock The block to be invoked as the result is available
 */
- (void) getLightsStateWithCompletion:(void (^)(BOOL enabled, NSError *error))completionBlock;

/**
 * Resets the reader configurations to factory default
 * @param completionBlock The block to be invoked as the operation completes
 */
- (void) resetConfigWithCompletion:(void (^)(NSError *error))completionBlock;

/**
 * Plays a beep on the reader
 */
- (void) beep;

/**
 * Returns the DataManSystem instance for this ReaderDevice
 * @return {@link CDMDataManSystem} instance
 */
- (CDMDataManSystem *)dataManSystem;

@end

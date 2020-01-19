//
//  CDMDataManSystem.h
//
//  Copyright (c) 2014 Cognex Corporation. All rights reserved.
//

/*! \mainpage Cognex Mobile Barcode iOS SDK

\section intro_sec Introduction

The CMB SDK can be used to connect to Cognex Barcode readers and perform operations on these systems. You can retrieve read results, images, image graphics and read statistics. The SDK also allows you to configure your system or change individual settings. Refer to the DMCC Command Reference document for a complete list of DMCC commands that you can send to a Cognex system.

The SDK package contains a sample application that shows you the basic concepts and how to use the SDK.

\section install_sec Quick Start
The CMB SDK comprises the iOS SDK lib files and their documentation. The library files are available for iOS 10.1.

\subsection step1 Using the DataMan SDK library

To use the DataMan SDK for an iOS project, you will need to add the following files to your XCode project:

 - libDataManSDK.a
 - /include/CDMDataManSystem.h
 - /include/CDMDataManSystemDelegate.h
 - /include/CDMResponse.h
 - /include/CDMEADiscoverer.h
 - /include/CNMEthernetSystemDiscoverer.h
 - /include/CNMSystemDiscoveredDelegate.h
 - /include/CNMCogNamerDevice.h
 - /include/CNMCogNamerDeviceType.h
 - /include/DataManSDK.h
 
After adding the files, make sure, that the \a libDataManSDK.a file is present in the Project Settings > Build Phases > Link Binary With Libraries section.

\subsection step2 Creating and Initializing CDMDataManSystem
 
First of all use the following header file to access the DataMan SDK classes:
\code
#import "DataManSDK.h"
\endcode
 
For communication with each DataMan device, you will need to create a CDMDataManSystem object. Here is a sample code showing how to connect to a device using its IP address.
\code
    CDMDataManSystem *dataManSystem;
 
    dataManSystem = [CDMDataManSystem dataManSystemWithHostname:@"10.86.80.71" withPort:23 withDelegate:self];
\endcode
 
To connect to an External Accessory device, like the MX-1000, you will need to include the DataMan External Accessory Protocol identifier in the Info.plist of your project:
\code
 <key>UISupportedExternalAccessoryProtocols</key>
 <array>
    <string>com.cognex.dmcc</string>
 </array>
\endcode

Then you can enumerate the available connected devices with:
\code
NSArray* connectedAccessories = [[CDMEADiscoverer sharedDiscoverer] compatibleAccessories];
\endcode
 
To initialize CDMDataManSystem object for a connected device:
\code
CDMDataManSystem *dataManSystem;

if (connectedAccessories.count > 0)
    dataManSystem = [CDMDataManSystem dataManSystemWithAccessory:connectedAccessories[0] delegate:self];
\endcode
 
Next, the result types needs to be specified:

\code
    [dataManSystem setResultTypes:(kCDMResultTypeImage | kCDMResultTypeImageGraphics | kCDMResultTypeReadXml | kCDMResultTypeReadString)];
\endcode

To connect, the connect method will be called:
\code
 [dataManSystem connect];
\endcode
 
To send commands to the device and retrieve their responses through the DataMan SDK, you can use the sendCommand method:
 
 \code
 [self.dataManSystem sendCommand:@"TRIGGER ON" withCallback:^(CDMResponse *response){
    if (response.status == DMCC_STATUS_NO_ERROR) {
        // command has succeed.
    } else {
        // handle error
    }
 }];
 \endcode
 \code
 [self.dataManSystem sendCommand:@"GET TRAINED-CODE.INFO" withCallback:^(CDMResponse *response){
    if (response.status == DMCC_STATUS_NO_ERROR) {
        if ([response.payload isEqualToString:@"Untrained"]) {
            // device is untrained
        } else {
            // device is trained
        }
    }
 }];
 \endcode

\subsection step3 Receiving messages from a CDMDataManSystem

To receive messages from a DataMan system, you will need to implement the CDMDataManSystemDelegate protocol and pass the class as a delegate when initializing the DataMan system.
Here is a skeleton implementation of the delegate methods. Note that only the first four methods are required, the rest are optional methods.

\code
 - (void)dataManSystemDidConnect:(CDMDataManSystem *)dataManSystem
 {
    NSLog(@"CDMAppDelegate dataManSystemDidConnect");
 }
 
 - (void)dataManSystemDidDisconnect:(CDMDataManSystem *)dataManSystem withError:(NSError *)error
 {
    if(error)
    {
        NSLog(@"dataManSystemDidDisconnect with error: %@", [error description]);
    }
    else
    {
        NSLog(@"dataManSystemDidDisconnect");
    }
 }
 
 - (void)dataManSystemDidMissHeartbeatResponse:(CDMDataManSystem *)dataManSystem
 {
    NSLog(@"dataManSystemDidMissHeartbeatResponse");
 }

 - (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveReadString:(NSString *)readString withId:(int)resultId
 {
    NSLog(@"didReceiveReadString:%@ withId: %d", readString, resultId);
 }
 
 - (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveImage:(UIImage *)image withId:(int)resultId
 {
    NSLog(@"didReceiveImage");
 }
\endcode
 */

#import <Foundation/Foundation.h>
#import <ExternalAccessory/ExternalAccessory.h>
#import "CDMDataManSystemDelegate.h"


/**
 *  Image size.
 */
typedef NS_ENUM(NSInteger, CDMImageSize)
{
    /**
     *  Full sized image
     */
    kCDMImageSizeFull,
    /**
     *  Image scaled down by 1/4
     */
    kCDMImageSizeQuarter,
    /**
     *  Image scaled down by 1/16
     */
    kCDMImageSizeSixteenth,
    /**
     *  Image scaled down by 1/64
     */
    kCDMImageSizeSixtyFourth
};

/**
 *  Image quality used when getting live image or process monitor images.
 */
typedef NS_ENUM(NSInteger, CDMImageQuality)
{
    /**
     *  Low image quality for jpeg format
     */
    kCDMImageQualityLow = 10,
    /**
     *  Medium image quality for jpeg format
     */
    kCDMImageQualityMedium = 50,
    /**
     *  High image quality for jpeg format
     */
    kCDMImageQualityHigh = 90
};

/**
 *  Indicates the image format type for live displays or process monitor images
 */
typedef NS_ENUM(NSInteger, CDMImageFormat)
{
    /**
     *  Bitmap format
     */
    kCDMImageFormatBitmap = 0,
    /**
     *  Jpeg format
     */
    kCDMImageFormatJpeg = 1
};

/**
 *  Specifies the result types, that the application can receive. All other result types are ignored.
 */
typedef NS_OPTIONS(NSInteger, CDMResultTypes)
{
    /**
     *  No results of any kind are requested from the reader
     */
    kCDMResultTypeNone = 0,
    /**
     *  Represents a simple read result string
     */
    kCDMResultTypeReadString = 1,
    /**
     *  Represents a read result in xml format
     */
    kCDMResultTypeReadXml = 2,
    /**
     *  Represents read statistics in xml format
     */
    kCDMResultTypeXmlStatistics = 4,
    /**
     *  Represents a read image
     */
    kCDMResultTypeImage = 8,
    /**
     *  Represent an image graphics xml
     */
    kCDMResultTypeImageGraphics = 16,
    /**
     *  Represents training results in xml format
     */
    kCDMResultTypeTrainingResults = 32,
    /**
     *  Represents code quality information in xml format
     */
    kCDMResultTypeCodeQualityData = 64
};

/**
 *  Specifies the connection states, that the DataManSystem can have.
 */
typedef NS_ENUM(NSInteger, CDMConnectionState) {
    kCDMConnectionStateDisconnected = 0,
    kCDMConnectionStateConnecting = 1,
    kCDMConnectionStateConnected = 2,
    kCDMConnectionStateDisconnecting = 3
};

/**
 *  Specifies the device types a CDMDataManSystem instance.
 */
typedef enum : NSUInteger {
    DataManDeviceClass_MX,
    DataManDeviceClass_Network,
    DataManDeviceClass_PhoneCamera
} DataManDeviceClass;

/**
 *  Represents a remote DataMan system.
 */
@interface CDMDataManSystem : NSObject

/**
 * Gets the device type of the CDMDataManSystem instance.
 */
@property (readonly) DataManDeviceClass deviceClass;

/**
 * Gets the current connection state of the CDMDataManSystem instance.
 */
@property (readonly) CDMConnectionState connectionState;

/**
 * Sets or gets the delegate where the messages will be sent to.
 * @see CDMDataManSystemDelegate
 */
@property (weak) id<CDMDataManSystemDelegate> delegate;

/**
 * Sets which result types the application wants to receive.
 */
@property (nonatomic) CDMResultTypes resultTypes;

/**
 * Read-only state of the heartbeat function.
 */
@property (readonly, getter = isHeartbeatEnabled) BOOL heartbeatEnabled;

/**
 * Read-only state of live image mode.
 */
@property (readonly, getter = isLiveImageEnabled) BOOL liveImageEnabled;

/**
 * Timeout for commands and connection, default value is 5 sec.
 */
@property (nonatomic) NSTimeInterval timeout;

/**
 * Read-only connection state of the system.
 */
@property (readonly, getter = isConnected) BOOL connected;

/**
 * Returns the current version of the library
 * @returns current DataMan SDK version
 */
+ (NSString *)getVersion;

/**
 
Constructs a DataMan system with hostname and port.

This factory method constructs a new DataMan system with an ethernet connector configured inside.
@param hostname The hostname of the remote system
@param port The port of the remote system
@param delegate The delegate where the messages will be sent to
@return DataMan system with ethernet connection configured
 
@see CDMDataManSystemDelegate
*/
+ (CDMDataManSystem *)dataManSystemWithHostname:(NSString *)hostname port:(int)port delegate:(id<CDMDataManSystemDelegate>)delegate;

/**
 Constructs a DataMan system with accessory connector. To properly detect and connect to the device, be sure to declare UISupportedExternalAccessoryProtocols key with Cognex DMCC protocol (com.cognex.dmcc) item in Info.plist.
 @param accessory The EAAccessory object with information about the connected device
 @param delegate The delegate where the messages will be sent to
 @return DataMan system with external accessory connection configured or nil, if the accessory is not a CDM device
 
 @see CDMDataManSystemDelegate
 */
+ (CDMDataManSystem *)dataManSystemWithAccessory:(EAAccessory*)accessory delegate:(id<CDMDataManSystemDelegate>)delegate;

/**
 Constructs a DataMan system with accessory connector. To properly detect and connect to the device, be sure to declare UISupportedExternalAccessoryProtocols key with Cognex DMCC protocol (com.cognex.dmcc) item in Info.plist.
 @param delegate The delegate where the messages will be sent to
 @return DataMan system with external accessory connection configured or nil, if there is no supported accessory connected
 
 @see CDMDataManSystemDelegate
 */
+ (CDMDataManSystem *)dataManSystemOfExternalAccessoryWithDelegate:(id<CDMDataManSystemDelegate>)delegate;

/**
* Specifies the preview/illumination mode when using the Mobile device camera.
*/
typedef NS_ENUM(NSInteger, CDMCameraMode)
{
    /**
     * Use camera with no aimer. Preview is on, illumination is available.
     */
    kCDMCameraModeNoAimer = 0,
    /**
     * Use camera with a basic aimer (e.g., StingRay). Preview is off, illumination is not available.
     */
    kCDMCameraModePassiveAimer = 1,
    /**
     * Use camera with an active aimer (e.g., MX-100). Preview is off, illumination is available.
     */
    kCDMCameraModeActiveAimer = 2,
    /**
     * Use mobile device front camera. Preview is on, illumination is not available.
     */
    kCDMCameraModeFrontCamera = 3
};

/**
 * Controls the preview/scanning options when using the Mobile device camera.
 * Preview defaults are set by the {@link CDMCameraMode} but can be overridden.
 * Multiple options can be OR'd together.
 */
typedef NS_OPTIONS(NSInteger, CDMPreviewOption)
{
    /**
     * Use defaults (no overrides).
     */
    kCDMPreviewOptionDefaults = 0,
    /**
     * Disable zoom feature (removes zoom button from preview).
     */
    kCDMPreviewOptionNoZoomBtn = 1,
    /**
     * Disable illumination (removes illumination button from preview).
     */
    kCDMPreviewOptionNoIllumBtn = 2,
    /**
     * Enables the simulated hardware trigger (the volume down button).
     */
    kCDMPreviewOptionHwTrigger = 4,
    /**
     * When scanning starts, the preview is displayed but decoding is paused until a trigger (either the on screen button or the volume down button, if enabled) is pressed.
     */
    kCDMPreviewOptionPaused = 8,
    /**
     * Force the preview to be displayed, even if off by default (e.g., when using kCDMCameraModePassiveAimer or kCDMCameraModeActiveAimer).
     */
    kCDMPreviewOptionAlwaysShow = 16
};

/**
 Constructs a DataMan system with iOS camera. To properly detect and connect to the device, be sure to declare NSCameraUsageDescription key with Cognex DMCC protocol (com.cognex.dmcc) item in Info.plist.
 @param previewView Camera preview will be attached on that view, can be null (in which case, camera preview will be streamed in the image delegate).
 @param delegate The delegate where the messages will be sent to
 @return DataMan system with external accessory connection configured or nil, if the accessory is not a CDM device
 
 @see CDMDataManSystemDelegate
 */
+ (CDMDataManSystem *)dataManSystemWithCameraMode:(CDMCameraMode)cameraMode
                                   previewOptions:(CDMPreviewOption)previewOptions
                              nullablePreviewView:(UIView*)previewView
                                         delegate:(id<CDMDataManSystemDelegate>)delegate;

- (void) setPreviewContainer:(UIView*) previewContainer;

///---------------------------------------------------------------------------------------
/// @name Instance methods
///---------------------------------------------------------------------------------------

/**
 * Connects to a remote system without authentication
 */
- (BOOL)connect;

/**
 *  Connects to a remote system, authenticating with the specified username and password. If the password is specified but the username is not, the username will be "admin" by default.
 *
 @param username the username for the authentication
 @param password the password for the given user
 @return YES, if the system has successfully started the connection process. (it may return NO mostly with EA devices if the session can't be opened)
 */
- (BOOL)connectWithUsername:(NSString*)username password:(NSString*)password;

/**
 * Disconnects from the remote system.
 */
- (void)disconnect;

/**
 * Sends the specified command to the connected remote system
 * @param command The command to send to the remote system
 * @return YES, if the system is connected and the command can be sent, NO otherwise
 */
- (BOOL)sendCommand:(NSString *)command;

/**
 * Sends the specified command to the connected remote system
 
 Code samples:
 \code
[self.dataManSystem sendCommand:@"TRIGGER ON" withCallback:^(CDMResponse *response){
    if (response.status == DMCC_STATUS_NO_ERROR) {
        // command has succeed.
    } else {
        // handle error
    }
}];
\endcode
\code
[self.dataManSystem sendCommand:@"GET TRAINED-CODE.INFO" withCallback:^(CDMResponse *response){
    if (response.status == DMCC_STATUS_NO_ERROR) {
        if ([response.payload isEqualToString:@"Untrained"]) {
            // device is untrained
        } else {
            // device is trained
        }
    }
 }];
\endcode
 * @param command The command to send to the remote system
 * @param callback A callback that will be called when the command is completed
 * @return YES, if the system is connected and the command can be sent, NO otherwise
 */
- (BOOL)sendCommand:(NSString *)command withCallback:(void(^)(CDMResponse *response))callback;

/**
 * Sends the specified command to the connected remote system.
 * @param command The command to send to the remote system
 * @param data Additional data to send to the remote system
 * @param timeout Timeout for the command
 * @param expectBinaryResponse Flag to signal if we expect binary response
 * @param callback A callback that will be called when the command is completed
 * @return YES, if the system is connected and the command can be sent, NO otherwise
 */
- (BOOL)sendCommand:(NSString *)command withData:(NSData *)data timeout:(NSTimeInterval)timeout expectBinaryResponse:(BOOL)expectBinaryResponse callback:(void(^)(CDMResponse *response))callback;

/**
 * Sends the specified commands array to the connected remote system
 * @param commands The array of commands to send to the remote system
 * @param complete A callback that will be called when all the commands are sent
 * @return YES, if the system is connected and the command can be sent, NO otherwise
 */
- (BOOL)sendBatchCommands:(NSArray *)commands completed:(void(^)())complete;

/** 
Changes whether the DataMan system accepts incoming messages or not. It does not effect an already connected device.
@param accept Flag to signal whether the incoming connection is accepted or not
 */
- (void)acceptIncomingConnection:(BOOL)accept;

/**
Enables heartbeat function and sets its interval.
@param interval Specifies heartbeat interval in seconds
 */
- (void)enableHeartbeatWithInterval:(NSTimeInterval)interval;

/**
 * Disables the heartbeat when enabled.
 */
- (void)disableHeartbeat;

/**
 *  Begins getting the latest image from the connected remote system in live display mode.
 *
 *  @param imageFormat Image format
 *  @param imageSize   Image size
 *  @param quality     Image quality
 *  @param callback    Callback block with image to be called when operation completes
 */
- (void)enableLiveImageWithFormat:(CDMImageFormat)imageFormat imageSize:(CDMImageSize)imageSize imageQuality:(CDMImageQuality)quality callback:(void(^)(UIImage* image, CDMResponse* response))callback;

/**
 *  Stops a pending live image retrieval operation.
 */
- (void)disableLiveImage;

@end

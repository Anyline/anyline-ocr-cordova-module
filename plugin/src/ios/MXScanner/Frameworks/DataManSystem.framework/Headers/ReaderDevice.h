//
//  ReaderDevice.h
//  MX_SDK_FW
//
//  Created by Gyula Hatalyak on 09/01/17.
//  Copyright © 2017 Gyula Hatalyak. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "ReadResults.h"
#import "CDMDataManSystem.h"

// duplicated enum !!!
typedef enum : NSUInteger {
    ConnectionState_Unavailable,
    ConnectionState_Disconnecting,
    ConnectionState_Disconnected,
    ConnectionState_Connecting,
    ConnectionState_Connected,
    //ConnectionStatus_Unknown
    //ConnectionStatus_Sleeping,
} ConnectionState;

typedef enum : NSUInteger {
    Symbology_DataMatrix,
    Symbology_QR,
    Symbology_C128,
    Symbology_UpcEan,
    Symbology_C39,
    Symbology_C93,
    Symbology_I2o5,
    Symbology_CodaBar,
    Symbology_EanUcc,
    Symbology_PharmaCode,
    Symbology_Maxicode,
    Symbology_Pdf417,
    Symbology_Micropdf417,
    Symbology_Databar,
    Symbology_Postnet,
    Symbology_Planet,
    Symbology_FourStateJap,
    Symbology_FourStateAus,
    Symbology_FourStateUpu,
    Symbology_FourStateImb,
    Symbology_Vericode,
    Symbology_Rpc,
    Symbology_Msi,
    Symbology_Azteccode,
    Symbology_Dotcode,
    Symbology_C25,
    Symbology_C39ConvertToC32,
    Symbology_Ocr,
    Symbology_ForStateRmc
} Symbology;

//typedef enum : NSUInteger {
//    UserEvent_1,
//    UserEvent_2
//    // ...
//} UserEvent;
//
//typedef enum : NSUInteger {
//    UserEventType_Beep,
//    UserEventType_Vibrate,
//    UserEventType_Light
//    // ...
//} UserEventType;

typedef enum : NSUInteger {
    ReaderAvailibility_Unknown,
    ReaderAvailibility_Available,
    ReaderAvailibility_Unavailable
} ReaderAvailibility;

//typedef enum : NSUInteger {
//    ReaderDeviceType_MX,
//    ReaderDeviceType_Network,
//    ReaderDeviceType_PhoneCamera
//} ReaderDeviceType;

@class ReaderDevice;

///// READERDEVICEDELEGATE /////
@protocol ReaderDeviceDelegate <NSObject>

@optional
- (void)availabilityDidChangeOfReader:(ReaderDevice *)reader;
- (void)connectionStateDidChangeOfReader:(ReaderDevice *)reader;
- (void)didReceiveReadResultFromReader:(ReaderDevice *)reader results:(ReadResults *)readResults;

@end

///// READERDEVICE /////
@interface ReaderDevice : NSObject

// PROPERTIES
@property (readonly) DataManDeviceClass deviceClass;
@property (readonly) ReaderAvailibility availability;
@property (readonly) ConnectionState connectionState;
@property (readwrite) BOOL imageResultEnabled;
@property (readwrite) BOOL SVGResultEnabled;
@property (weak) id<ReaderDeviceDelegate> delegate;

// INIT & CONNECT & DISCONNECT
+ (instancetype) readerOfMXDevice;

+ (instancetype) readerWithIP:(NSString *)IP_Address
                         port:(int)port
                     username:(NSString *)username
                     password:(NSString *)password;

+ (instancetype) readerOfDeviceCameraWithCameraMode:(CDMCameraMode)cameraMode
                                     previewOptions:(CDMPreviewOption)previewOptions
                                        previewView:(UIView*)previewContainer;

+ (instancetype) readerOfPhoneCamera;

- (void) connectWithCompletion:(void (^)(NSError *error))completionBlock;
- (void) disconnect;

// TRIGGERING
- (UIView *) liveCameraView;
- (void) startScanning;
- (void) stopScanning;

- (void) setPreviewContainer:(UIView*)previewContainer;

// HANDY METHODS
- (void) getDeviceBatteryLevelWithCompletion:(void (^)(int batteryLevel, NSError *error))completionBlock;

- (void) setSymbology:(Symbology)symbology
              enabled:(bool)enabled
           completion:(void (^)(NSError *error))completionBlock;

- (void) isSymbologyEnabled:(Symbology)symbology
                 completion:(void (^)(BOOL enabled, NSError *error))completionBlock;

- (void) setLightsON:(bool)on completion:(void (^)(NSError *error))completionBlock;
- (void) getLightsStateWithCompletion:(void (^)(BOOL enabled, NSError *error))completionBlock;

- (void) resetConfigWithCompletion:(void (^)(NSError *error))completionBlock;

- (void) beep;

//- (void) vibrate;
//- (void) setUserEvent:(UserEvent)userEvent events:(NSDictionary *)events ompletion:(void (^)(BOOL success))completionBlock;
//- (void) getUserEvent:(UserEvent)userEvent completion:(void (^)(NSDictionary *events))completionBlock;
//- (void) playUserEvent:(UserEvent)userEvent;

// DataManSystem
- (CDMDataManSystem *)dataManSystem;

@end

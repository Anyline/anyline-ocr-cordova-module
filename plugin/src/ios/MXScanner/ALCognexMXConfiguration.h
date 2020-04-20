//
//  ALCognexMXConfiguration.h
//
// WARNING: Before changing these parameters please check the MX_API documentation.
//          Changing parameters will chanage the scanning experience of the Anyline SDK.
//

#import <Foundation/Foundation.h>

@interface ALCognexMXConfiguration : NSObject

// Power Settings
@property (nonatomic) int  powerTimeout; //seconds [30-24000] => default: 1200
// Camera Settings
@property (nonatomic,assign) NSString *cameraExposureUSAutoMode; //Auto mode [OFF | ON] => default: OFF
@property (nonatomic) int cameraExposureUSTarget;   //target pixel value [0-255] => default: 128
@property (nonatomic) int cameraExposureUSExposure; //exposure [18-25000] => default: 400
@property (nonatomic) int cameraExposureUSGain;     //gain [0-60] => default: 50

@property (nonatomic) int cameraExposure;     //gain [18-25000] => default: 400
@property (nonatomic) double cameraGain;     //gain [1.0-15.00] => default: 6.0
//  Focus Settings
@property (nonatomic) double focusPower;     //power [-6.0 .. 20.00] => default: 13.0


    
-(instancetype) initWithDictionary:(NSDictionary*)dictionary;

@end

//
//  ALCognexMXConfiguration.m
//

#import "ALCognexMXConfiguration.h"


// Setting Key
NSString * const MX_CONFIG = @"mxConfig";

// Power Settings
NSString * const POWER_TIMEOUT = @"powerTimeout";
// Camera Settings
NSString * const CAMERA_EXPOSURE_US_AUTO_MODE = @"cameraExposureUSAutoMode";
NSString * const CAMERA_EXPOSURE_US_TARGET = @"cameraExposureUSTarget";
NSString * const CAMERA_EXPOSURE_US_EXPOSURE = @"cameraExposureUSExposure";
NSString * const CAMERA_EXPOSURE_US_GAIN = @"cameraExposureUSGain";
NSString * const CAMERA_EXPOSURE = @"cameraExposure";
NSString * const CAMERA_GAIN = @"cameraGain";
//  Focus Settings
NSString * const FOCUS_POWER = @"focusPower";

@implementation ALCognexMXConfiguration

-(instancetype)initWithDictionary:(NSDictionary *)dictionary {
    self = [super init];
    
    if(self) {
        NSDictionary *mxDict = [dictionary valueForKey:MX_CONFIG];

        if([mxDict valueForKey:POWER_TIMEOUT]) {
            _powerTimeout = [self clipValue:[[mxDict valueForKeyPath:POWER_TIMEOUT] intValue] min:30 max:2400];
        } else {
            _powerTimeout = 1200;
        }
    
        if([mxDict valueForKey:CAMERA_EXPOSURE_US_AUTO_MODE]) {
            _cameraExposureUSAutoMode = [mxDict valueForKeyPath:CAMERA_EXPOSURE_US_AUTO_MODE];
            
        } else {
            _cameraExposureUSAutoMode = @"OFF";
        }
        if([mxDict valueForKey:CAMERA_EXPOSURE_US_TARGET]) {
            _cameraExposureUSTarget = [self clipValue:[[mxDict valueForKeyPath:CAMERA_EXPOSURE_US_TARGET] intValue] min:0 max:255];
        } else {
            _cameraExposureUSTarget = 128;
        }
        if([mxDict valueForKey:CAMERA_EXPOSURE_US_EXPOSURE]) {
            _cameraExposureUSExposure = [self clipValue:[[mxDict valueForKeyPath:CAMERA_EXPOSURE_US_EXPOSURE] intValue] min:18 max:25000];
        } else {
            _cameraExposureUSExposure = 400;
        }
        if([mxDict valueForKey:CAMERA_EXPOSURE_US_GAIN]) {
            _cameraExposureUSGain = [self clipValue:[[mxDict valueForKeyPath:CAMERA_EXPOSURE_US_GAIN] intValue] min:0 max:60];
        } else {
            _cameraExposureUSGain = 50;
        }
        
        if([mxDict valueForKey:CAMERA_EXPOSURE]) {
            _cameraExposure = [self clipValue:[[mxDict valueForKeyPath:CAMERA_EXPOSURE] intValue] min:18 max:25000];
        } else {
            _cameraExposure = 400;
        }
        
        if([mxDict valueForKey:CAMERA_GAIN]) {
            _cameraGain = [self clipDoubleValue:[[mxDict valueForKeyPath:CAMERA_GAIN] doubleValue] min:1.0 max:15.0];
        } else {
            _cameraGain = 6.0;
        }
        
        if([mxDict valueForKey:FOCUS_POWER]) {
            _focusPower = [self clipDoubleValue:[[mxDict valueForKeyPath:FOCUS_POWER] doubleValue] min:-6.0 max:13.0];
        } else {
            _focusPower = 13.0;
        }
    }
    return self;
}

- (int)clipValue:(int)value min:(int)minValue max:(int)maxValue {
    int newValue = value;
    
    if (newValue < minValue) {
        newValue = minValue;
    }
    
    if (newValue > maxValue) {
        newValue = maxValue;
    }
        
    return newValue;
}


- (double)clipDoubleValue:(double)value min:(double)minValue max:(double)maxValue {
    double newValue = value;
    
    if (newValue < minValue) {
        newValue = minValue;
    }
    
    if (newValue > maxValue) {
        newValue = maxValue;
    }
        
    return newValue;
}

@end

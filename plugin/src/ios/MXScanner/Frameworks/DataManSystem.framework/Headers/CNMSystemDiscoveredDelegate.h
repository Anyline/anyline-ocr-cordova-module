//
//  CNMSystemDiscoveredDelegate.h
//  CogNamerApp
//
//  Created by Krisztian Gyuris on 28/08/14.
//  Copyright (c) 2014 Krisztian Gyuris. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CNMCogNamerDevice.h"

@protocol CNMSystemDiscoveredDelegate <NSObject>

/**
 * Occurs when a new device is discovered.
 * @param device the device discovered
 */
- (void)deviceDiscovered:(CNMCogNamerDevice *)device;

@end

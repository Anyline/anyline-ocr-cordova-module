//
//  CDMEADiscoverer.h
//  DataManSDK
//
//  Created by Ferenc Knebl on 24/11/14.
//  Copyright (c) 2014 Cognex Corporation. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <ExternalAccessory/ExternalAccessory.h>

/**
 *  \memberof CDMEADiscoverer
 *  Notification name for compatible accessory connected.
 */
static NSString* const CDMCompatibleAccessoryConnected = @"cdmAccessoryConnected";

/**
 *  \memberof CDMEADiscoverer
 *  Notification name for compatible accessory disconnected.
 */
static NSString* const CDMCompatibleAccessoryDisconnected = @"cdmAccessoryDisconnected";

/**
 *  \memberof CDMEADiscoverer
 *  Accessory parameter key in NSNotification userInfo dictionary.
 */
static NSString* const kCDMAccessory = @"accessory";

/**
 *  \memberof CDMEADiscoverer
 *  Protocol parameter key in NSNotification userInfo dictionary.
 */
static NSString* const kCDMProtocol = @"protocol";

/**
 *  Helper class for discovering Cognex DMCC protocol compatible accessories.
 */
@interface CDMEADiscoverer : NSObject

/**
 *  Returns the shared discoverer object.
 *  @return shared discoverer instance
 */
+ (id)sharedDiscoverer;

/**
 *  Returns the currently connected compatible accessories
 *  @return an array of the connected accessories, can be empty
 */
- (NSArray*)compatibleAccessories;

/**
 *  Starts device discovery.
 *  To receive connection related notifications, register for CDMCompatibleAccessoryConnected/CDMCompatibleAccessoryDisconnected notifications.
 */
- (void)startDiscovery;

/**
 *  Stops device discover.
 */
- (void)stopDiscovery;

@end

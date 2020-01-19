//
//  CNMCogNamerDevice.h
//  CogNamerApp
//
//  Created by Krisztian Gyuris on 11/08/14.
//  Copyright (c) 2014 Krisztian Gyuris. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CNMCogNamerDeviceType.h"

typedef NS_ENUM(NSInteger, EthernetDeviceScope)
{
    kLinkLocal = 0,
    kSubnetLocal = 1,
    kRemoteSubnet = 2,
    kUnknown = 3
};

/**
 *  Information that describes a discovered system.
 */
@interface CNMCogNamerDevice : NSObject

/**
 *  Gets the device type of the discovered system as Cognamer returns it.
 */
@property CNMCogNamerDeviceType deviceType;

/**
 *  Gets the type of the discovered system.
 */
@property NSString *type;

/**
 *  Gets the name of the discovered system.
 */
@property NSString *name;

/**
 *  Gets the IP address of the discovered system.
 */
@property NSString *ipAddress;

/**
 *  The port on which the discovered system is listening for DMCC communication.
 */
@property int port;

/**
 *  Gets the subnet mask of the discovered system.
 */
@property NSString *subnetMask;

/**
 *  Gets the default gateway of the discovered system.
 */
@property NSString *defaultGateway;

/**
 *  Gets the formatted MAC address of the discovered system.
 */
@property NSString *macAddressFormatted;

/**
 *  Gets the MAC address of the discovered system.
 */
@property NSData* macAddress;
/**
 *  Gets the serial number of the discovered system.
 */
@property NSString *serialNumber;
/**
 *  Gets the enabled state of DHCP of the discovered system.
 */
@property BOOL isDhcpEnabled;

/**
 *  Gets the model number of the discovered system.
 */
@property NSString *modelNumber;

/**
 *  Gets the firmware version of the discovered system.
 */
@property NSString *firmwareVersion;

/**
 *  Description of the discovered system
 */
@property NSString *systemDescription;

/**
 *  Is this link local ip
 */
@property bool isLinkLocalIP;

/**
 *  Domain of the discovered system
 */
@property NSString *domain;

/**
 *  Dns server of the discovered system
 */
@property NSString *dnsServer;

/**
 *  Used to indicate where the device exists relative to the local host
 */
@property EthernetDeviceScope scope;


@end

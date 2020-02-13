//
//  CNMEthernetSystemDiscoverer.h
//  CogNamerApp
//
//  Created by Krisztian Gyuris on 27/08/14.
//  Copyright (c) 2014 Krisztian Gyuris. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CNMSystemDiscoveredDelegate.h"

@interface CNMEthernetSystemDiscoverer : NSObject

/**
 *  Constructs a system discoverer with the delegate specified as parameter
 *
 *  @param delegate delegate to call back when there is anything to report
 *
 *  @return system discoverer over ethernet
 */
+ (CNMEthernetSystemDiscoverer *)ethernetSystemDiscovererWithDelegate:(id<CNMSystemDiscoveredDelegate>)delegate;

/**
 *  Open CogNamer on the specified interface
 *
 *  @param interface the name of the interface, specify nil to listen on all available interfaces
 *  @return YES, if UDP port is opened succesfully, NO otherwise
 */
- (BOOL)openWithNetworkInterface:(NSString *)interface;

/**
 *  Close CogNamer
 */
- (void)close;

/**
 *  Start system discovering with the optionally spcified device type filter.
 *
 *  @param deviceTypeFilter filters the results for the specified device type, pass nil to bypass filter
 *  @return YES, if query is started, NO if port is not available
 */
- (BOOL)startDeviceQueryWithDeviceTypeFilter:(CNMCogNamerDeviceType)deviceTypeFilter;

/**
 *  Start system discovering with the optionally spcified device type filter.
 *
 *  @param deviceTypeFilter filters the results for the specified device type, pass nil to bypass filter
 *  @param misconfigured discovers misconfigured devices too
 *  @return YES, if query is started, NO if port is not available
 */
- (BOOL)startDeviceQueryWithDeviceTypeFilter:(CNMCogNamerDeviceType)deviceTypeFilter discoverMisconfigured:(BOOL)misconfigured;

/**
 * Sending IP Assign packet to a selected device
 */
- (void)sendNetworkConfigurationToMacAddress:(NSData*)macAddress username:(NSString *)username password:(NSString *)password hostName:(NSString *)hostName useDHCP:(BOOL)useDHCP ipAddress:(NSString *)ipAddress subNetMask:(NSString *)subNetMask gateway:(NSString *)gateway dns:(NSString *)dns domainName:(NSString *)domainName;

/**
 * Flash device at the specified mac address
 */
- (void)sendFlashPacketWithMacAddress:(NSData*)macAddress;

/**
 *  Sends restart packet to the device with the specified IP.
 *
 *  @param ipAddress the device ip address (use nil for full broadcast)
 *  @param macaddress the device MAC address
 *  @param username The username credential
 *  @param password The password credential
 */
- (void)sendRestartPacketToIpAddress:(NSString*)ipAddress withMacAddress:(NSData*)macaddress username:(NSString*)username password:(NSString*)password;

@end

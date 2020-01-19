//
//  CNMCogNamerDeviceType.h
//  DataManSDK
//
//  Created by Ferenc Knebl on 28/05/15.
//  Copyright (c) 2015 Cognex. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 *  Describes the cogtnamer device type
 */
typedef NS_ENUM(NSInteger, CNMCogNamerDeviceType)
{
    /**
     *  Any device
     */
    kCNMDeviceTypeAny = 0,
    /**
     *  Subnet mask
     */
    kCNMDeviceTypeSubtypeMask = 255,
    /**
     *  Insight device
     */
    kCNMDeviceTypeInSightAny = 256,
    /**
     *  InSight 5000 Series
     */
    kCNMDeviceTypeInSight5000Series = 257,
    /**
     *  InSight 3400
     */
    kCNMDeviceTypeInSight3400 = 258,
    /**
     *  InSight 1700 Seris Wafer Reader
     */
    kCNMDeviceTypeInSight1700SeriesWaferReader = 259,
    /**
     *  InSight Micro Series
     */
    kCNMDeviceTypeInSightMicroSeries = 260,
    /**
     *  InSight EZ Series
     */
    kCNMDeviceTypeInSightEZSeries = 261,
    /**
     *  InSight Advantage Egniner Series
     */
    kCNMDeviceTypeInSightAdvantageEngineSeries = 262,
    /**
     *  InSight Micro 1000 LR
     */
    kCNMDeviceTypeInSightMicro1000LR = 263,
    /**
     *  InSight 500 Series
     */
    kCNMDeviceTypeInSight500Series = 264,
    /**
     *  InSight 7000 Series
     */
    kCNMDeviceTypeInSight7000Series = 265,
    /**
     *  Any InSight Emulator
     */
    kCNMDeviceTypeInSightEmulatorAny = 512,
    /**
     *  InSight Emulator PC Host
     */
    kCNMDeviceTypeInSightEmulatorPcHost = 513,
    /**
     *  VisionView Any
     */
    kCNMDeviceTypeVisionViewAny = 768,
    /**
     *  VisionView 700
     */
    kCNMDeviceTypeVisionView700 = 769,
    /**
     *  VisionView VGA
     */
    kCNMDeviceTypeVisionViewVGA = 770,
    /**
     *  VisionView PC
     */
    kCNMDeviceTypeVisionViewPC = 771,
    /**
     *  VisionView 700A
     */
    kCNMDeviceTypeVisionView700A = 772,
    /**
     *  VisionView 900
     */
    kCNMDeviceTypeVisionView900 = 773,
    /**
     *  VisionView 1500
     */
    kCNMDeviceTypeVisionView1500 = 774,
    /**
     *  VisionView CE
     */
    kCNMDeviceTypeVisionViewCE = 784,
    /**
     *  IO Module Any
     */
    kCNMDeviceTypeIOModuleAny = 1024,
    /**
     *  IO Module Cio Micro
     */
    kCNMDeviceTypeIOModuleCioMicro = 1025,
    /**
     *  IO Module Cio Micro CC
     */
    kCNMDeviceTypeIOModuleCioMicroCC = 1026,
    /**
     *  DataMan Any
     */
    kCNMDeviceTypeDataManAny = 1280,
    /**
     *  DataMan 200 Series
     */
    kCNMDeviceTypeDataMan200Series = 1281,
    /**
     *  DataMan 8100 Ethernet
     */
    kCNMDeviceTypeDataMan8100Ethernet = 1282,
    /**
     *  DataMan 8100 WiFi
     */
    kCNMDeviceTypeDataMan8100WiFi = 1283,
    /**
     *  DataMan 8500 Ethernet
     */
    kCNMDeviceTypeDataMan8500Ethernet = 1284,
    /**
     *  DataMan 8500 WiFi
     */
    kCNMDeviceTypeDataMan8500WiFi = 1285,
    /**
     *  DataMan 500 Series
     */
    kCNMDeviceTypeDataMan500Series = 1286,
    /**
     *  DataMan 8000 Series
     */
    kCNMDeviceTypeDataMan8000Series = 1287,
    /**
     *  DataMan Advantage Series
     */
    kCNMDeviceTypeDataManAdvantageSeries = 1288,
    /**
     *  DataMan AT70 Series
     */
    kCNMDeviceTypeDataManAT70Series = 1289,
    /**
     *  DataMan 300 Series
     */
    kCNMDeviceTypeDataMan300Series = 1290,
    /**
     *  DataMan 8000 Base Series
     */
    kCNMDeviceTypeDataMan8000BaseSeries = 1291,
    /**
     *  DataMan 9500 Series
     */
    kCNMDeviceTypeDataMan9500Series = 1292,
    /**
     *  DataMan 503 Series
     */
    kCNMDeviceTypeDataMan503Series = 1293,
    /**
     *  DataMan 50
     */
    kCNMDeviceTypeDataMan50 = 1294,
    /**
     *  DataMan 60
     */
    kCNMDeviceTypeDataMan60 = 1295,
    /**
     *  DataMan RTM
     */
    kCNMDeviceTypeDataManRTM = 1305,
    /**
     *  DataMan PC
     */
    kCNMDeviceTypeDataManPC = 1306,
    /**
     * DM360
     */
    kCNMDeviceTypeDataMan360 = 1307,
    /**
     * AE360
     */
    kCNMDeviceTypeAE360 = 1308,
    /**
     * MX-1000
     */
    kCNMDeviceTypeMX_1000 = 1309,
    /**
     * MX-1500
     */
    kCNMDeviceTypeMX_1500 = 0x0520,
    
    /**
     * IOB 53
     */
    kCNMDeviceTypeIOB_53 = 0x0510,
    
    /**
     * DataMan 8050 Ethernet
     */
    kCNMDeviceTypeDataMan8050Ethernet = 0x0511,
    
    /**
     * DataMan 8050 Bluetooth
     */
    kCNMDeviceTypeDataMan8050Bluetooth = 0x0512,
    
    /**
     * DataMan 8050 WiFi
     */
    kCNMDeviceTypeDataMan8050Wifi = 0x0513,
    
    /**
     * DataMan 8050 Base Series G2
     */
    kCNMDeviceTypeDataMan8050BaseSeriesG2 = 0x0514,
    
    /**
     * DataMan 260
     */
    kCNMDeviceTypeDataMan260 = 0x0515,
    
    /**
     * DataMan 8600 Ethernet
     */
    kCNMDeviceTypeDataMan8600Ethernet = 0x0516,
    
    /**
     * DataMan 8600 Bluetooth
     */
    kCNMDeviceTypeDataMan8600Bluetooth = 0x0517,
    
    /**
     * DataMan 8600 WiFi
     */
    kCNMDeviceTypeDataMan8600Wifi = 0x0518
};

@interface CNMCogNamerDeviceTypeHelper : NSObject

+ (CNMCogNamerDeviceType) fromDataManDeviceType:(NSString*)deviceType;

@end

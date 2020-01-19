//
//  CDMDataManSystemDelegate.h
//
//  Copyright (c) 2014 Cognex Corporation. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "CDMResponse.h"

@class CDMDataManSystem;

/**
 * Indicates the direction of the transfer.
 */
typedef NS_ENUM(NSInteger, CDMTransferDirection)
{
    kCDMTransferDirectionIncoming,
    kCDMTransferDirectionOutgoing
};

/**
 *  DataMan system delegate protocol
 */
@protocol CDMDataManSystemDelegate <NSObject>

/**
 * Occurs when the remote system has successfully connected.
 * @param dataManSystem The DataMan system that is sending the delegate
 */
- (void)dataManSystemDidConnect:(CDMDataManSystem *)dataManSystem;

/**
 * Occurs when the remote system gets disconnected
 * @param dataManSystem The DataMan system that is sending the delegate
 * @param error The error object if an error has occured during disconnect, or nil if there was no error
 */
- (void)dataManSystemDidDisconnect:(CDMDataManSystem *)dataManSystem withError:(NSError *)error;

/**
 * Occurs when the connected remote system sends a decoded string.
 * @param dataManSystem The DataMan system that is sending the delegate
 * @param readString String sent by the connected system
 * @param resultId Identifier of the result. This value can be used to match the read string with other result types, like images, image graphics or XML results.
 @warning To receive this event from the device you will need change the value of the CDMDataManSystem#resultTypes property to include #kCDMResultTypeReadString value
 @see CDMDataManSystem
 @see CDMResultTypes
 */
- (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveReadString:(NSString *)readString withId:(int)resultId;

/**
 * Occurs when the connected remote system sends an image.
 * @param dataManSystem The DataMan system that is sending the delegate
 * @param image Image sent by the connected system
 * @param resultId Identifier of the result. This value can be used to match the image with other result types, like read strings, image graphics or XML results.
 @warning To receive this event from the device you will need change the value of the CDMDataManSystem#resultTypes property to include #kCDMResultTypeImage value
 @see CDMDataManSystem
 @see CDMResultTypes
 */
- (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveImage:(UIImage *)image withId:(int)resultId;

@optional

/**
 Occurs when the connected remote system does not respond to a heartbeat request within a specified interval. To enable heartbeat for the device you need to call CDMDataManSystem#enableHeartbeatWithInterval: method.
 @param dataManSystem The DataMan system that has missed the heartbeat response
 
 */
- (void)dataManSystemDidMissHeartbeatResponse:(CDMDataManSystem *)dataManSystem;

/**
 * Occurs when the connected remote system sends XML statistics.
 * @param dataManSystem The DataMan system that is sending the delegate
 * @param xml XML statistics sent by the connected system
 @warning To receive this event from the device you will need change the value of the CDMDataManSystem#resultTypes property to include #kCDMResultTypeXmlStatistics value
 @see CDMDataManSystem
 @see CDMResultTypes
 */
- (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveXmlStatistics:(NSData *)xml;

/**
Occurs when the connected remote system sends XML results.
@param dataManSystem The DataMan system that is sending the delegate
@param xml XML results sent by the connected system
@param resultId Identifier of the result. This value can be used to match the result XML with other result types, like images, image graphics or read strings.
@warning To receive this event from the device you will need change the value of the CDMDataManSystem#resultTypes property to include #kCDMResultTypeReadXml value
@see CDMDataManSystem
@see CDMResultTypes
 */
- (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveXmlResult:(NSData *)xml withId:(int)resultId;

/**
 * Occurs when the connected remote system sends image graphics message.
 * @param dataManSystem The DataMan system that is sending the delegate
 * @param graphics Image graphics sent by the connected system
 * @param resultId Identifier of the result. This value can be used to match the image graphics with other result types, like read strings, image or XML results.
@warning To receive this event from the device you will need change the value of the CDMDataManSystem#resultTypes property to include #kCDMResultTypeImageGraphics value
@see CDMDataManSystem
@see CDMResultTypes
 */
- (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveImageGraphics:(NSData *)graphics withId:(int)resultId;

/**
 * Occurs when the connected remote system reports training results.
 * @param dataManSystem The DataMan system that is sending the delegate
 * @param trainingResult Training result
 @warning To receive this event from the device you will need change the value of the CDMDataManSystem#resultTypes property to include #kCDMResultTypeTrainingResults value
 @see CDMDataManSystem
 @see CDMResultTypes
 */
- (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveTrainingResult:(NSString *)trainingResult;

/**
 * Occurs when the connected remote system reports a status event.
 * @param dataManSystem The DataMan system that is sending the delegate
 * @param data Status event data
 */
- (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveStatusEvent:(NSData *)data;

/**
 * Occurs when the connected remote system reports its progress
 * @param dataManSystem The DataMan system that is sending the delegate
 * @param direction Direction of transfer
 * @param total Total size of the data being transferred
 * @param size Size of the already transferred data
 */
- (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveTransferProgress:(CDMTransferDirection)direction totalSize:(NSInteger)total sizeTransferred:(NSInteger)size;

/**
 * Occurs when an off protocol byte is received by the connected remote system
 * @param dataManSystem the DataMan system that is sending the delegate
 * @param byte The off protocol byte
 */
- (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveOffProtocolByte:(Byte)byte;

///**
// * Occurs when an off protocol byte is received by the connected remote system
// * @param dataManSystem the DataMan system that is sending the delegate
// */
//- (void)dataManSystemDidBecomeUnavailable:(CDMDataManSystem *)dataManSystem;

@end

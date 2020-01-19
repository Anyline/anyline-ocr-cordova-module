//
//  ALCognexDevice.h
//  MXSampleApp
//
//  Created by David Dengg on 11.12.18.
//  Copyright © 2018 Cognex. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol CognexDeviceDelegate <NSObject>
- (void)deviceIsReadyToScan;
@end

@interface ALCognexDevice : NSObject
@property (nonatomic, strong) UIImageView * preview;
@property (nonatomic, strong) NSNumber * isConnected;
@property (nonatomic, strong) id <CognexDeviceDelegate> delegate;
- (void)startReader;
- (void)setupDevice;
- (void)disconnectReaderDevice;
@end

NS_ASSUME_NONNULL_END

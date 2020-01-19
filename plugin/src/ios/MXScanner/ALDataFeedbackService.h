//
//  ALDataFeedbackService.h
//  MXSampleApp
//
//  Created by Daniel Albertini on 14.06.18.
//  Copyright © 2018 Cognex. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ALDataFeedbackService : NSObject

+ (void)uploadBinaryPayload:(NSData *)imagePayload
               scannedValue:(NSString *)scannedValue
                   bundleID:(NSString *)bundleID;

@end

NS_ASSUME_NONNULL_END

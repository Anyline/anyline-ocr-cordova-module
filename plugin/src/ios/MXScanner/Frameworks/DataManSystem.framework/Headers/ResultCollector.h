//
//  ResultCollector.h
//  DataManSDK
//
//  Created by Krisztian Gyuris on 09/03/17.
//  Copyright © 2017 Cognex. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ComplexResult.h"
#import "SimpleResult.h"
#import "DataManSDK.h"

@protocol ResultCollectorDelegate <NSObject>

@optional
- (void) complexResultArrived:(ComplexResult *)complexResult;
- (void) simpleResultDropped:(SimpleResult *)simpleResult;

@end

@interface ResultCollector : NSObject <CDMDataManSystemDelegate>

@property (weak) id<ResultCollectorDelegate> delegate;
@property NSTimeInterval resultTimeoutInterval;
@property (readwrite) NSUInteger resultCacheLength;


- (instancetype) initWithResultTypes:(CDMResultTypes) resultTypes;

//- (void) clearCachedResults;
//- (void) emptyResultQueue;
- (void) parseAndStoreResponseWithResultType:(CDMResultTypes)resultType responseID:(NSInteger)responseID payload:(NSObject *)payload;

@end

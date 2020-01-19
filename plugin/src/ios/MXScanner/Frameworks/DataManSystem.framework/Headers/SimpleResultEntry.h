//
//  SimpleResultEntry.h
//  DataManSDK
//
//  Created by Krisztian Gyuris on 09/03/17.
//  Copyright © 2017 Cognex. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "SimpleResult.h"
#import "SimpleResultId.h"


@interface SimpleResultEntry : NSObject

@property SimpleResult* result;
@property int numRaisedCompletedEvents;

@property NSMutableSet* containedResultIds; //NSNumber objects
@property NSMutableSet* containedImageIds;
@property NSMutableSet* referredResultIds;
@property NSMutableSet* referredImageIds;

@property NSMutableSet* expectedSimpleResults; // receiving SimpleResultId

- (instancetype) init;
- (instancetype) initWithSimpleResult:(SimpleResult*)result;
- (instancetype) initWithSimpleResultId:(SimpleResultId*)resultId;
- (instancetype) initWithSimpleResultType:(int)resultType resultId:(int)resultId;
- (instancetype) initWithSimpleResultType:(int)resultType resultId:(int)resultId data:(id)data arrivedAtUtc:(NSDate *)date;
- (instancetype) initWithSimpleResultID:(SimpleResultId *)simpleResultID data:(id)data arrivedAtUtc:(NSDate *)date;

//public SimpleResultEntry(ResultType type, int id, Object data, Date arrivedAtUtc)
//{
//    this(new SimpleResult(new SimpleResultId(type, id), data, arrivedAtUtc));
//}
//
//public SimpleResultEntry(SimpleResultId id, Object data, Date arrivedAtUtc)
//{
//    this(new SimpleResult(id, data, arrivedAtUtc));
//}

- (void)addReferredResultId:(int)resultId;
- (void)addContainedResultId:(int)resultId;
- (void)addReferredImageId:(int)imageId;
- (void)addContainedImageId:(int)imageId;
- (void)addExpectedSimpleResult:(SimpleResultId*)simpleResultId;

- (void) addContainedResultIds:(NSArray *)resultIds;
- (void) addReferredImageIds:(NSArray *)imageIds;
- (void) addReferredResultIds:(NSArray *)resultIds;

@end

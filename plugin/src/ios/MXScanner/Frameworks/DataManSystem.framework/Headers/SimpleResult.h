//
//  SimpleResult.h
//  DataManSDK
//
//  Created by Krisztian Gyuris on 09/03/17.
//  Copyright © 2017 Cognex. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SimpleResultId.h"
#import "CDMDataManSystem.h"

@interface SimpleResult : NSObject

@property (readonly) SimpleResultId *simpleResultID;
//@property (readonly) CDMResultTypes resultType;

@property (readonly) BOOL arrived;
@property (readwrite) NSDate* arrivalDate;
@property (readwrite) id data;

@property (readonly) NSString *dataString;

- (instancetype) initWithSimpleResultId:(SimpleResultId *)simpleResultID;

//- (instancetype) initWithResultType:(CDMResultTypes)resultType
//                     simpleResultId:(SimpleResultId *)simpleResultID;

//- (instancetype) initWithResultType:(CDMResultTypes)resultType
//                     simpleResultId:(SimpleResultId *)simpleResultID
//                        arrivalDate:(NSDate *)arrivalDate
//                            payload:(NSObject *)payload;

- (instancetype) initWithSimpleResultId:(SimpleResultId *)simpleResultID
                            arrivalDate:(NSDate *)arrivalDate
                                   data:(id)data;

//- (void)setData:(NSObject*)data utcDate:(NSDate*)utcDate;
//- (NSString*)getDataAsString;

@end

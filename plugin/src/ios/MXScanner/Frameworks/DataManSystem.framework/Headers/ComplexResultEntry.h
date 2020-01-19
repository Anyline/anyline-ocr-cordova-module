//
//  ComplexResultEntry.h
//  DataManSDK
//
//  Created by Krisztian Gyuris on 09/03/17.
//  Copyright © 2017 Cognex. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SimpleResultEntry.h"
#import "ComplexResult.h"

@interface ComplexResultEntry : NSObject

@property NSUInteger collectedResultTypes;
@property NSMutableDictionary *simpleResults;

- (BOOL) joinTo:(ComplexResultEntry *)otherComplexResultEntry;

- (void) addSimpleResult:(SimpleResultEntry *)simpleResultEntry;

- (bool) isComplete:(NSUInteger)collectedResultTypes_in;

- (ComplexResult *) convertToComplexResult:(ComplexResultEntry *)complexResultEntry onlyEntriesAlreadyArrived:(bool)onlyEntriesAlreadyArrived;


@end

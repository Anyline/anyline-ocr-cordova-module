//
//  SimpleResultId.h
//  DataManSDK
//
//  Created by Krisztian Gyuris on 09/03/17.
//  Copyright © 2017 Cognex. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface SimpleResultId : NSObject <NSCopying>

/**
 * Type of the simple result.
 */
@property int resultType;

/**
 * The identifier number of the simple result. This is either a Result Id or an Image Id.
 */
@property (readonly) int resultId;

- (id) initWithResultType:(int)resultType resultId:(int)resultId;
- (BOOL)isEqual:(id)object;

@end

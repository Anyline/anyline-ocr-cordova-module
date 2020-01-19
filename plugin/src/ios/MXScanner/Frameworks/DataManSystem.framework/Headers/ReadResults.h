//
//  ReadResults.h
//  DataManSDK
//
//  Created by Gyula Hatalyak on 2017. 04. 10..
//  Copyright © 2017. Cognex. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ComplexResult.h"

@interface ReadResults : NSObject

@property (readonly) NSString *XML;
@property (readonly) NSArray *readResults;

- (instancetype) initWithComplexResult:(ComplexResult *)complexResult;

@end

//
//  ReadResults.h
//  DataManSDK
//
//  Created by Gyula Hatalyak on 2017. 04. 10..
//  Copyright © 2017. Cognex. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 * Represents a list of read results
 */
@interface CMBReadResults : NSObject

/**
 * Returns the raw XML recieved from the reader
 * @return the raw XML string
 */
@property (readonly) NSString *XML;

/**
 * Returns an array of {@link CMBReadResult} objects
 */
@property (readonly) NSArray *readResults;

@end

//
//  ReadResult.h
//  MX_SDK
//
//  Created by Gyula Hatalyak on 12/01/17.
//  Copyright © 2017 Gyula Hatalyak. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CMBReaderDevice.h"

/**
 * Represents a read result
 */
@interface CMBReadResult : NSObject

/**
 * Success of the read
 * @return true, if the read was successful
 */
@property (readwrite) BOOL goodRead;

/**
 * Returns the read string, if available
 * @return read string or nil
 */
@property (readwrite) NSString * readString;

/**
 * Returns the image for this result
 */
@property (readwrite) UIImage * image;

/**
 * Returns the SVG XML as NSData for this result
 * @return the SVG XML as NSData or null
 */
@property (readwrite) NSData* imageGraphics;

/**
 * Returns the subresult XML string for this result
 * @return the subresult XML string or null
 */
@property (readwrite) NSData * XML;

/**
 * Returns the code symbology of the result
 * @return {@link CMBSymbology} of the result
 */
@property (readwrite) CMBSymbology symbology;

@end

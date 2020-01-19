//
//  ReadResult.h
//  MX_SDK
//
//  Created by Gyula Hatalyak on 12/01/17.
//  Copyright © 2017 Gyula Hatalyak. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ReaderDevice.h"

@interface ReadResult : NSObject

@property (readwrite) BOOL goodRead;
@property (readwrite) NSString * readString;
@property (readwrite) UIImage * image;
@property (readwrite) NSData* imageGraphics; //SVG
@property (readwrite) NSData * XML;
@property (readwrite) Symbology symbology;

@end

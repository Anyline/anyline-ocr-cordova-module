//
//  XmlTextReader.h
//  DataManSDK
//
//  Created by Gyula Hatalyak on 2017. 04. 26..
//  Copyright © 2017. Cognex. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface XmlTextReader : NSObject

@property int depth;

- (instancetype) initWithXML:(NSString *)xml;

- (bool) readToFollowing:(NSString *)tag;

- (NSString *) getAttribute:(NSString *)attrName;

- (NSInteger) getAttributeInteger:(NSString *)attrName;

@end

//
//  DMQSXmlResultParser.h
//  DataManQuickSetup
//
//  Created by Ferenc Knebl on 12/01/16.
//  Copyright © 2016 Cognex Corporation. All rights reserved.
//

#import <Foundation/Foundation.h>

@class CDMXMLElement;

@interface DMQSXmlResultParser : NSObject

- (id)initWithRootElement:(CDMXMLElement*)root;

- (NSDictionary*)parseForNotification;

@end

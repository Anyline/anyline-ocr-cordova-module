//
//  CDMXMLParser.h
//  CDMSVG
//
//  Created by Ferenc Knebl on 02/10/14.
//  Copyright (c) 2014 Cognex Corporation. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface CDMXMLElement : NSObject

@property (nonatomic, strong) NSString* name;
@property (nonatomic, strong) NSDictionary* attributes;
@property (nonatomic, strong) NSString* value;
@property (nonatomic, strong) NSArray* children;

- (NSArray*) childrenForName:(NSString*)name;
- (CDMXMLElement*) childForName:(NSString*)name;

@end

@interface CDMXMLParser : NSObject<NSXMLParserDelegate>

@property NSError* parseError;

- (id) initWithData:(NSData*)data;
- (id) initWithStream:(NSInputStream*)stream;
- (CDMXMLElement*) rootElement;

@end
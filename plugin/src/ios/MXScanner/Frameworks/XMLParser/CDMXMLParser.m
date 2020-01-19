//
//  CDMXMLParser.m
//  CDMSVG
//
//  Created by Ferenc Knebl on 02/10/14.
//  Copyright (c) 2014 Cognex Corporation. All rights reserved.
//

#import "CDMXMLParser.h"

@implementation CDMXMLParser{
    NSXMLParser* xmlParser;
    
    CDMXMLElement* xmlRootElement;
    
    NSMutableArray* elementsStack;
    CDMXMLElement* currentElement;
}

- (id) initWithData:(NSData*)data {
    if (self = [super init]) {
        xmlParser = [[NSXMLParser alloc] initWithData:data];
        xmlParser.delegate = self;
    }
    
    return self;
}

- (id) initWithStream:(NSInputStream*)stream {
    if (self = [super init]) {
        xmlParser = [[NSXMLParser alloc] initWithStream:stream];
        xmlParser.delegate = self;
    }
    
    return self;
}

- (CDMXMLElement*) rootElement {
    self.parseError = nil;
    
    elementsStack = [[NSMutableArray alloc] init];
    xmlRootElement = nil;
    
    if (![xmlParser parse]) {
        self.parseError = xmlParser.parserError;
    } else {

    }
    
    return xmlRootElement;
}

- (void)parser:(NSXMLParser *)parser didStartElement:(NSString *)elementName namespaceURI:(NSString *)namespaceURI qualifiedName:(NSString *)qualifiedName attributes:(NSDictionary *)attributeDict
{
    currentElement = [[CDMXMLElement alloc] init];
    
    currentElement.name = elementName;
    currentElement.attributes = attributeDict;
    
    currentElement.children = [[NSMutableArray alloc] init];
    
    if (elementsStack.count > 0) {
        [(NSMutableArray*)[[elementsStack lastObject] children] addObject:currentElement];
    }
    
    [elementsStack addObject:currentElement];
}

- (void)parser:(NSXMLParser *)parser didEndElement:(NSString *)elementName namespaceURI:(NSString *)namespaceURI qualifiedName:(NSString *)qName
{
    CDMXMLElement* lastObject = [elementsStack lastObject];
    
    if ([[lastObject children] count] > 0) {
        [lastObject setChildren: [NSArray arrayWithArray:[lastObject children]]];
    } else {
        [lastObject setChildren:nil];
    }
    
    if (elementsStack.count == 1) {
        xmlRootElement = lastObject;
    }
    
    [elementsStack removeLastObject];
    
    currentElement = nil;
}

- (void)parser:(NSXMLParser *)parser foundCharacters:(NSString *)string
{
    if (currentElement) {
        currentElement.value = string;
    }
}

@end

@implementation CDMXMLElement

- (CDMXMLElement*) childForName:(NSString*)name {
    for (CDMXMLElement* child in self.children) {
        if ([child.name isEqualToString:name]) {
            return child;
        }
    }
    
    return [[CDMXMLElement alloc] init];
}

- (NSArray*) childrenForName:(NSString*)name {
    NSMutableArray* cs = [NSMutableArray array];
    
    for (CDMXMLElement* child in self.children) {
        if ([child.name isEqualToString:name]) {
            [cs addObject:child];
        }
    }
    
    return [NSArray arrayWithArray: cs];
}

- (NSString*)description {
    NSMutableString* desc = [NSMutableString stringWithString:self.name];

    if (self.value) {
        [desc appendFormat:@" (%@)", self.value];
    }
    
    if (self.attributes) {
        [desc appendFormat:@"%@", self.attributes];
    }
    
    if (self.children) {
        [desc appendString:@" ["];
        for (CDMXMLElement* elem in self.children) {
            [desc appendFormat:@"%@", elem.description];
        }
        [desc appendString:@"]\n"];
    }
    
    return [NSString stringWithString:desc];
}

@end

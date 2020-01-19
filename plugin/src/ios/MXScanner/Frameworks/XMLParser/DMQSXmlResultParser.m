//
//  DMQSXmlResultParser.m
//  DataManQuickSetup
//
//  Created by Ferenc Knebl on 12/01/16.
//  Copyright © 2016 Cognex Corporation. All rights reserved.
//

#import "DMQSXmlResultParser.h"
#import "CDMXMLParser.h"

@interface DMQSXmlResultParser()

@property (strong) CDMXMLElement* root;

@end

@implementation DMQSXmlResultParser

- (id)initWithRootElement:(CDMXMLElement*)root {
    if (self = [super init]) {
        self.root = root;
    }
    
    return self;
}

- (NSDictionary*)parseForNotification {
    NSMutableDictionary* result = [NSMutableDictionary dictionary];
    
    CDMXMLElement* general = [self.root childForName:@"general"];
    CDMXMLElement* validation = [self.root childForName:@"validation"];
    
    if (general) {
        
        NSString* symbology = [[general childForName:@"symbology"] value];
        if (symbology)
            [result setObject:symbology forKey:@"symbology"];
        
        NSString* read_status = [[general childForName:@"status"] value];
        if ([@"GOOD READ" isEqualToString:read_status]) {
            [result setObject:[NSNumber numberWithBool:YES] forKey:@"goodRead"];
        } else {
            [result setObject:[NSNumber numberWithBool:NO] forKey:@"goodRead"];
        }
        
        CDMXMLElement* full_string = [general childForName:@"full_string"];
        if ([@"base64" isEqualToString: [full_string attributes][@"encoding"]]) {
            if ([full_string value]) {
                NSData *decodedData = [[NSData alloc] initWithBase64EncodedString:[full_string value] options:0];
                NSString *decodedString = [[NSString alloc] initWithData:decodedData encoding:NSUTF8StringEncoding];
                
                if (decodedString) {
                    [result setObject:decodedString forKey:@"readString"];
                } else {
                    NSMutableString* resultAsHexBytes = [NSMutableString string];
                    [decodedData enumerateByteRangesUsingBlock:^(const void * _Nonnull bytes, NSRange byteRange, BOOL * _Nonnull stop) {
                        for (NSUInteger i = 0; i < byteRange.length; ++i) {
                            uint8_t databyte = ((uint8_t*)bytes)[i];
                            if (databyte < 32)
                                [resultAsHexBytes appendFormat:@"<%02x>", databyte];
                            else
                                [resultAsHexBytes appendFormat:@"%c", databyte];
                        }
                    }];
                    
                    [result setObject:resultAsHexBytes forKey:@"readString"];
                }
            }
        }
    }
    
    if (validation) {
        NSString* status = [[validation childForName:@"status"] value];
        if ([@"valid" isEqualToString:status]) {
            [result setObject:[NSNumber numberWithBool:YES] forKey:@"valid"];
        } else if ([@"error" isEqualToString:status]) {
            [result setObject:[NSNumber numberWithBool:NO] forKey:@"valid"];
            
            [result setObject:[[validation childForName:@"error"] value] forKey:@"validation_error"];
        }
    }
    
    return [NSDictionary dictionaryWithDictionary: result];
}

@end

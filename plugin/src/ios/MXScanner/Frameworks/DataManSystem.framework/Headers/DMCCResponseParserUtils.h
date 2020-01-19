//
//  DMCCResponseParserUtils.h
//  DataManSDK
//
//  Created by Krisztian Gyuris on 09/03/17.
//  Copyright © 2017 Cognex. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "XmlIds.h"
#import "SvgIds.h"

@interface DMCCResponseParserUtils : NSObject

+ (XmlIds *) extractIdsFromReadXml:(NSString *)readXml;

+ (SvgIds *) extractIdsFromSvg:(NSString *)svgXml;

@end

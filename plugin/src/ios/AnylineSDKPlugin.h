#import <Foundation/Foundation.h>
#import "Cordova/CDVPlugin.h"

@interface AnylineSDKPlugin : CDVPlugin

- (void)scan:(CDVInvokedUrlCommand *)command;

- (void)checkLicense:(CDVInvokedUrlCommand *)command;

- (void)getSDKVersion:(CDVInvokedUrlCommand *)command;

@end

#import <Foundation/Foundation.h>
#import <Anyline/Anyline.h>
#import "Cordova/CDVPlugin.h"

__attribute__((deprecated("Use AnylineInfinityPlugin instead.")))
@interface AnylineSDKPlugin : CDVPlugin <ALWrapperSessionClientDelegate>

- (void)scan:(CDVInvokedUrlCommand *)command;

- (void)checkLicense:(CDVInvokedUrlCommand *)command;

- (void)getSDKVersion:(CDVInvokedUrlCommand *)command;

@end

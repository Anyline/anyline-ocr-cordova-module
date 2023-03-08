#import "AnylineSDKPlugin.h"
#import <Anyline/Anyline.h>
#import "ALPluginHelper.h"

@interface AnylineSDKPlugin()

@property (nonatomic, strong) NSString *callbackId;

@property (nonatomic, strong) ALCordovaUIConfiguration *cordovaUIConf;

@property (nonatomic, strong) NSDictionary *anylineConfig;

@end


@implementation AnylineSDKPlugin

- (void)scan:(CDVInvokedUrlCommand *)command {
    [self processArgumentsForCommand:command];
    __weak __block __typeof(self) weakSelf = self;
    [ALPluginHelper startScan:self.anylineConfig
                     finished:^(id  _Nullable callbackObj, NSString * _Nullable errorString) {
        CDVPluginResult *pluginResult;
        if (errorString.length) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                             messageAsString:errorString];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                         messageAsDictionary:callbackObj];
        }
        [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

/// Gets the license key's expiry date. NOTE: returns nil if the AnylineSDK was not
/// yet initialized successfully (with a key!)
- (void)checkLicense:(CDVInvokedUrlCommand *)command {
    NSString *licenseExpDate = [AnylineSDK licenseExpirationDate];
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                      messageAsString:licenseExpDate];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)getSDKVersion:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:AnylineSDK.versionNumber];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)initAnylineSDK:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult;
    if (command.arguments.count < 1) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"License key not given."];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    NSString *licenseKey = (NSString *)command.arguments[0];
    NSError *error;
    [AnylineSDK setupWithLicenseKey:licenseKey error:&error];
    if (error) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                         messageAsString:error.localizedDescription];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

// MARK: - Convenience Methods

- (void)processArgumentsForCommand:(CDVInvokedUrlCommand *)command {
    self.callbackId = command.callbackId;
    self.anylineConfig = [command.arguments objectAtIndex:0];

    NSDictionary *UIOptions = self.anylineConfig[@"options"];
    if (![UIOptions isKindOfClass:NSDictionary.class]) {
        UIOptions = @{};
    }
    self.cordovaUIConf = [[ALCordovaUIConfiguration alloc] initWithDictionary:UIOptions];
}

@end

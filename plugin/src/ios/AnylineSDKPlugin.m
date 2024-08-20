#import "AnylineSDKPlugin.h"
#import <Anyline/Anyline.h>
#import "ALPluginHelper.h"

@interface AnylineSDKPlugin()

@property (nonatomic, strong) NSString *callbackId;

@property (nonatomic, strong) ALCordovaUIConfiguration *cordovaUIConf;

@property (nonatomic, strong) NSDictionary *anylineConfig;

@property (nonatomic, strong) ALWrapperConfig *wrapperConfig;

@property (nonatomic, strong) NSString *wrapperPluginVersion;

@property (nonatomic, copy) NSString *initializationParamsStr;

@end


@implementation AnylineSDKPlugin

- (void)scan:(CDVInvokedUrlCommand *)command {
    [self processArgumentsForCommand:command];
    __weak __block __typeof(self) weakSelf = self;
    [self.commandDelegate runInBackground:^{
        [ALPluginHelper startScan:weakSelf.anylineConfig
          initializationParamsStr:weakSelf.initializationParamsStr
                         finished:^(NSDictionary * _Nullable callbackObj, NSError * _Nullable error) {
                             CDVPluginResult *pluginResult;
                             if (error) {
                                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                                  messageAsString:error.localizedDescription];
                             } else {
                                 pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                              messageAsDictionary:callbackObj];
                             }
                             [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                         }];
    }];
}

/// Gets the license key's expiry date. NOTE: returns nil if the AnylineSDK was not
/// yet initialized successfully (with a key!)
- (void)checkLicense:(CDVInvokedUrlCommand *)command {
    __weak __block __typeof(self) weakSelf = self;
    [self.commandDelegate runInBackground:^{
        NSString *licenseExpDate = [AnylineSDK licenseExpirationDate];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                          messageAsString:licenseExpDate];
        [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)getSDKVersion:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                      messageAsString:AnylineSDK.versionNumber];
    __weak __block __typeof(self) weakSelf = self;
    [self.commandDelegate runInBackground:^{
        [weakSelf.commandDelegate sendPluginResult:pluginResult
                                        callbackId:command.callbackId];
    }];
}

- (void)exportCachedEvents:(CDVInvokedUrlCommand *)command {
    NSError *error;
    NSString *exportPath = [AnylineSDK exportCachedEvents:&error];

    CDVPluginResult *pluginResult;
    if (!exportPath) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.localizedDescription];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:exportPath];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)setPluginVersion:(CDVInvokedUrlCommand *)command {
    __weak __block __typeof(self) weakSelf = self;
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *pluginResult;
        if (command.arguments.count < 1) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Plugin version not given."];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            return;
        }
        weakSelf.wrapperPluginVersion = (NSString *)(command.arguments[0]);
        weakSelf.wrapperConfig = [ALWrapperConfig cordova:weakSelf.wrapperPluginVersion];

        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)getPluginVersion:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                      messageAsString:self.wrapperPluginVersion];
    __weak __block __typeof(self) weakSelf = self;
    [self.commandDelegate runInBackground:^{
        [weakSelf.commandDelegate sendPluginResult:pluginResult
                                        callbackId:command.callbackId];
    }];
}

- (void)initAnylineSDK:(CDVInvokedUrlCommand *)command {
    __weak __block __typeof(self) weakSelf = self;
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *pluginResult;
        if (command.arguments.count < 1) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"License key not given."];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            return;
        }
        NSString *licenseKey = (NSString *)command.arguments[0];
        NSError *error;

        ALCacheConfig *cacheConfig;
        if (command.arguments.count > 1) {
            id offlineLicenseCacheEnabled = command.arguments[1];
            if (offlineLicenseCacheEnabled != [NSNull null] && [offlineLicenseCacheEnabled boolValue]) {
                cacheConfig = [ALCacheConfig offlineLicenseCachingEnabled];
            }
        }

        [AnylineSDK setupWithLicenseKey:licenseKey cacheConfig:cacheConfig wrapperConfig:self.wrapperConfig error:&error];
        if (error) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                             messageAsString:error.localizedDescription];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            return;
        }
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

// MARK: - Convenience Methods

- (void)processArgumentsForCommand:(CDVInvokedUrlCommand *)command {
    self.callbackId = command.callbackId;
    self.anylineConfig = [command.arguments objectAtIndex:0];
    if (command.arguments.count > 1) {
        self.initializationParamsStr = [self stringForDictionary:[command.arguments objectAtIndex:1]];
    } else {
        self.initializationParamsStr = nil;
    }
    NSDictionary *UIOptions = self.anylineConfig[@"options"];
    if (![UIOptions isKindOfClass:NSDictionary.class]) {
        UIOptions = @{};
    }
    self.cordovaUIConf = [[ALCordovaUIConfiguration alloc] initWithDictionary:UIOptions];
}

// MARK: - Utility Method

- (NSString *)stringForDictionary:(NSDictionary *)dict {
    NSError * err;
    NSData * jsonData = [NSJSONSerialization dataWithJSONObject:dict options:0 error:&err];
    return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}

@end

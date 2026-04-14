#import "AnylineInfinityPlugin.h"
#import <Anyline/Anyline.h>

// Static instance to retain the ALWrapperSessionProvider reference.
static ALWrapperSessionProvider *_infinityWrapperSessionProvider;

static NSString *_infinityPluginVersion;

@interface AnylineInfinityPlugin ()

@property (nonatomic, strong) CDVInvokedUrlCommand *sdkInitializationCommand;
@property (nonatomic, strong) CDVInvokedUrlCommand *scanStartCommand;
@property (nonatomic, strong) CDVInvokedUrlCommand *ucrReportCommand;
@property (nonatomic, strong) CDVInvokedUrlCommand *exportCachedEventsCommand;

@end

@implementation AnylineInfinityPlugin

- (void)setupWrapperSession:(CDVInvokedUrlCommand *)command {
    __weak __block __typeof(self) weakSelf = self;
    [self.commandDelegate runInBackground:^{
        if (command.arguments.count < 1) {
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                         messageAsString:@"Plugin version not given."];
            [weakSelf.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            return;
        }
        _infinityPluginVersion = (NSString *)command.arguments[0];
        if (!_infinityWrapperSessionProvider) {
            _infinityWrapperSessionProvider = [[ALWrapperSessionProvider alloc] init];
        }
        ALWrapperConfig *wrapperConfig = [ALWrapperConfig cordova:_infinityPluginVersion codename:ALWrapperCodenameInfinity];
        [ALWrapperSessionProvider setupWrapperSessionWithWrapperInfo:wrapperConfig
                                                wrapperSessionClient:weakSelf];
        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [weakSelf.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)getSDKVersion:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                      messageAsString:AnylineSDK.versionNumber];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)requestSdkInitialization:(CDVInvokedUrlCommand *)command {
    self.sdkInitializationCommand = command;
    [self.commandDelegate runInBackground:^{
        NSString *requestJson = (NSString *)command.arguments[0];
        [ALWrapperSessionProvider
            requestSdkInitializationWithInitializationRequestParamsString:requestJson];
    }];
}

- (void)requestScanStart:(CDVInvokedUrlCommand *)command {
    self.scanStartCommand = command;
    [self.commandDelegate runInBackground:^{
        NSString *requestJson = (NSString *)command.arguments[0];
        [ALWrapperSessionProvider requestScanStartWithScanStartRequestParamsString:[self resolvedScanStartRequestJsonString:requestJson]];
    }];
}

- (void)requestScanStop:(CDVInvokedUrlCommand *)command {
    __weak __block __typeof(self) weakSelf = self;
    [self.commandDelegate runInBackground:^{
        NSString *requestJson = nil;
        if (command.arguments.count > 0 && command.arguments[0] != [NSNull null]) {
            requestJson = (NSString *)command.arguments[0];
        }
        [ALWrapperSessionProvider requestScanStopWithScanStopRequestParamsString:requestJson];
        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [weakSelf.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)requestScanSwitchWithScanStartRequestParams:(CDVInvokedUrlCommand *)command {
    __weak __block __typeof(self) weakSelf = self;
    [self.commandDelegate runInBackground:^{
        [ALWrapperSessionProvider requestScanSwitchWithScanStartRequestParamsString:[self resolvedScanStartRequestJsonString:(NSString *)command.arguments[0]]];
        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [weakSelf.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)requestScanSwitchWithScanViewConfigContentString:(CDVInvokedUrlCommand *)command {
    __weak __block __typeof(self) weakSelf = self;
    [self.commandDelegate runInBackground:^{
        [ALWrapperSessionProvider
            requestScanSwitchWithScanViewConfigContentString:(NSString *)command.arguments[0]];
        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [weakSelf.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)requestUCRReport:(CDVInvokedUrlCommand *)command {
    self.ucrReportCommand = command;
    [self.commandDelegate runInBackground:^{
        [ALWrapperSessionProvider
            requestUCRReportWithWrapperSessionUCRReportRequestString:(NSString *)command.arguments[0]];
    }];
}

- (void)requestExportCachedEvents:(CDVInvokedUrlCommand *)command {
    self.exportCachedEventsCommand = command;
    [self.commandDelegate runInBackground:^{
        [ALWrapperSessionProvider requestExportCachedEvents];
    }];
}

// MARK: - Helpers

- (NSString *)bundlePathFromScanViewConfigPath:(NSString * _Nullable)scanViewConfigPath {
    // Guard against NSNull from JSON deserialization when the field is absent
    if ([scanViewConfigPath isKindOfClass:[NSNull class]]) scanViewConfigPath = nil;
    NSString *absoluteScanViewConfigPath = [[NSBundle mainBundle] bundlePath];
    if (scanViewConfigPath) {
        absoluteScanViewConfigPath = [absoluteScanViewConfigPath stringByAppendingPathComponent:scanViewConfigPath];
    }
    return absoluteScanViewConfigPath;
}

- (NSString *)resolvedScanStartRequestJsonString:(NSString *)requestJsonString {
    if (!requestJsonString) return requestJsonString;
    NSData *jsonData = [requestJsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSMutableDictionary *requestDict = [[NSJSONSerialization JSONObjectWithData:jsonData options:0 error:nil] mutableCopy];
    if (!requestDict) return requestJsonString;
    NSString *scanViewConfigPath = requestDict[@"scanViewConfigPath"];
    requestDict[@"scanViewConfigPath"] = [self bundlePathFromScanViewConfigPath:scanViewConfigPath];

    NSData *fixedData = [NSJSONSerialization dataWithJSONObject:requestDict options:0 error:nil];
    return fixedData ? [[NSString alloc] initWithData:fixedData encoding:NSUTF8StringEncoding] : requestJsonString;
}

- (void)sendScanStartPayloadWithType:(NSString *)type data:(NSString *)data keepCallback:(BOOL)keepCallback {
    if (!self.scanStartCommand) return;
    NSDictionary *payload = @{@"type": type, @"data": data};
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                               messageAsDictionary:payload];
    [result setKeepCallbackAsBool:keepCallback];
    [self.commandDelegate sendPluginResult:result callbackId:self.scanStartCommand.callbackId];
}

// MARK: - ALWrapperSessionClientDelegate

- (nullable UIViewController *)getTopViewController {
    return nil;
}

- (nullable UIView *)getContainerView {
    return nil;
}

- (void)onSdkInitializationResponse:(nonnull ALWrapperSessionSDKInitializationResponse *)initializationResponse {
    if (!self.sdkInitializationCommand) return;
    NSDictionary *dict = [initializationResponse toJSONDictionary];
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                 messageAsString:[dict asJSONString]];
    [self.commandDelegate sendPluginResult:result callbackId:self.sdkInitializationCommand.callbackId];
    self.sdkInitializationCommand = nil;
}

- (void)onScanResults:(nonnull ALWrapperSessionScanResultsResponse *)scanResultsResponse {
    NSArray<ALExportedScanResult *> *results = (NSArray<ALExportedScanResult *> *)scanResultsResponse.exportedScanResults;
    NSMutableArray<NSDictionary *> *resultDicts = [NSMutableArray array];
    for (ALExportedScanResult *result in results) {
        [resultDicts addObject:[result toJSONDictionary]];
    }
    NSMutableDictionary *dict = [[scanResultsResponse toJSONDictionary] mutableCopy];
    dict[@"exportedScanResults"] = resultDicts;
    [self sendScanStartPayloadWithType:@"scanResults" data:[dict asJSONString] keepCallback:YES];
}

- (void)onScanResponse:(nonnull ALWrapperSessionScanResponse *)scanResponse {
    NSDictionary *dict = [scanResponse toJSONDictionary];
    [self sendScanStartPayloadWithType:@"scanResponse" data:[dict asJSONString] keepCallback:NO];
    self.scanStartCommand = nil;
}

- (void)onUIElementClicked:(nonnull ALWrapperSessionScanResultConfig *)scanResultConfig
    uiFeedbackElementConfig:(nonnull ALUIFeedbackElementConfig *)uiFeedbackElementConfig {
    NSDictionary *dict = [uiFeedbackElementConfig performSelector:@selector(JSONDictionary)];
    [self sendScanStartPayloadWithType:@"uiElementClicked" data:[dict asJSONString] keepCallback:YES];
}

- (void)onUCRReportResponse:(nonnull ALWrapperSessionUCRReportResponse *)ucrReportResponse {
    if (!self.ucrReportCommand) return;
    NSDictionary *dict = [ucrReportResponse toJSONDictionary];
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                 messageAsString:[dict asJSONString]];
    [self.commandDelegate sendPluginResult:result callbackId:self.ucrReportCommand.callbackId];
    self.ucrReportCommand = nil;
}

- (void)onExportCachedEventsResponse:(nonnull ALWrapperSessionExportCachedEventsResponse *)exportCachedEventsResponse {
    if (!self.exportCachedEventsCommand) return;
    NSDictionary *dict = [exportCachedEventsResponse toJSONDictionary];
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                 messageAsString:[dict asJSONString]];
    [self.commandDelegate sendPluginResult:result callbackId:self.exportCachedEventsCommand.callbackId];
    self.exportCachedEventsCommand = nil;
}

@end
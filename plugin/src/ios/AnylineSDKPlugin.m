#import "AnylineSDKPlugin.h"
#import <Anyline/Anyline.h>

// Static instance to retain the ALWrapperSessionProvider instance
static ALWrapperSessionProvider *_wrapperSessionProvider;

static NSString *_pluginVersion;

@interface AnylineSDKPlugin()

@property (nonatomic, strong) CDVInvokedUrlCommand *wrapperSessionSdkInitializationResponseCommand;

@property (nonatomic, strong) CDVInvokedUrlCommand *wrapperSessionScanResponseCommand;

@property (nonatomic, strong) CDVInvokedUrlCommand *wrapperSessionExportCachedEventsResponseCommand;

@property (nonatomic, strong) CDVInvokedUrlCommand *wrapperSessionReportCorrectedResultResponseCommand;


@end


@implementation AnylineSDKPlugin

- (void)sendEvent:(NSString *)eventName params:(NSString *)params {
    // Escape single quotes in the message
    NSString *escapedParams = [params stringByReplacingOccurrencesOfString:@"'" withString:@"\\'"];

    // Construct the JavaScript string
    NSString *js = [NSString stringWithFormat:@"window.%@('%@')", eventName, escapedParams];

    // Run on main thread
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.commandDelegate evalJs:js];
    });
}

-(NSString *)bundleRootPath {
    NSString *rootPath = [[NSBundle mainBundle] bundlePath];
    return rootPath;
}

-(NSString *)bundlePathFromScanViewConfigPath:(NSString * _Nullable)scanViewConfigPath {
    //get root folder (ends with ...Runner.app)
    NSString *absoluteScanViewConfigPath = [self bundleRootPath];

    if (scanViewConfigPath) {
        //append scanViewConfigPath
        absoluteScanViewConfigPath = [absoluteScanViewConfigPath stringByAppendingPathComponent:scanViewConfigPath];
    }
    return absoluteScanViewConfigPath;
}

- (void)scan:(CDVInvokedUrlCommand *)command {
    self.wrapperSessionScanResponseCommand = command;

    NSString *configStr = [self stringForDictionary:[command.arguments objectAtIndex:0]];

    NSString *initializationParametersStr;
    if (command.arguments.count > 1 && [command.arguments objectAtIndex:1] != [NSNull null]) {
        NSDictionary *initializationParamsDict = [command.arguments objectAtIndex:1];
        initializationParametersStr = [self stringForDictionary:initializationParamsDict];
    } else {
        initializationParametersStr = nil;
    }

    NSString *scanViewConfigPathStr;
    if (command.arguments.count > 2 && [command.arguments objectAtIndex:2] != [NSNull null]) {
        scanViewConfigPathStr = [[command.arguments objectAtIndex:2] objectForKey:@"scanViewConfigPath"];
    } else {
        scanViewConfigPathStr = nil;
    }

    NSString *scanCallbackConfigStr;
    if (command.arguments.count > 3 && [command.arguments objectAtIndex:3] != [NSNull null]) {
        //ideally this element is corresponding to WrapperSessionScanResultConfig
        NSDictionary *scanCallbackConfigDict = [[command.arguments objectAtIndex:3] objectForKey:@"callbackConfig"];
        scanCallbackConfigStr = [self stringForDictionary:scanCallbackConfigDict];
    } else {
        scanCallbackConfigStr = nil;
    }

    [self.commandDelegate runInBackground:^{
        [self requestScanStartWithScanViewConfigContent:configStr
                 scanViewInitializationParametersString:initializationParametersStr
                                     scanViewConfigPath:scanViewConfigPathStr
                               scanCallbackConfigString:scanCallbackConfigStr];
    }];
}

/// Gets the license key's expiry date. NOTE: returns nil if the AnylineSDK was not
/// yet initialized successfully (with a key!)
- (void)checkLicense:(CDVInvokedUrlCommand *)command {
    __weak __block __typeof(self) weakSelf = self;
    [self.commandDelegate runInBackground:^{
        ALWrapperSessionSDKInitializationResponse *currentSdkInitializationResponse = [ALWrapperSessionProvider getCurrentSdkInitializationResponse];
        if ([currentSdkInitializationResponse.initialized isEqualToNumber:@YES]) {
            ALWrapperSessionSDKInitializationResponseInitialized *sdkInitializationResponseInitialized = currentSdkInitializationResponse.succeedInfo;
            if (sdkInitializationResponseInitialized) {
                CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                                  messageAsString:sdkInitializationResponseInitialized.expiryDate];
                [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                return;
            }
        }
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                          messageAsString:nil];
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
    self.wrapperSessionExportCachedEventsResponseCommand = command;
    [self.commandDelegate runInBackground:^{
        [ALWrapperSessionProvider requestExportCachedEvents];
    }];
}

- (void)setDefaultScanStartPlatformOptions:(CDVInvokedUrlCommand *)command {
    __weak __block __typeof(self) weakSelf = self;
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *pluginResult;
        @try {
            NSString *scanStartPlatformOptionsString = nil;
            if (command.arguments.count > 0 && [command.arguments objectAtIndex:0] != [NSNull null]) {
                scanStartPlatformOptionsString = (NSString *)command.arguments[0];
            }
            [ALWrapperSessionProvider setDefaultScanStartPlatformOptionsWithString:scanStartPlatformOptionsString];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
        }
        @catch (NSException *exception) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                             messageAsString:exception.reason];
        }
        [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)setupWrapperSession:(CDVInvokedUrlCommand *)command {
    __weak __block __typeof(self) weakSelf = self;
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *pluginResult;
        if (command.arguments.count < 1) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Plugin version not given."];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            return;
        }
        _pluginVersion = (NSString *)(command.arguments[0]);
        // Setup wrapper session with this view controller as delegate
        ALWrapperConfig *wrapperConfig = [ALWrapperConfig cordova:_pluginVersion];
        [ALWrapperSessionProvider setupWrapperSessionWithWrapperInfo:wrapperConfig
                                                wrapperSessionClient:self];

        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)getPluginVersion:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                      messageAsString:_pluginVersion];
    __weak __block __typeof(self) weakSelf = self;
    [self.commandDelegate runInBackground:^{
        [weakSelf.commandDelegate sendPluginResult:pluginResult
                                        callbackId:command.callbackId];
    }];
}

- (void)initAnylineSDK:(CDVInvokedUrlCommand *)command {
    self.wrapperSessionSdkInitializationResponseCommand = command;

    NSString *licenseKey = (NSString *)command.arguments[0];

    BOOL enableOfflineCache = NO;
    if (command.arguments.count > 1) {
        id offlineLicenseCacheEnabled = command.arguments[1];
        if (offlineLicenseCacheEnabled != [NSNull null]) {
            enableOfflineCache = [offlineLicenseCacheEnabled boolValue];
        }
    }
    [self.commandDelegate runInBackground:^{
        [self initSdkWithLicenseKey:licenseKey sdkAssetsFolder:nil enableOfflineCache:enableOfflineCache];
    }];
}

- (void)requestScanStartWithScanViewConfigContent:(NSString *)scanViewConfigContent
           scanViewInitializationParametersString:(NSString * _Nullable)scanViewInitializationParametersString
                               scanViewConfigPath:(NSString * _Nullable)scanViewConfigPath
                         scanCallbackConfigString:(NSString * _Nullable)scanCallbackConfigString {
    NSError *error;
    BOOL shouldReturnImages = true;

    ALWrapperSessionScanStartRequest *wrapperSessionScanStartRequest = [ALLegacyPluginHelper
                                        scanStartRequestWithScanViewConfigContentString:scanViewConfigContent
                                                 scanViewInitializationParametersString:scanViewInitializationParametersString
                                                                     scanViewConfigPath:[self bundlePathFromScanViewConfigPath:scanViewConfigPath]
                                                         scanResultCallbackConfigString:scanCallbackConfigString
                                                                     shouldReturnImages:shouldReturnImages
                                                                                  error:&error];
    if (error) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                          messageAsString:error.localizedDescription];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.wrapperSessionScanResponseCommand.callbackId];
    } else {
        NSDictionary *wrapperSessionScanStartRequestDict = [wrapperSessionScanStartRequest toJSONDictionary];
        [ALWrapperSessionProvider requestScanStartWithScanStartRequestParamsString:[wrapperSessionScanStartRequestDict asJSONString]];
    }
}

- (void)tryStopScan:(CDVInvokedUrlCommand *)command {
    NSString *scanStopRequestParamsStr;
    if (command.arguments.count > 0 && [command.arguments objectAtIndex:0] != [NSNull null]) {
        NSDictionary *scanStopRequestParamsDict = [command.arguments objectAtIndex:0];
        scanStopRequestParamsStr = [self stringForDictionary:scanStopRequestParamsDict];
    } else {
        scanStopRequestParamsStr = nil;
    }
    [ALWrapperSessionProvider requestScanStopWithScanStopRequestParamsString:scanStopRequestParamsStr];
}

// MARK: - Utility Method

- (NSString * _Nullable)stringForDictionary:(NSDictionary *)dict {
    NSError * err;
    NSData * jsonData = [NSJSONSerialization dataWithJSONObject:dict options:0 error:&err];
    if(jsonData != nil){
        return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
    else{
        return @"";
    }
}

- (void)initSdkWithLicenseKey:(NSString *)sdkLicenseKey
              sdkAssetsFolder: (NSString *)sdkAssetsFolder
           enableOfflineCache: (BOOL)enableOfflineCache {
    NSDictionary *wrapperSessionSdkInitializationRequestJson = [ALLegacyPluginHelper
            sdkInitializationRequestJsonWithLicenseKey:sdkLicenseKey
                                    enableOfflineCache:enableOfflineCache
                                       assetPathPrefix:sdkAssetsFolder];

    [ALWrapperSessionProvider
            requestSdkInitializationWithInitializationRequestParamsString:[wrapperSessionSdkInitializationRequestJson asJSONString]];
}

- (void)requestUCRReportWithBlobKey:(NSString *)blobKey
                    correctedResult:(NSString *)correctedResult {

    ALWrapperSessionUCRReportRequest *wrapperSessionSdkInitializationRequest = [ALLegacyPluginHelper ucrReportRequestWithBlobKey:blobKey
                                                                                  correctedResult:correctedResult];
    [ALWrapperSessionProvider requestUCRReport:wrapperSessionSdkInitializationRequest];
}

#pragma mark - ALWrapperSessionClientDelegate

- (nullable UIViewController *)getTopViewController {
    return nil;
}

- (nullable UIView *)getContainerView {
    return nil;
}

- (void)onSdkInitializationResponse:(nonnull ALWrapperSessionSDKInitializationResponse *)initializationResponse {
    CDVPluginResult *pluginResult;
    if ([initializationResponse.initialized isEqualToNumber:@YES]) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.wrapperSessionSdkInitializationResponseCommand.callbackId];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                         messageAsString:[[initializationResponse toJSONDictionary] asJSONString]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.wrapperSessionSdkInitializationResponseCommand.callbackId];
    }
}

- (void)onScanResults:(nonnull ALWrapperSessionScanResultsResponse *)scanResultsResponse {
    ALWrapperSessionScanResultConfig *scanResultConfig = scanResultsResponse.scanResultConfig;
    NSArray<ALExportedScanResult *> *exportedScanResultsArray =
            (NSArray<ALExportedScanResult *> * _Nonnull) scanResultsResponse.exportedScanResults;
    ALWrapperSessionScanResultExtraInfo *scanResultExtraInfo =
            (ALWrapperSessionScanResultExtraInfo * _Nonnull) scanResultsResponse.scanResultExtraInfo;
    ALViewPluginType *viewPluginType = (ALViewPluginType * _Nonnull) scanResultExtraInfo.viewPluginType;

    NSError *error;
    NSString *resultsWithImagePathString = [ALLegacyPluginHelper scanResultsWithImagePathFromExportedScanResults:exportedScanResultsArray
                                                                                                          viewPluginType:viewPluginType
                                                                                                                   error:&error];

    if (!error) {
        if (scanResultConfig.callbackConfig && scanResultConfig.callbackConfig.onResultEventName) {
            [self sendEvent:scanResultConfig.callbackConfig.onResultEventName params:resultsWithImagePathString];
        } else {
            NSData *jsonData = [resultsWithImagePathString dataUsingEncoding:NSUTF8StringEncoding];
            NSDictionary *jsonDict;
            if (viewPluginType == ALViewPluginType.viewPluginComposite) {
                NSArray *jsonResultArray = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&error];
                jsonDict = (NSDictionary *)jsonResultArray;
            } else {
                jsonDict = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&error];
            }
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                          messageAsDictionary:jsonDict];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:self.wrapperSessionScanResponseCommand.callbackId];
        }
    }
}

- (void)onScanResponse:(nonnull ALWrapperSessionScanResponse *)scanResponse {
    CDVPluginResult *pluginResult;

    if (scanResponse.status == ALWrapperSessionScanResponseStatus.scanSucceeded) {
        ALWrapperSessionScanResultConfig *scanResultConfig = scanResponse.scanResultConfig;
        if (scanResultConfig.callbackConfig && scanResultConfig.callbackConfig.onResultEventName) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                              messageAsString:@""];
        } else {
            //already delivered inside onScanResults
            return;
        }
    } else if (scanResponse.status == ALWrapperSessionScanResponseStatus.scanFailed) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                          messageAsString:scanResponse.failInfo.lastError];
    } else if (scanResponse.status == ALWrapperSessionScanResponseStatus.scanAborted) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                          messageAsString:@"Canceled"];
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.wrapperSessionScanResponseCommand.callbackId];
}

- (void)onUIElementClicked:(nonnull ALWrapperSessionScanResultConfig *)scanResultConfig
        uiFeedbackElementConfig:(nonnull ALUIFeedbackElementConfig *)uiFeedbackElementConfig {
    if (scanResultConfig.callbackConfig && scanResultConfig.callbackConfig.onUIElementClickedEventName) {
        [self sendEvent:scanResultConfig.callbackConfig.onUIElementClickedEventName
                 params:uiFeedbackElementConfig];
    }
}

- (void)onUCRReportResponse:(nonnull ALWrapperSessionUCRReportResponse *)ucrReportResponse {
    CDVPluginResult *pluginResult;
    if (ucrReportResponse.status == ALWrapperSessionUCRReportResponseStatus.ucrReportSucceeded) {
        ALWrapperSessionUCRReportResponseSucceed *ucrReportSucceed = ucrReportResponse.succeedInfo;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                         messageAsString:ucrReportSucceed.message];
    } else {
        ALWrapperSessionUCRReportResponseFail *ucrReportFail = ucrReportResponse.failInfo;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                         messageAsString:ucrReportFail.lastError];
    }
    if (self.wrapperSessionReportCorrectedResultResponseCommand) {
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.wrapperSessionReportCorrectedResultResponseCommand.callbackId];
    }
}

- (void)onExportCachedEventsResponse:(nonnull ALWrapperSessionExportCachedEventsResponse *)exportCachedEventsResponse {
    CDVPluginResult *pluginResult;
    if (exportCachedEventsResponse.status == ALWrapperSessionExportCachedEventsResponseStatus.exportSucceeded) {
        ALWrapperSessionExportCachedEventsResponseSucceed *exportCachedEventsSucceed = exportCachedEventsResponse.succeedInfo;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                         messageAsString:exportCachedEventsSucceed.exportedFile];
    } else {
        ALWrapperSessionExportCachedEventsResponseFail *exportCachedEventsFail = exportCachedEventsResponse.failInfo;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                         messageAsString:exportCachedEventsFail.lastError];
    }
    if (self.wrapperSessionExportCachedEventsResponseCommand) {
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.wrapperSessionExportCachedEventsResponseCommand.callbackId];
    }
}

@end

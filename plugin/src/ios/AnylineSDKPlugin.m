
#import "AnylineSDKPlugin.h"
#import <Anyline/Anyline.h>
#import "ALCordovaUIConfiguration.h"
#import "ALPluginScanViewController.h"
#import "ALNFCScanViewController.h"


@interface AnylineSDKPlugin()<ALPluginScanViewControllerDelegate>

@property (nonatomic, strong) UIViewController *baseScanViewController;
@property (nonatomic, strong) ALScanViewPluginConfig *conf;

@property (nonatomic, strong) NSString *callbackId;
@property (nonatomic, strong) NSString *licensekey;

@property (nonatomic, strong) ALCordovaUIConfiguration *cordovaUIConf;
@property (nonatomic, strong) NSDictionary *anyline4Config;

@end


@implementation AnylineSDKPlugin

- (void)scan:(CDVInvokedUrlCommand *)command {
    [self processCommandArgumentsAnyline4:command];
    
    NSString *customCmdFile = [self.anyline4Config valueForKeyPath:@"viewPlugin.plugin.nfcPlugin"];
    
    [self.commandDelegate runInBackground:^{
        ALPluginScanViewController *pluginScanViewController;
        if (customCmdFile) {
            if (@available(iOS 13.0, *)) {
                if ([ALNFCDetector readingAvailable]) {
                    ALNFCScanViewController *nfcScanViewController = [[ALNFCScanViewController alloc] initWithLicensekey:self.licensekey
                                                                                                           configuration:self.anyline4Config
                                                                                                    cordovaConfiguration:self.cordovaUIConf
                                                                                                                delegate:self];
                    
                    if([self.anyline4Config valueForKey:@"quality"]){
                        nfcScanViewController.quality = [[self.anyline4Config valueForKey:@"quality"] integerValue];
                    }
                    
                    if([self.anyline4Config valueForKey:@"cropAndTransformErrorMessage"]){
                        NSString *str = [self.anyline4Config objectForKey:@"cropAndTransformErrorMessage"];
                        nfcScanViewController.cropAndTransformErrorMessage = str;
                    }
                    
                    if ([self.anyline4Config valueForKey:@"nativeBarcodeEnabled"]) {
                        nfcScanViewController.nativeBarcodeEnabled = [[self.anyline4Config objectForKey:@"nativeBarcodeEnabled"] boolValue];
                    }
                    
                    self.baseScanViewController = nfcScanViewController;
                    
                    [self presentViewController];
                } else {
                    [self handleDidStopScanning:@"NFC passport reading is not supported on this device or app."];
                }
            } else {
                [self handleDidStopScanning:@"NFC passport reading is only supported on iOS 13 and later."];
            }
        } else {
            pluginScanViewController = [[ALPluginScanViewController alloc] initWithLicensekey:self.licensekey
                                                     configuration:self.anyline4Config
                                              cordovaConfiguration:self.cordovaUIConf
                                                          delegate:self];
            if([self.anyline4Config valueForKey:@"quality"]){
                pluginScanViewController.quality = [[self.anyline4Config valueForKey:@"quality"] integerValue];
            }
            
            if([self.anyline4Config valueForKey:@"cropAndTransformErrorMessage"]){
                NSString *str = [self.anyline4Config objectForKey:@"cropAndTransformErrorMessage"];
                pluginScanViewController.cropAndTransformErrorMessage = str;
            }
            
            if ([self.anyline4Config valueForKey:@"nativeBarcodeEnabled"]) {
                pluginScanViewController.nativeBarcodeEnabled = [[self.anyline4Config objectForKey:@"nativeBarcodeEnabled"] boolValue];
            }
            
            if ([self.anyline4Config valueForKey:@"nativeBarcodeEnabled"]) {
                
            }
            
            self.baseScanViewController = pluginScanViewController;
            
            [self presentViewController];
        }
    }];
}

- (void)CHECK_LICENSE:(CDVInvokedUrlCommand *)command {
//    NSError *error = nil;
    CDVPluginResult *pluginResult;

    NSString *license = [command.arguments objectAtIndex:0];
    NSString *licenseExpDate = [ALCoreController licenseExpirationDateForLicense:license error:nil];
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:licenseExpDate];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)GET_SDK_VERSION:(CDVInvokedUrlCommand *)command {
    
    CDVPluginResult *pluginResult;
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:ALCoreController.versionNumber];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)processCommandArguments:(CDVInvokedUrlCommand *)command {
    self.callbackId = command.callbackId;
    self.licensekey = [command.arguments objectAtIndex:0];

    NSDictionary *options = [command.arguments objectAtIndex:1];
    self.conf = [[ALScanViewPluginConfig alloc] initWithDictionary:options];
    
    self.cordovaUIConf = [[ALCordovaUIConfiguration alloc] initWithDictionary:options];
}

- (void)processCommandArgumentsAnyline4:(CDVInvokedUrlCommand *)command {
    self.callbackId = command.callbackId;
    self.licensekey = [command.arguments objectAtIndex:0];
    
    self.anyline4Config = [command.arguments objectAtIndex:1];
    
    self.cordovaUIConf = [[ALCordovaUIConfiguration alloc] initWithDictionary:self.anyline4Config];
}

- (void)presentViewController {
    dispatch_async(dispatch_get_main_queue(), ^{
        self.viewController.modalPresentationStyle = UIModalPresentationFullScreen;
        self.baseScanViewController.modalPresentationStyle = UIModalPresentationFullScreen;
        if ([self.viewController respondsToSelector:@selector(presentViewController:animated:completion:)]) {
            [self.viewController presentViewController:self.baseScanViewController animated:NO completion:NULL];
        } else {
            // ignore warning
            [self.viewController presentModalViewController:self.baseScanViewController animated:NO];
        }
    });
}

#pragma mark - ALPluginScanViewControllerDelegate

- (void)pluginScanViewController:(nonnull ALPluginScanViewController *)pluginScanViewController
                         didScan:(nonnull id)scanResult
                continueScanning:(BOOL)continueScanning {
    [self handleDidScanWithResult:scanResult continueScanning:continueScanning];
}

- (void)pluginScanViewController:(nonnull ALPluginScanViewController *)pluginScanViewController
                 didStopScanning:(nonnull id)sender {
    [self handleDidStopScanning];
}

- (void)handleDidScanWithResult:(id)scanResult
               continueScanning:(BOOL)continueScanning {
    CDVPluginResult *pluginResult;
    if ([scanResult isKindOfClass:[NSString class]]) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:scanResult];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:scanResult];
    }
    if (continueScanning) {
        [pluginResult setKeepCallback:@YES];
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
}

- (void)handleDidStopScanning {
    CDVPluginResult *pluginResult;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Canceled"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
}

- (void)handleDidStopScanning:(NSString *)errorMessage {
    CDVPluginResult *pluginResult;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMessage];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
}

@end

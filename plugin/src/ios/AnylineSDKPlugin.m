
#import "AnylineSDKPlugin.h"
#import <Anyline/Anyline.h>
#import "AnylineBarcodeScanViewController.h"
#import "AnylineEnergyScanViewController.h"
#import "AnylineMRZScanViewController.h"
#import "AnylineOCRScanViewController.h"
#import "AnylineDocumentScanViewController.h"
#import "AnylineLicensePlateViewController.h"
#import "ALCordovaUIConfiguration.h"
#import "ALPluginScanViewController.h"


@interface AnylineSDKPlugin()<AnylineBaseScanViewControllerDelegate,ALPluginScanViewControllerDelegate>

@property (nonatomic, strong) UIViewController *baseScanViewController;
@property (nonatomic, strong) ALUIConfiguration *conf;

@property (nonatomic, strong) NSString *callbackId;
@property (nonatomic, strong) NSString *licensekey;

@property (nonatomic, strong) ALCordovaUIConfiguration *cordovaUIConf;
@property (nonatomic, strong) NSDictionary *anyline4Config;

@end


@implementation AnylineSDKPlugin


- (void)AUTO_ANALOG_DIGITAL_METER:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALAutoAnalogDigitalMeter];
}

- (void)DIAL_METER:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALDialMeter];
}

- (void)ANALOG_METER:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALAnalogMeter];
}

- (void)ELECTRIC_METER:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALAnalogMeter];
}

- (void)GAS_METER:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALAnalogMeter];
}

- (void)WATER_METER_WHITE:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALAnalogMeter];
}

- (void)WATER_METER_BLACK:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALAnalogMeter];
}

- (void)ELECTRIC_METER_5_1:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALAnalogMeter];
}

- (void)ELECTRIC_METER_6_1:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALAnalogMeter];
}

- (void)GAS_METER_6:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALAnalogMeter];
}

- (void)ANALOG_METER_WHITE:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALAnalogMeter];
}

- (void)ANALOG_METER_4:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALAnalogMeter];
}

- (void)ANALOG_METER_7:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALAnalogMeter];
}

- (void)HEAT_METER_4:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALHeatMeter4];
}

- (void)HEAT_METER_5:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALHeatMeter5];
}

- (void)HEAT_METER_6:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALHeatMeter6];
}

- (void)DIGITAL_METER:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALDigitalMeter];
}

- (void)SERIAL_NUMBER:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALSerialNumber];
}

- (void)DOT_MATRIX_METER:(CDVInvokedUrlCommand *)command {
    [self processMeterCommand:command withScanMode:ALDotMatrixMeter];
}

- (void)MRZ:(CDVInvokedUrlCommand *)command {
    [self processCommandArguments:command];

    [self.commandDelegate runInBackground:^{
        AnylineMRZScanViewController *mrzVC = [[AnylineMRZScanViewController alloc] initWithKey:self.licensekey configuration:self.conf cordovaConfiguration:self.cordovaUIConf  delegate:self];

        NSDictionary *options = [command.arguments objectAtIndex:1];
        if ([options valueForKey:@"mrz"]) {
            NSDictionary *mrzConfig = [options valueForKey:@"mrz"];

            // Check for Strict Mode and set it
            if([mrzConfig valueForKey:@"strictMode"]){
                mrzVC.strictMode = [[mrzConfig valueForKey:@"strictMode"] boolValue];
            } else {
                mrzVC.strictMode = false;
            }

            // Check for cropAndTransformID Config and set it
            if([mrzConfig valueForKey:@"cropAndTransformID"]){
                mrzVC.cropAndTransformID = [[mrzConfig valueForKey:@"cropAndTransformID"] boolValue];
            } else {
                mrzVC.cropAndTransformID = false;
            }
            
            // Check for showPointsOutOfCutoutError Config and set it
            if([mrzConfig valueForKey:@"cropAndTransformErrorMessage"]){
                NSString *str = [mrzConfig objectForKey:@"cropAndTransformErrorMessage"];
                mrzVC.cropAndTransformErrorMessage = str;
            } else {
                mrzVC.cropAndTransformErrorMessage = @"";
            }
        }

        self.baseScanViewController = mrzVC;

        [self presentViewController];
    }];
}

- (void)BARCODE:(CDVInvokedUrlCommand *)command {
    [self processCommandArguments:command];

    [self.commandDelegate runInBackground:^{
        self.baseScanViewController = [[AnylineBarcodeScanViewController alloc] initWithKey:self.licensekey configuration:self.conf cordovaConfiguration:self.cordovaUIConf delegate:self];

        [self presentViewController];
    }];
}

- (void)ANYLINE_OCR:(CDVInvokedUrlCommand *)command {
    [self processCommandArguments:command];

    [self.commandDelegate runInBackground:^{
        AnylineOCRScanViewController *ocrScanViewController = [[AnylineOCRScanViewController alloc] initWithKey:self.licensekey configuration:self.conf cordovaConfiguration:self.cordovaUIConf delegate:self];

        ocrScanViewController.ocrConfDict = [command.arguments objectAtIndex:2];

        self.baseScanViewController = ocrScanViewController;

        [self presentViewController];
    }];
}

- (void)scan:(CDVInvokedUrlCommand *)command {
    [self processCommandArgumentsAnyline4:command];
    
    [self.commandDelegate runInBackground:^{
        ALPluginScanViewController *pluginScanViewController =
        [[ALPluginScanViewController alloc] initWithLicensekey:self.licensekey
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
        
        self.baseScanViewController = pluginScanViewController;
        
        [self presentViewController];
    }];
}

- (void)DOCUMENT:(CDVInvokedUrlCommand *)command {
    [self processCommandArguments:command];

    [self.commandDelegate runInBackground:^{
        AnylineDocumentScanViewController *docScanViewController = [[AnylineDocumentScanViewController alloc] initWithKey:self.licensekey configuration:self.conf cordovaConfiguration:self.cordovaUIConf delegate:self];

        NSDictionary *options = [command.arguments objectAtIndex:1];
        if ([options valueForKey:@"document"]) {
            NSDictionary *docConfig = [options valueForKey:@"document"];

            // Check for Document quality Config and set it
            if([docConfig valueForKey:@"quality"]){
                docScanViewController.quality = [[docConfig valueForKey:@"quality"] integerValue];
            } else {
                docScanViewController.quality = 100;
            }

            // Check for Document PostProcessing and set it
            if([docConfig valueForKey:@"postProcessing"]){
                docScanViewController.postProcessing = [[docConfig valueForKey:@"postProcessing"] boolValue];
            } else {
                docScanViewController.postProcessing = true;
            }

            // Check for Document Max Output Config and set it
            if([docConfig valueForKey:@"maxOutputResoultion"]){
                NSDictionary *maxOutputResoultionConfig = [docConfig valueForKey:@"maxOutputResoultion"];
                if([maxOutputResoultionConfig valueForKey:@"width"] && [maxOutputResoultionConfig valueForKey:@"height"]){
                    docScanViewController.maxOutputResolution = CGSizeMake([[maxOutputResoultionConfig valueForKey:@"width"] doubleValue], [[maxOutputResoultionConfig valueForKey:@"height"] doubleValue]);
                }
            }

            // Check for Document Ratio Config and set it
            if([docConfig valueForKey:@"ratio"]){
                NSDictionary *ratioConfig = [docConfig valueForKey:@"ratio"];
                if([ratioConfig valueForKey:@"ratios"]){
                    docScanViewController.ratios = [ratioConfig valueForKey:@"ratios"];
                }
                if([ratioConfig valueForKey:@"deviation"]){
                    docScanViewController.ratioDeviation = [[ratioConfig valueForKey:@"deviation"] doubleValue];
                }
            }
        }

        self.baseScanViewController = docScanViewController;

        [self presentViewController];
    }];
}


- (void)LICENSE_PLATE:(CDVInvokedUrlCommand *)command {
    [self processCommandArguments:command];

    [self.commandDelegate runInBackground:^{
        AnylineLicensePlateViewController *licensePlateViewController = [[AnylineLicensePlateViewController alloc] initWithKey:self.licensekey configuration:self.conf cordovaConfiguration:self.cordovaUIConf delegate:self];

        self.baseScanViewController = licensePlateViewController;

        [self presentViewController];
    }];
}


- (void)CHECK_LICENSE:(CDVInvokedUrlCommand *)command {
    NSError *error = nil;
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

- (void)scanBarcode:(CDVInvokedUrlCommand *)command {
    [self BARCODE:command];
}

- (void)processMeterCommand:(CDVInvokedUrlCommand *)command withScanMode:(ALScanMode)scanMode {
    [self processCommandArguments:command];

    BOOL nativeBarcodeScanning = NO;

    if (command.arguments.count == 3) {
        nativeBarcodeScanning = [[command.arguments[2] objectForKey:@"nativeBarcodeEnabled"] boolValue];
    }

    [self.commandDelegate runInBackground:^{
        AnylineEnergyScanViewController *energyScanViewController = [[AnylineEnergyScanViewController alloc] initWithKey:self.licensekey configuration:self.conf cordovaConfiguration:self.cordovaUIConf delegate:self];


        // Set SerialNumber Configuration
        NSDictionary *options = [command.arguments objectAtIndex:1];
        if ([options valueForKey:@"serialNumber"]) {
            NSDictionary *serNumConf = [options valueForKey:@"serialNumber"];

            // Check for Serial Number Whitelist and set it
            if([serNumConf valueForKey:@"numberCharWhitelist"]){
                energyScanViewController.serialWhitelist = [serNumConf objectForKey:@"numberCharWhitelist"];
            }

            // Check for Serial Number ValidationRegex and set it
            if([serNumConf valueForKey:@"validationRegex"]){
                energyScanViewController.serialValRegex = [serNumConf objectForKey:@"validationRegex"];
            }
        }


        energyScanViewController.scanMode = scanMode;
        energyScanViewController.nativeBarcodeEnabled = nativeBarcodeScanning;

        self.baseScanViewController = energyScanViewController;

        [self presentViewController];
    }];
}

- (void)processCommandArguments:(CDVInvokedUrlCommand *)command {
    self.callbackId = command.callbackId;
    self.licensekey = [command.arguments objectAtIndex:0];

    NSDictionary *options = [command.arguments objectAtIndex:1];
    self.conf = [[ALUIConfiguration alloc] initWithDictionary:options];
    
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
        if ([self.viewController respondsToSelector:@selector(presentViewController:animated:completion:)]) {
            [self.viewController presentViewController:self.baseScanViewController animated:YES completion:NULL];
        } else {
            // ignore warning
            [self.viewController presentModalViewController:self.baseScanViewController animated:NO];
        }
    });
}

#pragma mark - AnylineBaseScanViewControllerDelegate

- (void)anylineBaseScanViewController:(AnylineBaseScanViewController *)baseScanViewController
                              didScan:(id)scanResult
                     continueScanning:(BOOL)continueScanning {
    [self handleDidScanWithResult:scanResult continueScanning:continueScanning];
}

-(void)anylineBaseScanViewController:(AnylineBaseScanViewController *)baseScanViewController didStopScanning:(id)sender {
    [self handleDidStopScanning];
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

@end

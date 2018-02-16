
#import "AnylineSDKPlugin.h"
#import <Anyline/Anyline.h>
#import "AnylineBarcodeScanViewController.h"
#import "AnylineEnergyScanViewController.h"
#import "AnylineMRZScanViewController.h"
#import "AnylineOCRScanViewController.h"
#import "AnylineDocumentScanViewController.h"
#import "AnylineLicensePlateViewController.h"
#import "ALCordovaUIConfiguration.h"


@interface AnylineSDKPlugin()<AnylineBaseScanViewControllerDelegate>

@property (nonatomic, strong) AnylineBaseScanViewController *baseScanViewController;
@property (nonatomic, strong) ALUIConfiguration *conf;

@property (nonatomic, strong) NSString *callbackId;
@property (nonatomic, strong) NSString *appKey;

@property (nonatomic, strong) ALCordovaUIConfiguration *cordovaUIConf;

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
        self.baseScanViewController = [[AnylineMRZScanViewController alloc] initWithKey:self.appKey configuration:self.conf cordovaConfiguration:self.cordovaUIConf  delegate:self];

        [self presentViewController];
    }];
}

- (void)BARCODE:(CDVInvokedUrlCommand *)command {
    [self processCommandArguments:command];

    [self.commandDelegate runInBackground:^{
        self.baseScanViewController = [[AnylineBarcodeScanViewController alloc] initWithKey:self.appKey configuration:self.conf cordovaConfiguration:self.cordovaUIConf delegate:self];

        [self presentViewController];
    }];
}

- (void)ANYLINE_OCR:(CDVInvokedUrlCommand *)command {
    [self processCommandArguments:command];

    [self.commandDelegate runInBackground:^{
        AnylineOCRScanViewController *ocrScanViewController = [[AnylineOCRScanViewController alloc] initWithKey:self.appKey configuration:self.conf cordovaConfiguration:self.cordovaUIConf delegate:self];

        ocrScanViewController.ocrConfDict = [command.arguments objectAtIndex:2];

        self.baseScanViewController = ocrScanViewController;

        [self presentViewController];
    }];
}

- (void)DOCUMENT:(CDVInvokedUrlCommand *)command {
    [self processCommandArguments:command];

    [self.commandDelegate runInBackground:^{
        AnylineDocumentScanViewController *docScanViewController = [[AnylineDocumentScanViewController alloc] initWithKey:self.appKey configuration:self.conf cordovaConfiguration:self.cordovaUIConf delegate:self];

        NSDictionary *options = [command.arguments objectAtIndex:1];
        if ([options valueForKey:@"document"]) {
            NSDictionary *docConfig = [options valueForKey:@"document"];

            // Check for Document quality Config and set it
            if([docConfig valueForKey:@"quality"]){
                docScanViewController.quality = [[docConfig valueForKey:@"quality"] integerValue];
            } else {
                docScanViewController.quality = 100;
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
        AnylineLicensePlateViewController *licensePlateViewController = [[AnylineLicensePlateViewController alloc] initWithKey:self.appKey configuration:self.conf cordovaConfiguration:self.cordovaUIConf delegate:self];

        self.baseScanViewController = licensePlateViewController;

        [self presentViewController];
    }];
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
        AnylineEnergyScanViewController *energyScanViewController = [[AnylineEnergyScanViewController alloc] initWithKey:self.appKey configuration:self.conf cordovaConfiguration:self.cordovaUIConf delegate:self];


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
    self.appKey = [command.arguments objectAtIndex:0];
    
    NSDictionary *options = [command.arguments objectAtIndex:1];
    self.conf = [[ALUIConfiguration alloc] initWithDictionary:options bundlePath:nil];
    
    self.cordovaUIConf = [[ALCordovaUIConfiguration alloc] initWithDictionary:options];
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

- (void)anylineBaseScanViewController:(AnylineBaseScanViewController *)baseScanViewController didScan:(id)scanResult continueScanning:(BOOL)continueScanning {
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


-(void)anylineBaseScanViewController:(AnylineBaseScanViewController *)baseScanViewController didStopScanning:(id)sender {
    CDVPluginResult *pluginResult;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Canceled"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
}

@end

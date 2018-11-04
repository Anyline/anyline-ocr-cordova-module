
#import "AnylineEnergyScanViewController.h"
#import <Anyline/Anyline.h>

@interface AnylineEnergyScanViewController ()<AnylineEnergyModuleDelegate,AnylineNativeBarcodeDelegate>

@property (nonatomic, strong) UISegmentedControl *segment;

@property (nonatomic, strong) NSMutableArray<NSDictionary *> *detectedBarcodes;

@end

@implementation AnylineEnergyScanViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    dispatch_async(dispatch_get_main_queue(), ^{
        AnylineEnergyModuleView *energyModuleView = [[AnylineEnergyModuleView alloc] initWithFrame:self.view.bounds];
        
        NSError *error = nil;
        [energyModuleView setupWithLicenseKey:self.key delegate:self error:&error];

        [energyModuleView setScanMode:self.scanMode error:nil];

        if (self.nativeBarcodeEnabled) {
            [energyModuleView.captureDeviceManager addBarcodeDelegate:self];
        }

        // Set Serial Number specific configurations
        // Set Validation Regex
        if (self.serialValRegex) {
            NSLog(@"ValidationRegex %@", self.serialValRegex);
            energyModuleView.serialNumberValidationRegex = self.serialValRegex;
        }
        // Set Whitelist
        if (self.serialWhitelist) {
            NSLog(@"Whitelist %@", self.serialWhitelist);
            energyModuleView.serialNumberCharWhitelist = self.serialWhitelist;
        }

        energyModuleView.currentConfiguration = self.conf;
        self.moduleView = energyModuleView;

        [self.view addSubview:self.moduleView];
        [self.view sendSubviewToBack:self.moduleView];

        if(self.cordovaConfig.segmentModes){

            self.segment = [ALPluginHelper createSegmentForViewController:self
                                                                   config:self.cordovaConfig
                                                                 scanMode:self.scanMode];
        }

        self.detectedBarcodes = [NSMutableArray array];

    });
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];

    if(self.cordovaConfig.segmentModes){
        self.segment.frame = CGRectMake(self.moduleView.cutoutRect.origin.x + self.cordovaConfig.segmentXPositionOffset/2,
                                        self.moduleView.cutoutRect.origin.y + self.cordovaConfig.segmentYPositionOffset/2,
                                        self.view.frame.size.width - 2*(self.moduleView.cutoutRect.origin.x + self.cordovaConfig.segmentXPositionOffset/2),
                                        self.segment.frame.size.height);
        self.segment.hidden = NO;
    }

}

#pragma mark - AnylineEnergyModuleDelegate method

- (void)anylineEnergyModuleView:(AnylineEnergyModuleView *)anylineEnergyModuleView didFindResult:(ALEnergyResult *)scanResult {
    /*
     To present the scanned result to the user we use a custom view controller.
     */
    self.scannedLabel.text = (NSString *)scanResult.result;

    NSDictionary *dictResult = [ALPluginHelper dictionaryForMeterResult:scanResult
                                                       detectedBarcodes:self.detectedBarcodes
                                                                outline:anylineEnergyModuleView.meterScanViewPlugin.outline
                                                                quality:100];

    [self.delegate anylineBaseScanViewController:self
                                         didScan:dictResult
                                continueScanning:!self.moduleView.cancelOnResult];

    if (self.moduleView.cancelOnResult) {
        [self dismissViewControllerAnimated:YES completion:NULL];
    }
    self.detectedBarcodes = [NSMutableArray array];
}

#pragma mark - AnylineNativeBarcodeDelegate

- (void)anylineCaptureDeviceManager:(ALCaptureDeviceManager *)captureDeviceManager
               didFindBarcodeResult:(NSString *)scanResult
                               type:(NSString *)barcodeType {
    [self.detectedBarcodes addObject:[ALPluginHelper dictionaryForBarcodeResults:self.detectedBarcodes
                                                                     barcodeType:barcodeType
                                                                      scanResult:scanResult]];
}

#pragma mark - IBActions

- (IBAction)segmentChange:(id)sender {
    NSString *modeString = self.cordovaConfig.segmentModes[((UISegmentedControl *)sender).selectedSegmentIndex];
    ALScanMode scanMode = [ALPluginHelper scanModeFromString:modeString];

    [(AnylineEnergyModuleView *)self.moduleView setScanMode:scanMode error:nil];
    self.moduleView.currentConfiguration = self.conf;
}

@end

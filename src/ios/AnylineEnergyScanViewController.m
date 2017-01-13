
#import "AnylineEnergyScanViewController.h"
#import <Anyline/Anyline.h>

@interface AnylineEnergyScanViewController ()<AnylineEnergyModuleDelegate,AnylineNativeBarcodeDelegate>

@property (nonatomic, strong) UISegmentedControl *segment;

@property (nonatomic, strong) NSMutableArray<NSMutableDictionary *> *detectedBarcodes;

@end

@implementation AnylineEnergyScanViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    dispatch_async(dispatch_get_main_queue(), ^{
        AnylineEnergyModuleView *energyModuleView = [[AnylineEnergyModuleView alloc] initWithFrame:self.view.bounds];
        
        NSError *error = nil;
        [energyModuleView setupWithLicenseKey:self.key delegate:self error:&error];
//        if(!success) {
//            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Setup failed:" message:error.debugDescription delegate:self cancelButtonTitle:@"Ok" otherButtonTitles:nil];
//            [alert show];
//        }
        
        energyModuleView.scanMode = self.scanMode;
        energyModuleView.currentConfiguration = self.conf;
        
        if (self.nativeBarcodeEnabled) {
            energyModuleView.videoView.barcodeDelegate = self;
        }
        
        self.moduleView = energyModuleView;
        
        [self.view addSubview:self.moduleView];
        
        [self.view sendSubviewToBack:self.moduleView];
        
        self.segment = [[UISegmentedControl alloc] initWithItems:self.cordovaConfig.segmentTitles];
        
        self.segment.tintColor = self.cordovaConfig.segmentTintColor;
        self.segment.hidden = YES;
        
        NSInteger index = [self.cordovaConfig.segmentModes indexOfObject:[self stringFromScanMode:self.scanMode]];
        [self.segment setSelectedSegmentIndex:index];
        
        [self.segment addTarget:self action:@selector(segmentChange:) forControlEvents:UIControlEventValueChanged];
        
        [self.view addSubview:self.segment];
        
        self.detectedBarcodes = [NSMutableArray array];
    });
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
    self.segment.frame = CGRectMake(self.moduleView.cutoutRect.origin.x + self.cordovaConfig.segmentXPositionOffset/2,
                                    self.moduleView.cutoutRect.origin.y + self.cordovaConfig.segmentYPositionOffset/2,
                                    self.view.frame.size.width - 2*(self.moduleView.cutoutRect.origin.x + self.cordovaConfig.segmentXPositionOffset/2),
                                    self.segment.frame.size.height);
    self.segment.hidden = NO;
    
}

#pragma mark - AnylineEnergyModuleDelegate method

- (void)anylineEnergyModuleView:(AnylineEnergyModuleView *)anylineEnergyModuleView
              didFindScanResult:(NSString *)scanResult
                      cropImage:(UIImage *)image
                      fullImage:(UIImage *)fullImage
                         inMode:(ALScanMode)scanMode {
    self.scannedLabel.text = scanResult;
    
    NSMutableDictionary *dictResult = [NSMutableDictionary dictionaryWithCapacity:4];
    
    switch (scanMode) {
        case ALGasMeter:
            [dictResult setObject:@"Gas Meter" forKey:@"meterType"];
            break;
        case ALWaterMeterBlackBackground:
        case ALWaterMeterWhiteBackground:
            [dictResult setObject:@"Water Meter" forKey:@"meterType"];
            break;
        case ALDigitalMeter:
            [dictResult setObject:@"Digital Meter" forKey:@"meterType"];
            break;
        case ALHeatMeter4:
        case ALHeatMeter5:
        case ALHeatMeter6:
            [dictResult setObject:@"Heat Meter" forKey:@"meterType"];
            break;
        case ALSerialNumber:
            [dictResult setObject:@"Serial Number" forKey:@"meterType"];
            break;
        default:
            [dictResult setObject:@"Electric Meter" forKey:@"meterType"];
            break;
    }
    
    [dictResult setObject:[self stringFromScanMode:scanMode] forKey:@"scanMode"];
    
    [dictResult setObject:scanResult forKey:@"reading"];
    
    NSString *imagePath = [self saveImageToFileSystem:image];
    
    [dictResult setValue:imagePath forKey:@"imagePath"];
    
    NSString *fullImagePath = [self saveImageToFileSystem:fullImage];
    
    [dictResult setValue:fullImagePath forKey:@"fullImagePath"];
    
    [dictResult setObject:self.detectedBarcodes forKey:@"detectedBarcodes"];
    
    [self.delegate anylineBaseScanViewController:self didScan:dictResult continueScanning:!self.moduleView.cancelOnResult];
    
    if (self.moduleView.cancelOnResult) {
        [self dismissViewControllerAnimated:YES completion:NULL];
    }
    self.detectedBarcodes = [NSMutableArray array];
}

#pragma mark - AnylineNativeBarcodeDelegate

- (void)anylineVideoView:(AnylineVideoView *)videoView
    didFindBarcodeResult:(NSString *)scanResult
                    type:(NSString *)barcodeType {
    for (NSMutableDictionary<NSString *, NSString *> *barcode in self.detectedBarcodes) {
        if ([[barcode objectForKey:@"value"] isEqualToString:scanResult]) {
            return;
        }
    }
    
    NSMutableDictionary *barcode = [NSMutableDictionary dictionaryWithCapacity:2];
    
    barcode[@"value"] = scanResult;
    barcode[@"format"] = [self barcodeFormatForNativeString:barcodeType];
    
    [self.detectedBarcodes addObject:barcode];
}
    
#pragma mark - IBActions
    
- (IBAction)segmentChange:(id)sender {
    NSString *modeString = self.cordovaConfig.segmentModes[((UISegmentedControl *)sender).selectedSegmentIndex];
    ALScanMode scanMode = [self scanModeFromString:modeString];
    ((AnylineEnergyModuleView *)self.moduleView).scanMode = scanMode;
    
    self.moduleView.currentConfiguration = self.conf;
}
    
#pragma mark - Private Methods

- (NSString *)barcodeFormatForNativeString:(NSString *)barcodeType {
    
    static NSDictionary<NSString *, NSString *> * barcodeFormats = nil;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
        barcodeFormats = @{
                           @"AVMetadataObjectTypeUPCECode" : kCodeTypeUPCE,
                           @"AVMetadataObjectTypeCode39Code" : kCodeTypeCode39,
                           @"AVMetadataObjectTypeCode39Mod43Code" : kCodeTypeCode39,
                           @"AVMetadataObjectTypeEAN13Code" : kCodeTypeEAN13,
                           @"AVMetadataObjectTypeEAN8Code" : kCodeTypeEAN8,
                           @"AVMetadataObjectTypeCode93Code" : kCodeTypeCode93,
                           @"AVMetadataObjectTypeCode128Code" : kCodeTypeCode128,
                           @"AVMetadataObjectTypePDF417Code" : kCodeTypePDF417,
                           @"AVMetadataObjectTypeQRCode" : kCodeTypeQR,
                           @"AVMetadataObjectTypeAztecCode" : kCodeTypeAztec,
                           @"AVMetadataObjectTypeInterleaved2of5Code" : kCodeTypeITF,
                           @"AVMetadataObjectTypeITF14Code" : kCodeTypeITF,
                           @"AVMetadataObjectTypeDataMatrixCode" : kCodeTypeDataMatrix,
                           };
#pragma clang diagnostic pop
    });
    
    return barcodeFormats[barcodeType];
}

- (ALScanMode)scanModeFromString:(NSString *)scanMode {
    NSDictionary<NSString *, NSNumber *> *scanModes = [self scanModesDict];
    
    return [scanModes[scanMode] integerValue];
}

- (NSString *)stringFromScanMode:(ALScanMode)scanMode {
    NSDictionary<NSString *, NSNumber *> *scanModes = [self scanModesDict];
    
    return [scanModes allKeysForObject:@(scanMode)][0];
}

- (NSDictionary<NSString *, NSNumber *> *)scanModesDict {
    static NSDictionary<NSString *, NSNumber *> * scanModes = nil;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        scanModes = @{
                      @"ELECTRIC_METER" : @(ALElectricMeter),
                      @"ELECTRIC_METER_5_1" : @(ALElectricMeter5_1),
                      @"ELECTRIC_METER_6_1" : @(ALElectricMeter6_1),
                      @"ANALOG_METER_WHITE" : @(ALAnalogMeterWhite),
                      @"ANALOG_METER_4" : @(ALAnalogMeter4),
                      @"ANALOG_METER_7" : @(ALAnalogMeter7),
                      @"GAS_METER" : @(ALGasMeter),
                      @"GAS_METER_6" : @(ALGasMeter6),
                      @"ANALOG_METER" : @(ALAnalogMeter),
                      @"BARCODE" : @(ALBarcode),
                      @"SERIAL_NUMBER" : @(ALSerialNumber),
                      @"WATER_METER_BLACK" : @(ALWaterMeterBlackBackground),
                      @"WATER_METER_WHITE" : @(ALWaterMeterWhiteBackground),
                      @"DIGITAL_METER" : @(ALDigitalMeter),
                      @"HEAT_METER_4" : @(ALHeatMeter4),
                      @"HEAT_METER_5" : @(ALHeatMeter5),
                      @"HEAT_METER_6" : @(ALHeatMeter6),
                      
                      };
    });

    return scanModes;
}

@end

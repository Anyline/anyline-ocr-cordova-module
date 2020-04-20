//
//  ViewController.m
//  MXMWSampleApp
//
//  Created by Zhivko Manchev on 5/30/17.
//  Copyright © 2017 Cognex. All rights reserved.
//

#import "ScannerController.h"
#import <DataManFW/DataManFW.h>
#import <Anyline/Anyline.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import <ZHPopupView/ZHPopupView.h>
#include <stdio.h>
#import <Foundation/Foundation.h>
#import "ALCognexMXConfiguration.h"

#import "ALPluginHelper.h"

@interface ScannerController () <CMBReaderDeviceDelegate,CDMDataManSystemDelegate,ALOCRScanPluginDelegate, ALImageProvider, ALInfoDelegate>

@property (nonatomic, strong) ALOCRScanPlugin *scanPlugin;
@property (nonatomic, assign) BOOL readyForNextFrame;
@property (nonatomic, strong) ALImageProviderBlock completionBlock;
//@property (weak, nonatomic) IBOutlet UIImageView *debugImage;
//@property (weak, nonatomic) IBOutlet UIImageView *debugImage2;

@property (nonatomic, strong) ALCutoutView *overlay;

@property (nonatomic, assign) SystemSoundID beepSound;

@property (nonatomic, strong) dispatch_queue_t imagerQ;
@property (nonatomic, strong) dispatch_queue_t anylineQ;

@property (nonatomic, strong) NSDictionary *anylineConfig;
@property (nonatomic, weak) id<ALPluginScanViewControllerDelegate> delegate;
@property (nonatomic, strong) NSString *licensekey;
@property (nonatomic, strong) ALCordovaUIConfiguration *cordovaConfig;
@property (nonatomic, strong) ALCognexMXConfiguration *mxConfig;

@property (weak, nonatomic) IBOutlet UIButton *btnCancel;
@property (weak, nonatomic) IBOutlet UIButton *btnDummyResult;
@property (weak, nonatomic) IBOutlet UILabel *lblBattery;

@property (nonatomic, strong) NSTimer *batterLevelTimer;

@end

@implementation ScannerController

CMBReaderDevice *readerDevice;

- (instancetype)initWithLicensekey:(NSString *)licensekey
                     configuration:(NSDictionary *)anylineConfig
              cordovaConfiguration:(ALCordovaUIConfiguration *)cordovaConf
                   mxConfiguration:(ALCognexMXConfiguration *)mxConf
                          delegate:(id<ALPluginScanViewControllerDelegate>)delegate {
    
    self = [super init];
    if(self) {
        _licensekey = licensekey;
        _delegate = delegate;
        _anylineConfig = anylineConfig;
        _cordovaConfig = cordovaConf;
        _mxConfig = mxConf;
        
//        self.quality = 100;
//        self.nativeBarcodeEnabled = NO;
//        self.cropAndTransformErrorMessage = @"";
    }
    return self;
}

- (void)setupWithLicensekey:(NSString *)licensekey
              configuration:(NSDictionary *)anylineConfig
       cordovaConfiguration:(ALCordovaUIConfiguration *)cordovaConf
            mxConfiguration:(ALCognexMXConfiguration *)mxConf
                   delegate:(id<ALPluginScanViewControllerDelegate>)delegate {
    _licensekey = licensekey;
    _delegate = delegate;
    _anylineConfig = anylineConfig;
    _cordovaConfig = cordovaConf;
    _mxConfig = mxConf;
}
- (void)viewDidLoad {
    [super viewDidLoad];
    
    _imagerQ = dispatch_queue_create("cognex.imager.queue", 0);
    _anylineQ = dispatch_queue_create("cognex.anyline.queue", 0);
    
    self.readyForNextFrame = NO;
    
    [_lblConnection.layer setCornerRadius:_lblConnection.frame.size.height/2];
    [_lblConnection setClipsToBounds:YES];
    [_lblConnection setTextColor:[UIColor whiteColor]];
    [_lblConnection setBackgroundColor:[UIColor redColor]];
    [_lblConnection setText:@"  Disconnected  "];

    
    //Setup Cancel button
    [_btnScan setTitle:@"(NOT CONNECTED)" forState:UIControlStateDisabled];
    [_btnScan setEnabled:NO];
    
    [_btnScan setBackgroundColor:[UIColor colorWithRed:0.98 green:0.86 blue:0.01 alpha:1.0]];
    [_btnScan setTintColor:[UIColor blackColor]];
    [_btnScan.layer setCornerRadius:10];
    [_btnScan setClipsToBounds:YES];
    [_btnScan.layer setBorderColor:[UIColor colorWithRed:0.99 green:0.73 blue:0.07 alpha:1.0].CGColor];
    [_btnScan.layer setBorderWidth:1];
    
    [_btnScan setTitle:@"(NOT CONNECTED)" forState:UIControlStateDisabled];
    [_btnScan setEnabled:NO];
    
    [_btnScan setBackgroundColor:[UIColor colorWithRed:0.98 green:0.86 blue:0.01 alpha:1.0]];
    [_btnScan setTintColor:[UIColor blackColor]];
    [_btnScan.layer setCornerRadius:10];
    [_btnScan setClipsToBounds:YES];
    [_btnScan.layer setBorderColor:[UIColor colorWithRed:0.99 green:0.73 blue:0.07 alpha:1.0].CGColor];
    [_btnScan.layer setBorderWidth:1];
    
    //Setup Cancel button
    UIButton *btnCancel = [UIButton buttonWithType:UIButtonTypeCustom];
        btnCancel.frame = _btnScan.frame;
    [btnCancel addTarget:self
               action:@selector(onCancel:)
     forControlEvents:UIControlEventTouchUpInside];
    
    [btnCancel setTitle:@"Cancel" forState:UIControlStateNormal];
    btnCancel.tintColor = UIColor.whiteColor;
    btnCancel.backgroundColor = UIColor.redColor;
    [btnCancel.layer setBorderColor:UIColor.redColor.CGColor];
    [btnCancel.layer setBorderWidth:1];
    
    [btnCancel.layer setCornerRadius:10];
    [btnCancel setClipsToBounds:YES];
    self.btnCancel = btnCancel;
    [self.view addSubview:self.btnCancel];
    
    //Add anchors and constraints to self.btnCancel
    _btnCancel.translatesAutoresizingMaskIntoConstraints = NO;
    [self.btnCancel.bottomAnchor
     constraintEqualToAnchor:_btnScan.topAnchor
     constant:-7.5
     ].active = YES;
    [self.btnCancel.heightAnchor constraintEqualToAnchor:_btnScan.heightAnchor multiplier:1.0].active = YES;
    [self.btnCancel.widthAnchor constraintEqualToAnchor:_btnScan.widthAnchor multiplier:1.0].active = YES;
    
    NSLayoutConstraint *centreHorizontallyConstraint = [NSLayoutConstraint
                                          constraintWithItem:self.btnCancel
                                          attribute:NSLayoutAttributeCenterX
                                          relatedBy:NSLayoutRelationEqual
                                          toItem:self.view
                                          attribute:NSLayoutAttributeCenterX
                                          multiplier:1.0
                                          constant:0];
    [self.view addConstraint:centreHorizontallyConstraint];
    
    
    //Setup Battery Label
    UILabel *lblBattery = [[UILabel alloc] init];
    lblBattery.frame = _lblConnection.frame;

    CGRect labelFrame = [lblBattery frame];
    labelFrame.origin.x = 5;
    labelFrame.origin.y = self.view.frame.origin.y + CGRectGetMaxY(self.navigationController.navigationBar.frame) + 10;
    labelFrame.size.width = 50;
    [lblBattery setFrame:labelFrame];
    
    [lblBattery setText:@"- %"];
    lblBattery.tintColor = UIColor.whiteColor;
    lblBattery.textColor = UIColor.whiteColor;
    lblBattery.backgroundColor = UIColor.redColor;
    [lblBattery.layer setBorderColor:UIColor.redColor.CGColor];
    [lblBattery.layer setBorderWidth:1];
    [lblBattery.layer setCornerRadius:8];
    
    [lblBattery setClipsToBounds:YES];
    lblBattery.font = _lblConnection.font;
    lblBattery.textAlignment = NSTextAlignmentCenter;
    
    self.lblBattery = lblBattery;
    [self.view addSubview:self.lblBattery];

    //Setup Anyline scanPlugin to process provided frames
    [self setupAnyline];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(initDevice)
                                                 name:UIApplicationDidBecomeActiveNotification
                                               object:nil];

}

- (void)viewDidAppear:(BOOL)animated {
    [self disconnectReaderDevice];
    [super viewDidAppear:animated];
}

- (void)setupAnyline {
    ALOCRConfig *config = [[ALOCRConfig alloc] init];
    NSString *cmdPath = [[NSBundle mainBundle] pathForResource:@"bmw" ofType:@"ale"];
    config.customCmdFilePath =cmdPath;
    NSString *langPath = [[NSBundle mainBundle] pathForResource:@"BMW_det_class_6" ofType:@"any"];
    [config setLanguages:@[langPath] error:nil];

    NSError *error = nil;
    self.scanPlugin = [[ALOCRScanPlugin alloc] initWithPluginID:@"Cognex_Scanning"
                                                    licenseKey:self.licensekey
                                                      delegate:self
                                                     ocrConfig:config
                                                         error:&error];
    if( error ) {
       NSLog(@"Error launching SDK: %@", error);
       [self presentError:error.debugDescription];
    }

    [self.scanPlugin addInfoDelegate:self];

    NSBundle *frameworkBundle = [ALCoreController frameworkBundle];
    NSURL *audioPath = [frameworkBundle URLForResource:@"beep" withExtension:@"wav" subdirectory:@"sounds"];
    AudioServicesCreateSystemSoundID((__bridge CFURLRef)audioPath, &_beepSound);
}

-(void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self initDevice];
    self.lblBattery.center = CGPointMake(self.lblBattery.center.x, _lblConnection.center.y);
    
}


- (void)dealloc {
    NSLog(@"Dealloc Cognex Scanner Controller");
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self.batterLevelTimer invalidate];
}

-(void) initDevice {

    if (readerDevice == nil) {
        dispatch_async(dispatch_queue_create("MXInit", nil), ^{
            
            readerDevice = [CMBReaderDevice readerOfMXDevice];
            
            dispatch_async(dispatch_get_main_queue(), ^{
                readerDevice.delegate = self;
                readerDevice.dataManSystem.delegate = self;
                [self connectToReaderDevice];
            });
        });
    } else {
        readerDevice.delegate = self;
        readerDevice.dataManSystem.delegate = self;
        [self connectToReaderDevice];
    }
}

- (void)connectToReaderDevice {
    if (   readerDevice.availability == CMBReaderAvailibilityAvailable
        && readerDevice.connectionState != CMBConnectionStateConnected)
    {
        [readerDevice connectWithCompletion:^(NSError *error){
            if (error)
            {
                [[[UIAlertView alloc]initWithTitle:@"Failed to connect" message:error.description delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil]show];

                NSLog(@"connect error:\n%@", error);

                [self->_btnScan setEnabled:NO];
                [self->_lblConnection setText:@"  Disconnected  "];
                [self->_lblConnection setBackgroundColor:[UIColor systemRedColor]];
            }
            readerDevice.delegate = self;
            readerDevice.dataManSystem.delegate = self;

        }];
    } else if (readerDevice.connectionState != CMBConnectionStateConnected){
        [_btnScan setEnabled:NO];
        [_lblConnection setText:@"  Disconnected  "];
        [_lblConnection setBackgroundColor:[UIColor systemRedColor]];
    }

}

- (void)disconnectReaderDevice {
    if (readerDevice != nil && readerDevice.connectionState != CMBConnectionStateDisconnected) {
        [readerDevice disconnect];
    }
}

-(void) loadSettings {
    
    [readerDevice setSymbology:CMBSymbologyDataMatrix enabled:YES completion:^(NSError *error){
        if (error)
        {
            NSLog(@"FALIED TO ENABLE [Symbology_DataMatrix], %@", error.description);
        }
    }];
    [readerDevice setSymbology:CMBSymbologyQR enabled:YES completion:^(NSError *error){
        if (error)
        {
            NSLog(@"FALIED TO ENABLE [Symbology_QR], %@", error.description);
        }
    }];
    [readerDevice setSymbology:CMBSymbologyC128 enabled:YES completion:^(NSError *error){
        if (error)
        {
            NSLog(@"FALIED TO ENABLE [Symbology_C128], %@", error.description);
        }
    }];
    [readerDevice setSymbology:CMBSymbologyUpcEan enabled:YES completion:^(NSError *error){
        if (error)
        {
            NSLog(@"FALIED TO ENABLE [Symbology_UpcEan], %@", error.description);
        }
    }];
    [self configureCognexSettings:^(CDMResponse *response) { }];
    
    [self batteryLevel:^(CDMResponse *response) {
        [self updateBatteryLevelLabel:response.payload];
        [self setupBatteryLevelTimer];
    }];
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender{
    if ([segue.identifier isEqualToString:@"segueToDeviceSelector"]) {
        [self disconnectReaderDevice];
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

BOOL issScanning = NO;
- (IBAction)toggleScanner:(UIButton*)sender {
    if (issScanning) {
        [self stopScan];
        [sender setTitle:@"START SCANNING" forState:UIControlStateNormal];
    }else{
        [self startScan];
        [sender setTitle:@"STOP SCANNING" forState:UIControlStateNormal];
    }
    issScanning = !issScanning;
}

- (void)presentError:(NSString*)error; {
    if (error.length == 0) {
        return;
    }
    
    ZHPopupView *popupView = [ZHPopupView popupNomralAlertViewInView:nil
                                                     backgroundStyle:ZHPopupViewBackgroundType_SimpleOpacity
                                                               title:@"Info"
                                                             content:error
                                                        buttonTitles:@[@"OK"]
                                                 confirmBtnTextColor:nil otherBtnTextColor:nil
                                                  buttonPressedBlock:^(NSInteger btnIdx) {
                                                      
                                                      
                                                  }];
    [popupView present];
     
}

- (void) startScan {
    NSString *setCameraExposureUS = [NSString stringWithFormat:@"SET CAMERA.EXPOSURE-US %@ %d %d %d", self.mxConfig.cameraExposureUSAutoMode, self.mxConfig.cameraExposureUSTarget, self.mxConfig.cameraExposureUSExposure, self.mxConfig.cameraExposureUSGain];
    
    [readerDevice.dataManSystem sendCommand:setCameraExposureUS withCallback:^(CDMResponse *response) {
        [readerDevice.dataManSystem sendCommand:@"GET CAMERA.EXPOSURE-US" withCallback:^(CDMResponse *response) {
            NSLog(@"Exposure-US: %@",response.payload);
            NSString *setCameraExposure = [NSString stringWithFormat:@"SET CAMERA.EXPOSURE %d", self.mxConfig.cameraExposure];
            
            [readerDevice.dataManSystem sendCommand:setCameraExposure withCallback:^(CDMResponse *response) {
                [readerDevice.dataManSystem sendCommand:@"GET CAMERA.EXPOSURE" withCallback:^(CDMResponse *response) {
                    NSLog(@"Exposure: %@",response.payload);
                    NSString *setCameraGain = [NSString stringWithFormat:@"SET CAMERA.GAIN %f", self.mxConfig.cameraGain];
                    
                    [readerDevice.dataManSystem sendCommand:setCameraGain withCallback:^(CDMResponse *response) {
                        [readerDevice.dataManSystem sendCommand:@"GET CAMERA.GAIN" withCallback:^(CDMResponse *response) {
                            NSLog(@"GAIN: %@",response.payload);
                            NSString *setFocusPower = [NSString stringWithFormat:@"SET FOCUS.POWER %f", self.mxConfig.focusPower];
                            
                            [readerDevice.dataManSystem sendCommand:setFocusPower withCallback:^(CDMResponse *response) {
                                [readerDevice.dataManSystem sendCommand:@"GET FOCUS.POWER" withCallback:^(CDMResponse *response) {
                                    NSLog(@"FOCUS POWER: %@",response.payload);
                                    [self.scanPlugin stopAndReturnError:nil];
                                    NSError *error = nil;
                                    BOOL success = [self.scanPlugin start:self error:&error];
                                    NSAssert1(success, @"Start went wrong: %@",error.debugDescription);
                                    [self presentError:error.debugDescription];
                                }];
                            }];
                        }];
                    }];
                }];
            }];
        }];
    }];
}

- (void)configureCognexSettings:(void(^)(CDMResponse *response))callback {
    [readerDevice.dataManSystem sendCommand:@"SET BUTTON.ACTION 0 0" withCallback:^(CDMResponse *response) {
        [readerDevice.dataManSystem sendCommand:@"SET BUTTON.ACTION 1 0" withCallback:^(CDMResponse *response) {
            [readerDevice.dataManSystem sendCommand:@"SET BUTTON.ACTION 2 0" withCallback:^(CDMResponse *response) {
                NSString *setPowerOffTimeout = [NSString stringWithFormat:@"SET POWER.POWEROFF-TIMEOUT %d", self.mxConfig.powerTimeout];
                
                [readerDevice.dataManSystem sendCommand:setPowerOffTimeout withCallback:^(CDMResponse *response) {
                    callback(response);
                }];
            }];
        }];
    }];
}

- (void)setupBatteryLevelTimer {
    dispatch_async(dispatch_get_main_queue(), ^{
        //Check battery level every 30 seconds
        NSTimeInterval timerDelay = 30.0;
        [self.batterLevelTimer invalidate];
        self.batterLevelTimer = nil;
        self->_batterLevelTimer = [NSTimer scheduledTimerWithTimeInterval:timerDelay target:self selector:@selector(batteryTimerTask:) userInfo:nil repeats:YES];
    });
    
}

- (void)batteryTimerTask:(NSTimer *)timer {
    [self batteryLevel:^(CDMResponse *response) {
        [self updateBatteryLevelLabel:response.payload];
    }];
}

- (void)batteryLevel:(void(^)(CDMResponse *response))callback {
    dispatch_async(dispatch_get_main_queue(), ^{
        if (readerDevice && readerDevice.dataManSystem) {
            [readerDevice.dataManSystem sendCommand:@"GET BATTERY.CHARGE" withCallback:^(CDMResponse *response) {
                callback(response);
            }];
        }
    });
}

- (void)updateBatteryLevelLabel:(NSString *)batteryLevel {
    if (!batteryLevel) {
        batteryLevel = @"-";
        [self updateBatteryLevelLabelColor:UIColor.systemRedColor];
    } else {
        int intValue = [batteryLevel intValue];
        if (intValue >= 80) {
            [self updateBatteryLevelLabelColor:UIColor.systemGreenColor];
        } else if (intValue >= 20) {
            [self updateBatteryLevelLabelColor:UIColor.systemOrangeColor];
        } else {
            [self updateBatteryLevelLabelColor:UIColor.systemRedColor];
        }
    }
    self.lblBattery.text = [NSString stringWithFormat:@"%@ %%", batteryLevel];
    
}

- (void)updateBatteryLevelLabelColor:(UIColor *)color {
    self.lblBattery.backgroundColor = color;
    [self.lblBattery.layer setBorderColor:color.CGColor];

    
}


- (void)stopScan {
//    [self stopFillingImageBuffer];
    [self.scanPlugin stopAndReturnError:nil];
}

//MX device availability
- (void)availabilityDidChangeOfReader:(CMBReaderDevice *)reader
{
    NSLog(@"DeviceSelectorVC availabilityDidChangeOfReader");
    
    BOOL readerAvailable = (reader.availability == CMBReaderAvailibilityAvailable);
    NSLog(@"readerAvailable: %i", readerAvailable);
    
    if ((reader.availability != CMBReaderAvailibilityAvailable)) {
        [_lblSymbology setText:@"MX Became unavailable"];
        [self disconnectReaderDevice];
    }else{
        [_lblSymbology setText:@""];
        readerDevice = [CMBReaderDevice readerOfMXDevice];
        readerDevice.delegate = self;
        readerDevice.dataManSystem.delegate = self;
        if ((readerDevice.availability == CMBReaderAvailibilityAvailable)) {
            [self connectToReaderDevice];
        }
    }
}

/**
 * Occurs when the remote system has successfully connected.
 * @param dataManSystem The DataMan system that is sending the delegate
 */
- (void)dataManSystemDidConnect:(CDMDataManSystem *)dataManSystem {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self loadSettings];

        
        [self->_btnScan setTitle:@"START SCANNING" forState:UIControlStateNormal];
        issScanning = NO;
        
        [self->_btnScan setEnabled:YES];
        [self->_lblConnection setText:@"  Connected  "];
        [self->_lblConnection setBackgroundColor:UIColor.systemGreenColor];
        
        [self toggleScanner:nil];
    });
}

/**
 * Occurs when the remote system gets disconnected
 * @param dataManSystem The DataMan system that is sending the delegate
 * @param error The error object if an error has occured during disconnect, or nil if there was no error
 */
- (void)dataManSystemDidDisconnect:(CDMDataManSystem *)dataManSystem withError:(NSError *)error {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self->_btnScan setEnabled:NO];
        [self->_lblConnection setText:@"  Disconnected  "];
        [self->_lblConnection setBackgroundColor:[UIColor systemRedColor]];
    });
    
}

- (void)connectionStateDidChangeOfReader:(CMBReaderDevice *)reader{
    if (readerDevice.connectionState == CMBConnectionStateConnected)
    {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self loadSettings];
        });

        [_btnScan setTitle:@"START SCANNING" forState:UIControlStateNormal];
        issScanning = NO;

        [_btnScan setEnabled:YES];
        [_lblConnection setText:@"  Connected  "];
        [_lblConnection setBackgroundColor:UIColor.systemGreenColor];
        
        [self toggleScanner:nil];
        
//    } else if (readerDevice.connectionState == CMBConnectionStateDisconnected) {
//        dispatch_async(dispatch_get_main_queue(), ^{
//            [self connectToReaderDevice];
//        });
    } else{
        [_btnScan setEnabled:NO];
        [_lblConnection setText:@"  Disconnected  "];
        [_lblConnection setBackgroundColor:[UIColor systemRedColor]];
    }
}

#pragma mark - Anyline Delegates

- (void)provideNewImageWithCompletionBlock:(ALImageProviderBlock)completionHandler {
    [self fetchImage:completionHandler];
}

- (void)provideNewFullResolutionImageWithCompletionBlock:(ALImageProviderBlock)completionHandler {
    [self fetchImage:completionHandler];
}


- (void)fillImageBuffer {
    NSDate *methodStart = [NSDate date];
    [readerDevice.dataManSystem sendCommand:@"IMAGE.FETCH 1 1 90"
                                   withData:nil
                                    timeout:5000
                       expectBinaryResponse:YES
                                   callback:^(CDMResponse *response) {
                                       UIImage *img =  [UIImage imageWithData:response.binaryPayload];
                                       self.imageBuffer = img;
                                       self.ivPreview.image = img;
                                        //TODO: if the image has to be saved in the gallery
//                                       UIImageWriteToSavedPhotosAlbum(img,nil,nil,nil);
                                       NSTimeInterval executionTime = [[NSDate date] timeIntervalSinceDate:methodStart];
                                   }];
}

- (void)fetchImage:(ALImageProviderBlock)completionHandler {
    dispatch_async(_anylineQ, ^{
        if(self.lastImage == nil) {
            dispatch_async(self.imagerQ, ^{
                [self fillImageBuffer];
            });
        }
    
        {
#ifdef DEBUG
            NSDate *methodFinish = [NSDate date];
            NSTimeInterval executionTime = [methodFinish timeIntervalSinceDate:self.roundaboutScandate];
            //NSLog(@"aroundaboutTime = %f", executionTime);
            self.roundaboutScandate = [NSDate date];
#endif
        }
        
        NSDate * imgdate = [NSDate date];
        while(self.lastImage == self.imageBuffer || !self.imageBuffer) {
            [NSThread sleepForTimeInterval:0.02];
        }
            self.lastImage = self.imageBuffer;
    
        dispatch_async(_imagerQ, ^{
            [self fillImageBuffer];
        });
        
#ifdef DEBUG
        NSTimeInterval executionTime = [[NSDate date] timeIntervalSinceDate:imgdate];
        //NSLog(@"wait time = %f", executionTime);
#endif
//        if (!self.lastImage) {
//            return;
//        }
        ALImage * alimg = [[ALImage alloc] initWithUIImage:self.lastImage];
        self.lastScandate = [NSDate date];
        
#ifdef DEBUG
        //NSLog(@"anyline callback");
        //NSLog(@"img %@", self.lastImage);
#endif
        dispatch_async(dispatch_get_main_queue(), ^{
            completionHandler(alimg ,nil);
        });
    });
}

- (void)anylineScanPlugin:(ALAbstractScanPlugin *)anylineScanPlugin reportInfo:(ALScanInfo *)info {

}

- (void)anylineOCRScanPlugin:(ALOCRScanPlugin *)anylineOCRScanPlugin didFindResult:(ALOCRResult *)result {
    self.lblCode.text = result.result;
    [self triggerScanFeedback];
    
    [self finishWithResult:result.result image:self.lastImage];
    
}

- (void)triggerScanFeedback {
    AudioServicesPlaySystemSound(_beepSound);
    AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
}

- (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveStatusEvent:(NSData *)data {
    NSLog(@"Did receive status event");
}

- (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveImage:(UIImage *)image withId:(int)resultId {
    NSLog(@"DidRecieveImage");
}

- (void)didReceiveReadResultFromReader:(CMBReaderDevice *)reader results:(CMBReadResults *)readResults {
    NSLog(@"didReceiveReadResultFromReader");
}

-(void)onCancel:(id)sender {
    [self stopScan];
    [self disconnectReaderDevice];
    [self dismissViewControllerAnimated:YES completion:^{
        [self.delegate pluginScanViewController:nil didStopScanning:sender];
    }];
}

-(void)onDebugResult:(id)sender {
    [self finishWithResult:@"DEBUG RESULT STRING" image:self.lastImage];
}

- (void)finishWithResult:(NSString *)result image:(UIImage *)image {
    [self stopScan];
    [self disconnectReaderDevice];
    [self dismissViewControllerAnimated:YES completion:^{
        [self.delegate pluginScanViewController:nil didScan:[self createResultDict:result image:image] continueScanning:NO];
    }];
}

- (NSDictionary *)createResultDict:(NSString *)result image:(UIImage*)image {
    
    NSMutableDictionary *dictResult = [NSMutableDictionary dictionaryWithCapacity:2];
    
    [dictResult setObject:result forKey:@"text"];
    
    if (image) {
        NSString *imagePath = [ALPluginHelper saveImageToFileSystem:image compressionQuality:1.0];
         [dictResult setValue:imagePath forKey:@"imagePath"];
    }
    
    return dictResult;
}


@end

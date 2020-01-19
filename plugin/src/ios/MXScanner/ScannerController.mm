//
//  ViewController.m
//  MXMWSampleApp
//
//  Created by Zhivko Manchev on 5/30/17.
//  Copyright © 2017 Cognex. All rights reserved.
//

#import "ScannerController.h"
#import <Anyline/Anyline.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import "opencv.hpp"
#import "ALImage+PrivateHeader.h"
#import "ALDataFeedbackService.h"
#import <ZHPopupView/ZHPopupView.h>
#import "ALCognexDevice.h"
#include <stdio.h>


@interface ScannerController () <ALOCRScanPluginDelegate, ALImageProvider, ALInfoDelegate, CognexDeviceDelegate>

@property (nonatomic, strong) ALOCRScanPlugin *scanPlugin;
@property (nonatomic, assign) BOOL readyForNextFrame;
@property (nonatomic, strong) ALImageProviderBlock completionBlock;
@property (weak, nonatomic) IBOutlet UIImageView *debugImage;
@property (weak, nonatomic) IBOutlet UIImageView *debugImage2;

@property (nonatomic, strong) ALCutoutView *overlay;

@property (nonatomic, assign) SystemSoundID beepSound;

@property (nonatomic, strong) ALCognexDevice * deviceController;

@property (nonatomic, strong) dispatch_queue_t anylineQ;

@property (nonatomic, strong) NSString * licenseKey;

@end

@implementation ScannerController

- (instancetype)initWithLicenseKey:(NSString *)licenseKey {
    self = [super init];
    if (self) {
        _licenseKey = licenseKey;
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];

    _anylineQ = dispatch_queue_create("cognex.anyline.queue", 0);
    
    
    self.deviceController = [[ALCognexDevice alloc] init];
    

    
    self.readyForNextFrame = NO;
    
    [_lblConnection.layer setCornerRadius:_lblConnection.frame.size.height/2];
    [_lblConnection setClipsToBounds:YES];
    [_lblConnection setTextColor:[UIColor whiteColor]];
    [_lblConnection setBackgroundColor:[UIColor redColor]];
    [_lblConnection setText:@"  Disconnected  "];

    
    [_btnScan setTitle:@"(NOT CONNECTED)" forState:UIControlStateDisabled];
    [_btnScan setEnabled:NO];
    
    [_btnScan setBackgroundColor:[UIColor colorWithRed:0.98 green:0.86 blue:0.01 alpha:1.0]];
    [_btnScan setTintColor:[UIColor blackColor]];
    [_btnScan.layer setCornerRadius:10];
    [_btnScan setClipsToBounds:YES];
    [_btnScan.layer setBorderColor:[UIColor colorWithRed:0.99 green:0.73 blue:0.07 alpha:1.0].CGColor];
    [_btnScan.layer setBorderWidth:1];
    
    ALOCRConfig *config = [[ALOCRConfig alloc] init];
    
//    NSString *cmdPath = [[ALCoreController frameworkBundle] pathForResource:@"bmw" ofType:@"ale"];
//    config.customCmdFilePath = cmdPath;
//
//    NSString *cmdPath2 = [[ALCoreController frameworkBundle] pathForResource:@"vin" ofType:@"ale"];
//    NSString *langPath = [[ALCoreController frameworkBundle] pathForResource:@"BMW_det_class_6" ofType:@"any"];
//    [config setLanguages:@[langPath,] error:nil];
    
    NSError *error = nil;
    self.scanPlugin = [[ALOCRScanPlugin alloc] initWithPluginID:@"Cognex_Scanning" licenseKey:self.licenseKey
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
    
    
    [self.deviceController addObserver:self forKeyPath:@"isConnected" options:NSKeyValueObservingOptionNew context:NULL];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context {
    if(self.deviceController.isConnected) {
        [_btnScan setTitle:@"START SCANNING" forState:UIControlStateNormal];
        [_btnScan setEnabled:YES];
        [_lblConnection setText:@"  Connected  "];
        [_lblConnection setBackgroundColor:[UIColor colorWithRed:0.00 green:0.39 blue:0.00 alpha:1.0]];
    } else {
        [_btnScan setEnabled:NO];
        [_lblConnection setText:@"  Disconnected  "];
        [_lblConnection setBackgroundColor:[UIColor redColor]];
    }

}

-(void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self.deviceController setupDevice];
    
    [self.view addSubview:self.deviceController.preview];
    NSAssert(self.deviceController.preview, @"No preview");
    [self.deviceController.preview setFrame:self.view.bounds];
}



- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender{
    if ([segue.identifier isEqualToString:@"segueToDeviceSelector"]) {
        [self.deviceController disconnectReaderDevice];
    }
}

BOOL issScanning = NO;

- (IBAction)toggleScanner:(UIButton*)sender {
    if (issScanning) {
        [self stopScan];
        [sender setTitle:@"START SCANNING" forState:UIControlStateNormal];
    } else {
        [self.deviceController startReader];
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


- (void)stopScan {
    [self.scanPlugin stopAndReturnError:nil];
}

- (void)deviceIsReadyToScan; {
    [self.scanPlugin stopAndReturnError:nil];
    NSError *error = nil;
    BOOL success = [self.scanPlugin start:self error:&error];
//    NSAssert(success, @"Start went wrong: %@",error.debugDescription);
}


- (void)setLicenseKey:(NSString *)licenseKey {
    _licenseKey = licenseKey;
}

#pragma mark - Anyline Delegates

- (void)provideNewImageWithCompletionBlock:(ALImageProviderBlock)completionHandler {
    [self fetchImage:completionHandler];
}

- (void)provideNewFullResolutionImageWithCompletionBlock:(ALImageProviderBlock)completionHandler {
    [self fetchImage:completionHandler];
}

- (void)fetchImage:(ALImageProviderBlock)completionHandler {
    
    /*
    dispatch_async(_anylineQ, ^{
    
        {
#ifdef DEBUG
            NSDate *methodFinish = [NSDate date];
            NSTimeInterval executionTime = [methodFinish timeIntervalSinceDate:self.roundaboutScandate];
            //NSLog(@"aroundaboutTime = %f", executionTime);
            self.roundaboutScandate = [NSDate date];
#endif
        }
        
        NSDate * imgdate = [NSDate date];
        while(self.lastImage == self.imageBuffer) {
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
                                                             */
}

- (void)anylineScanPlugin:(ALAbstractScanPlugin *)anylineScanPlugin reportInfo:(ALScanInfo *)info {
    if ([info.variableName isEqualToString:kThresholdedImageVariableName]) {
        self.debugImage.image = [(ALImage *)info.value uiImage];
    } else if ([info.variableName isEqualToString:@"$tfImage"]) {
        self.debugImage2.image = [(ALImage *)info.value uiImage];
    }
}

- (void)anylineOCRScanPlugin:(ALOCRScanPlugin *)anylineOCRScanPlugin didFindResult:(ALOCRResult *)result {
    self.lblCode.text = result.result;
    
    [ALDataFeedbackService uploadBinaryPayload:UIImageJPEGRepresentation(_ivPreview.image, 0.5)
                                  scannedValue:result.result
                                      bundleID:NSBundle.mainBundle.bundleIdentifier];
    
    [self triggerScanFeedback];
}

- (void)triggerScanFeedback {
    AudioServicesPlaySystemSound(_beepSound);
    AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
}

@end

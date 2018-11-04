//
//  AnylineLicensePlateViewController.m
//
//  Created by Jonas Laux on 10/10/17.
//  Copyright © 2017 Anyline GmbH. All rights reserved.
//

#import "AnylineLicensePlateViewController.h"
#import <Anyline/Anyline.h>
#import "Anyline/AnylineLicensePlateModuleView.h"


// The controller has to conform to <AnylineOCRModuleDelegate> to be able to receive results
@interface AnylineLicensePlateViewController ()<AnylineLicensePlateModuleDelegate, AnylineDebugDelegate>

// The Anyline module used for OCR
@property (nonatomic, strong) AnylineLicensePlateModuleView *licensePlateModuleView;

@end

@implementation AnylineLicensePlateViewController
/*
 We will do our main setup in viewDidLoad. Its called once the view controller is getting ready to be displayed.
 */
- (void)viewDidLoad {
    [super viewDidLoad];
    dispatch_async(dispatch_get_main_queue(), ^{
        self.licensePlateModuleView = [[AnylineLicensePlateModuleView alloc] initWithFrame:self.view.bounds];

        NSError *error = nil;
        [self.licensePlateModuleView setupWithLicenseKey:self.key delegate:self error:&error];

        self.licensePlateModuleView.currentConfiguration = self.conf;

        self.moduleView = self.licensePlateModuleView;

        [self.view addSubview:self.moduleView];

        [self.view sendSubviewToBack:self.moduleView];
    });
}

/*
 This method will be called once the view controller and its subviews have appeared on screen
 */
-(void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
}

/*
 Cancel scanning to allow the module to clean up
 */
- (void)viewWillDisappear:(BOOL)animated {
    [self.licensePlateModuleView cancelScanningAndReturnError:nil];
}

#pragma mark -- AnylineOCRModuleDelegate

/*
 This is the main delegate method Anyline uses to report its results
 */

- (void)anylineLicensePlateModuleView:(AnylineLicensePlateModuleView *)anylineLicensePlateModuleView
                        didFindResult:(ALLicensePlateResult *)scanResult {
    NSDictionary *dictResult = [ALPluginHelper dictionaryForLicensePlateResult:scanResult
                                                              detectedBarcodes:nil
                                                                       outline:anylineLicensePlateModuleView.licensePlateScanViewPlugin.outline
                                                                       quality:100];

    [self.delegate anylineBaseScanViewController:self didScan:dictResult continueScanning:!self.moduleView.cancelOnResult];

    if (self.moduleView.cancelOnResult) {
        [self dismissViewControllerAnimated:YES completion:NULL];
    }
}

- (void)anylineModuleView:(AnylineAbstractModuleView *)anylineModuleView
               runSkipped:(ALRunFailure)runFailure {
    switch (runFailure) {
        case ALRunFailureResultNotValid:
            break;
        case ALRunFailureConfidenceNotReached:
            break;
        case ALRunFailureNoLinesFound:
            break;
        case ALRunFailureNoTextFound:
            break;
        case ALRunFailureUnkown:
            break;
        default:
            break;
    }
}

- (void)alertView:(UIAlertView *)alertView didDismissWithButtonIndex:(NSInteger)buttonIndex {
    NSError *error = nil;
    BOOL success = [self.licensePlateModuleView startScanningAndReturnError:&error];

    NSAssert(success, @"We failed starting: %@",error.debugDescription);
}

@end

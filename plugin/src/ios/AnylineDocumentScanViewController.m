//
//  AnylineDocumentScanViewController.m
//  Anyline Cordova Example
//
//  Created by Daniel Albertini on 23/06/16.
//
//

#import "AnylineDocumentScanViewController.h"
#import <Anyline/Anyline.h>

#import "ALRoundedView.h"

@interface AnylineDocumentScanViewController ()<AnylineDocumentModuleDelegate>

@property (nonatomic, strong) ALRoundedView *roundedView;
@property (nonatomic, assign) NSInteger showingLabel;

@end

@implementation AnylineDocumentScanViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    dispatch_async(dispatch_get_main_queue(), ^{
        AnylineDocumentModuleView *docModuleView = [[AnylineDocumentModuleView alloc] initWithFrame:self.view.bounds];
        
        self.conf.pictureResolution = ALPictureResolution1080;
        docModuleView.currentConfiguration = self.conf;
        
        // Set Document Ratios and deviation
        [docModuleView setDocumentRatios:self.ratios];
        docModuleView.maxDocumentRatioDeviation = [NSNumber numberWithDouble:self.ratioDeviation];
        
        // Set max Output Resolution
        if(!CGSizeEqualToSize(CGSizeZero, self.maxOutputResolution)){
            docModuleView.maxOutputResolution = self.maxOutputResolution;
        }
        
        // Set PostProcessing of the
        [docModuleView setPostProcessingEnabled:self.postProcessing];
        
        NSError *error = nil;
        BOOL success = [docModuleView setupWithLicenseKey:self.key delegate:self error:&error];
        
        self.moduleView = docModuleView;
        
        [self.view addSubview:self.moduleView];
        [self.view sendSubviewToBack:self.moduleView];
        
        // This view notifies the user of any problems that occur while he is scanning
        self.roundedView = [ALPluginHelper createRoundedViewForViewController:self];
    });
}

#pragma mark - AnylineDocumentModuleDelegate method

- (void)anylineDocumentModuleView:(AnylineDocumentModuleView *)anylineDocumentModuleView
                        hasResult:(UIImage *)transformedImage
                        fullImage:(UIImage *)fullFrame
                  documentCorners:(ALSquare *)corners {
    
    NSDictionary *dictResult = [ALPluginHelper dictionaryForTransformedImage:transformedImage
                                                                   fullFrame:fullFrame
                                                                     quality:self.quality
                                                            detectedBarcodes:nil
                                                                     outline:corners];
    
    
    [self.delegate anylineBaseScanViewController:self didScan:dictResult continueScanning:!self.moduleView.cancelOnResult];
    
    if (self.moduleView.cancelOnResult) {
        [self dismissViewControllerAnimated:YES completion:NULL];
    }
}

/*
 This method receives errors that occured during the scan.
 */
- (void)anylineDocumentModuleView:(AnylineDocumentModuleView *)anylineDocumentModuleView
  reportsPictureProcessingFailure:(ALDocumentError)error {
    [self showUserLabel:error];
}

/*
 This method receives errors that occured during the scan.
 */
- (void)anylineDocumentModuleView:(AnylineDocumentModuleView *)anylineDocumentModuleView
  reportsPreviewProcessingFailure:(ALDocumentError)error {
    [self showUserLabel:error];
}

- (BOOL)anylineDocumentModuleView:(AnylineDocumentModuleView *)anylineDocumentModuleView
          documentOutlineDetected:(ALSquare *)outline
                      anglesValid:(BOOL)anglesValid {
    return NO;
}

#pragma mark -- Helper Methods

/*
 Shows a little round label at the bottom of the screen to inform the user what happended
 */
- (void)showUserLabel:(ALDocumentError)error {
    NSString *helpString = nil;
    switch (error) {
        case ALDocumentErrorNotSharp:
            helpString = @"Document not Sharp";
            break;
        case ALDocumentErrorSkewTooHigh:
            helpString = @"Wrong Perspective";
            break;
        case ALDocumentErrorImageTooDark:
            helpString = @"Too Dark";
            break;
        case ALDocumentErrorShakeDetected:
            helpString = @"Too much shaking";
            break;
        default:
            break;
    }
    
    // The error is not in the list above or a label is on screen at the moment
    if(!helpString || self.showingLabel == 1) {
        return;
    }
    
    self.showingLabel = 1;
    self.roundedView.textLabel.text = helpString;
    
    
    // Animate the appearance of the label
    CGFloat fadeDuration = 0.8;
    [UIView animateWithDuration:fadeDuration animations:^{
        self.roundedView.alpha = 1;
    } completion:^(BOOL finished) {
        [UIView animateWithDuration:fadeDuration animations:^{
            self.roundedView.alpha = 0;
        } completion:^(BOOL finished) {
            self.showingLabel = 0;
        }];
    }];
}

//- (void)updateWarningPosition:(CGFloat)newPosition {
//    self.warningView.center = CGPointMake(self.warningView.center.x, newPosition);
//}

@end

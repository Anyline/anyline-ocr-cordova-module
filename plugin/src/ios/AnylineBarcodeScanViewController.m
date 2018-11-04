
#import "AnylineBarcodeScanViewController.h"
#import <Anyline/Anyline.h>

@interface AnylineBarcodeScanViewController ()<AnylineBarcodeModuleDelegate>

@end

@implementation AnylineBarcodeScanViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    dispatch_async(dispatch_get_main_queue(), ^{
        AnylineBarcodeModuleView *barcodeModuleView = [[AnylineBarcodeModuleView alloc] initWithFrame:self.view.bounds];
        
        NSError *error = nil;
        [barcodeModuleView setupWithLicenseKey:self.key delegate:self error:&error];
//        if(!success) {
//            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Setup failed:" message:error.debugDescription delegate:self cancelButtonTitle:@"Ok" otherButtonTitles:nil];
//            [alert show];
//        }

        barcodeModuleView.currentConfiguration = self.conf;

        self.moduleView = barcodeModuleView;
        
        [self.view addSubview:self.moduleView];
        
        [self.view sendSubviewToBack:self.moduleView];
    });
}

#pragma mark - AnylineBarcodeModuleDelegate method


- (void)anylineBarcodeModuleView:(AnylineBarcodeModuleView *)anylineBarcodeModuleView
                   didFindResult:(ALBarcodeResult *)scanResult {
    
    self.scannedLabel.text = (NSString *)scanResult.result;
    [self flashResultFor:0.9];
    
    NSDictionary *dictResult = [ALPluginHelper dictionaryForBarcodeResult:scanResult
                                                                  outline:anylineBarcodeModuleView.barcodeScanViewPlugin.outline
                                                                  quality:100];
    
    [self.delegate anylineBaseScanViewController:self
                                         didScan:dictResult
                                continueScanning:!self.moduleView.cancelOnResult];
    if (self.moduleView.cancelOnResult) {
        [self dismissViewControllerAnimated:YES completion:NULL];
    }
}

@end

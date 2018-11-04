
#import "AnylineBaseScanViewController.h"
#import <Anyline/Anyline.h>

@interface AnylineBaseScanViewController ()

@property (nonatomic,strong) UIButton *doneButton;

@end

@implementation AnylineBaseScanViewController

-(instancetype)initWithKey:(NSString*)key configuration:(ALUIConfiguration *)conf cordovaConfiguration:(ALCordovaUIConfiguration*)cordovaConf delegate:(id<AnylineBaseScanViewControllerDelegate>)delegate {
    self = [super init];
    if(self) {
        _key = key;
        _delegate = delegate;
        _conf = conf;
        _cordovaConfig = cordovaConf;
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    dispatch_async(dispatch_get_main_queue(), ^{
        
        self.doneButton = [ALPluginHelper createButtonForViewController:self config:self.cordovaConfig];
        
        self.scannedLabel = [ALPluginHelper createLabelForView:self.view];
    });
    
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
    [UIApplication sharedApplication].idleTimerDisabled = YES;
    
    NSError *error;
    BOOL success = [self.moduleView startScanningAndReturnError:&error];
    if(!success) {
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Could not start scanning" message:error.localizedDescription delegate:self cancelButtonTitle:@"Ok" otherButtonTitles:nil];
        [alert show];
    }
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
    [self dismissViewControllerAnimated:YES completion:^{
        [self.delegate anylineBaseScanViewController:self didStopScanning:self];
    }];
}

- (void)viewDidDisappear:(BOOL)animated {
    [self turnOffTorch];
    [UIApplication sharedApplication].idleTimerDisabled = NO;
}

- (BOOL)shouldAutorotate {
    return NO;
}

- (void)doneButtonPressed:(id)sender {

    [self turnOffTorch];
    [self.moduleView cancelScanningAndReturnError:nil];
    [self dismissViewControllerAnimated:YES completion:^{
        [self.delegate anylineBaseScanViewController:self didStopScanning:sender];
    }];
}


- (void)turnOffTorch {
    Class captureDeviceClass = NSClassFromString(@"AVCaptureDevice");
    if (captureDeviceClass != nil) {
        AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
        if ([device hasTorch] && [device hasFlash]){
            [device lockForConfiguration:nil];
            [device setTorchMode:AVCaptureTorchModeOff];
            [device setFlashMode:AVCaptureFlashModeOff];
        }
    };
}

- (NSString *)saveImageToFileSystem:(UIImage *)image {
    return [ALPluginHelper saveImageToFileSystem:image];
}

- (NSString *)saveImageToFileSystem:(UIImage *)image compressionQuality:(CGFloat)compressionQuality {
    return [ALPluginHelper saveImageToFileSystem:image compressionQuality:compressionQuality];
}

-(void)flashResultFor:(NSTimeInterval) duration {    
    [UIView animateWithDuration:duration/3 animations:^{
        self.scannedLabel.alpha = 1.0;
    } completion:^(BOOL finished) {
        [UIView animateWithDuration:duration/3*2 animations:^{
            self.scannedLabel.alpha = 0.0;
        } completion:^(BOOL finished) {
            // self.scannedLabel.alpha = 0.0;
        }];
    }];
}

- (NSString *)stringForOutline:(ALSquare *)square {
    return [ALPluginHelper stringForOutline:square];
}


@end

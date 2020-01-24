//
//  ViewController.h
//  MXMWSampleApp
//
//  Created by Zhivko Manchev on 5/30/17.
//  Copyright © 2017 Cognex. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "ALPluginScanViewController.h"

@interface ScannerController : UIViewController

- (instancetype)initWithLicensekey:(NSString *)licensekey
                     configuration:(NSDictionary *)anylineConfig
              cordovaConfiguration:(ALCordovaUIConfiguration *)cordovaConf
                          delegate:(id<ALPluginScanViewControllerDelegate>)delegate;

- (void)setupWithLicensekey:(NSString *)licensekey
              configuration:(NSDictionary *)anylineConfig
       cordovaConfiguration:(ALCordovaUIConfiguration *)cordovaConf
                   delegate:(id<ALPluginScanViewControllerDelegate>)delegate;

@property (weak, nonatomic) IBOutlet UIImageView *ivPreview;
@property (weak, nonatomic) IBOutlet UILabel *lblCode;
@property (weak, nonatomic) IBOutlet UILabel *lblSymbology;
@property (weak, nonatomic) IBOutlet UIButton *btnScan;
@property (weak, nonatomic) IBOutlet UIButton *btnDone;
@property (weak, nonatomic) IBOutlet UILabel *lblConnection;

@property (strong, nonatomic) NSDate *lastScandate;
@property (strong, nonatomic) NSDate *roundaboutScandate;

@property (strong, atomic) UIImage * imageBuffer;
@property (strong, atomic) UIImage * lastImage;

@end


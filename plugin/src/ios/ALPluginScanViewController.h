//
//  ALPluginScanViewController.h
//  Anyline Cordova Example
//
//  Created by Daniel Albertini on 30.10.18.
//

#import <UIKit/UIKit.h>
#import "ALCordovaUIConfiguration.h"

NS_ASSUME_NONNULL_BEGIN

@protocol ALPluginScanViewControllerDelegate;

@interface ALPluginScanViewController : UIViewController

@property (nonatomic, assign) BOOL nativeBarcodeEnabled;

@property (nonatomic, strong) NSString *cropAndTransformErrorMessage;

@property (nonatomic, assign) NSUInteger quality;


- (instancetype)initWithLicensekey:(NSString*)licensekey
                     configuration:(NSDictionary *)anylineConfig
              cordovaConfiguration:(ALCordovaUIConfiguration*)cordovaConf
                          delegate:(id<ALPluginScanViewControllerDelegate>)delegate;

@end

@protocol ALPluginScanViewControllerDelegate <NSObject>

@required

- (void)pluginScanViewController:(ALPluginScanViewController *)pluginScanViewController
                         didScan:(id)scanResult
                continueScanning:(BOOL)continueScanning;

- (void)pluginScanViewController:(ALPluginScanViewController *)pluginScanViewController
                 didStopScanning:(id)sender;
@end

NS_ASSUME_NONNULL_END


#import <UIKit/UIKit.h>
#import "AnylineBaseScanViewController.h"

@interface AnylineEnergyScanViewController : AnylineBaseScanViewController

@property (nonatomic, assign) ALScanMode scanMode;
@property (nonatomic, assign) BOOL nativeBarcodeEnabled;

/**
 * Serial Number whitelist and validationRegEX
 * @warning Parameter can only be changed when the scanning is not running.
 *
 * @since 3.21
 */
@property (nonatomic, strong) NSString *serialValRegex;
@property (nonatomic, strong) NSString *serialWhitelist;


@end

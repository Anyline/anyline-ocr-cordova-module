#import "ALPluginScanViewController.h"

NS_ASSUME_NONNULL_BEGIN

@interface ALNFCScanViewController : UIViewController

- (instancetype _Nullable)initWithConfiguration:(NSDictionary *)anylineConfig
                           cordovaConfiguration:(ALCordovaUIConfiguration *)cordovaConf
                                       callback:(ALPluginCallback)callback;

@end

NS_ASSUME_NONNULL_END

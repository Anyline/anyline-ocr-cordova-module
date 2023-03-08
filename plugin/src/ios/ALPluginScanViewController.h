#import <UIKit/UIKit.h>
#import "ALCordovaUIConfiguration.h"

NS_ASSUME_NONNULL_BEGIN

typedef void (^ALPluginCallback)(id _Nullable callbackObj, NSString * _Nullable errorString);

@interface ALPluginScanViewController : UIViewController

- (instancetype)initWithConfiguration:(NSDictionary *)anylineConfig
                 cordovaConfiguration:(ALCordovaUIConfiguration *)cordovaConf
                             callback:(ALPluginCallback)callback;

@end

NS_ASSUME_NONNULL_END

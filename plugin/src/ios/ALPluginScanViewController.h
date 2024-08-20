#import <UIKit/UIKit.h>
#import "ALCordovaUIConfiguration.h"

NS_ASSUME_NONNULL_BEGIN

typedef void (^ALPluginCallback)(NSDictionary * _Nullable callbackObj, NSError * _Nullable error);

@interface ALPluginScanViewController : UIViewController

- (instancetype)initWithConfiguration:(NSDictionary *)anylineConfig
                 cordovaConfiguration:(ALCordovaUIConfiguration *)cordovaConf
              initializationParamsStr:(NSString *)initializationParamsStr
                             callback:(ALPluginCallback)callback;

@end

NS_ASSUME_NONNULL_END

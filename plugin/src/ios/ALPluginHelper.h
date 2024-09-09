//
//  ALPluginHelper.h
//  Anyline Cordova Example
//
#import <Foundation/Foundation.h>
#import <Anyline/Anyline.h>
#import <UIKit/UIKit.h>
#import "ALCordovaUIConfiguration.h"
#import "ALRoundedView.h"
#import "ALPluginScanViewController.h"

NS_ASSUME_NONNULL_BEGIN

@interface ALPluginHelper : NSObject

+ (ALPluginScanViewController * _Nullable)startScan:(NSDictionary *)config
                            initializationParamsStr:(NSString * _Nullable)initializationParamsStr
                                           finished:(ALPluginCallback)callback;

// UI Elements
+ (UILabel *)createLabelForView:(UIView *)view;

+ (UISegmentedControl * _Nullable)createSegmentForViewController:(UIViewController *)viewController
                                                          config:(ALCordovaUIConfiguration *)config
                                                 initialScanMode:(NSString *)scanMode;

+ (UIButton *)createButtonForViewController:(UIViewController *)viewController
                                     config:(ALCordovaUIConfiguration *)config;

// Errors and Alerts
+ (void)showErrorAlertWithTitle:(NSString *)title
                        message:(NSString *)message
       presentingViewController:(UIViewController *)presentingViewController;

+ (BOOL)showErrorAlertIfNeeded:(NSError *)error
                pluginCallback:(ALPluginCallback)callback;

+ (NSError *)errorWithMessage:(NSString *)message;

// Date Formatting
+ (NSString *)stringForDate:(NSDate *)date;

+ (NSDate * _Nullable)formattedStringToDate:(NSString *)formattedStr;

// Miscellaneous
+ (NSString * _Nullable)confPropKeyWithScanModeForPluginConfig:(ALPluginConfig * _Nullable)pluginConfig;

+ (NSString * _Nullable)saveImageToFileSystem:(UIImage *)image
                           compressionQuality:(CGFloat)compressionQuality;

@end

NS_ASSUME_NONNULL_END

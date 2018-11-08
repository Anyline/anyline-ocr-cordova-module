//
//  ALPluginHelper.h
//  Anyline Cordova Example
//
//  Created by Daniel Albertini on 30.10.18.
//

#import <Foundation/Foundation.h>
#import <Anyline/Anyline.h>
#import <UIKit/UIKit.h>
#import "ALCordovaUIConfiguration.h"
#import "ALRoundedView.h"

NS_ASSUME_NONNULL_BEGIN

@interface ALPluginHelper : NSObject

+ (ALBarcodeFormat)barcodeFormatFromString:(NSString *)barcodeFormat;

+ (NSString *)stringFromBarcodeFormat:(ALBarcodeFormat)barcodeFormat;

+ (NSDictionary<NSString *, NSNumber *> *)barcodesFormatDict;

+ (ALScanMode)scanModeFromString:(NSString *)scanMode;

+ (NSString *)stringFromScanMode:(ALScanMode)scanMode;

+ (NSString *)stringForOutline:(ALSquare *)square;

+ (NSDictionary<NSString *, NSNumber *> *)scanModesDict;

+ (NSString *)saveImageToFileSystem:(UIImage *)image;

+ (NSString *)saveImageToFileSystem:(UIImage *)image
                 compressionQuality:(CGFloat)compressionQuality;

+ (UILabel *)createLabelForView:(UIView *)view;

+ (UISegmentedControl *)createSegmentForViewController:(UIViewController *)viewController
                                                config:(ALCordovaUIConfiguration *)config
                                              scanMode:(ALScanMode)scanMode;

+ (NSString *)barcodeFormatForNativeString:(NSString *)barcodeType;

+ (UIButton *)createButtonForViewController:(UIViewController *)viewController
                                     config:(ALCordovaUIConfiguration *)config;

+ (ALRoundedView *)createRoundedViewForViewController:(UIViewController *)viewController;

+ (NSDictionary *)dictionaryForMeterResult:(ALMeterResult *)scanResult
                          detectedBarcodes:(NSMutableArray<NSDictionary *> *)detectedBarcodes
                                   outline:(ALSquare *)outline
                                   quality:(NSInteger)quality;

+ (NSDictionary *)dictionaryForIDResult:(ALIDResult *)scanResult
                       detectedBarcodes:(NSMutableArray<NSDictionary *> *)detectedBarcodes
                                outline:(ALSquare *)outline
                                quality:(NSInteger)quality;

+ (NSDictionary *)dictionaryForBarcodeResults:(NSMutableArray<NSDictionary *> *)detectedBarcodes
                                  barcodeType:(NSString *)barcodeType
                                   scanResult:(NSString *)scanResult;

+ (NSDictionary *)dictionaryForOCRResult:(ALOCRResult *)scanResult
                        detectedBarcodes:(NSMutableArray<NSDictionary *> *)detectedBarcodes
                                 outline:(ALSquare *)outline
                                 quality:(NSInteger)quality;

+ (NSDictionary *)dictionaryForBarcodeResult:(ALBarcodeResult *)scanResult
                                     outline:(ALSquare *)outline
                                     quality:(NSInteger)quality;

+ (NSDictionary *)dictionaryForLicensePlateResult:(ALLicensePlateResult *)scanResult
                                 detectedBarcodes:(NSMutableArray<NSDictionary *> *)detectedBarcodes
                                          outline:(ALSquare *)outline
                                          quality:(NSInteger)quality;

+ (NSDictionary *)dictionaryForTransformedImage:(UIImage *)transformedImage
                                      fullFrame:(UIImage *)fullFrame
                                        quality:(NSInteger)quality
                               detectedBarcodes:(NSMutableArray<NSDictionary *> *)detectedBarcodes
                                        outline:(ALSquare *)outline;

@end

NS_ASSUME_NONNULL_END

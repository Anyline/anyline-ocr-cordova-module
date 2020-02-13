//
//  MWOverlay.h
//  mobiscan_ALL
//
//  Created by vladimir zivkovic on 12/12/13.
//  Copyright (c) 2013 Manatee Works. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>

@interface MWOverlay : NSObject
enum PauseMode{
    PM_NONE,
    PM_PAUSE,
    PM_STOP_BLINKING
};
enum OverlayMode{
    OM_CMB,
    OM_LEGACY
};
+ (void) addToPreviewLayer:(AVCaptureVideoPreviewLayer *) videoPreviewLayer;
+ (void) removeFromPreviewLayer;
+ (void) updateOverlay;
+ (BOOL) isAttached;

//customization of overlay
+ (void) setPaused: (BOOL) paused;
+ (void) setPauseMode: (enum PauseMode) pMode;
+ (void) setViewportVisible: (BOOL) value;
+ (void) setTargetRectVisible: (BOOL) value;
+ (void) setBlinkingLineVisible: (BOOL) value;
+ (void) setViewportLineWidth: (float) value;
+ (void) setBlinkingLineWidth: (float) value;
+ (void) setLocationLineWidth: (float) value;
+ (void) setTargetRectLineWidth: (float) value;
+ (void) setViewportAlpha: (float) value;
+ (void) setTargetRectLineAlpha: (float) value;
+ (void) setViewportLineAlpha: (float) value;
+ (void) setBlinkingLineAlpha: (float) value;
+ (void) setBlinkingSpeed: (float) value;
+ (void) setViewportLineRGBColor: (int) value;
+ (void) setBlinkingLineRGBColor: (int) value;
+ (void) setTargetRectLineRGBColor: (int) value;
+ (void) setLocationLineRGBColor: (int) value;
+ (void) setViewportLineUIColor: (UIColor*) value;
+ (void) setBlinkingLineUIColor: (UIColor*) value;
+ (void) setTargetRectLineUIColor: (UIColor*) value;
+ (void) setLocationLineUIColor: (UIColor*) value;
+ (void) showLocation: (CGPoint *) points imageWidth:(int) width imageHeight: (int) height;
+ (void) showLocations: (CGPoint *) points count:(int) count imageWidth:(int) width imageHeight: (int) height;
+ (int) getLocationLineColor;
+ (int) getTargetRectLineColor;

+ (void) setOverlayMode:(int) overlayMode;
+ (int) getOverlayMode;
+ (void) addViewFinderToView:(UIView*) scannerView isFullScreen:(BOOL) fullScreen;
@end

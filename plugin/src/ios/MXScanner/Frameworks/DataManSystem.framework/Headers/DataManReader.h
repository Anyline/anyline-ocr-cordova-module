//
//  MXReader.h
//  MX_SDK
//
//  Created by Gyula Hatalyak on 10/01/17.
//  Copyright © 2017 Gyula Hatalyak. All rights reserved.
//

#import "ReaderDevice.h"

@interface DataManReader : ReaderDevice

- (instancetype)initWithExternalAccessory;

- (instancetype)initWithIP:(NSString *)IP_Address
                      port:(int)port
                  username:(NSString *)username
                  password:(NSString *)password;

- (instancetype)initWithCameraMode:(CDMCameraMode)cameraMode
                    previewOptions:(CDMPreviewOption)previewOptions
                       previewView:(nullable UIView*)previewContainer;
@end

//
//  ALCognexDevice.m
//  MXSampleApp
//
//  Created by David Dengg on 11.12.18.
//  Copyright © 2018 Cognex. All rights reserved.
//

#import "CMBReadResult.h"
#import "CDMXMLParser.h"
#import "DMQSXmlResultParser.h"
#import "CMBReaderDevice.h"
#import <Anyline/Anyline.h>
#import "ALCognexDevice.h"

@interface ALCognexDevice () <CMBReaderDeviceDelegate, CDMDataManSystemDelegate>

@property (nonatomic, strong) UIImage * currentImage;
@property (nonatomic, strong) UIImage * lastImage;
@property (nonatomic, strong) dispatch_queue_t imagerQ;
@property (nonatomic, strong) NSTimer * imagerTimer;


@property (nonatomic, assign) BOOL getNewImage;
@end

@implementation ALCognexDevice

CMBReaderDevice *readerDevice;

- (instancetype)init
{
    self = [super init];
    if (self) {
        _imagerQ = dispatch_queue_create("cognex.imager.queue", 0);
        self.preview = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, 50, 50)];
        self.preview.contentMode = UIViewContentModeScaleAspectFit;
        _isConnected = @(NO);
    }
    return self;
}


- (void)loadSettings {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
    [readerDevice setSymbology:CMBSymbologyDataMatrix enabled:YES completion:^(NSError *error){
        if (error)
        {
            NSLog(@"FAILED TO ENABLE [Symbology_DataMatrix], %@", error.description);
        }
    }];
    [readerDevice setSymbology:CMBSymbologyQR enabled:YES completion:^(NSError *error){
        if (error)
        {
            NSLog(@"FAILED TO ENABLE [Symbology_QR], %@", error.description);
        }
    }];
    [readerDevice setSymbology:CMBSymbologyC128 enabled:YES completion:^(NSError *error){
        if (error)
        {
            NSLog(@"FAILED TO ENABLE [Symbology_C128], %@", error.description);
        }
    }];
    [readerDevice setSymbology:CMBSymbologyUpcEan enabled:YES completion:^(NSError *error){
        if (error)
        {
            NSLog(@"FAILED TO ENABLE [Symbology_UpcEan], %@", error.description);
        }
    }];
}


- (void)disconnectReaderDevice {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
    if (readerDevice != nil && readerDevice.connectionState != CMBConnectionStateDisconnected) {
        [readerDevice disconnect];
    }
}


- (void)availabilityDidChangeOfReader:(CMBReaderDevice *)reader {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
    
    BOOL readerAvailable = (reader.availability == CMBReaderAvailibilityAvailable);
    NSLog(@"readerAvailable: %i", readerAvailable);
    
    if ((reader.availability != CMBReaderAvailibilityAvailable)) {
        self.isConnected = @(NO);
        [self disconnectReaderDevice];
    }else{
        self.isConnected = @(YES);
        readerDevice = [CMBReaderDevice readerOfMXDevice];
        readerDevice.delegate = self;
        readerDevice.dataManSystem.delegate = self;
        if ((readerDevice.availability == CMBReaderAvailibilityAvailable)) {
            [self connectToReaderDevice];
        }
    }
}




- (void)startReader {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
    [readerDevice.dataManSystem sendCommand:@"SET CAMERA.EXPOSURE-US OFF 128 400 50" withCallback:^(CDMResponse *response) {
        [readerDevice.dataManSystem sendCommand:@"GET CAMERA.EXPOSURE-US" withCallback:^(CDMResponse *response) {
            NSLog(@"Exposure-US: %@",response.payload);
            [readerDevice.dataManSystem sendCommand:@"SET CAMERA.EXPOSURE 400" withCallback:^(CDMResponse *response) {
                [readerDevice.dataManSystem sendCommand:@"GET CAMERA.EXPOSURE" withCallback:^(CDMResponse *response) {
                    NSLog(@"Exposure: %@",response.payload);
                    [readerDevice.dataManSystem sendCommand:@"SET CAMERA.GAIN 6.0" withCallback:^(CDMResponse *response) {
                        [readerDevice.dataManSystem sendCommand:@"GET CAMERA.GAIN" withCallback:^(CDMResponse *response) {
                            NSLog(@"GAIN: %@",response.payload);
                            [readerDevice.dataManSystem sendCommand:@"SET FOCUS.POWER 13.0" withCallback:^(CDMResponse *response) {
                                [readerDevice.dataManSystem sendCommand:@"GET FOCUS.POWER" withCallback:^(CDMResponse *response) {
                                    NSLog(@"FOCUS POWER: %@",response.payload);
                                    [self startFillingImageBuffer];
                                    [self.delegate deviceIsReadyToScan];
                                    
                                }];
                            }];
                        }];
                    }];
                }];
            }];
        }];
    }];
}

- (void)startFillingImageBuffer {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
//    __weak __block typeof(self) welf = self;
    self.getNewImage = YES;
    self.imagerTimer = [NSTimer scheduledTimerWithTimeInterval:0.05 repeats:YES block:^(NSTimer * _Nonnull timer) {
        [self tryToFillImageBuffer];
    }];
}

- (void)tryToFillImageBuffer {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
    if( self.getNewImage == YES) {
        self.getNewImage = NO;
        [self fillImageBuffer];
    }
}

- (void)fillImageBuffer {
    __block NSDate * stamp = [NSDate date];
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
    [readerDevice.dataManSystem sendCommand:@"IMAGE.FETCH 1 1 90"
                                   withData:nil
                                    timeout:5000
                       expectBinaryResponse:YES
                                   callback:^(CDMResponse *response) {
                                       //UIImageWriteToSavedPhotosAlbum(img,nil,nil,nil);
                                       NSLog(@" %@ takes %f", NSStringFromSelector(_cmd), [stamp timeIntervalSinceNow]);
                                       [self receivedBinaryImageFromDM:response.binaryPayload];
                                   }];
}

- (void)receivedBinaryImageFromDM:(NSData*)imageData {
    self.lastImage = self.currentImage;
    UIImage *img = [UIImage imageWithData:imageData];
    self.currentImage = img;
    NSLog(@"%@", img);
    NSLog(@"%@", NSStringFromCGSize(img.size));
    self.preview.image = img;
    self.getNewImage = YES;
}

- (void)stopFillingImageBuffer {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
    [self.imagerTimer invalidate];
}

- (void)dataManSystemDidConnect:(CDMDataManSystem *)dataManSystem {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
    dispatch_async(dispatch_get_main_queue(), ^{
        self.isConnected = @(YES);
    });
}

- (void)dataManSystemDidDisconnect:(CDMDataManSystem *)dataManSystem withError:(NSError *)error {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
    dispatch_async(dispatch_get_main_queue(), ^{
        self.isConnected = @(NO);
    });
}

- (void)connectionStateDidChangeOfReader:(CMBReaderDevice *)reader {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
    if (readerDevice.connectionState == CMBConnectionStateConnected)
    {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self loadSettings];
        });
        self.isConnected = @(YES);
    } else {
        self.isConnected = @(NO);
    }
}

- (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveStatusEvent:(NSData *)data {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
}

- (void)dataManSystem:(CDMDataManSystem *)dataManSystem didReceiveImage:(UIImage *)image withId:(int)resultId {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
}

- (void)didReceiveReadResultFromReader:(CMBReaderDevice *)reader results:(CMBReadResults *)readResults {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
}

- (void)setupDevice {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
    if (readerDevice == nil) {
        dispatch_async(dispatch_queue_create("MXInit", nil), ^{
            readerDevice = [CMBReaderDevice readerOfMXDevice];
            
            dispatch_async(dispatch_get_main_queue(), ^{
                [readerDevice setDelegate:self];
                readerDevice.dataManSystem.delegate = self;
                [self connectToReaderDevice];
            });
        });
    } else {
        readerDevice.delegate = self;
        readerDevice.dataManSystem.delegate = self;
        [self connectToReaderDevice];
    }
}

- (void)connectToReaderDevice {
    NSLog(@"%@: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
    NSLog(@"connect availability %lu",    readerDevice.availability);
    NSLog(@"connect connectionState %lui", readerDevice.connectionState);
    
    if (   readerDevice.availability == CMBReaderAvailibilityAvailable && readerDevice.connectionState != CMBConnectionStateConnected)
    {
        [readerDevice connectWithCompletion:^(NSError *error){
            if (error) {
                [[[UIAlertView alloc]initWithTitle:@"Failed to connect" message:error.description delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil]show];
                NSLog(@"connect error:\n%@", error);
                self.isConnected = @(NO);
                return;
            }
            [readerDevice setDelegate:self];
            readerDevice.dataManSystem.delegate = self;
            self.isConnected = @(YES);
        }];
    } else if (readerDevice.connectionState != CMBConnectionStateConnected) {
        NSLog(@"readerDevice.connectionState != CMBConnectionStateConnected");
        self.isConnected = @(NO);
    }
}


- (void)reconnectDevice {
    if (readerDevice != nil
        && readerDevice.availability == CMBReaderAvailibilityAvailable
        && readerDevice.connectionState != CMBConnectionStateConnecting && readerDevice.connectionState != CMBConnectionStateConnected)
    {
        [readerDevice connectWithCompletion:^(NSError *error) {
            if (error) {
                // handle connection error
            }
        }];
    }
}



@end

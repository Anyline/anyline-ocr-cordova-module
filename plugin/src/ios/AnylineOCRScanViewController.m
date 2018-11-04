//
//  AnylineOCRScanViewController.m
//  HelloCordova
//
//  Created by Daniel Albertini on 30/03/16.
//
//

#import "AnylineOCRScanViewController.h"
#import <Anyline/Anyline.h>

@interface AnylineOCRScanViewController ()<AnylineOCRModuleDelegate>

@property (nonatomic, assign) BOOL drawTextOutline;

@end

@implementation AnylineOCRScanViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    dispatch_async(dispatch_get_main_queue(), ^{
        AnylineOCRModuleView *ocrModuleView = [[AnylineOCRModuleView alloc] initWithFrame:self.view.bounds];

        ALOCRConfig *ocrConf = [[ALOCRConfig alloc] initWithJsonDictionary:self.ocrConfDict];

        if ([self.ocrConfDict objectForKey:@"aleFile"]) {
            NSString *aleDirectoryPath = [NSString stringWithFormat:@"%@/%@",@"www", [[self.ocrConfDict objectForKey:@"aleFile"] stringByDeletingLastPathComponent]];
            NSString *pathResource = [[[self.ocrConfDict objectForKey:@"aleFile"] lastPathComponent] stringByDeletingPathExtension];
            ocrConf.customCmdFilePath = [[NSBundle mainBundle] pathForResource:pathResource ofType:@"ale" inDirectory:aleDirectoryPath];
        }

        self.drawTextOutline = [[self.ocrConfDict objectForKey:@"drawTextOutline"] boolValue];

        NSArray *tesseractArray = [self.ocrConfDict objectForKey:@"traineddataFiles"];

        NSError *error = nil;

         NSMutableArray<NSString *> *languages = [NSMutableArray arrayWithCapacity:tesseractArray.count];
        for (NSString *tesseractLang in tesseractArray) {
            NSString *ressourcePath = [[NSBundle mainBundle] pathForResource:[[tesseractLang lastPathComponent] stringByDeletingPathExtension] ofType:[[tesseractLang lastPathComponent] pathExtension] inDirectory:[NSString stringWithFormat:@"www/%@",[tesseractLang stringByDeletingLastPathComponent]]];
            NSError *copyError = nil;
            [languages addObject:ressourcePath];
        }
        ocrConf.languages = languages;

        [ocrModuleView setupWithLicenseKey:self.key delegate:self ocrConfig:ocrConf error:&error];

        ocrModuleView.currentConfiguration = self.conf;

        self.moduleView = ocrModuleView;

        [self.view addSubview:self.moduleView];

        [self.view sendSubviewToBack:self.moduleView];
    });
}

#pragma mark - AnylineEnergyModuleDelegate method

- (void)anylineOCRModuleView:(AnylineOCRModuleView *)anylineOCRModuleView
               didFindResult:(ALOCRResult *)result {

    NSDictionary *dictResult = [ALPluginHelper dictionaryForOCRResult:result
                                                     detectedBarcodes:nil
                                                              outline:anylineOCRModuleView.ocrScanViewPlugin.outline
                                                              quality:100];

    [self.delegate anylineBaseScanViewController:self didScan:dictResult continueScanning:!self.moduleView.cancelOnResult];

    if (self.moduleView.cancelOnResult) {
        [self dismissViewControllerAnimated:YES completion:NULL];
    }
}

- (BOOL)anylineOCRModuleView:(AnylineOCRModuleView *)anylineOCRModuleView
         textOutlineDetected:(ALSquare *)outline {
    return !self.drawTextOutline;
}


@end

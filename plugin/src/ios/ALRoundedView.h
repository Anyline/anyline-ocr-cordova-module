#import <UIKit/UIKit.h>

@interface ALRoundedView : UIView

@property (nonatomic, strong) UILabel *textLabel;

@property (nonatomic, assign) CGFloat cornerRadius;
@property (nonatomic, assign) CGFloat borderWidth;

@property (nonatomic, strong) UIColor *fillColor;
@property (nonatomic, strong) UIColor *textColor;
@property (nonatomic, strong) UIColor *borderColor;

- (void)addTarget:(id)target selector:(SEL)selector;

- (void)addImage:(UIImage*)image;

@end

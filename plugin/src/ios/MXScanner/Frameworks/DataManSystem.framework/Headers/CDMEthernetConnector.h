//
//  CDMEthernetConnecter.h
//  DataManSDK
//
//  Created by Ferenc Knebl on 01/12/14.
//  Copyright (c) 2014 Cognex Corporation. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CDMStreamConnector.h"

@interface CDMEthernetConnector : CDMStreamConnector<NSStreamDelegate>

- (id)initWithHost:(NSString *)host port:(int)port encoding:(NSStringEncoding)encoding delegate:(id<CDMConnectorDelegate>)delegate delegateQueue:(dispatch_queue_t)queue;

@end

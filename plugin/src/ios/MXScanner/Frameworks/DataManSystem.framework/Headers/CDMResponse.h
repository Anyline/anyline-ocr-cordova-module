//
//  CDMResponse.h
//
//  Copyright (c) 2014 Cognex Corporation. All rights reserved.
//

#import <Foundation/Foundation.h>

#define DMCC_STATUS_NO_ERROR 0
#define DMCC_STATUS_READ_STRING 1
#define DMCC_STATUS_AUTO_RESPONSE 2   // This is not used in the current firmware (4.2).
#define DMCC_STATUS_XML_RESULT 3
#define DMCC_STATUS_XML_STATISTICS 4
#define DMCC_STATUS_IMAGE 5
#define DMCC_STATUS_IMAGE_GRAPHICS 6
#define DMCC_STATUS_TRAINING_RESULT 7
#define DMCC_STATUS_AUTO_TRAIN_BRIGHT 8
#define DMCC_STATUS_AUTO_TRAIN_STRING 9
#define DMCC_STATUS_CODE_QUALITY_DATA 10
#define DMCC_STATUS_AUTO_TRAIN_FOCUS 11
#define DMCC_STATUS_EVENT 12

#define DMCC_STATUS_UNIDENTIFIED_ERROR 100
#define DMCC_STATUS_INVALID_COMMAND 101
#define DMCC_STATUS_INVALID_PARAM_OR_MISSING_FEATURE 102
#define DMCC_STATUS_INCORRECT_CHECKSUM 103
#define DMCC_STATUS_PARAMETER_REJECTED 104
#define DMCC_STATUS_READER_OFFLINE 105

#define DMCC_STATUS_COMMAND_TIMEOUT -1

/**
 *  Represents a DMCC response sent by a remote system.
 */
@interface CDMResponse : NSObject
/**
 *  Id of the response
 */
@property (nonatomic, readonly) int responseId;
/**
 *  Status of the response
 */
@property (nonatomic, readonly) int status;
/**
 *  Payload content
 */
@property (nonatomic, readonly) NSString* payload;
/**
 *  Binary data
 */
@property (nonatomic, readonly) NSData* binaryPayload;

- (id) initWithResponseId:(int)responseId status:(int)status payload:(NSString*)payload binaryPayload:(NSData*)binaryPayload;

@end


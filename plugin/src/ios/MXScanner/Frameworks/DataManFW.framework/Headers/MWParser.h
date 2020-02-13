/**
 * @file    MWParser.h
 * @brief   Barcode Parser Library
 * @n       (C) Manatee Works, 2014.
 *
 *          Main user public header.
 */

#ifndef MWParser_h
#define MWParser_h

#ifdef __cplusplus
extern "C" {
#endif

/**
 * @name General configuration
 ** @{
 */


/**
 * @name Basic return values for API functions
 * @{
 */
#define MWP_RT_OK                   0
#define MWP_RT_FAIL                 -1
#define MWP_RT_NOT_SUPPORTED        -2
#define MWP_RT_BAD_PARAM            -3
#define MWP_RT_BAD_INPUT            -4
/** @} */

/**
 * @name Bit mask identifiers for supported decoder types
 * @{ */
#define MWP_PARSER_MASK_NONE                0x00000000u
#define MWP_PARSER_MASK_GS1                 0x00000001u
#define MWP_PARSER_MASK_IUID                0x00000002u
#define MWP_PARSER_MASK_ISBT                0x00000004u
#define MWP_PARSER_MASK_AAMVA         		0x00000008u
#define MWP_PARSER_MASK_HIBC         		0x00000010u
#define MWP_PARSER_MASK_SCM         		0x00000020u
/** @} */

    
//UID PARSER ERROR CODES
#define UID_ERROR_INVALID_HEADER    -1
#define UID_ERROR_INVALID_FORMAT    -2
#define UID_ERROR_INVALID_EI        -3.0
#define UID_ERROR_INVALID_CAGE      -3.1
#define UID_ERROR_INVALID_DUNS      -3.2
#define UID_ERROR_INVALID_DODAAC    -3.3
#define UID_ERROR_INVALID_GS1COMP   -3.4
#define UID_ERROR_INVALID_PN        -4
#define UID_ERROR_INVALID_SN        -5
#define UID_ERROR_INVALID_UII       -6
#define UID_ERROR_INVALID_LOT       -7
#define UID_ERROR_GS_MISSING        -8      //GS Missing after Header
#define UID_ERROR_RS_MISSING        -9
#define UID_ERROR_EOT_MISSING       -10
#define UID_ERROR_NO_SN             -11
#define UID_ERROR_NO_EI             -12
#define UID_ERROR_NO_PN             -13
#define UID_ERROR_NO_LOT            -14
#define UID_ERROR_DUPLICATE_DQ      -15
#define UID_ERROR_DUPLICATE_UII     -16
#define UID_ERROR_DUPLICATE_LOT     -17
#define UID_ERROR_DUPLICATE_SN      -18
#define UID_ERROR_DUPLICATE_EI      -19
#define UID_ERROR_LOT_PN_CONFLICT   -20
#define UID_ERROR_MISSING_REQ       -21
#define UID_ERROR_INVALID_IAC       -22
#define UID_ERROR_INVALID_TEI       -23
#define UID_ERROR_NOT_ENOUGHT_MEMORY          -24


//UID PARSER WARNING CODES
#define UID_WARN_EXTRA_CHARS        91      //characters after EOT
#define UID_WARN_UNNEEDED_DATA      92      //unneeded additional data
#define UID_WARN_SPACE_AROUND       93      //space at the beginning or end of the uid
#define UID_WARN_UNKNOWN_DQ         94
#define UID_WARN_OBSOLETE_FORMAT    95      //warning for DD


//AAMVA PARSER ERROR CODES
#define AAMVA_ERROR_INVALID_FORMAT             -1
#define AAMVA_ERROR_INVALID_HEADER    	       -2
#define AAMVA_ERROR_INVALID_IIN      	       -3
#define NOT_ENOUGHT_MEMORY                     -4
#define AAMVA_ERROR_INVALID_JN      	       -5
#define AAMVA_ERROR_INVALID_NENTIRES  	       -6


//AAMVA PARSER WARNING CODES
#define AAMVA_WARNING_MISSING_MANDATORY_FIELDS  1


//UPS/SCM PARSER ERROR CODES
#define SCM_ERROR_INVALID_FORMAT			-1
#define SCM_ERROR_INVALID_CODE				-2
#define SCM_ERROR_ELEMENT_NOT_FOUND			-3
#define SCM_ERROR_CANT_ALLOCATE_MEMORY		-4

//UPS/SCM PARSER WARNING CODES
#define SCM_WARNING_LENGTH_OUT_OF_BOUNDS		1		//possible compression used by UPS
#define SCM_WARNING_FIELD_EXCEEDS_MAX_LENGTH	2		//possible compression used by UPS
#define SCM_WARNING_INVALID_TERMINATOR			3		//possible compression used by UPS



/**
 * Returns supported parsers in this library release.
 *
 * @returns 32-bit bit mask where each non-zero bit represents
 *          supported decoder according to MWP_PARSER_MASK_... values
 *          defined in MWParser.h header file.
 */
extern unsigned int MWP_getSupportedParsers(void);
    

/*
 * Registers licensing information with selected single parser type.
 * If registering information is correct, enables full support for selected
 * parser type.
 * Should be called once per decoder type.
 *
 * @param[in]   parserMask              Single parser type selector (MWP_PARSER_MASK_...)
 * @param[in]   userName                User name string
 * @param[in]   key                     License key string
 *
 * @retval      MWP_RT_OK               Registration successful
 *              MWP_RT_FAIL             Registration failed
 *              MWP_RT_BAD_PARAM        More than one parser flag selected
 *              MWP_RT_NOT_SUPPORTED    Selected parser type or its registration
 *                                      is not supported
 */
extern int
    MWP_registerParser(const uint32_t parserMask, const char * userName, const char * key);

    
    
/*
 * Get parsed result in form of 'formatted text', mainly suited for demonstration purpose.
 * It would return text with rows consisted of key/values pairs, like: (ABC) 123456, where
 * ABC is a key, and 123456 is a value.
 *
 * @param[in]   parser_type             Single parser type selector (MWP_PARSER_MASK_...)
 * @param[in]   p_input                 Input byte array from decoder
 * @param[in]   inputLength             Length of input byte array
 * @param[in]   pp_output               Output formatted result
 *
 * @retval      MWP_RT_OK               Parsing successful
 *              MWP_RT_FAIL             Parsing failed
 */
extern double
   MWP_getFormattedText(const int parser_type, const unsigned char * p_input, const int inputLength, unsigned char **pp_output);

/*
 * Get parsed result as JSON string, caontaining general info about parsed data, and fields array.
 *
 * @param[in]   parser_type             Single parser type selector (MWP_PARSER_MASK_...)
 * @param[in]   p_input                 Input byte array from decoder
 * @param[in]   inputLength             Length of input byte array
 * @param[in]   pp_output               Output JSON string
 *
 * @retval      MWP_RT_OK               Parsing successful
 *              MWP_RT_FAIL             Parsing failed
 */
double
    MWP_getJSON(const int parser_type, const unsigned char* p_input, const int inputLength, unsigned char **pp_output);



#ifdef __cplusplus
}
#endif

#endif

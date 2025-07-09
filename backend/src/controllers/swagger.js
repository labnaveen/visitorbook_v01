// Email Auth Controller

//1. POST API FOR RESET PASSWORD

/**
 * User reset password
 * @route POST /auth/email/resetpassword:
 * @api public[temp demo]
 * @param {object} req
 * @param {object} res
 * @return {error|json}
 * @author Deepak Tiwari
 */

/**
 * @swagger
 * /auth/email/resetpassword:
 *  put:
 *   tags:
 *    - Email Auth Module
 *   requestBody:
 *    description: User reset-password
 *    required: false
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            password:
 *              type: string
 *            access_token:
 *              type: string
 *   responses:
 *    '200':
 *      description: successful
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *    '500':
 *      description: error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Authorization invalid
 *    '404':
 *      description: Not found
 *    '422':
 *      description: validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationResponse'
 */


/// 2. POST API FOR OTHER DEVICE LOGOUT

/**
 * User logout
 * @route POST /auth/email/otherdevicesignout:
 * @api public[temp demo]
 * @param {object} req
 * @param {object} res
 * @return {error|json}
 * @author Deepak Tiwari
 */

/**
 * @swagger
 * /auth/email/otherdevicesignout:
 *  post:
 *   tags:
 *    - Email Auth Module
 *   requestBody:
 *    description: User sign-out
 *    required: false
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            device_name:
 *              type: string
 *            fcm:
 *              type: string
 *            access_token:
 *              type: string
 *   responses:
 *    '200':
 *      description: successful
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *    '500':
 *      description: error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Authorization invalid
 *    '404':
 *      description: Not found
 *    '422':
 *      description: validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationResponse'
 */


//3. GET API FOR USER LOGOUT

/**
 * @swagger
 * /auth/email/signout:
 *  get:
 *   tags:
 *    - Email Auth Module
 *   responses:
 *    '200':
 *      description: successful
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *    '500':
 *      description: error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Authorization invalid
 *    '404':
 *      description: Not found
 *    '422':
 *      description: validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationResponse'
 */

//4. GET API FOR USER DELETE USER

/**
 * @swagger
 * /auth/email/deleteuser:
 *  get:
 *   tags:
 *    - Email Auth Module
 *   responses:
 *    '200':
 *      description: successful
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *    '500':
 *      description: error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Authorization invalid
 *    '404':
 *      description: Not found
 *    '422':
 *      description: validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationResponse'
 */



/// 5. POST API FOR RESEND OTP

/**
 * Resend OTP
 * @route POST /auth/email/resendotp:
 * @api public[temp demo]
 * @param {object} req
 * @param {object} res
 * @return {error|json}
 * @author Deepak Tiwari
 */

/**
 * @swagger
 * /auth/email/resendotp:
 *  post:
 *   tags:
 *    - Email Auth Module
 *   requestBody:
 *    description: User reset-password
 *    required: false
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *   responses:
 *    '200':
 *      description: successful
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *    '500':
 *      description: error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Authorization invalid
 *    '404':
 *      description: Not found
 *    '422':
 *      description: validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationResponse'
 */



/// 6. POST API FOR USER SIGNIN
/**
 * User login
 * @route POST /auth/email/signin:
 * @api public[temp demo]
 * @param {object} req
 * @param {object} res
 * @return {error|json}
 * @author Deepak Tiwari
 */
/**
 * @swagger
 * /auth/email/signin:
 *  post:
 *   tags:
 *    - Email Auth Module
 *   requestBody:
 *    description: User sign-in
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *              required: true
 *            password:
 *              type: string
 *              required: true
 *            fcm:
 *              type: string
 *              required: false
 *            device_id:
 *              type: string
 *              required: false
 *            ip_address:
 *              type: string
 *              required: true
 *            device_name:
 *              type: string
 *              required: true
 *            language:
 *              type: string
 *              required: true
 *   responses:
 *    '200':
 *      description: successful
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *    '500':
 *      description: error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Authorization invalid
 *    '404':
 *      description: Not found
 *    '422':
 *      description: validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationResponse'
 */


/// 7. POST API FOR VERIFY OTP
/**
 * Verify emailed otp
 * @route POST /auth/email/verifyotp:
 * @api public[temp demo]
 * @param {object} req
 * @param {object} res
 * @return {error|json}
 * @author Deepak Tiwari
 */
/**
 * @swagger
 * /auth/email/verifyotp:
 *  post:
 *   tags:
 *    - Email Auth Module
 *   requestBody:
 *    description: Verify emailed otp
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            otp:
 *              type: number
 *   responses:
 *    '200':
 *      description: successful
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *    '500':
 *      description: error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Authorization invalid
 *    '404':
 *      description: Not found
 *    '422':
 *      description: validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationResponse'
 */



/// 8. POST API FOR USER SIGNUP
/**
 * Insert User details
 * @route POST /auth/email/signup:
 * @api public[temp demo]
 * @param {object} req
 * @param {object} res
 * @return {error|json}
 * @author Deepak Tiwari
 */
/**
 * @swagger
 * /auth/email/signup:
 *  post:
 *   tags:
 *    - Email Auth Module
 *   requestBody:
 *    description: User details for user registration using email
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            country_code:
 *              type: string
 *            mobile:
 *              type: string
 *            name:
 *              type: string
 *            language:
 *              type: string
 *            password:
 *              type: string
 *   responses:
 *    '200':
 *      description: successful
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *    '500':
 *      description: error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Authorization invalid
 *    '404':
 *      description: Not found
 *    '422':
 *      description: validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationResponse'
 */



/// 9. GET API FOR REFRESH TOKEN

/**
 * @swagger
 * /auth/email/refreshtoken:
 *  get:
 *   tags:
 *    - Email Auth Module
 *   responses:
 *    '200':
 *      description: successful
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *    '500':
 *      description: error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Authorization invalid
 *    '404':
 *      description: Not found
 *    '422':
 *      description: validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationResponse'
 */



/// 10. POST API for upload image
/**
 * upload image in S3 bucket
 * @route POST /user/uploadimage:
 * @api public[temp demo]
 * @param {object} req
 * @param {object} res
 * @return {error|json}
 * @author Deepak Tiwari
 */
/**
 * @swagger
 * /user/uploadimage:
 *  post:
 *   tags:
 *    - User Module
 *   requestBody:
 *    description:   Insert user's profile picture
 *    required: true
 *    content:
 *      multipart/form-data:
 *        schema:
 *          type: object
 *          properties:
 *            image:
 *              type: file
 *   responses:
 *    '200':
 *      description: successful
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *    '500':
 *      description: error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Authorization invalid
 *    '404':
 *      description: Not found
 *    '422':
 *      description: validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationResponse'
 */


/// 11. PUT API FOR CHANGE PASSWORD
/**
* Update language 
* @route PUT /auth/email/changepassword:
* @api public[temp demo]
* @param {object} req
* @param {object} res
* @return {error|json}
* @author Deepak Tiwari
*/
/**
* @swagger
*  /auth/email/uploadimage:
*  put:
*   tags:
*    - Email Auth Module
*   requestBody:
*    required: true
*    content:
*      application/x-www-form-urlencoded:
*        schema:
*          type: object
*   responses:
*    '200':
*      description: successful
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/schemas/SuccessResponse'
*    '403':
*      description: error
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/schemas/ErrorResponse'
*    '400':
*      description: Bad request
*    '401':
*      description: Authorization invalid
*    '404':
*      description: Not found
*    '422':
*      description: validation error
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/schemas/ValidationResponse'
*/



// SOCIAL AUTH CONTROLLER


/// 1. POST API FOR USER SOCIAL REGISTRATION
/**
 * Insert User details
 * @route POST /auth/email/socialidregistration:
 * @api public[temp demo]
 * @param {object} req
 * @param {object} res
 * @return {error|json}
 * @author Deepak Tiwari
 */
/**
 * @swagger
 * /auth/email/socialidregistration:
 *  post:
 *   tags:
 *    - Email Auth Module Social
 *   requestBody:
 *    description: User details for user registration using email
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            social_type:
 *              type: string
 *            social_id:
 *              type: string
 *            is_social_email:
 *              type: string
 *            language:
 *              type: string
 *            fcm:
 *              type: string
 *            device_id:
 *              type: string
 *            ip_address:
 *              type: string
 *            device_name:
 *              type: string
 *   responses:
 *    '200':
 *      description: successful
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *    '500':
 *      description: error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Authorization invalid
 *    '404':
 *      description: Not found
 *    '422':
 *      description: validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationResponse'
 */


/// 2. POST API FOR SOCIAL SIGN-IN
/**
 * Insert User details
 * @route POST /auth/email/socialsignin:
 * @api public[temp demo]
 * @param {object} req
 * @param {object} res
 * @return {error|json}
 * @author Deepak Tiwari
 */
/**
 * @swagger
 * /auth/email/socialsignin:
 *  post:
 *   tags:
 *    - Email Auth Module Social
 *   requestBody:
 *    description: User details for user registration using email
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            social_id:
 *              type: string
 *            social_type:
 *              type: string
 *            is_social_email:
 *              type: bool
 *            language:
 *              type: string
 *            signup_by:
 *              type: string
 *            fcm:
 *              type: string
 *            device_id:
 *              type: string
 *            ip_address:
 *              type: string
 *            device_name:
 *              type: string
 *   responses:
 *    '200':
 *      description: successful
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *    '500':
 *      description: error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Authorization invalid
 *    '404':
 *      description: Not found
 *    '422':
 *      description: validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationResponse'
 */


/// 3. POST API FOR REQUEST SOCIAL OTP
/**
 * Insert User details
 * @route POST /auth/email/requestsocialotp:
 * @api public[temp demo]
 * @param {object} req
 * @param {object} res
 * @return {error|json}
 * @author Deepak Tiwari
 */
/**
 * @swagger
 * /auth/email/requestsocialotp:
 *  post:
 *   tags:
 *    - Email Auth Module Social
 *   requestBody:
 *    description: User details for user registration using email
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            social_id:
 *              type: string
 *            user_id:
 *              type: string
 *            email:
 *              type: string
 *            social_type:
 *              type: string
 *   responses:
 *    '200':
 *      description: successful
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *    '500':
 *      description: error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Authorization invalid
 *    '404':
 *      description: Not found
 *    '422':
 *      description: validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationResponse'
 */


/// 4. POST API FOR VERIFY SOCIAL OTP
/**
 * Insert User details
 * @route POST /auth/email/verifysocialotp:
 * @api public[temp demo]
 * @param {object} req
 * @param {object} res
 * @return {error|json}
 * @author Deepak Tiwari
 */
/**
 * @swagger
 * /auth/email/verifysocialotp:
 *  post:
 *   tags:
 *    - Email Auth Module Social
 *   requestBody:
 *    description: User details for user registration using email
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            social_type:
 *              type: string
 *            social_id:
 *              type: string
 *            user_id:
 *              type: integer
 *            otp:
 *              type: string
 *            fcm:
 *              type: string
 *            device_id:
 *              type: string
 *            ip_address:
 *              type: string
 *            device_name:
 *              type: string
 *            language:
 *              type: string
 *   responses:
 *    '200':
 *      description: successful
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *    '500':
 *      description: error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Authorization invalid
 *    '404':
 *      description: Not found
 *    '422':
 *      description: validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ValidationResponse'
 */

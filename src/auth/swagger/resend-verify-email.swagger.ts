import { ApiOperationOptions, ApiParamOptions, ApiResponseOptions } from '@nestjs/swagger';

export const resendVerifyEmailSwagger = {
  operation: {
    summary: 'Resend verification email',
    description: 'Resends a verification email to the user',
  } as ApiOperationOptions,

  params: {
    phone: {
      name: 'phone',
      description: 'Phone of the user',
      example: '+380987654333',
      required: true,
      type: 'string',
    } as ApiParamOptions,
  },

  headers: [
    {
      name: 'accept-language',
      description: 'Specifies the language for the response messages (e.g., en, uk)',
      required: false,
      example: 'uk',
    },
  ],

  responses: {
    success: {
      status: 200,
      description: 'Verification email resent successfully',
      schema: {
        example: {
          success: true,
          data: {
            message: 'Verification email resent'
          },
        },
      },
    } as ApiResponseOptions,

    userNotFound: {
      status: 400,
      description: 'User not found',
      schema: {
        example: {
          success: false,
          error: {
            status: 400,
            message: 'User not found',
            code: 'SRV-ATH-12',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    emailAlreadyVerified: {
      status: 400,
      description: 'Email already verified',
      schema: {
        example: {
          success: false,
          error: {
            status: 400,
            message: 'Email already verified',
            code: 'SRV-ATH-13',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    invalidEmail: {
      status: 400,
      description: 'Invalid email address format',
      schema: {
        example: {
          success: false,
          error: {
            status: 400,
            message: 'Invalid email address',
            code: 'SRV-MAI-1',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    sendMailFailed: {
      status: 503,
      description: 'Failed to send email due to a mail server issue',
      schema: {
        example: {
          success: false,
          error: {
            status: 503,
            message: 'Failed to send email. Please try again later',
            code: 'SRV-MAI-2',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    internalError: {
      status: 500,
      description: 'Internal server error',
      schema: {
        example: {
          success: false,
          error: {
            status: 500,
            message: 'Internal Server Error',
            code: 'SRV-GEN-500',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,
  },
};

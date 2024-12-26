import { ApiOperationOptions, ApiParamOptions, ApiResponseOptions } from '@nestjs/swagger';

export const verifyEmailSwagger = {
  operation: {
    summary: 'Verify email',
    description: 'Verifies a user’s email using a confirmation code',
  } as ApiOperationOptions,

  params: {
    email: {
      name: 'email',
      description: 'User email address',
      example: 'user@mailinator.com',
      required: true,
      type: 'string',
    } as ApiParamOptions,

    code: {
      name: 'code',
      description: "Confirmation code sent to the user's email",
      example: '1234',
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
    {
      name: 'x-platform',
      description: 'Specifies the platform where the request originates (e.g., crm, android, ios)',
      required: true,
      example: 'crm',
    },
  ],

  responses: {
    success: {
      status: 200,
      description: 'Email verified successfully',
      schema: {
        example: {
          success: true,
          data: {
            message: 'Email verified successfully'
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
            code: 'SRV-ATH-9',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    invalidTokenType: {
      status: 400,
      description: 'Invalid token type',
      schema: {
        example: {
          success: false,
          error: {
            status: 400,
            message: 'Invalid token type',
            code: 'SRV-ATH-10',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    tokenExpired: {
      status: 400,
      description: 'The confirmation code has expired',
      schema: {
        example: {
          success: false,
          error: {
            status: 400,
            message: 'Token expired',
            code: 'SRV-ATH-11',
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

import { ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';

export const checkAuthSwagger = {
  operation: {
    summary: 'Check if the user is logged in',
    description: 'Validates if the user is logged in based on the provided JWT in cookies',
  } as ApiOperationOptions,

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
      description: 'User is logged in successfully',
      schema: {
        example: {
          success: true,
          data: {
            logged_in: true,
            user_id: 1,
          },
        },
      },
    } as ApiResponseOptions,

    unauthorized: {
      status: 401,
      description: 'User is not logged in or the token is invalid',
      schema: {
        example: {
          success: false,
          error: {
            status: 401,
            message: 'Invalid or expired token',
            code: 'SRV-AUT-401',
            timestamp: '2024-12-10T17:36:50.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    tokenNotProvided: {
      status: 401,
      description: 'JWT token was not provided in the cookies',
      schema: {
        example: {
          success: false,
          error: {
            status: 401,
            message: 'No JWT token provided',
            code: 'SRV-AUT-402',
            timestamp: '2024-12-10T17:36:50.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    internalError: {
      status: 500,
      description: 'Internal server error occurred',
      schema: {
        example: {
          success: false,
          error: {
            status: 500,
            message: 'Internal server error',
            code: 'SRV-GEN-500',
            timestamp: '2024-12-10T17:36:50.885Z',
          },
        },
      },
    } as ApiResponseOptions,
  },
};

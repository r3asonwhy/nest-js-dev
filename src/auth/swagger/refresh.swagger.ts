import { ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';

export const refreshSwagger = {
  operation: {
    summary: 'Refresh access token',
    description: 'Refreshes an expired access token by using the refresh token stored in the system',
  } as ApiOperationOptions,

  headers: [
    {
      name: 'accept-language',
      description: 'Specifies the language for the response messages (e.g., en, uk)',
      required: false,
      example: 'uk',
    },
  ],

  body: {
    description: 'No request body required, the refresh token is taken from the `jwt` cookie',
  },

  responses: {
    success: {
      status: 200,
      description: 'Access token refreshed successfully',
      schema: {
        example: {
          success: true,
          data: {
            message: 'Token refreshed'
          },
        },
      },
    } as ApiResponseOptions,

    unauthorized: {
      status: 401,
      description: 'Invalid or expired access token',
      schema: {
        example: {
          success: false,
          error: {
            status: 401,
            message: 'Invalid access token',
            code: 'SRV-ATH-6',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    tokenNotProvided: {
      status: 401,
      description: 'Access token was not provided',
      schema: {
        example: {
          success: false,
          error: {
            status: 401,
            message: 'No access token provided',
            code: 'SRV-ATH-5',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    userNotFound: {
      status: 401,
      description: 'The user associated with the token was not found',
      schema: {
        example: {
          success: false,
          error: {
            status: 401,
            message: 'User not found',
            code: 'SRV-ATH-7',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    refreshError: {
      status: 401,
      description: 'Error refreshing tokens using AWS Cognito',
      schema: {
        example: {
          success: false,
          error: {
            status: 401,
            message: 'Error refreshing tokens',
            code: 'SRV-ATH-8',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    databaseError: {
      status: 500,
      description: 'Database error occurred while processing the request',
      schema: {
        example: {
          success: false,
          error: {
            status: 500,
            message: 'Failed to fetch token from the database',
            code: 'SRV-TKN-1',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    updateError: {
      status: 500,
      description: 'Failed to update tokens in the database',
      schema: {
        example: {
          success: false,
          error: {
            status: 500,
            message: 'Failed to update tokens in the database',
            code: 'SRV-TKN-2',
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

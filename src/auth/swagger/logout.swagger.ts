import { ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';

export const logoutSwagger = {
  operation: {
    summary: 'Logout a user',
    description: 'Logs out a user by invalidating their access token',
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
      description: 'User logged out successfully',
      schema: {
        example: {
          success: true,
          data: {
            message: 'Logout successful',
            redirect: '/client/home'
          },
        },
      },
    } as ApiResponseOptions,

    unauthorized: {
      status: 401,
      description: 'Unauthorized access due to missing or invalid token',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              error: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 401 },
                  message: { type: 'string' },
                  code: { type: 'string' },
                  timestamp: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
          examples: {
            noToken: {
              summary: 'No access token provided',
              value: {
                success: false,
                error: {
                  status: 401,
                  message: 'No access token provided',
                  code: 'SRV-ATH-3',
                  timestamp: '2024-12-05T16:27:40.885Z',
                },
              },
            },
            invalidToken: {
              summary: 'Invalid token',
              value: {
                success: false,
                error: {
                  status: 401,
                  message: 'Invalid token',
                  code: 'SRV-ATH-4',
                  timestamp: '2024-12-05T16:27:40.885Z',
                },
              },
            },
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
  },
};

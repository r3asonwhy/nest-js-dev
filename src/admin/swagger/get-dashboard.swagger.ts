import { ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';

export const getDashboardSwagger = {
  operation: {
    summary: 'Get dashboard statistics',
    description: 'Retrieve statistics for users, tickets, shippings, and news.',
  } as ApiOperationOptions,

  responses: {
    success: {
      status: 200,
      description: 'Dashboard statistics retrieved successfully',
      schema: {
        example: {
          success: true,
          data: {
            users: 150,
          },
        },
      },
    } as ApiResponseOptions,

    internalError: {
      status: 500,
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: {
            example: {
              success: false,
              error: {
                status: 500,
                message: 'Internal Server Error',
                code: 'SRV-GEN-500',
                timestamp: '2024-12-11T16:27:40.885Z',
              },
            },
          },
        },
      },
    } as ApiResponseOptions,
  },
};

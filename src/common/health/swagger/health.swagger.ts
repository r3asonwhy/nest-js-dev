import { ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';

export const healthSwagger = {
  operation: {
    summary: 'Health check',
    description: 'Checks the health status of the application',
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
      description: 'Application is healthy',
      schema: {
        example: {
          success: true,
          data: {
            status: 'ok',
            timestamp: '2024-12-05T12:00:00.000Z',
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

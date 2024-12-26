import { ApiOperationOptions, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
import { Config } from '@/models/configs/entities/config.entity';

export const getConfigsSwagger = {
  operation: {
    summary: 'Get all configuration values',
    description: 'Retrieve all existing configuration key-value pairs.',
  } as ApiOperationOptions,

  responses: {
    success: {
      status: 200,
      description: 'Configurations retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(Config) },
              },
            },
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

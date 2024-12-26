import { ApiOperationOptions, ApiResponseOptions, ApiBodyOptions, getSchemaPath } from '@nestjs/swagger';
import { CreateConfigDto } from '../dto/create-config.dto';
import { Config } from '@/models/configs/entities/config.entity';

export const createConfigSwagger = {
  operation: {
    summary: 'Create new configuration values',
    description: 'Allows creating new configuration keys and values',
  } as ApiOperationOptions,

  body: {
    description: 'Array of configuration key-value pairs to create',
    type: CreateConfigDto,
  } as ApiBodyOptions,

  responses: {
    success: {
      status: 201,
      description: 'Configs created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: {
                $ref: getSchemaPath(Config),
              },
            },
          },
        },
      },
    } as ApiResponseOptions,

    badRequest: {
      status: 400,
      description: 'Bad request due to invalid input data',
      content: {
        'application/json': {
          schema: {
            example: {
              success: false,
              error: {
                status: 400,
                message: 'Invalid input data',
                code: 'SRV-CONFIG-400',
                timestamp: '2024-12-24T12:00:00.000Z',
              },
            },
          },
        },
      },
    } as ApiResponseOptions,
  },
};

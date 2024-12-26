import { ApiOperationOptions, ApiResponseOptions, ApiBodyOptions, getSchemaPath } from '@nestjs/swagger';
import { UpdateConfigDto } from '../dto/update-config.dto';
import { Config } from '@/models/configs/entities/config.entity';

export const updateConfigSwagger = {
  operation: {
    summary: 'Update existing configuration values',
    description: 'Allows updating values of existing configuration keys',
  } as ApiOperationOptions,

  body: {
    description: 'Array of configuration key-value pairs to update',
    type: UpdateConfigDto,
  } as ApiBodyOptions,

  responses: {
    success: {
      status: 200,
      description: 'Configs updated successfully',
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

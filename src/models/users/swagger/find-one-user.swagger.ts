import { ApiOperationOptions, ApiParamOptions, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export const findOneUserSwagger = {
  operation: {
    summary: 'Get user by ID',
    description: 'Returns the details of a single user by their ID',
  } as ApiOperationOptions,

  param: {
    name: 'id',
    description: 'ID of the user to retrieve',
    example: 1,
    required: true,
    type: 'number',
  } as ApiParamOptions,

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
      description: 'User retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { $ref: getSchemaPath(User) },
            },
          },
        },
      },
    } as ApiResponseOptions,

    notFound: {
      status: 404,
      description: 'User not found',
      schema: {
        example: {
          success: false,
          error: {
            status: 404,
            message: 'User with id 1 not found',
            code: 'SRV-USER-1',
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

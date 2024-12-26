import { ApiOperationOptions, ApiParamOptions, ApiResponseOptions, ApiBodyOptions, getSchemaPath, ApiHeaderOptions } from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export const updateUserSwagger = {
  operation: {
    summary: 'Update a user',
    description: 'Updates a user\'s details by their ID',
  } as ApiOperationOptions,

  param: {
    name: 'id',
    description: 'ID of the user to update',
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
    {
      name: 'x-platform',
      description: 'Specifies the platform where the request originates (e.g., crm, android, ios)',
      required: true,
      example: 'crm',
    },
  ],

  body: {
    description: 'Details to update for the user',
    type: UpdateUserDto,
  } as ApiBodyOptions,

  responses: {
    success: {
      status: 200,
      description: 'User updated successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: {
                $ref: getSchemaPath(User),
              },
            },
          },
        },
      },
    } as ApiResponseOptions,

    notFound: {
      status: 404,
      description: 'User not found',
      content: {
        'application/json': {
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
                timestamp: '2024-12-05T16:27:40.885Z',
              },
            },
          },
        },
      },
    } as ApiResponseOptions,
  },
};

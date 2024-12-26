import { ApiOperationOptions, ApiResponseOptions, ApiBodyOptions, getSchemaPath, ApiHeaderOptions } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

export const createUserSwagger = {
  operation: {
    summary: 'Create a user',
    description: 'Creates a new user with the provided details',
  } as ApiOperationOptions,

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
    description: 'Details of the new user',
    type: CreateUserDto,
  } as ApiBodyOptions,

  responses: {
    success: {
      status: 201,
      description: 'User created successfully',
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
                code: 'SRV-USER-400',
                timestamp: '2024-12-11T16:27:40.885Z',
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

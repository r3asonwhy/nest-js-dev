import { ApiOperationOptions, ApiParamOptions, ApiResponseOptions } from '@nestjs/swagger';

export const deleteUserSwagger = {
  operation: {
    summary: 'Delete a user',
    description: 'Deletes a user and their associated tokens by their ID',
  } as ApiOperationOptions,

  param: {
    name: 'id',
    description: 'ID of the user to delete',
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

  responses: {
    success: {
      status: 200,
      description: 'User deleted successfully',
      schema: {
        example: {
          success: true,
          data: {
            message: 'User deleted successfully',
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

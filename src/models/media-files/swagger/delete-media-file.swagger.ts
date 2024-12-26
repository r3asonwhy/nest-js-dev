import { ApiOperationOptions, ApiResponseOptions, ApiParamOptions } from '@nestjs/swagger';

export const deleteMediaFileSwagger = {
  operation: {
    summary: 'Delete file',
    description: 'Deletes a file from S3 storage and the database using the file key',
  } as ApiOperationOptions,

  param: {
    key: {
      name: 'key',
      description: 'The key (name) of the file in S3',
      example: 'e04f74f3-9061-453f-9bd2-f04e3b2e4011-image.png',
      required: true,
      type: 'string',
    } as ApiParamOptions,
  },

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
      description: 'File successfully deleted',
      schema: {
        example: {
          success: true,
          data: {
            message: 'File deleted successfully',
          },
        },
      },
    } as ApiResponseOptions,

    notFound: {
      status: 404,
      description: 'File not found',
      schema: {
        example: {
          success: false,
          error: {
            status: 404,
            message: 'File not found',
            code: 'SRV-FILE-404',
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

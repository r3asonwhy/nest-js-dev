import { ApiOperationOptions, ApiResponseOptions, ApiParamOptions } from '@nestjs/swagger';

export const getMediaFileSwagger = {
  operation: {
    summary: 'Get file',
    description: 'Retrieves a file from S3 storage using its key',
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

  responses: {
    success: {
      status: 200,
      description: 'File retrieved successfully and returned as binary content',
      content: {
        'application/octet-stream': {
          schema: {
            type: 'string',
            format: 'binary',
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
  },
};

import { ApiOperationOptions, ApiResponseOptions, ApiBodyOptions, getSchemaPath } from '@nestjs/swagger';
import { MediaFile } from '../entities/media-file.entity';
import { CreateMediaFileDto } from '../dto/create-media-file.dto';

export const uploadMediaFileSwagger = {
  operation: {
    summary: 'Upload file',
    description: 'Uploads a file to S3 storage and saves its metadata in the database',
  } as ApiOperationOptions,

  body: {
    description: 'File to be uploaded',
    type: CreateMediaFileDto,
  } as ApiBodyOptions,

  responses: {
    success: {
      status: 201,
      description: 'File uploaded successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: {
                $ref: getSchemaPath(MediaFile),
              },
            },
          },
        },
      },
    } as ApiResponseOptions,

    badRequest: {
      status: 400,
      description: 'Invalid file format',
      schema: {
        example: {
          success: false,
          error: {
            status: 400,
            message: 'Invalid file format',
            code: 'SRV-FILE-400',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,
  },
};

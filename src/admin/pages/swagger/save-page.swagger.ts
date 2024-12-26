import { ApiOperationOptions, ApiResponseOptions, ApiBodyOptions, getSchemaPath, ApiHeaderOptions } from '@nestjs/swagger';
import { CreatePageDto } from '../dto/create-page.dto';
import { Page } from '@/models/pages/entities/page.entity';

export const savePageSwagger = {
  operation: {
    summary: 'Create or Update a page',
    description: 'Creates or updates a page with sections and slug.',
  } as ApiOperationOptions,

  body: {
    description: 'Details of the page to be created or updated',
    type: CreatePageDto,
  } as ApiBodyOptions,

  responses: {
    success: {
      status: 201,
      description: 'Page created/updated successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: {
                $ref: getSchemaPath(Page),
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
                code: 'SRV-PAGE-400',
                timestamp: '2024-12-17T16:30:00.000Z',
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
                timestamp: '2024-12-17T16:30:00.000Z',
              },
            },
          },
        },
      },
    } as ApiResponseOptions,
  },
};

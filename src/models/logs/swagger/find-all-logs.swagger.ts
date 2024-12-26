import { ApiOperationOptions, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
import { Log } from '../entities/log.entity';

export const findAllLogsSwagger = {
  operation: {
    summary: 'Get all logs',
    description: 'Returns a list of all logs in the system',
  } as ApiOperationOptions,

  headers: [
    {
      name: 'accept-language',
      description: 'Specifies the language for the response messages (e.g., en, uk)',
      required: false,
      example: 'uk',
    },
  ],

  query: [
    {
      name: 'page',
      required: false,
      example: 1,
      description: 'Page number (starts from 1)',
    },
    {
      name: 'limit',
      required: false,
      example: 15,
      description: 'Limit of results per page',
    },
    {
      name: 'sort_field',
      required: false,
      example: 'first_name',
      description: 'Field to sort by',
    },
    {
      name: 'sort_order',
      required: false,
      example: 'ASC',
      description: 'Sort direction (ASC or DESC)',
    },
    {
      name: 'search',
      required: false,
      example: 'John',
      description: 'Search string for filtering by name',
    },
  ],

  responses: {
    success: {
      status: 200,
      description: 'List of logs retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(Log) },
              },
              count: { type: 'integer', example: 3 },
            },
          },
        },
      },
    } as ApiResponseOptions,

    unauthorized: {
      status: 401,
      description: 'Unauthorized access due to missing or invalid token',
      schema: {
        example: {
          success: false,
          error: {
            status: 401,
            message: 'Unauthorized access',
            code: 'SRV-AUTH-1',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,
  },
};

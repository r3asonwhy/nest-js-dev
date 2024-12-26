import { ApiOperationOptions, ApiResponseOptions, ApiQueryOptions } from '@nestjs/swagger';

export const getMenuSwagger = {
  operation: {
    summary: 'Get menu configuration',
    description: 'Retrieve the menu configuration based on the provided language.',
  } as ApiOperationOptions,

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
      description: 'Menu configuration retrieved successfully',
      schema: {
        example: {
          success: true,
          data: {
            id: 3,
            updated_at: '2024-12-17T10:54:03Z',
            value: [
              { id: 1, title: 'Home', link: '/' },
              { id: 2, title: 'About', link: '/about' },
            ],
          },
        },
      },
    } as ApiResponseOptions,

    notFound: {
      status: 404,
      description: 'Menu configuration not found',
      schema: {
        example: {
          success: false,
          error: {
            status: 404,
            message: 'Menu configuration not found',
            code: 'SRV-404-NOT-FOUND',
            timestamp: '2024-12-17T12:00:00.000Z',
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
            code: 'SRV-500-ERROR',
            timestamp: '2024-12-17T12:00:00.000Z',
          },
        },
      },
    } as ApiResponseOptions,
  },
};

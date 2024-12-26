import { ApiOperationOptions, ApiResponseOptions, ApiBodyOptions } from '@nestjs/swagger';

export const saveMenuSwagger = {
  operation: {
    summary: 'Save or update menu configuration',
    description: 'Updates or creates the menu settings in the config table based on the language.',
  } as ApiOperationOptions,

  body: {
    description: 'Menu configuration payload',
    required: true,
    schema: {
      example: {
        lang: 'en',
        value: [
          { id: 1, title: 'Home', link: '/' },
          { id: 2, title: 'About', link: '/about' },
        ],
      },
    },
  } as ApiBodyOptions,

  responses: {
    success: {
      status: 200,
      description: 'Menu configuration saved successfully',
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

    badRequest: {
      status: 400,
      description: 'Bad request due to missing or invalid input',
      schema: {
        example: {
          success: false,
          error: {
            status: 400,
            message: 'Missing required fields',
            code: 'SRV-BAD-REQUEST',
            timestamp: '2024-12-17T10:54:03Z',
          },
        },
      },
    } as ApiResponseOptions,
  },
};

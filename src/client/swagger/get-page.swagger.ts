import { ApiOperationOptions, ApiParamOptions, ApiResponseOptions } from '@nestjs/swagger';

export const getPageSwagger = {
  operation: {
    summary: 'Render a page',
    description: 'Returns the HTML content of the requested page',
    security: [
      {
        jwt: [],
      },
    ],
  } as ApiOperationOptions,

  param: {
    name: 'slug',
    description: 'The name of the page to render (e.g., home, about, contact)',
    required: true,
    schema: {
      type: 'string',
      enum: ['home'],
    },
  } as ApiParamOptions,

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
      description: 'HTML content of the requested page',
      content: {
        'text/html': {
          example: '<h1>Welcome to our homepage!</h1><ul><li>Product1</li><li>Product2</li></ul>',
        },
      },
    } as ApiResponseOptions,

    notFound: {
      status: 404,
      description: 'Page not found or template data not defined',
      schema: {
        example: {
          success: false,
          error: {
            status: 404,
            message: 'Template data not defined for home',
            code: 'SRV-PG-1',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,
  },
};

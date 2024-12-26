import { ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';

export const getHeaderFooterSwagger = {
  operation: {
    summary: 'Get header and footer configurations',
    description: 'Retrieves the header and footer settings based on the language provided.',
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
      description: 'Header and footer configurations saved successfully',
      schema: {
        example: {
          success: true,
          data: {
            header_logo: { id: 1, origin_id: 0 },
            footer_logo: { id: 3, origin_id: 0 },
            address: '123 Main Street, City, Country',
            copyright: '© 2024 MyCompany. All rights reserved.',
            social_network: [
              { icon: { id: 4, origin_id: 0 }, link: 'https://facebook.com/mycompany' },
              { icon: { id: 5, origin_id: 0 }, link: 'https://twitter.com/mycompany' },
            ],
            phones_icon: { id: 6, origin_id: 0 },
            phones: ['+1234567890123456', '+1234567890123457'],
            schedule_icon: { id: 7, origin_id: 0 },
            schedule: 'Mon-Fri 9:00 AM - 5:00 PM',
            lang: 'en',
          },
        },
      },
    } as ApiResponseOptions,

    notFound: {
      status: 404,
      description: 'Header and footer configurations not found',
      schema: {
        example: {
          success: false,
          error: {
            status: 404,
            message: 'Header and Footer not found',
            code: 'SRV-404-NOT-FOUND',
            timestamp: '2024-12-17T12:00:00.000Z',
          },
        },
      },
    } as ApiResponseOptions,
  },
};

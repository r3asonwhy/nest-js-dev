import { ApiOperationOptions, ApiResponseOptions, ApiBodyOptions } from '@nestjs/swagger';
import { SaveHeaderFooterDto } from '../dto/save-header-footer.dto';

export const saveHeaderFooterSwagger = {
  operation: {
    summary: 'Save or update header/footer configurations',
    description: 'Updates or creates the header and footer settings in the config table.',
  } as ApiOperationOptions,

  body: {
    type: SaveHeaderFooterDto,
    required: true,
    description: 'Payload containing header, footer, and additional settings',
  } as ApiBodyOptions,

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

    badRequest: {
      status: 400,
      description: 'Bad request due to invalid input',
      schema: {
        example: {
          success: false,
          error: {
            status: 400,
            message: 'Invalid input data',
            code: 'SRV-400-BAD-REQUEST',
            timestamp: '2024-12-17T07:30:00.000Z',
          },
        },
      },
    } as ApiResponseOptions,
  },
};

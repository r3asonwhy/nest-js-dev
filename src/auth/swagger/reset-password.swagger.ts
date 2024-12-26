import { ApiBodyOptions, ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';
import { UpdatePasswordDto } from '../dto/update-password.dto';

export const resetPasswordSwagger = {
  operation: {
    summary: 'Reset password',
    description: 'Resets the user\'s password using a reset code',
  } as ApiOperationOptions,

  headers: [
    {
      name: 'accept-language',
      description: 'Specifies the language for the response messages (e.g., en, uk)',
      required: false,
      example: 'uk',
    },
  ],

  body: {
    description: 'Password reset details',
    type: UpdatePasswordDto,
  } as ApiBodyOptions,

  responses: {
    success: {
      status: 200,
      description: 'Password has been successfully updated',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Password has been successfully updated' },
                },
              },
            },
          },
        },
      },
    } as ApiResponseOptions,

    badRequest: {
      status: 400,
      description: 'Validation errors or invalid input data',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              error: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 400 },
                  message: { type: 'string', example: 'User not found or invalid code' },
                  code: { type: 'string', example: 'SRV-ATH-16' },
                  timestamp: { type: 'string', format: 'date-time', example: '2024-12-05T16:27:40.885Z' },
                },
              },
            },
          },
          examples: {
            invalidCode: {
              summary: 'Invalid reset code',
              value: {
                success: false,
                error: {
                  status: 400,
                  message: 'User not found or invalid code',
                  code: 'SRV-ATH-16',
                  timestamp: '2024-12-05T16:27:40.885Z',
                },
              },
            },
            expiredCode: {
              summary: 'Expired reset code',
              value: {
                success: false,
                error: {
                  status: 400,
                  message: 'Code has expired',
                  code: 'SRV-ATH-17',
                  timestamp: '2024-12-05T16:27:40.885Z',
                },
              },
            },
            passwordMismatch: {
              summary: 'Passwords do not match',
              value: {
                success: false,
                error: {
                  status: 400,
                  message: 'Passwords do not match',
                  code: 'SRV-ATH-15',
                  timestamp: '2024-12-05T16:27:40.885Z',
                },
              },
            },
            invalidEmail: {
              summary: 'Invalid email format',
              value: {
                success: false,
                error: {
                  status: 400,
                  message: 'Invalid email address',
                  code: 'SRV-MAI-1',
                  timestamp: '2024-12-05T16:27:40.885Z',
                },
              },
            },
          },
        },
      },
    } as ApiResponseOptions,

    sendMailFailed: {
      status: 503,
      description: 'Failed to send confirmation email',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              error: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 503 },
                  message: { type: 'string', example: 'Failed to send email. Please try again later' },
                  code: { type: 'string', example: 'SRV-MAI-2' },
                  timestamp: { type: 'string', format: 'date-time', example: '2024-12-05T16:27:40.885Z' },
                },
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
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              error: {
                type: 'object',
                properties: {
                  status: { type: 'integer', example: 500 },
                  message: { type: 'string', example: 'Internal Server Error' },
                  code: { type: 'string', example: 'SRV-GEN-500' },
                  timestamp: { type: 'string', format: 'date-time', example: '2024-12-05T16:27:40.885Z' },
                },
              },
            },
          },
        },
      },
    } as ApiResponseOptions,
  },
};

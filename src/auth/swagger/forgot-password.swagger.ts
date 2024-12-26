import { ApiBodyOptions, ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

export const forgotPasswordSwagger = {
  operation: {
    summary: 'Request password reset',
    description: 'Sends a password reset code to the user\'s email',
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
    description: 'Details of the user requesting a password reset',
    type: ForgotPasswordDto,
  } as ApiBodyOptions,

  responses: {
    success: {
      status: 200,
      description: 'Password reset code sent successfully',
      schema: {
        example: {
          success: true,
          data: {
            message: 'Password reset code sent to your email',
          },
        },
      },
    } as ApiResponseOptions,

    userNotFound: {
      status: 400,
      description: 'User not found',
      schema: {
        example: {
          success: false,
          error: {
            status: 400,
            message: 'User not found',
            code: 'SRV-ATH-14',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    invalidEmail: {
      status: 400,
      description: 'Invalid email address format',
      schema: {
        example: {
          success: false,
          error: {
            status: 400,
            message: 'Invalid email address',
            code: 'SRV-MAI-1',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    sendMailFailed: {
      status: 503,
      description: 'Failed to send email due to a mail server issue',
      schema: {
        example: {
          success: false,
          error: {
            status: 503,
            message: 'Failed to send email. Please try again later',
            code: 'SRV-MAI-2',
            timestamp: '2024-12-05T16:27:40.885Z',
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
            code: 'SRV-GEN-500',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,
  },
};

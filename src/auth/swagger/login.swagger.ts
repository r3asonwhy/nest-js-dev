import { ApiBodyOptions, ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

export const loginSwagger = {
  operation: {
    summary: 'Login a user',
    description: 'Authenticates a user and returns an access token',
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
    description: 'User login credentials',
    type: LoginDto,
  } as ApiBodyOptions,

  responses: {
    success: {
      status: 200,
      description: 'User logged in successfully',
      schema: {
        example: {
          success: true,
          data: {
            message: 'Login successful',
            redirect: '/client/home'
          },
        },
      },
    } as ApiResponseOptions,

    badRequest: {
      status: 400,
      description: 'Invalid email or password',
      schema: {
        example: {
          success: false,
          error: {
            status: 400,
            message: 'Invalid email or password',
            code: 'SRV-ATH-1',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    unauthorized: {
      status: 401,
      description: 'Email not verified',
      schema: {
        example: {
          success: false,
          error: {
            status: 401,
            message: 'Email is not verified',
            code: 'SRV-ATH-2',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,

    serviceUnavailable: {
      status: 503,
      description: 'AWS Cognito service is unavailable',
      schema: {
        example: {
          success: false,
          error: {
            status: 503,
            message: 'AWS Cognito service is unavailable',
            code: 'SRV-ATH-3',
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
            code: 'SRV-ATH-4',
            timestamp: '2024-12-05T16:27:40.885Z',
          },
        },
      },
    } as ApiResponseOptions,
  },
};

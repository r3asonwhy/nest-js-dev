import { Controller, Get, applyDecorators } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { healthSwagger } from './swagger';
import { addHeaders } from '../helpers/swagger-helper';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @applyDecorators(...addHeaders(healthSwagger.headers))
  @ApiOperation(healthSwagger.operation)
  @ApiResponse(healthSwagger.responses.success)
  @ApiResponse(healthSwagger.responses.internalError)
  checkHealth(): { status: string; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

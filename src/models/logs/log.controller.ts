import { Controller, Get, Query, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LogService } from './log.service';
import { Log } from './entities/log.entity';
import { AuthGuard } from '@/common/guards/auth.guard';
import { addHeaders, addQuery } from '@/common/helpers/swagger-helper';
import { FindLogDto } from './dto/find-log.dto';
import { findAllLogsSwagger } from './swagger';

@ApiTags('Logs')
@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @applyDecorators(
    ...addHeaders(findAllLogsSwagger.headers), 
    ...addQuery(findAllLogsSwagger.query)
  )
  @ApiOperation(findAllLogsSwagger.operation)
  @ApiResponse(findAllLogsSwagger.responses.success)
  @ApiResponse(findAllLogsSwagger.responses.unauthorized)
  async findAll(@Query() query: FindLogDto): Promise<{ data: Log[]; count: number }> {
    return this.logService.findAll(query);
  }
}

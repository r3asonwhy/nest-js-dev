import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';
import { getConfigsSwagger } from './swagger/get-config.swagger';
import { ConfigResponseDto } from './dto/config-response.dto';
import { AdminConfigService } from './admin-config.service';
import { createConfigSwagger } from './swagger/create-config.swagger';
import { updateConfigSwagger } from './swagger/update-config.swagger';
import { UpdateConfigDto } from './dto/update-config.dto';
import { CreateConfigDto } from './dto/create-config.dto';

@ApiTags('Admin')
@Controller('admin/configs')
export class AdminConfigController {
  constructor(private readonly adminConfigService: AdminConfigService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @ApiOperation(createConfigSwagger.operation)
  @ApiBody(createConfigSwagger.body)
  @ApiResponse(createConfigSwagger.responses.success)
  @ApiResponse(createConfigSwagger.responses.badRequest)
  @HttpCode(HttpStatus.CREATED)
  async createConfig(@Body() data: CreateConfigDto[]): Promise<ConfigResponseDto[]> {
    return this.adminConfigService.createConfig(data);
  }

  @Post('update')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @ApiOperation(updateConfigSwagger.operation)
  @ApiBody(updateConfigSwagger.body)
  @ApiResponse(updateConfigSwagger.responses.success)
  @ApiResponse(updateConfigSwagger.responses.badRequest)
  @HttpCode(HttpStatus.OK)
  async updateConfig(@Body() data: UpdateConfigDto[]): Promise<ConfigResponseDto[]> {
    return this.adminConfigService.updateConfig(data);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @ApiOperation(getConfigsSwagger.operation)
  @ApiResponse(getConfigsSwagger.responses.success)
  @ApiResponse(getConfigsSwagger.responses.internalError)
  @HttpCode(HttpStatus.OK)
  async getConfigs(): Promise<ConfigResponseDto[]> {
    return this.adminConfigService.getConfigs();
  }
}

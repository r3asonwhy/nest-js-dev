import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Query, Req, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LayoutService } from './layout.service';
import { SaveHeaderFooterDto } from './dto/save-header-footer.dto';
import { AuthGuard } from '@/common/guards/auth.guard';
import { saveHeaderFooterSwagger } from './swagger/save-header-footer';
import { getHeaderFooterSwagger } from './swagger/get-header-footer.swagger';
import { HeaderFooterResponseDto } from './dto/header-footer-response.dto';
import { saveMenuSwagger } from './swagger/save-menu.swagger';
import { SaveMenuDto } from './dto/save-menu.dto';
import { getMenuSwagger } from './swagger/get-menu.swagger';
import { MenuResponseDto } from './dto/menu-response.dto';
import { RequestWithUser } from '@/common/interfaces/request.interface';
import { addHeaders } from '@/common/helpers/swagger-helper';

@ApiTags('Admin')
@Controller('admin/layouts')
export class LayoutController {
  constructor(private readonly layoutService: LayoutService) {}

  @Post('save-header-footer')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @ApiOperation(saveHeaderFooterSwagger.operation)
  @ApiBody(saveHeaderFooterSwagger.body)
  @ApiResponse(saveHeaderFooterSwagger.responses.success)
  @ApiResponse(saveHeaderFooterSwagger.responses.badRequest)
  @HttpCode(HttpStatus.OK)
  async saveHeaderFooter(@Body() body: SaveHeaderFooterDto): Promise<HeaderFooterResponseDto> {
    return this.layoutService.saveHeaderFooter(body);
  }

  @Get('header-footer')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @applyDecorators(...addHeaders(getHeaderFooterSwagger.headers))
  @ApiOperation(getHeaderFooterSwagger.operation)
  @ApiResponse(getHeaderFooterSwagger.responses.success)
  @ApiResponse(getHeaderFooterSwagger.responses.notFound)
  @HttpCode(HttpStatus.OK)
  async getHeaderFooter(@Req() req: RequestWithUser): Promise<HeaderFooterResponseDto> {
    return this.layoutService.getHeaderFooter(req.lang);
  }

  @Post('save-menu')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @ApiOperation(saveMenuSwagger.operation)
  @ApiBody(saveMenuSwagger.body)
  @ApiResponse(saveMenuSwagger.responses.success)
  @ApiResponse(saveMenuSwagger.responses.badRequest)
  @HttpCode(HttpStatus.OK)
  async saveMenu(@Body() body: SaveMenuDto): Promise<MenuResponseDto> {
    return await this.layoutService.saveMenu(body);
  }

  @Get('menu')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @applyDecorators(...addHeaders(getMenuSwagger.headers))
  @ApiOperation(getMenuSwagger.operation)
  @ApiResponse(getMenuSwagger.responses.success)
  @ApiResponse(getMenuSwagger.responses.notFound)
  @ApiResponse(getMenuSwagger.responses.internalError)
  @HttpCode(HttpStatus.OK)
  async getMenu(@Req() req: RequestWithUser): Promise<MenuResponseDto> {
    return await this.layoutService.getMenu(req.lang);
  }
}

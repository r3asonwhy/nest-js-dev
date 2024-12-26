import { Controller, Get, Param, Query, Req, Res, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiExcludeEndpoint, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ClientPageService } from './client-page.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { addHeaders } from '@/common/helpers/swagger-helper';
import { RequestWithUser } from '@/common/interfaces/request.interface';
import { getPageSwagger } from './swagger';
import { IPopupQuery, TemplateDataMap } from '@/client/interfaces/client.interface';

@ApiTags('Client')
@Controller('client')
export class ClientPageController {
  constructor(
    private readonly clientPageService: ClientPageService,
  ) {}

  @Get(':slug')
  @UseGuards(AuthGuard)
   @ApiCookieAuth('jwt')
  @applyDecorators(...addHeaders(getPageSwagger.headers))
  @ApiOperation(getPageSwagger.operation)
  @ApiParam(getPageSwagger.param)
  @ApiResponse(getPageSwagger.responses.success)
  @ApiResponse(getPageSwagger.responses.notFound)
  async renderPage(
    @Param('slug') slug: keyof TemplateDataMap,
    @Req() req: RequestWithUser,
    @Res() res: Response
  ): Promise<void> {
    const html = await this.clientPageService.renderPage(slug, req.lang, req.user);
    res.type('text/html').send(html);
  }

  @Get('popup/:name')
  @ApiExcludeEndpoint()
  async loadPopupContent(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Param('name') popupName: string,
    @Query() query: IPopupQuery
  ): Promise<void> {
    const html = await this.clientPageService.generatePopupContent(req, popupName, query);
    res.json({ html });
  }

  @Get('localization/errors')
  @ApiExcludeEndpoint()
  async getLocalizedError(@Query('errorCode') errorCode: string): Promise<void> {
    await this.clientPageService.handleLocalizationError(errorCode);
  }
}

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  Delete,
  Param,
  Res,
  Get,
  Req,
  UseGuards,
  Inject,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { MediaFileService } from './media-file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiCookieAuth,
} from '@nestjs/swagger';
import {
  uploadMediaFileSwagger,
  getMediaFileSwagger,
  deleteMediaFileSwagger,
} from './swagger';
import { Response } from 'express';
import { RequestWithUser } from '@/common/interfaces/request.interface';
import { AuthGuard } from '@/common/guards/auth.guard';
import { I18nService } from 'nestjs-i18n';
import { MediaFile } from './entities/media-file.entity';

@ApiTags('Media-Files')
@Controller('media-files')
export class MediaFileController {
  constructor(
    private readonly mediaFileService: MediaFileService,
    @Inject(I18nService) private readonly i18nService: I18nService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @ApiOperation(uploadMediaFileSwagger.operation)
  @ApiBody(uploadMediaFileSwagger.body)
  @ApiResponse(uploadMediaFileSwagger.responses.success)
  @ApiResponse(uploadMediaFileSwagger.responses.badRequest)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File, 
    @Req() req: RequestWithUser,
    @Headers('x-platform') platform: string
  ): Promise<MediaFile> {
    return this.mediaFileService.uploadFile(file, req.user?.id, platform);
  }

  @Get(':key')
  @ApiOperation(getMediaFileSwagger.operation)
  @ApiParam(getMediaFileSwagger.param.key)
  @ApiResponse(getMediaFileSwagger.responses.success)
  @ApiResponse(getMediaFileSwagger.responses.notFound)
  @HttpCode(200)
  async getFile(@Param('key') key: string, @Res() res: Response): Promise<void> {
    const { buffer, mimeType } = await this.mediaFileService.getFile(key);
    res.set({ 'Content-Type': mimeType, 'Content-Disposition': `inline; filename="${key}"` });
    res.send(buffer);
  }

  @Delete(':key')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @ApiOperation(deleteMediaFileSwagger.operation)
  @ApiParam(deleteMediaFileSwagger.param.key)
  @ApiResponse(deleteMediaFileSwagger.responses.success)
  @ApiResponse(deleteMediaFileSwagger.responses.notFound)
  @ApiResponse(deleteMediaFileSwagger.responses.internalError)
  @HttpCode(200)
  async deleteFile(
    @Param('key') key: string, 
    @Req() req: RequestWithUser,
    @Headers('x-platform') platform: string,
  ): Promise<{ message: string }> {
    await this.mediaFileService.deleteFile(key, req.user?.id, platform);
    return { message: await this.i18nService.translate('texts.file.DELETED_SUCCESSFULLY') };
  }
}

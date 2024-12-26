import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminPageService } from './admin-page.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { RequestWithUser } from '@/common/interfaces/request.interface';
import { CreatePageDto } from './dto/create-page.dto';
import { savePageSwagger } from './swagger';

@ApiTags('Admin')
@Controller('admin/pages')
export class AdminPageController {
  constructor(
    private readonly adminPageService: AdminPageService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @ApiOperation(savePageSwagger.operation)
  @ApiBody(savePageSwagger.body)
  @ApiResponse(savePageSwagger.responses.success)
  @ApiResponse(savePageSwagger.responses.badRequest)
  @ApiResponse(savePageSwagger.responses.internalError)
  async savePage(
    @Body() body: CreatePageDto,
    @Req() req: RequestWithUser,
  ): Promise<{ success: boolean; data: any }> {
    const result = await this.adminPageService.saveOrUpdatePage(body, req.user.id);
    return { success: true, data: result };
  }
}

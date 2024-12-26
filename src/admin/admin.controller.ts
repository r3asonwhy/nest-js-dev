import { Controller, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getDashboardSwagger } from './swagger/get-dashboard.swagger';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { AdminService } from './admin.service';
import { AuthGuard } from '@/common/guards/auth.guard';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @ApiOperation(getDashboardSwagger.operation)
  @ApiResponse(getDashboardSwagger.responses.success)
  @ApiResponse(getDashboardSwagger.responses.internalError)
  @HttpCode(HttpStatus.OK)
  async getDashboard(): Promise<DashboardResponseDto> {
    return this.adminService.getDashboard();
  }
}

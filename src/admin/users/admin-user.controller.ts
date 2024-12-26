import { Controller, Get, UseGuards, Query, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@/common/guards/auth.guard';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindUserDto } from '@/models/users/dto/find-user.dto';
import { UserService } from '@/models/users/user.service';
import { addHeaders, addQuery } from '@/common/helpers/swagger-helper';
import { findAllUsersSwagger } from '@/models/users/swagger';

@ApiTags('Admin')
@Controller('admin/users')
export class AdminUserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @applyDecorators(
    ...addHeaders(findAllUsersSwagger.headers), 
    ...addQuery(findAllUsersSwagger.query)
  )
  @ApiOperation(findAllUsersSwagger.operation)
  @ApiResponse(findAllUsersSwagger.responses.success)
  @ApiResponse(findAllUsersSwagger.responses.unauthorized)
  async getUsers(@Query() query: FindUserDto) {
    return this.userService.findAll(query);
  }
}

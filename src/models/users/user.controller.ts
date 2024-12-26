import { Headers, Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, ParseIntPipe, Patch, Post, Req, UseGuards, applyDecorators, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@/common/guards/auth.guard';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  findAllUsersSwagger,
  findOneUserSwagger,
  updateUserSwagger,
  deleteUserSwagger,
  createUserSwagger,
} from './swagger';
import { I18nService } from 'nestjs-i18n';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { addHeaders, addQuery } from '@/common/helpers/swagger-helper';
import { FindUserDto } from './dto/find-user.dto';
import { RequestWithUser } from '@/common/interfaces/request.interface';

@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    @Inject(I18nService) private readonly i18nService: I18nService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @applyDecorators(...addHeaders(createUserSwagger.headers))
  @ApiOperation(createUserSwagger.operation)
  @ApiBody(createUserSwagger.body)
  @ApiResponse(createUserSwagger.responses.success)
  @ApiResponse(createUserSwagger.responses.badRequest)
  @ApiResponse(createUserSwagger.responses.internalError)
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Req() req: RequestWithUser,
    @Headers('x-platform') platform: string,
  ): Promise<{ message: string }> {
    await this.usersService.create(createUserDto, platform, req.user);
    return { message: await this.i18nService.translate('texts.user.CREATED_SUCCESS') };
  }

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
  async findAll(@Query() query: FindUserDto): Promise<{ data: User[]; count: number }> {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @applyDecorators(...addHeaders(findOneUserSwagger.headers))
  @ApiOperation(findOneUserSwagger.operation)
  @ApiParam(findOneUserSwagger.param)
  @ApiResponse(findOneUserSwagger.responses.success)
  @ApiResponse(findOneUserSwagger.responses.notFound)
  @ApiResponse(findOneUserSwagger.responses.internalError)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @applyDecorators(...addHeaders(updateUserSwagger.headers))
  @ApiOperation(updateUserSwagger.operation)
  @ApiParam(updateUserSwagger.param)
  @ApiBody(updateUserSwagger.body)
  @ApiResponse(updateUserSwagger.responses.success)
  @ApiResponse(updateUserSwagger.responses.notFound)
  @ApiResponse(updateUserSwagger.responses.internalError)
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser,
    @Headers('x-platform') platform: string,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto, req.user, platform);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @applyDecorators(...addHeaders(deleteUserSwagger.headers))
  @ApiOperation(deleteUserSwagger.operation)
  @ApiParam(deleteUserSwagger.param)
  @ApiResponse(deleteUserSwagger.responses.success)
  @ApiResponse(deleteUserSwagger.responses.notFound)
  @ApiResponse(deleteUserSwagger.responses.internalError)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
    @Headers('x-platform') platform: string,
  ): Promise<{ message: string }> {
    await this.usersService.delete(id, req.user, platform);
    return { message: await this.i18nService.translate('texts.user.DELETED_SUCCESSFULLY') };
  }
}

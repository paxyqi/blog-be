//tips：不要在controller里面写业务逻辑！保持controller的简介非常有利于后期维护！
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, EditUserDTO } from './user.dto';
import { User } from './user.interface';

interface UserResponse<T = unknown> {
  code: number;
  data?: T;
  message: string;
}

@Controller('user')
export class UserController {
  //先用构造器实例化，然后才能调用方法
  constructor(private readonly usersService: UserService) {}
  //使用POST来接收请求
  @Post('find-me')
  findMe(@Body() body: any) {
    // 通过@Body()来获取请求体(request.body)的参数
    return this.usersService.findMe(body.username);
  }

  // GET /user
  @Get()
  async findAll(): Promise<UserResponse<User[]>> {
    return {
      code: 200,
      data: await this.usersService.findAll(),
      message: 'Success.',
    };
  }

  // GET /user/:_id
  @Get(':_id')
  async findOne(
    @Res() res,
    @Param('_id') _id: string,
  ): Promise<UserResponse<User>> {
    const user = await this.usersService.findOne(_id);
    if (!user) throw new NotFoundException('this user does not exist!');
    return {
      code: 200,
      message: 'Success.',
    };
  }

  // POST /user
  @Post()
  async addOne(@Body() body: CreateUserDTO): Promise<UserResponse> {
    await this.usersService.addOne(body);
    return {
      code: 200,
      message: 'Success.',
    };
  }

  // PUT /user/:_id
  @Put(':_id')
  async editOne(
    @Param('_id') _id: string,
    @Body() body: EditUserDTO,
  ): Promise<UserResponse> {
    await this.usersService.editOne(_id, body);
    return {
      code: 200,
      message: 'Success.',
    };
  }

  // DELETE /user/:_id
  @Delete(':_id')
  async deleteOne(@Param('_id') _id: string): Promise<UserResponse> {
    await this.usersService.deleteOne(_id);
    return {
      code: 200,
      message: 'Success.',
    };
  }
}

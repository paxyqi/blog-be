import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Param,
  NotFoundException,
  Post,
  Body,
  Query,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, LoginDTO } from './dto/create-user.dto';
import { ValidateObjectId } from '../pipes/validate-object-id.pipes';
import { AuthService } from 'src/auth/auth.service';
//添加用于验证用户token的守卫机制
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard } from 'src/guards/rbac.guard';
//用于用户分级，只有高等级用户可以执行注销账号和编辑账号操作
import { roleConstans as role } from 'src/auth/constants';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiBearerAuth() // Swagger 的 JWT 验证
@ApiTags('user') // 添加 接口标签 装饰器
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  // JWT验证 - Step 1: 用户请求登录
  @Post('login')
  @ApiBody({
    description: '用户登录',
    type: LoginDTO,
  })
  async login(@Body() loginParmas: LoginDTO) {
    console.log('JWT验证 - Step 1: 用户请求登录');
    const authResult = await this.authService.validateUser(
      loginParmas.user_name,
      loginParmas.password,
    );
    console.log(authResult);
    switch (authResult.code) {
      case 1:
        return this.authService.certificate(authResult.user);
      case 2:
        return {
          code: 600,
          msg: `账号或密码不正确`,
        };
      default:
        return {
          code: 600,
          msg: `查无此人`,
        };
    }
  }

  @Get('users')
  @UseGuards(new RbacGuard(role.DEVELOPER))
  //@UseInterceptors(new RbacInterceptor(role.DEVELOPER))
  async getUsers(@Res() res) {
    // @Res是@Response的别名，目的是暴露底层响应对象的接口
    const users = await this.userService.getUsers();
    return res.status(HttpStatus.OK).json(users);
  }

  //动态路由，实际类似user/1
  @Get('user/:userID')
  async getUser(@Res() res, @Param('userID', new ValidateObjectId()) userID) {
    const user = await this.userService.getUser(userID);
    if (!user) throw new NotFoundException('This user does not exist!');
    return res.status(HttpStatus.OK).json(user);
  }

  @Get('user/:user_name')
  async getUserbyName(@Res() res, @Param() user_name) {
    const user = await this.userService.getUserbyName(user_name);
    if (!user) throw new NotFoundException('This user does not exist!');
    return res.status(HttpStatus.OK).json(user);
  }

  @Post('/post')
  async addUser(@Res() res, @Body() createUserDTO: CreateUserDTO) {
    const newUser = await this.userService.addUser(createUserDTO);
    return res.status(HttpStatus.OK).json({
      message: 'User has been submitted successfully!',
      user: newUser,
    });
  }

  // Rbac应在Auth之前，否则无法获取用户信息
  @Put('/edit')
  @UseGuards(new RbacGuard(role.DEVELOPER))
  @UseGuards(AuthGuard('jwt'))
  // @UseInterceptors(new RbacInterceptor(role.DEVELOPER))
  async editUser(
    @Res() res,
    @Query('userID', new ValidateObjectId()) userID,
    @Body() createUserDTO: CreateUserDTO,
  ) {
    const editedUser = await this.userService.editUser(userID, createUserDTO);
    if (!editedUser) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'User has been updated successfully!',
      user: editedUser.ATTRIBUTE_NODE,
    });
  }

  @Delete('/delete')
  @UseGuards(new RbacGuard(role.DEVELOPER))
  @UseGuards(AuthGuard('jwt'))
  //@UseInterceptors(new RbacInterceptor(2))
  async deleteUser(
    @Res() res,
    @Query('userID', new ValidateObjectId()) userID,
  ) {
    const deletedUser = await this.userService.deleteUser(userID);
    if (!deletedUser) throw new NotFoundException('User dose not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'User has been deleted!',
      user: deletedUser,
    });
  }
}

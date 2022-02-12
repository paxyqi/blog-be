import {
  IsNotEmpty,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({
    description:
      '[用户角色]: 0-超级管理员 | 1-管理员 | 2-开发&测试&运营 | 3-普通用户(只能查看)',
  })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是 String 类型' })
  @MaxLength(15, { message: '用户名不应长于15' })
  @MinLength(6, { message: '用户名不应短于6' })
  readonly user_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string; // 取消readonly，考虑在获得DTO之后将其password进行加密再存储，因此需要可写权限

  @ApiProperty()
  @IsNotEmpty({ message: '注册邮箱不能为空' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty({ message: '身份信息不能为空' })
  @IsInt()
  readonly role: number;
  salt: string;
}

export class LoginDTO {
  @ApiProperty({ description: '用户名', example: 'normal_user' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly user_name: string;

  @ApiProperty({ description: '密码', example: '000000' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
}

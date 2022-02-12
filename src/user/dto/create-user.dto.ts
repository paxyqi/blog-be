import {
  IsNotEmpty,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDTO {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是 String 类型' })
  @MaxLength(15, { message: '用户密码不应长于15' })
  @MinLength(6, { message: '用户密码不应短于6' })
  readonly user_name: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @MaxLength(15, { message: '用户密码不应长于15' })
  @MinLength(6, { message: '用户密码不应短于6' })
  password: string; // 取消readonly，考虑在获得DTO之后将其password进行加密再存储，因此需要可写权限

  @IsNotEmpty({ message: '注册邮箱不能为空' })
  readonly email: string;

  @IsNotEmpty({ message: '身份信息不能为空' })
  @IsInt()
  readonly role: number;
  salt: string;
}

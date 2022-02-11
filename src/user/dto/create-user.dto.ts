export class CreateUserDTO {
  readonly user_name: string;
  password: string; // 取消readonly，考虑在获得DTO之后将其password进行加密再存储，因此需要可写权限
  readonly email: string;
  readonly role: number;
}

import Document from 'mongoose';

export interface User extends Document {
  readonly user_name: string;
  readonly password: string;
  readonly email: string;
  readonly role: number;
  readonly salt: string; //密码盐：用于加密密码
}

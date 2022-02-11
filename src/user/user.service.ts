import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import { makeSalt, encryptPassword } from 'src/utils/cryptogram';

@Injectable()
export class UserService {
  // 依赖注入:将User模型注入UserService类中。
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users;
  }

  async getUser(userID): Promise<User> {
    const post = await this.userModel.findById(userID).exec();
    return post;
  }

  async addUser(createUserDTO: CreateUserDTO): Promise<User> {
    const salt = makeSalt(); //制作密码盐用于加密passwd
    const hashPassword = encryptPassword(createUserDTO.password, salt);
    createUserDTO.password = hashPassword;
    const newUser = await new this.userModel(createUserDTO);
    return newUser.save();
  }

  async editUser(userID, createUserDTO: CreateUserDTO): Promise<User> {
    const editedUser = await this.userModel.findByIdAndUpdate(
      userID,
      createUserDTO,
      { new: true },
    );
    return editedUser;
  }

  async deleteUser(userID): Promise<any> {
    const deletedUser = await this.userModel.findByIdAndRemove(userID);
    return deletedUser;
  }
}

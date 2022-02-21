import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 由于将UserService和UserController组装在了UserModule里面，因此不用在@Module里面二次引入
// import { UserService } from './logical/user/user.service';

// import { UserModule } from './logical/user/user.module';
// 引入mongodb
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from './blog/blog.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
// import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  //使用module装饰器将元数据附加到模块类中, mongoose中localhost/xxx中xxx为db名字
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://172.25.102.11/blog'),
    BlogModule,
    AuthModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() //HTTP 请求方法装饰器告诉 Nest 为 HTTP 请求的特定端点创建处理程序
  getHello(): string {
    return this.appService.getHello();
  }
}

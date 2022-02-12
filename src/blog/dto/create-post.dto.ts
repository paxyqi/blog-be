// 创建一个数据传输对象，它将定义数据会怎样发送到网络。
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDTO {
  @ApiProperty()
  readonly title: string;
  @ApiProperty()
  readonly description: string;
  @ApiProperty()
  readonly body: string;
  @ApiProperty()
  readonly author: string;
  @ApiProperty()
  readonly date_posted: string;
}

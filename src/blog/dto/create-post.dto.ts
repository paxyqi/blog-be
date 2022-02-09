// 创建一个数据传输对象，它将定义数据会怎样发送到网络。
export class CreatePostDTO {
  readonly title: string;
  readonly description: string;
  readonly body: string;
  readonly author: string;
  readonly date_posted: string;
}

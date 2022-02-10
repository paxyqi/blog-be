import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class ValidateObjectId implements PipeTransform<string> {
  /*transform() 的方法，该方法将 value 作为参数 —— 在当前着种情况下为 postID。
使用这个方法，任何带有无法在数据库中检索到的 postID 的应用中的前端 HTTP 请求都会被视为无效。
保存并关闭文件。 */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: string, metadata: ArgumentMetadata) {
    const isValid = mongoose.Types.ObjectId.isValid(value);
    if (!isValid) throw new BadRequestException('Invalid ID!');
    return value;
  }
}

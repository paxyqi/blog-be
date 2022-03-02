import * as mongoose from 'mongoose';

export class ReplyDTO {
  readonly fromUser: mongoose.Schema.Types.ObjectId;
  readonly toUser: mongoose.Schema.Types.ObjectId;
  readonly replyContent: string;
  readonly enterDate: Date;
  readonly replyToId: mongoose.Schema.Types.ObjectId;
  readonly like: number;
  readonly hate: number;
}

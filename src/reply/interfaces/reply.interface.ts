import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Reply extends Document {
  readonly fromUser: mongoose.Schema.Types.ObjectId;
  readonly toUser: mongoose.Schema.Types.ObjectId;
  readonly replyContent: string;
  readonly enterDate: Date;
  readonly replyToId: mongoose.Schema.Types.ObjectId;
  readonly like: number;
  readonly hate: number;
}

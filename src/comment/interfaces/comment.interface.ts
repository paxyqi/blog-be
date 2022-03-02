import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Comment extends Document {
  readonly userID: mongoose.Schema.Types.ObjectId;
  readonly blogID: mongoose.Schema.Types.ObjectId;
  readonly role: number;
  readonly content: string;
  readonly enterDate: Date;
  readonly like: number;
  readonly hate: number;
}

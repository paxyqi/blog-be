import * as mongoose from 'mongoose';

export class CreateCommentDTO {
  readonly userID: mongoose.Schema.Types.ObjectId;
  readonly blogID: mongoose.Schema.Types.ObjectId;
  readonly role: number;
  readonly content: string;
  readonly enterDate: Date;
  readonly like: number;
  readonly hate: number;
}

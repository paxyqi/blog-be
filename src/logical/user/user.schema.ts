// user.schema.ts
import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // 覆盖 Mongoose 生成的默认 _id
  user_name: { type: String, required: true },
  administrator: { type: Boolean, required: true },
  password: { type: String, required: true },
});

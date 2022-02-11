import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  user_name: String,
  password: String,
  email: String,
  role: Number,
  salt: String,
});

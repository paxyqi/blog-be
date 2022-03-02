import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
  userID: {
    // 将当前集合与评论用户集合关联
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  blogID: mongoose.Schema.Types.ObjectId,
  role: Number,
  content: String,
  enterDate: {
    type: Date,
    default: Date.now,
  },
  like: {
    type: Number,
    default: 0,
  },
  hate: {
    type: Number,
    default: 0,
  },
});

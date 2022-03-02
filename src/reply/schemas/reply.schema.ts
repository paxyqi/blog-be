import * as mongoose from 'mongoose';

export const ReplySchema = new mongoose.Schema({
  // 回复用户
  fromUser: {
    // 将当前集合和用户集合关联
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  toUser: {
    // 将当前集合和回复用户集合关联
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // 内容
  replyContent: {
    type: String,
    maxlength: 200,
    required: true,
  },
  // 创建时间
  enterDate: {
    type: Date,
    default: Date.now,
  },
  // 回复对象Id
  replyToId: {
    // 将当前集合和评论集合关联
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  },
  role: Number,
  like: {
    type: Number,
    default: 0,
  },
  hate: {
    type: Number,
    default: 0,
  },
});

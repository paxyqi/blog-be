import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Reply } from './interfaces/reply.interface';
import { ReplyDTO } from './dto/reply.dto';

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel('Reply') private readonly replyModel: Model<Reply>,
  ) {}

  async addReply(replyDTO: ReplyDTO): Promise<Reply> {
    const newReply = await new this.replyModel(replyDTO);
    return newReply.save();
  }

  async getReplyList(replyToID): Promise<Reply[]> {
    const replyList = await this.replyModel
      .find({ replyToId: replyToID })
      .exec();
    return replyList;
  }
}

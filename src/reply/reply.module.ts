import { Module } from '@nestjs/common';
import { CommentModule } from 'src/comment/comment.module';
import { UserModule } from 'src/user/user.module';
import { ReplyController } from './reply.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReplySchema } from './schemas/reply.schema';
import { ReplyService } from './reply.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Reply', schema: ReplySchema, collection: 'replys' },
    ]),
    CommentModule,
    UserModule,
  ],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}

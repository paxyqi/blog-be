import {
  Controller,
  Res,
  HttpStatus,
  Post,
  Body,
  Req,
  Get,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyDTO } from './dto/reply.dto';
import { UserService } from '../user/user.service';
import { ValidateObjectId } from '../pipes/validate-object-id.pipes';
import { CommentService } from '../comment/comment.service';

@Controller('reply')
export class ReplyController {
  constructor(
    private replyService: ReplyService,
    private userService: UserService,
    private commentService: CommentService,
  ) {}

  @Post()
  async addReply(@Req() req, @Res() res, @Body() replyDTO: ReplyDTO) {
    const hasFromUser = await this.userService.getUser(req.body.fromUser);
    const hasToUser = await this.userService.getUser(req.body.toUser);
    if (hasFromUser !== null && hasToUser !== null) {
      const newReply = await this.replyService.addReply(replyDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Comment has been submitted successfully!',
        rely: newReply,
      });
    } else {
      return res.status(HttpStatus.OK).json({
        message:
          'Comment has not been submitted because the from or to user does not exist!',
      });
    }
  }

  @Get('/List')
  async getReplyList(
    @Res() res,
    @Query('postID', new ValidateObjectId()) postID,
  ) {
    const data = await this.commentService.getCommentbyPostID(postID);
    console.log(data);
    const replyLists = [];
    let i = 0;
    for (const item of data) {
      console.log(item._id);
      const replyList = await this.replyService.getReplyList(item._id);
      replyLists[i] = replyList;
      console.log(replyList);
      i++;
    }
    console.log(replyLists);
    if (replyLists === [])
      throw new NotFoundException('This post does not has comments!');
    return res.status(HttpStatus.OK).json({
      message: 'Get all comments!',
      reply: replyLists,
    });
  }
}

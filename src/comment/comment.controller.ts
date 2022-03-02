import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Param,
  NotFoundException,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { ValidateObjectId } from '../pipes/validate-object-id.pipes';
import { UserService } from '../user/user.service';

@Controller('comment')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private userService: UserService,
  ) {}

  @Get('contents')
  async getComments(@Res() res) {
    const contents = await this.commentService.getComments();
    return res.status(HttpStatus.OK).json(contents);
  }

  @Get('content/:commentID')
  async getComment(
    @Res() res,
    @Param('commentID', new ValidateObjectId()) commentID,
  ) {
    const content = await this.commentService.getComment(commentID);
    if (!content) throw new NotFoundException('This comment does not exist!');
    return res.status(HttpStatus.OK).json(content);
  }

  @Post('/post')
  async addComment(
    @Req() req,
    @Res() res,
    @Body() createCommentDTO: CreateCommentDTO,
  ) {
    const hasUser = await this.userService.getUser(req.body.userID);
    if (hasUser !== null) {
      const newComment = await this.commentService.addComment(createCommentDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Comment has been submitted successfully!',
        comment: newComment,
      });
    } else {
      return res.status(HttpStatus.OK).json({
        message:
          'Comment has not been submitted because the user does not exist!',
      });
    }
  }
}

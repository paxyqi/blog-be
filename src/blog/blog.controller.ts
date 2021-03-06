import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Param,
  NotFoundException,
  Post,
  Body,
  Query,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { ValidateObjectId } from './shared/pipes/validate-object-id.pipes';
import { RbacInterceptor } from '../interceptor/rbac.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { roleConstans as role } from 'src/auth/constants';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('blog') // 添加 接口标签 装饰器
@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  //客户端接收 HTTP GET 请求时从数据库中获取所有文章
  @Get('posts')
  async getPosts(@Res() res) {
    const posts = await this.blogService.getPosts();
    return res.status(HttpStatus.OK).json(posts);
  }

  //从数据库中获取一篇文章
  @Get('post/:postID')
  async getPost(@Res() res, @Param('postID', new ValidateObjectId()) postID) {
    const post = await this.blogService.getPost(postID);
    if (!post) throw new NotFoundException('Post does not exist!');
    return res.status(HttpStatus.OK).json(post);
  }

  //添加新的文章
  @Post('/post')
  // @UseGuards(AuthGuard('jwt')) 为了测试前端功能，临时注释
  async addPost(@Res() res, @Body() createPostDTO: CreatePostDTO) {
    const newPost = await this.blogService.addPost(createPostDTO);
    return res.status(HttpStatus.OK).json({
      message: 'Post has been submitted successfully!',
      post: newPost,
    });
  }

  //这个方法接受 postID 的查询参数，并执行更新一篇文章的功能。
  //ValidateObjectId 方法为您需要编辑文章提供适当的认证。
  @Put('/edit')
  @UseGuards(AuthGuard('jwt'))
  async editPost(
    @Res() res,
    @Query('postID', new ValidateObjectId()) postID,
    @Body() createPostDTO: CreatePostDTO,
  ) {
    const editedPost = await this.blogService.editPost(postID, createPostDTO);
    if (!editedPost) throw new NotFoundException('Post does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Post has been successfully updated',
      post: editedPost,
    });
  }

  //接受 postID 的查询参数，并从数据库中删除特定的文章;若用户为等级为3的普通用户则不能删除文章
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new RbacInterceptor(role.DEVELOPER))
  @Delete('/delete')
  async deletePost(
    @Res() res,
    @Query('postID', new ValidateObjectId()) postID,
  ) {
    const deletedPost = await this.blogService.deletePost(postID);
    if (!deletedPost) throw new NotFoundException('Post does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Post has been deleted!',
      post: deletedPost,
    });
  }
}

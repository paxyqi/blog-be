import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from './schemas/blog.schema';

@Module({
  // forFeature第一个参数name：specify the identity of 'ModelDefinition' in a collection of schema registration.
  // 第二个参数schema：accepts the Collection(Table) Schema that we have created above
  // 第三个参数collection？：the value should match with MongoDB Collection name
  imports: [
    MongooseModule.forFeature([
      { name: 'Post', schema: BlogSchema, collection: 'posts' },
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}

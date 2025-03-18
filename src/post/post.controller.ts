import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Roles('TEACHER')
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    const authorId = req.user.id;
    return this.postService.create(createPostDto, authorId);
  }

  @Get()
  async findAllPosts() {
    return this.postService.findAll();
  }

  @Get(':id')
  async viewPost(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @Roles('TEACHER')
  @Put(':id')
  async updatePost(
    @Param('id') postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
  ) {
    const authorId = req.user.id;
    return this.postService.update(postId, authorId, updatePostDto);
  }

  @Roles('TEACHER')
  @Delete(':id')
  async removePost(@Param('id') id: number) {
    return this.postService.remove(id);
  }
}

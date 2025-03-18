import { Controller, Post, Body, Param, Put, Delete, Get, Request } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req: any,
  ) {
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

  @Put(':id')
  async updatePost(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
  ) {
    const authorId = req.user.id;
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  async removePost(@Param('id') id: number) {
    return this.postService.remove(id);
  }
}

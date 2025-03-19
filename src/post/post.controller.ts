import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
  Request,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { IPost } from './models/post.interface';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Roles('TEACHER')
  @Post()
  @ApiOperation({ summary: 'Create post' })
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    const authorId = req.user.id;
    return this.postService.create(createPostDto, authorId);
  }

  @Get()
  @ApiOperation({ summary: 'Find all posts' })
  @ApiOkResponse({
    description: 'List of all posts',
    type: [CreatePostDto],
  })
  async findAllPosts(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return this.postService.findAll(limit, page);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search posts by title or content' })
  async searchPosts(
    @Query('query') query: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<IPost[]> {
    return this.postService.search(query, limit, page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find post by id' })
  async viewPost(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @Roles('TEACHER')
  @Put(':id')
  @ApiOperation({ summary: 'Update post by id' })
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
  @ApiOperation({ summary: 'Delete post by id' })
  async removePost(@Param('id') id: number) {
    return this.postService.remove(id);
  }
}

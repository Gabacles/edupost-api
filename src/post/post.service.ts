import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: number): Promise<Post> {
    const post = this.postRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      author_id: authorId,
    });

    return this.postRepository.save(post);
  }

  async findAll(limit = 10, page = 1): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author_id'],
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author_id'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async search(query: string, limit = 10, page = 1): Promise<Post[]> {
    return this.postRepository.find({
      where: [{ title: ILike(`%${query}%`) }, { content: ILike(`%${query}%`) }],
      relations: ['author_id'],
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async update(
    id: number,
    authorId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author_id'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const { id: postAuthorId } = post.author_id as any;

    if (postAuthorId !== authorId) {
      throw new NotFoundException('You are not the author of this post');
    }

    Object.assign(post, updatePostDto);

    return this.postRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const result = await this.postRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Post not found');
    }
  }
}

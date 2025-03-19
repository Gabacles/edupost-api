import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostController', () => {
  let controller: PostController;
  let postService: PostService;

  const mockPostService = {
    create: jest.fn(),
    findAll: jest.fn(),
    search: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const createPostDto: CreatePostDto = { title: 'Test Post', content: 'Test content', authorId: 1 };
      const mockUser = { id: 1 };

      mockPostService.create.mockResolvedValue('Post created');

      const result = await controller.createPost(createPostDto, { user: mockUser });
      expect(result).toBe('Post created');
      expect(mockPostService.create).toHaveBeenCalledWith(createPostDto, mockUser.id);
    });
  });

  describe('findAllPosts', () => {
    it('should return all posts', async () => {
      const mockPosts = [{ id: 1, title: 'Test Post', content: 'Test content' }];
      mockPostService.findAll.mockResolvedValue(mockPosts);

      const result = await controller.findAllPosts(10, 1);
      expect(result).toBe(mockPosts);
      expect(mockPostService.findAll).toHaveBeenCalledWith(10, 1);
    });
  });

  describe('searchPosts', () => {
    it('should return posts based on search query', async () => {
      const mockPosts = [{ id: 1, title: 'Test Post', content: 'Test content' }];
      mockPostService.search.mockResolvedValue(mockPosts);

      const result = await controller.searchPosts('Test', 10, 1);
      expect(result).toBe(mockPosts);
      expect(mockPostService.search).toHaveBeenCalledWith('Test', 10, 1);
    });
  });

  describe('viewPost', () => {
    it('should return a post by id', async () => {
      const mockPost = { id: 1, title: 'Test Post', content: 'Test content' };
      mockPostService.findOne.mockResolvedValue(mockPost);

      const result = await controller.viewPost(1);
      expect(result).toBe(mockPost);
      expect(mockPostService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = { title: 'Updated Post', content: 'Updated content' };
      const mockUser = { id: 1 };
      const mockPost = { id: 1, title: 'Updated Post', content: 'Updated content' };

      mockPostService.update.mockResolvedValue(mockPost);

      const result = await controller.updatePost(1, updatePostDto, { user: mockUser });
      expect(result).toBe(mockPost);
      expect(mockPostService.update).toHaveBeenCalledWith(1, mockUser.id, updatePostDto);
    });
  });

  describe('removePost', () => {
    it('should remove a post', async () => {
      mockPostService.remove.mockResolvedValue('Post removed');

      const result = await controller.removePost(1);
      expect(result).toBe('Post removed');
      expect(mockPostService.remove).toHaveBeenCalledWith(1);
    });
  });
});

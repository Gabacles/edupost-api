import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('PostService', () => {
  let service: PostService;
  let repository: Repository<Post>;

  const mockPostRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    repository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a post', async () => {
      const createPostDto = {
        title: 'Test Post',
        content: 'Test content',
        authorId: 1,
      };
      const mockPost = { ...createPostDto, id: 1 };

      mockPostRepository.create.mockReturnValue(mockPost);
      mockPostRepository.save.mockResolvedValue(mockPost);

      const result = await service.create(createPostDto, 1);
      expect(result).toEqual(mockPost);
      expect(mockPostRepository.save).toHaveBeenCalledWith(mockPost);
    });
  });

  describe('findAll', () => {
    it('should return paginated posts with metadata', async () => {
      const mockPosts = [
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' },
      ];
      const mockTotal = 20;

      mockPostRepository.findAndCount.mockResolvedValue([mockPosts, mockTotal]);

      const result = await service.findAll(10, 1);

      expect(result).toEqual({
        data: mockPosts,
        totalItems: mockTotal,
        totalPages: 2,
        currentPage: 1,
        pageSize: 10,
      });

      expect(mockPostRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        relations: ['author_id'],
        take: 10,
        skip: 0,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      const mockPost = { id: 1, title: 'Post 1', content: 'Content 1' };
      mockPostRepository.findOne.mockResolvedValue(mockPost);

      const result = await service.findOne(1);
      expect(result).toEqual(mockPost);
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['author_id'],
      });
    });

    it('should throw an error if post not found', async () => {
      mockPostRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('search', () => {
    it('should return posts matching the search query', async () => {
      const query = 'Test';
      const mockPosts = [
        { id: 1, title: 'Test Post 1', content: 'Test content 1' },
        { id: 2, title: 'Test Post 2', content: 'Test content 2' },
      ];

      mockPostRepository.find.mockResolvedValue(mockPosts);

      const result = await service.search(query, 10, 1);
      expect(result).toEqual(mockPosts);

      expect(mockPostRepository.find).toHaveBeenCalledWith({
        relations: ['author_id'],
        take: 10,
        skip: 0,
        where: [
          {
            title: expect.objectContaining({
              _type: 'ilike',
              _value: '%Test%',
            }),
          },
          {
            content: expect.objectContaining({
              _type: 'ilike',
              _value: '%Test%',
            }),
          },
        ],
      });
    });
  });

  describe('update', () => {
    it('should update and return the post if user is the author', async () => {
      const updatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };
      const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        author_id: { id: 1 },
      };
      const updatedPost = { ...mockPost, ...updatePostDto };

      mockPostRepository.findOne.mockResolvedValue(mockPost);
      mockPostRepository.save.mockResolvedValue(updatedPost);

      const result = await service.update(1, 1, updatePostDto);
      expect(result).toEqual(updatedPost);
      expect(mockPostRepository.save).toHaveBeenCalledWith(updatedPost);
    });

    it('should throw an error if the user is not the author', async () => {
      const updatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };
      const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        author_id: { id: 2 },
      };

      mockPostRepository.findOne.mockResolvedValue(mockPost);

      await expect(service.update(1, 1, updatePostDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete the post', async () => {
      mockPostRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.not.toThrow();
      expect(mockPostRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if the post does not exist', async () => {
      mockPostRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});

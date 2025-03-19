import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRoles } from './models/userRoles.enum';

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  delete: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const createUserDto = {
        email: 'newuser@example.com',
        password: 'newPassword',
        name: 'New User',
        roles: UserRoles.TEACHER,
        username: 'newuser',
      };
      const mockUser = { id: 1, ...createUserDto };

      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith({ ...createUserDto, posts: [] });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: 1, email: 'test1@example.com', posts: [] },
        { id: 2, email: 'test2@example.com', posts: [] },
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.find).toHaveBeenCalledWith({ relations: ['posts'] });
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: 1, email: 'test@example.com', posts: [] };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['posts'],
      });
    });

    it('should throw a NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      try {
        await service.findOne(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User with ID 1 not found');
      }
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const updateUserDto = { email: 'updated@example.com' };
      const mockUser = { id: 1, email: 'test@example.com', posts: [] };
      const updatedUser = { ...mockUser, ...updateUserDto };

      mockUserRepository.preload.mockResolvedValue(updatedUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateUserDto,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw a NotFoundException if user not found', async () => {
      const updateUserDto = { email: 'updated@example.com' };
      mockUserRepository.preload.mockResolvedValue(null);

      try {
        await service.update(1, updateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User with ID 1 not found');
      }
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if user not found', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });

      try {
        await service.remove(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User with ID 1 not found');
      }
    });
  });
});

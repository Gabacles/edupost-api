import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from './models/userRoles.enum';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOneByEmail: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      roles: UserRoles.TEACHER,
      username: 'john_doe',
    };
    mockUserService.create.mockResolvedValue({ id: 1, ...dto });

    const result = await userController.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(mockUserService.create).toHaveBeenCalledWith(dto);
  });

  it('should return all users', async () => {
    const users = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];
    mockUserService.findAll.mockResolvedValue(users);

    const result = await userController.findAll();
    expect(result).toEqual(users);
    expect(mockUserService.findAll).toHaveBeenCalled();
  });

  it('should return a user by ID', async () => {
    const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
    mockUserService.findOne.mockResolvedValue(user);

    const result = await userController.findOne('1');
    expect(result).toEqual(user);
    expect(mockUserService.findOne).toHaveBeenCalledWith(1);
  });

  it('should return a user by email', async () => {
    const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
    mockUserService.findOneByEmail.mockResolvedValue(user);

    const result = await userController.findOneByEmail('john@example.com');
    expect(result).toEqual(user);
    expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
      'john@example.com',
    );
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = { name: 'John Updated' };
    const updatedUser = {
      id: 1,
      name: 'John Updated',
      email: 'john@example.com',
    };
    mockUserService.update.mockResolvedValue(updatedUser);

    const result = await userController.update('1', dto);
    expect(result).toEqual(updatedUser);
    expect(mockUserService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should delete a user', async () => {
    mockUserService.remove.mockResolvedValue({ message: 'User deleted' });

    const result = await userController.remove('1');
    expect(result).toEqual({ message: 'User deleted' });
    expect(mockUserService.remove).toHaveBeenCalledWith(1);
  });
});

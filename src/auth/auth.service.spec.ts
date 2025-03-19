import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '@/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { UserRoles } from '@/user/models/userRoles.enum';

jest.mock('bcryptjs', () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const email = 'test@example.com';
      const password = 'testPassword';

      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(email, password);
      expect(result).toEqual(mockUser);
      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw BadRequestException if user is not found', async () => {
      const email = 'invalid@example.com';
      const password = 'wrongPassword';

      mockUserService.findOneByEmail.mockResolvedValue(null);

      try {
        await service.validateUser(email, password);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('invalid credentials');
      }
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const email = 'test@example.com';
      const password = 'wrongPassword';

      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(false);

      try {
        await service.validateUser(email, password);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('invalid credentials');
      }
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        roles: UserRoles.TEACHER,
        name: 'Test User',
        username: 'testuser',
        password: 'hashedPassword',
        posts: [],
      };
      const mockToken = 'mockJWTToken';

      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);
      expect(result).toEqual({ access_token: mockToken });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser.id,
        roles: mockUser.roles,
      });
    });
  });

  describe('register', () => {
    it('should register a new user and return a JWT token', async () => {
      const mockCreateUserDto = {
        email: 'newuser@example.com',
        password: 'newPassword',
        name: 'New User',
        roles: UserRoles.TEACHER,
        username: 'newuser',
      };
      const mockUser = {
        id: 1,
        email: 'newuser@example.com',
        password: 'hashedPassword',
      };
      const mockToken = 'mockJWTToken';

      mockUserService.findOneByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.register(mockCreateUserDto);
      expect(result).toEqual({ access_token: mockToken });
      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        mockCreateUserDto.email,
      );
      expect(mockUserService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockCreateUserDto.email,
          password: expect.any(String),
        }),
      );
    });

    it('should throw BadRequestException if email already exists', async () => {
      const mockCreateUserDto = {
        email: 'existinguser@example.com',
        password: 'newPassword',
        name: 'New User',
        roles: UserRoles.TEACHER,
        username: 'newuser',
      };
      const mockExistingUser = { id: 1, email: 'existinguser@example.com' };

      mockUserService.findOneByEmail.mockResolvedValue(mockExistingUser);

      try {
        await service.register(mockCreateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Email already exists');
      }
    });
  });
});

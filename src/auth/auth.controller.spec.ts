import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import { UserRoles } from '@/user/models/userRoles.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a login response', async () => {
      const mockUser = { username: 'testUser', password: 'testPassword' };
      const mockLoginResponse = { access_token: 'mockToken' };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login({ user: mockUser });

      expect(result).toEqual(mockLoginResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should return BadRequestException if login fails', async () => {
      const mockUser = { username: 'invalidUser', password: 'wrongPassword' };

      mockAuthService.login.mockRejectedValue(
        new BadRequestException('Invalid credentials'),
      );

      try {
        await controller.login({ user: mockUser });
      } catch (error) {
        expect(error.response.message).toBe('Invalid credentials');
        expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
      }
    });
  });

  describe('register', () => {
    it('should return a register response', async () => {
      const mockRegisterBody = {
        username: 'newUser',
        password: 'newPassword',
        name: 'newName',
        email: 'test@email.com',
        roles: UserRoles.TEACHER,
      };
      const mockRegisterResponse = { id: 1, username: 'newUser' };

      mockAuthService.register.mockResolvedValue(mockRegisterResponse);

      const result = await controller.register(mockRegisterBody);
      expect(result).toEqual(mockRegisterResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(mockRegisterBody);
    });

    it('should return BadRequestException if registration fails', async () => {
      const mockRegisterBody = {
        username: 'newUser',
        password: 'newPassword',
        name: 'newName',
        email: 'test@email.com',
        roles: UserRoles.TEACHER,
      };

      mockAuthService.register.mockRejectedValue(
        new BadRequestException('User already exists'),
      );

      try {
        await controller.register(mockRegisterBody);
      } catch (error) {
        expect(error.response.message).toBe('User already exists');
        expect(mockAuthService.register).toHaveBeenCalledWith(mockRegisterBody);
      }
    });
  });
});

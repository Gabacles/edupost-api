import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '@/common/decorators/public.decorator';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { RegisterResponseDTO } from './dtos/register-response.dto';
import { CreateUserDto } from '@/user/dto/create-user.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() registerBody: CreateUserDto,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }
}

import { PartialType } from '@nestjs/mapped-types';
import { AccessToken } from '../types/access-token';
import { User } from '@/user/entities/user.entity';

export class RegisterResponseDTO extends PartialType(User) {
  access_token: AccessToken;
}

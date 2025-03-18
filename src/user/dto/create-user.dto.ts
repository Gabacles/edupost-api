import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRoles } from '../models/userRoles.enum';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must have at least 2 characters.' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have at least 3 characters.' })
  @IsAlphanumeric()
  username: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @IsString()
  @IsEmail()
  email: string;

  @IsInt()
  age: number;

  @IsNotEmpty()
  @IsEnum(UserRoles, { message: 'Invalid role provided.' })
  roles: UserRoles;

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain 8-20 characters, including:
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one number
        - At least one special character (@$!%*?&)`,
  })
  password: string;
}

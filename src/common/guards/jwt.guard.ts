import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | boolean | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException();
    }

    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new ForbiddenException('Malformed authorization token.');
    }

    try {
      const decodedToken = this.jwtService.decode(token) as any;

      request.user = decodedToken;

      const requiredRole = this.reflector.get<string>(
        'roles',
        context.getHandler(),
      );

      if (requiredRole) {
        const userRole = decodedToken.roles;

        if (userRole !== requiredRole.at(0)) {
          throw new ForbiddenException(
            'Access denied: You do not have permission to access this route.',
          );
        }
      }
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new ForbiddenException('Failed to decode the token.');
    }

    return super.canActivate(context);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Post } from './post/entities/post.entity';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './common/guards/jwt.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '24264', 10),
      database: process.env.DATABASE_NAME,
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.CA_CERTIFICATE_BASE64
          ? Buffer.from(process.env.CA_CERTIFICATE_BASE64, 'base64').toString(
              'utf-8',
            )
          : (() => {
              throw new Error('CA_CERTIFICATE_BASE64 is not defined');
            })(),
      },
      entities: [User, Post],
      synchronize: true,
      logging: true,
    }),
    UserModule,
    PostModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}

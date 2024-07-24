import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({}), ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}

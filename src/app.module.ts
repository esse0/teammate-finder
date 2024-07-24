import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { PostsModule } from './posts/posts.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'client'),
  }),
  AuthModule, UserModule, PrismaModule, ChatModule, PostsModule, GamesModule],
})
export class AppModule {}

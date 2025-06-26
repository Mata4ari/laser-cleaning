import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller'; 
import { AuthService } from './auth/auth.service'; 
import { JwtModule } from '@nestjs/jwt'; 
import { AuthModule } from './auth/auth.module';
import { TelegramModule } from './tg/telegram.module';


@Module({
  imports: [
    PortfolioModule,
    AuthModule,
    TelegramModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', 
      serveStaticOptions: {
        index: false,
        fallthrough: false,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'build'),
      exclude: ['/api*','/uploads*'],
      serveStaticOptions: {
        index: false,
        fallthrough: true,
      },
    }),
  ],
  controllers: [AppController], 
  providers: [], 
})
export class AppModule {}
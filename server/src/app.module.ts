import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller'; // Импортируем контроллер
import { AuthService } from './auth/auth.service'; // Импортируем сервис
import { JwtModule } from '@nestjs/jwt'; // Для работы с JWT
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    PortfolioModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // Префикс URL для доступа к файлам
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
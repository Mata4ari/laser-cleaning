import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'build'),
      exclude: ['/api*'],
      serveStaticOptions: {
        index: false,
      },
    }),
    PortfolioModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
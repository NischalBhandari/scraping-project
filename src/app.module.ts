import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperController } from './scraper/scraper.controller';
import { NestCrawlerModule } from 'nest-crawler';
import { CrawlerService } from './crawler/crawler.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    NestCrawlerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','client'),
      exclude: ['api/*'],
    }),
  ],
  controllers: [AppController, ScraperController],
  providers: [AppService, CrawlerService],
})
export class AppModule {}

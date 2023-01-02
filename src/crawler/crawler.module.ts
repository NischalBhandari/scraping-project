import { Module } from "@nestjs/common";
import { NestCrawlerModule } from 'nest-crawler';
@Module({
    imports: [
        NestCrawlerModule,
    ],
})
export class CrawlerModule {}
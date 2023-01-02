import { Controller, Get, Post, Render } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as axios from 'axios';

@Controller('scraper')
export class ScraperController {
    @Get()
    @Render('index')
    root(){
        return { message: 'Hyallo World' };
    }

    @Post()
    create(): string {
        return 'Create scraper';
    }
}

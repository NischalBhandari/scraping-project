import { Controller, Get, Query } from '@nestjs/common';
import { load } from 'cheerio';
import e from 'express';
import { resolve } from 'path';
import puppeteer from 'puppeteer';
import { AppService } from './app.service';
import { CrawlerService } from './crawler/crawler.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly crawlerService: CrawlerService) {}



  @Get('/api/search')
  async getTest(@Query() query: {name: string}) {
    console.log(query.name);
    let data = {'link': null};
    let link = await this.appService.getSearchData(query.name);
    data.link = link;
    return data;
    
  }

  @Get('/csv')
  getCsv(@Query() query: {name: string}){

  }
}

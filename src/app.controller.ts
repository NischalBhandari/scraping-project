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

  @Get('/backup')
  getHello(@Query() query: {name: string}) {
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto('https://www.coursera.org/search?index=prod_all_launched_products_term_optimization&entityTypeDescription=Guided%20Projects&topic=Data%20Science');
      await page.screenshot({path: 'example.png'})
    
      await browser.close();
    })();    
    console.log(query.name);
    let url = 'https://www.coursera.org/search?index=prod_all_launched_products_term_optimization&entityTypeDescription=Guided%20Projects&topic=Data%20Science';
    this.crawlerService.getNoOfPaginations(url);

    // crawling for each product types
    // this.crawlerService.getLearningProducts().then(x=>{
    //   let titles = x.title;
    //   titles.forEach(element =>{
    //     console.log(element);
    //     let url = 'https://www.coursera.org/search?index=prod_all_launched_products_term_optimization&entityTypeDescription=Guided%20Projects&topic=Data%20Science';
    //   })
    // }).catch(err=>{
    //   console.log("ERR");
    // });


    //this.crawlerService.scrape();
    //this.crawlerService.crawl();
    return this.appService.getHello();
  }

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

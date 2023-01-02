import { Injectable } from '@nestjs/common';
import { NestCrawlerService } from 'nest-crawler';
import { resolve } from 'path';
 
@Injectable()
export class CrawlerService {
  constructor(
    private readonly crawler: NestCrawlerService,
  ) {}
 
  public async crawl(): Promise<void> {
    interface Page {
      title: string;
    }
 
    const pages: Page[] = await this.crawler.fetch({
      target: {
        url: 'https://www.coursera.org/search?query=data%20science&',
        iterator: {
          selector: 'span.cds-35',
          convert: (x: string) => `https://news.ycombinator.com/${x}`,
        },
      },
      // fetch each `https://news.ycombinator.com/${x}` and scrape data
      fetch: (data: any, index: number, url: string) => ({
        title: '.title > a',
      }),
    });
 
    console.log(pages);
    // [
    //   { title: 'Post Title 1' },
    //   { title: 'Post Title 2' },
    //   ...
    //   ...
    //   { title: 'Post Title 30' }
    // ]
  }

  public async scrape(): Promise<void> {
    interface ExampleCom {
      courseName: string;
      courseProvider: string;
      courseDescription: string;
      courseDuration: string;
      noOfRatings: string
    }

    const data: ExampleCom = await this.crawler.fetch({
      target: 'https://www.coursera.org/learn/python-data-analysis',
      fetch: {
        courseName: 'h1',
        courseProvider: {
          listItem:'h3.instructor-name.headline-3-text.bold' ,
        },
        courseDescription: 'p.cds-33.css-n1ma14.cds-35',
        courseDuration: {
          selector: '.cds-33.css-bku0rr.cds-35',
          how: 'html',
          eq: 1,
        },
        noOfRatings: {
          selector: 'p.cds-33.css-bku0rr.cds-35 .rc-ReviewsOverview__totals__rating',
          how: 'html',
          eq: 0,
        }
      },
    });

    console.log(data);
    // {
    //   title: 'Example Domain',
    //   info: 'http://www.iana.org/domains/example',
    //   content: '<div><h1>Example Heading</h1><p>Example Paragraph</p></div>'
    // }
  }

  public async guidedProject(url): Promise <void> {
    interface ExampleCom {
      courseName: string;
      courseProvider: string;
      courseDescription: string;
      courseDuration: string;
      noOfRatings: string
    }

    const data: ExampleCom = await this.crawler.fetch({
      target: url,
      fetch: {
        courseName: 'h1',
        courseProvider: {
          listItem:'h3.instructor-name.headline-3-text.bold' ,
        },
        courseDescription: 'p.cds-33.css-n1ma14.cds-35',
        courseDuration: {
          selector: '.cds-33.css-bku0rr.cds-35',
          how: 'html',
          eq: 1,
        },
        noOfRatings: {
          selector: 'p.cds-33.css-bku0rr.cds-35 .rc-ReviewsOverview__totals__rating',
          how: 'html',
          eq: 0,
        }
      },
    });

    console.log(data);
  }

  public async getLearningProducts(): Promise<any> {
    interface ExampleCom {
      subjects: any,
    }

    const data: ExampleCom = await this.crawler.fetch({
      target: 'https://www.coursera.org/search',
      fetch: {
        title: {
          listItem: 'span.cds-33.cds-35',
        },
      },
    });
    
    return data;
    // {
    //   title: 'Example Domain',
    //   info: 'http://www.iana.org/domains/example',
    //   content: '<div><h1>Example Heading</h1><p>Example Paragraph</p></div>'
    // }
  }

  public async getNoOfPaginations(url): Promise<any>{
    interface paginationNumbers {
      final: any,
    }
    console.log(url);
    const data: paginationNumbers = await this.crawler.fetch({
      target: url,
      fetch: {
        final: {
          listItem: 'button',
          attr: 'id',
        },
      },
    });
    console.log(data);
 
  }

}
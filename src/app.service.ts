import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { json } from 'stream/consumers';


@Injectable()
export class AppService {
  getHello() {
  }

  getSearchData(searchName){
    let filename = Math.random()+'.csv';
    let items = [];
    let allItems = [];
    let readyStatus = 0;
    const fs=require('fs');
    (async()=>{
      const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: './tmp'
      });
      const page = await browser.newPage();
      let isDisabled = false;
      let url = 'https://www.coursera.org/search?query='+searchName;
      await page.goto(url,{
        waitUntil: "networkidle0",
      });
      while(!isDisabled){
      await page.waitForSelector(".pagination-controls-container",{visible: true});
      await page.screenshot({path: 'example.png'})
      const nextButtonDisabled = await page.$x("//button[@data-e2e='pagination-controls-next' and @disabled]");
      await page.screenshot({path: 'test.png'})
      console.log(nextButtonDisabled.length);
        if(nextButtonDisabled.length !== 0){
          isDisabled = true;
        }
        console.log(isDisabled);
        // get the product list from the page
        await page.waitForSelector("ul.cds-71",{visible: true});
        let productHandles = await page.$$('ul .cds-71');
        for(const productHandle of productHandles){
          let output = {title: null, link: null, rating: null, duration: null, fullLink : null, description: null, provider: null};
          try{
            const title = await page.evaluate(
              (el)=>el.querySelector(" div > div.css-ilhc4l > div.css-1rj417c > h2").textContent,
            productHandle);
            output.title = title;
            }catch(error){}
            try{
            const link = await page.evaluate(
              (el)=>el.querySelector(".css-1pa69gt > div > a").getAttribute("href"),
              productHandle
            );
            output.link = link;
            }catch(error){}
            try{
            const rating = await page.evaluate(
              (el)=>el.querySelector("div > p.cds-33.css-zl0kzj.cds-35").textContent,
              productHandle
            );

            
            output.rating = rating;
            }catch(error){
            }

            try{
              const duration = await page.evaluate(
                (el) => el.querySelector("div > div.css-ilhc4l > div:nth-child(2) > p").textContent,
                productHandle
              );
              output.duration = duration;
            }catch(error){}

            try{
              const provider = await page.evaluate(
                (el)=> el.querySelector("div.cds-71.css-1xdhyk6.cds-73.cds-grid-item > span").textContent,
                productHandle
              );
              output.provider = provider;
            }
            catch(error){}
            if(output.title){
            let fullLink = 'https://www.coursera.org' + output.link;
            try{
              if(output.link != null){
                const linkPage = await browser.newPage();
                
                console.log(fullLink);
                await linkPage.goto(fullLink,{
                  waitUntil: "load",
                });
                await linkPage.screenshot({path: 'linkpage.png'})
    
                const description = await linkPage.$('div > div.content > div > p:nth-child(1)');
                const text = await (await description.getProperty('textContent')).jsonValue();
                output.description = text;
                await linkPage.close();
              }


            }catch(error){
              console.log(error);
            }





              items.push(output);
              allItems.push(output);

            }



        }
        // console.log(items);
        // console.log(items.length);
       //zs items = [];
        if(!isDisabled){
          try{
            await page.click("button[data-e2e='pagination-controls-next']");
            await page.waitForNavigation();

          }
          catch(error){}
        }
      }
       console.log(allItems);

      await this.getCsvData(allItems,filename);
      console.log("not here");
      readyStatus = 1;
      return filename;

      // console.log(allItems.length);
    })();

    return 'http://localhost:5000/public/csv/'+filename;
  }

  getCsvData(jsonData,filename){
    const fs = require('fs');
    let data = this.convertToCSV(jsonData);
    let fullFilePath = './public/csv/'+filename;
    fs.writeFile(fullFilePath, data, "utf-8", (err) => {
      if (err) console.log(err);
      else console.log("Data saved");
    });
    return filename;
  }

  convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr)
  
    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
  }
}

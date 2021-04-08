const _ = require('underscore');
const cheerio = require('cheerio');
const path = require('path');
const logging = require('../../common/logging');
const commonFun = require('../../common/commonfunction');
const urlDomain = 'https://www.tigerdirect.com'

const scrapurl = async (payload) => {
  let { URL, apiReference } = payload;

  try {
    logging.logD(apiReference, { EVENT: 'REQ PAYLOAD', payload });

    logging.log('valid url or not', commonFun.validURL(URL));

    if (!commonFun.validURL(URL)) {
      throw 'invalid url'
    }

    let finalReviews = [];
    while (URL) {

      logging.log('pehla while loop-', URL);

      try {

        let html = await fetch(URL);
        const $ = cheerio.load(html);

        $("#customerReviews").each((index, element) => {
          //logging.logD('element----' + index + '\n\n', $(element).html() + '\n\n');
          if (index !== 0) {
            let check = $(element).html();
            const $review = cheerio.load(check);
            let reviewObj = {
              rating: $review('body > div > div.leftCol > dl.itemReview > dd:nth-child(2) > div > strong').text(),
              comment: $review('body > div > div.rightCol > blockquote > p').text(),
              reviewer: $review('body > div > div.leftCol > dl.reviewer > dd:nth-child(2)').text(),
              date: $review('body > div > div.leftCol > dl.reviewer > dd:nth-child(4)').text()
            }
            finalReviews.push(reviewObj);
          }
        })

        logging.logD(apiReference, { EVENT: 'finalReviewsInAloop', finalReviews });

        let next = $('#customerReviews > div:nth-child(1) > dl > dd > a').text();

        logging.log('check if next exists---', next, next ? true : false, next.includes('Next'));

        if (next && next.includes('Next')) {
          URL = `${urlDomain}${$('#customerReviews > div:nth-child(1) > dl > dd > a').attr('href').trim()}`
        } else break;

      }
      catch (e) {
        logging.logD(apiReference, { EVENT: 'ERROR=====', e });
        throw 'error in catch'
      }
    }

    logging.logD(apiReference, { EVENT: 'FINAL RESULT', finalReviews });
    return finalReviews
  }
  catch (e) {
    console.log('error caught----><<<><<<');
  }
}

const fetch = (url) => {
  return new Promise((resolve, reject) => {
    const { Worker, isMainThread } = require('worker_threads');

    if (isMainThread) {
      logging.log('main thread---');

      let worker = new Worker(path.join(__dirname, './worker.js'), { workerData: { url } })

      worker.on('message', (result) => {
        logging.log('back to main thread--->', result);
        resolve(result)
      })

      worker.on('exit', (code) => {
        if (code !== 0)
          reject()
        else
          logging.log('Worker stopped ' + code);
      });
    }
  })
};
exports.scrapurl = scrapurl
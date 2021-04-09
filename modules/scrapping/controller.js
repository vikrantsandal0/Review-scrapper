const _ = require('underscore');
const cheerio = require('cheerio');
const path = require('path');
const logging = require('../../common/logging');
const commonFun = require('../../common/commonfunction');
const urlDomain = 'https://www.tigerdirect.com'


const fetch = (url) => {
  return new Promise((resolve, reject) => {
    const { Worker, isMainThread } = require('worker_threads');

    if (isMainThread) {
      // This code is executed in the main thread.

      logging.log('Entering main thread');

      // Create the worker.
      let worker = new Worker(path.join(__dirname, './worker.js'), { workerData: { url } })

      worker.on('message', (result) => {
        // Listen for messages from the worker and print them.
        logging.log('Back to main thread', result);
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

const scrapurl = async (payload) => {
  let { URL, apiReference } = payload;

  try {
    logging.logD(apiReference, { EVENT: 'REQ PAYLOAD', payload });

    logging.log('valid url or not', commonFun.validURL(URL));

    if (!commonFun.validURL(URL)) {
      throw 'invalid url'
    }

    let finalReviews = [];
    //loops over all URL and fetches all reviews , untill it reach << previous button
    while (URL) {
      try {
        let html = await fetch(URL);
        const $ = cheerio.load(html);

        $("#customerReviews").each((index, element) => {
          if (index !== 0) {

            let reviewObj = {
              rating: $(element).find('div.review > div.leftCol > dl.itemReview > dd:nth-child(2) > div > strong').text(),
              comment: $(element).find('div.review > div.rightCol > blockquote > p').text(),
              reviewer: $(element).find('div.review > div.leftCol > dl.reviewer > dd:nth-child(2)').text(),
              date: $(element).find('div.review > div.leftCol > dl.reviewer > dd:nth-child(4)').text()
            }

            finalReviews.push(reviewObj);
          }
        })

        logging.logD(apiReference, { EVENT: 'finalReviewsInAloop', finalReviews });

        let next = $('#customerReviews > div:nth-child(1) > dl > dd > a').text();
        //check if there are more reviews on the next page/next>> button 
        logging.log('check if next exists', next, next ? true : false, next.includes('Next'));

        if (next && next.includes('Next')) {
          URL = `${urlDomain}${$('#customerReviews > div:nth-child(1) > dl > dd > a').attr('href').trim()}`
        } else {
          break;
        }

      }
      catch (e) {
        logging.logD(apiReference, { EVENT: 'ERROR=====', e });
        throw new Error(e.message || 'some error occurred');
      }
    }

    logging.logD(apiReference, { EVENT: 'FINAL RESULT', finalReviews });
    return finalReviews
  }
  catch (e) {
    logging.log('error caught====', e.message);
    throw e
  }
}

exports.scrapurl = scrapurl
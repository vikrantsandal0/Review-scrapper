# scrapping-Tigerdirect-reviews
* A simple crawler written in node.js, phantomJs,cheerio to scrap Tigerdirect web pages.
### Tech-stack used
* express.js - a back end web application framework for Node.js.
* worker_threads - Workers (threads), useful for performing CPU-intensive JavaScript operations.
* phantom - fast NodeJS API for PhantomJS.
* cheerio -  jQuery for Node.js which makes it easy to select, edit, and view DOM elements.
* joi - powerful schema description language and data validator for JavaScript.



### The whole functionality of web scraping can be broken down into two main steps:

* Fetching the HTML source code of the URL using phantom npm by running it on worker threads to acheive better parallelism as its CPU-intensive work. The parent event loop is always free
* Parsing the raw data using cheerio to extract just the information we are interested in and send the response back.


### API RESPONSE EXAMPLES
   * **API results after we post an URL through /scrapurl API**
```{
  "message": "Successful",
  "status": 200,
  "data": [
    {
      "reviewer": "vikrant",
      "date": "Apr 04, 2021",
      "comment": "Amazing product , been using it for a while now.",
      "rating": "4.5"
    },
    {
      "reviewer": "sandy",
      "date": "Apr 10, 2021",
      "comment": "boo! i hate the quality",
      "rating": "2"
    }
  ]
}
```
### REVIEWS EXTRACTION LOGIC
**It extracts all reviews on a product. The code traverses all review pages of a product using  Next»**
**buttons href's untill it reaches the «Previous button and gives the list of all reviews posted**.
**If a page has total 10 reviews with 5 on current page and 5 on the next, the crawler fetches all 10**
**reviews. try different links with different number of reviews.**



 ### FOLDER STRUCTURE 
 * the complete structure has been built using Node.js, other libs like phantom , cheerio , joi etc.
 * *modules/scrapping/index.js* contains the parent API for scrapping urls.
 * *common/commonfunction.js* contains API request body and URL validation.

### HOW TO INITIATE 
```
npm install
```
```
nodemon server.js
```

### POSTMAN COLLECTION
[link](https://www.getpostman.com/collections/8357fd3783402886e55c)




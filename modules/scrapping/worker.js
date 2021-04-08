const phantom = require('phantom');
const { parentPort, workerData } = require('worker_threads');

//cpu intesive task being executed in parallel

const crawlUrl = async (URL) => {
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on('onResourceRequested', function (requestData) {
    console.info('Requesting', requestData.url);
  });

  const status = await page.open(URL);
  const content = await page.property('content');
  //parentPort.postMessage(content)
  //console.log('here is the content----', content);
  await instance.exit();
  return content

}


(async () => {
  console.log('inside worker thread--->', workerData.url)
  parentPort.postMessage(await crawlUrl(workerData.url))
})()





// (async () => {
//     console.log('inside worker thread--->',workerData.value)
//     parentPort.postMessage(await sortArray(workerData.value))
// })()




// const system = require("system");
// const env = system.env;
// const page = require("webpage").create();

// page.settings.userAgent =
//   "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36";

// console.log('inside phantom script----');
// // default viewport size is small, change it to 1366x768
// page.viewportSize = {
//   width: 1366,
//   height: 768
// };

// // open page
// page.open(env.URL, function(status) {
//   if (status == "success") {
//     // wait until all the assets are loaded
//     function checkReadyState() {
//       var readyState = page.evaluate(function() {
//         return document.readyState;
//       });

//       if (readyState == "complete") {
//         var result = page.evaluate(function() {
//            return document.documentElement.outerHTML;
//         //return document.querySelector("#customerReviews")
//         });

//         // exit and return HTML
//         system.stdout.write(result);
//         phantom.exit(0);
//       } else {
//         setTimeout(checkReadyState, 50);
//       }
//     }

//     checkReadyState();
//   } else {
//     // if status is not 'success' exit with an error
//     system.stderr.write(error);
//     phantom.exit(1);
//   }
// });
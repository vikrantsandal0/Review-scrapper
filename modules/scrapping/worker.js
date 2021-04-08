const phantom = require('phantom');
const { parentPort, workerData } = require('worker_threads');

//cpu intesive task being executed in parallel using worker threads
// This code is executed in the worker 
const crawlUrl = async (URL) => {
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on('onResourceRequested', function (requestData) {
    console.info('Requesting', requestData.url);
  });

  const status = await page.open(URL);
  const content = await page.property('content');
  await instance.exit();
  return content

}


(async () => {
  console.log('inside worker thread', workerData.url)
  //sending message to parent thread
  parentPort.postMessage(await crawlUrl(workerData.url))
})()
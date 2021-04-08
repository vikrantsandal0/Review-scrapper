const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const http = require('http')
const logging = require('./common/logging');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
global.app = app;

require('./modules/scrapping');

let port = 3000;
const startServer = http.createServer(app).listen(port, () => {
    logging.log('into startServer')
});


process.on("uncaughtException", function (err) {
    logging.log("uncaughtException", err);
    startServer.close();
    setTimeout(function () {
        process.exit(0);
    }, 15000);
})
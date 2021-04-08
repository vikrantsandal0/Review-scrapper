/**
 * Created by vikrant sandal on 09/04/2021.
 */
'use strict';
const validator = require('./validator');
const routeHandler = require('./routehandler');

app.post('/scrapurl', validator.scrapurl, routeHandler.scrapurl);
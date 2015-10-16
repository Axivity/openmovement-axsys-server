/**
 * Created by Praveen on 07/09/2015.
 */

/*
* To run this from console execute following command,
*   `UV_THREADPOOL_SIZE=100 node server.js`
* this helps work around the issue with node
* */
require("babel/register")({
    retainLines: true
});

var app = require('./app.js');

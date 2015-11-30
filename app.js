/**
 * Created by Praveen on 09/09/2015.
 *
 * @flow
 */

/* System imports */
import path from 'path';

/* Third party imports */
import log4js from 'log4js';
log4js.replaceConsole();
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('axsys-server.log'));


import http from 'http';
import { Server as WebSocketServer } from 'ws';
import express from 'express';
import {createStore} from 'redux';

/* Internal imports */
import * as register_module from './lib/register-client';
import * as discoveryService from './lib/services/devicediscovery-service';
import { EventBus } from './lib/services/bus';
import * as constants from './lib/constants/event-name-constants';
import * as websocketFacade from './lib/api/websocket-api';
import {AxsysError, Payload} from './lib/api/payload';
import * as stringUtils from './lib/utils/string-utils';
import cacheReducer from './lib/reducers/cache-reducer';
import * as actionCreators from './lib/action-creators/cache-action-creator';
import timeSyncServer from 'timesync/server';

const store = createStore(cacheReducer);

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};


/* main */
function main() {
    var server = http.createServer();
    var wss = new WebSocketServer( {'server': server} );
    var app = express();

    console.log(timeSyncServer);
    app.use(allowCrossDomain);
    app.use('/timesync', timeSyncServer.requestHandler);

    register_module.register(app);

    let eventBus = new EventBus();

    let deviceDiscoverer = new discoveryService.DeviceDiscovery({
        eventBus: eventBus,
        vidPids: [
            0x04D80057
        ]
    });

    deviceDiscoverer.start();
    subscribeCacheEvents(eventBus);

    websocketFacade.websocketSetup(wss, store);

    // setup static route for client.min.js
    setUpRouteForClientLibrary(app);

    server.on('request', app);
    server.listen(9693);
}


function subscribeCacheEvents(eventBus) {
    eventBus.subscribe(constants.AX_DEVICE_ADDED, function(device) {
        let path = stringUtils.removeWindowsPrefixToSerialPath(device.port);
        let devicePath = stringUtils.constructSerialPath(path);
        store.dispatch(actionCreators.createDeviceWithAttributes({
            devicePath: devicePath,
            deviceAttributes: device
        }));
        console.log(store.getState());
    });

    eventBus.subscribe(constants.AX_DEVICE_REMOVED, function(device) {
        let path = stringUtils.removeWindowsPrefixToSerialPath(device.port);
        let devicePath = stringUtils.constructSerialPath(path);
        store.dispatch(actionCreators.removeDeviceWithAttributes({
            devicePath: devicePath
        }));
        console.log(store.getState());
    });
}


function secureOriginsToServe(app) {
    // setup origins - TODO: this list should be externalized
    app.io.set('origins', 'http://localhost:9692');
}

function setUpRouteForClientLibrary(app) {
    // setup route for serving client
    app.get('/client.min.js', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist-client/client.min.js'));
    });
}

/* Init app */
main();


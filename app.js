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
import * as dbService from './lib/services/pouchdb-service';
import * as discoveryService from './lib/services/devicediscovery-service';
import { EventBus } from './lib/services/bus';
import * as constants from './lib/constants/event-name-constants';
import * as websocketFacade from './lib/api/websocket-api';
import * as socketBroadcastService from './lib/services/socket-broadcast-service';
import {AxsysError, Payload} from './lib/api/payload';
import * as stringUtils from './lib/utils/string-utils';
import cacheReducer from './lib/reducers/cache-reducer';
import * as actionCreators from './lib/action-creators/cache-action-creator';
import timeSyncServer from 'timesync/server';

/* Global constants */
const DEVICES_DATABASE_NAME = 'axsys-devices';


let DEVICES_DB;
let eventBus = new EventBus();

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
    //let app = eio();
    //app.http().io();

    var server = http.createServer();
    var wss = new WebSocketServer( {'server': server} );
    var app = express();

    console.log(timeSyncServer);
    app.use(allowCrossDomain);
    app.use('/timesync', timeSyncServer.requestHandler);

    register_module.register(app);

    // TODO: Experimental at the minute - cleanup all unnecessary services
    subscribeCacheEvents();

    // setup db service and device discovery
    createDBAndStartDeviceDiscovery().then((db) => {
        // setup routes for client
        websocketFacade.websocketSetup(wss, dbService, db, store);

        // subscribe to events
        subscribeDBEvents(db);
    });

    subscribeSocketEvents(wss);

    // setup static route for client.min.js
    setUpRouteForClientLibrary(app);

    server.on('request', app);
    server.listen(9693);
}

function subscribeDBEvents(db) {
    eventBus.subscribe(constants.AX_DEVICE_ADDED, dbService.onDeviceAdded(db));
    eventBus.subscribe(constants.AX_DEVICE_REMOVED, dbService.onDeviceRemoved(db));
}


function subscribeCacheEvents() {
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


// TODO: May be this function should live behind API interface?
function subscribeSocketEvents(sock) {
    eventBus.subscribe(constants.AX_DEVICE_ADDED, function (device) {
        sock.clients.forEach(function (client) {
            console.log(device);
            let payload = new Payload(null, device, null);
            client.send(JSON.stringify({
                'event': constants.AX_DEVICE_ADDED,
                'data': payload
            }));
        });
    });

    eventBus.subscribe(constants.AX_DEVICE_REMOVED, function (device) {
        sock.clients.forEach(function (client) {
            let payload = new Payload(null, device, null);
            client.send(JSON.stringify({
                'event': constants.AX_DEVICE_REMOVED,
                'data': payload
            }));
        });
    });
}

function createDBAndStartDeviceDiscovery() {
    // create db and start device discovery
    return dbService.createDatabase(DEVICES_DATABASE_NAME).then((db) => {
        let deviceDiscoverer = new discoveryService.DeviceDiscovery({
            eventBus: eventBus,
            vidPids: [
                0x04D80057
            ]
        });

        deviceDiscoverer.start();
        return db;

    }).catch((err) => {
        console.error(err);
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


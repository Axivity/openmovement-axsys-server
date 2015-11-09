/**
 * Created by Praveen on 09/09/2015.
 *
 * @flow
 */

/* System imports */
import path from 'path';

/* Third party imports */
//import eio from 'express.io';
//import eio from 'express.oi';
import http from 'http';
import { Server as WebSocketServer } from 'ws';
import express from 'express';
import {createStore} from 'redux';

/* Internal imports */
import * as register_module from './lib/register-client';
import * as dbService from './lib/services/pouchdb-service';
import * as discoveryService from './lib/services/devicediscovery-service';
import { EventBus } from './lib/services/bus';
import * as constants from './lib/services/event-name-constants';
import * as websocketFacade from './lib/api/websocket-api';
import * as socketBroadcastService from './lib/services/socket-broadcast-service';
import {AxsysError, Payload} from './lib/api/payload';
import * as stringUtils from './lib/utils/string-utils';
import cacheReducer from './lib/reducers/cache-reducer';
import * as actionCreators from './lib/action-creators/cache-action-creator';

/* Global constants */
const DEVICES_DATABASE_NAME = 'axsys-devices';


let DEVICES_DB;
let eventBus = new EventBus();

const store = createStore(cacheReducer);

/* main */
function main() {
    //let app = eio();
    //app.http().io();

    var server = http.createServer();
    var wss = new WebSocketServer( {'server': server} );
    var app = express();

    register_module.register(app);

    // setup db service and device discovery
    createDBAndStartDeviceDiscovery().then((db) => {
        // setup routes for client
        websocketFacade.websocketSetup(wss, dbService, db);

        // subscribe to events
        subscribeDBEvents(db);
    });

    subscribeSocketEvents(wss);

    // TODO: Experimental at the minute - cleanup all unnecessary services
    subscribeCacheEvents();

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


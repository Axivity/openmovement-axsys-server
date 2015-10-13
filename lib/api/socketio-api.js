/**
 * Created by Praveen on 09/09/2015.
 */

import { APIInterface } from './api';
import * as constants from '../services/event-name-constants';
import { hasError } from './payload';
import * as stringUtils from '../utils/string-utils';

export class WebsocketAPI {
    constructor(dbService, db, app) {
        console.log(this.onData);
        this.api = new APIInterface(dbService,
            db,
            this.onData.bind(this));
        this.app = app;
        this.connectedClients = {};
    }

    getDevices(req, res) {
        console.log('Getting devices');
        return this.api.getDevices().then((payload) => {
            //req.io.respond(payload);
            res.json(payload);
        });
    }

    connect (req, res) {
        console.log('connecting to a device');
        let options = req.data;
        options.lockedById = req.socket.id;
        this.api.connect(options, (payload) => {
            if(!hasError(payload)) {
                let path = stringUtils.parseSerialPath(options.path);
                this.connectedClients[path] = req.socket;
                //req.io.respond(payload);
                res.json(payload);
            } else {
                console.log("There is an error");
                console.log(payload);
            }
        });
    }

    write (req, res) {
        let options = req.data;
        options.key = req.socket.id;
        console.log(req.socket.id);
        this.api.write(options, (payload) => {
            //req.io.respond(payload);
            res.json(payload);
        });
    }

    disconnect (req, res) {
        let options = req.data;
        options.key = req.socket.id;

        this.api.disconnect(options, (payload) => {
            res.json(payload);

        });
    }

    onData(response) {
        let path = response.path;
        let socket = this.connectedClients[path];
        socket.emit(constants.AX_CLIENT_DATA, response);
    }
}

export function websocketSetup(app, dbService, db) {
    let webSocketAPI = new WebsocketAPI(dbService, db, app);
    console.log('Setting up websocket');

    app.io.route('ax-devices', {
        getAll: (req, res) => {
            console.log('getAll called');
            return webSocketAPI.getDevices(req, res);
        }
    });

    app.io.route(constants.AX_DEVICE_CONNECT, (req, res) => {
        console.log('Connect called');
        return webSocketAPI.connect(req, res);
    });

    app.io.route(constants.AX_DEVICE_WRITE, (req, res) => {
        console.log('Write called');
        return webSocketAPI.write(req, res);
    });

    app.io.route(constants.AX_DEVICE_DISCONNECT, (req, res) => {
        console.log('Disconnect called');
        return webSocketAPI.disconnect(req, res);
    });
}
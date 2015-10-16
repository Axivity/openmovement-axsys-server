/**
 * Created by Praveen on 13/10/2015.
 */

import { APIInterface } from './api';
import * as constants from '../services/event-name-constants';
import { hasError } from './payload';
import * as stringUtils from '../utils/string-utils';

export class WebsocketAPI {
    constructor(dbService, db) {
        console.log(this.onData);
        this.api = new APIInterface(dbService,
            db,
            this.onData.bind(this));
        this.connectedClients = {};
    }

    getDevices() {
        console.log('Getting devices');
        return this.api.getDevices();
    }

    connect (ws, data) {
        console.log('connecting to a device');
        let options = data;
        this.api.connect(options, (payload) => {
            if(!hasError(payload)) {
                let path = stringUtils.parseSerialPath(options.path);
                this.connectedClients[path] = ws;
                ws.send(JSON.stringify({
                    'event': constants.AX_DEVICE_CONNECT,
                    'data': payload
                }));

            } else {
                console.log("There is an error");
                console.log(payload);
                ws.send(JSON.stringify({
                    'event': constants.AX_DEVICE_CONNECT,
                    'data': payload
                }));
            }
        });
    }

    write (ws, options) {
        this.api.write(options, (payload) => {
            ws.send(JSON.stringify({
                'event': constants.AX_DEVICE_WRITE,
                'data': payload
            }));
        });
    }

    disconnect (ws, options) {
        this.api.disconnect(options, (payload) => {
            ws.send(JSON.stringify({
                'event': constants.AX_DEVICE_DISCONNECT,
                'data': payload
            }));
        });
    }

    onData(response) {
        console.log(response);
        let path = stringUtils.parseSerialPath(response.path);
        console.log(path);
        let ws = this.connectedClients[path];
        ws.send(JSON.stringify( {
            'event':constants.AX_CLIENT_DATA,
            'data': response
        }));
    }
}

export function websocketSetup(wss, dbService, db) {

    console.log('Setting up websocket');
    var webSocketAPI = new WebsocketAPI(dbService, db);

    wss.on('connection', (ws) => {
        console.log('Connected');

        ws.on('message', (message) => {
            console.log(message);
            var msg = JSON.parse(message);
            //console.log(msg);
            console.log(msg.event);
            console.log(msg.data);

            var opts = {};

            opts[constants.AX_CLIENT_DEVICES_GET_ALL] = function () {
                webSocketAPI.getDevices().then(function (payload) {
                    ws.send(JSON.stringify({
                        'event': constants.AX_CLIENT_DEVICES_GET_ALL,
                        'data': payload
                    }));
                });
            };

            opts[constants.AX_DEVICE_CONNECT] = function () {
                webSocketAPI.connect(ws, msg.data);
            };

            opts[constants.AX_DEVICE_WRITE] = function() {
                webSocketAPI.write(ws, msg.data);
            };

            opts[constants.AX_DEVICE_DISCONNECT] = function() {
                webSocketAPI.disconnect(ws, msg.data);
            };

            var func = opts[msg.event];

            if (func) {
                func();

            } else {
                console.error('Event not registered to a function');
            }

        });

        ws.on('close', function () {
            console.log('Web socket is closed');
        });
    });

}
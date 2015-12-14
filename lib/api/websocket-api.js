/**
 * Created by Praveen on 13/10/2015.
 *
 * @flow
 */

import { APIInterface } from './api';
import * as constants from '../constants/event-name-constants';
import { hasError } from './payload';
import * as stringUtils from '../utils/string-utils';

export class WebsocketAPI {
    constructor(store, dataPublisher) {
        this.api = new APIInterface(
            store,
            this.onData.bind(this),
            this.onDataPublished.bind(this)
        );
        this.connectedClients = {};
        this.dataPublisher = dataPublisher;
    }

    onDataPublished(payload) {
        console.log('Data published from web socket');
        this.dataPublisher(JSON.stringify( {
            'event': constants.AX_ATTRIBUTE_CACHE_PUBLISH,
            'data': payload
        }));
    }

    getDevices(ws) {
        let devicesWithAttributes = this.api.getDevices();
        let response = JSON.stringify({
            'event': constants.AX_CLIENT_DEVICES_GET_ALL,
            'data': devicesWithAttributes
        });
        console.log(response);
        ws.send(response);
    }

    connect (ws, data) {
        let options = data;
        this.api.connect(options, (payload) => {
            let path = stringUtils.parseSerialPath(options.path);
            this.connectedClients[path] = ws;

            if(!hasError(payload)) {
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
            console.log("Writing back");
            console.log(payload);
            ws.send(JSON.stringify({
                'event': constants.AX_DEVICE_WRITE,
                'data': payload
            }));
        });
    }

    disconnect (ws, options) {
        this.api.disconnect(options, (payload) => {
            let path = stringUtils.parseSerialPath(options.path);
            delete this.connectedClients[path];
            ws.send(JSON.stringify({
                'event': constants.AX_DEVICE_DISCONNECT,
                'data': payload
            }));
        });
    }

    onData(response) {
        console.log(response);
        let path = stringUtils.parseSerialPath(response.path);
        let ws = this.connectedClients[path];

        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify( {
                'event': constants.AX_CLIENT_DATA,
                'data': response
            }));

        } else {
            console.warn('Web socket status not open -> ' + ws.readyState);
        }
    }

    /**
     *  See AttributesAPI
     */
    publish(ws, options) {
        let {devicePath, attributeKey, attributeVal} = options;
        let payload = this.api.publish(devicePath, attributeKey, attributeVal);
        ws.send(JSON.stringify({
            'event': constants.AX_DEVICE_ATTRIBUTE_PUBLISH,
            'data': payload
        }));
    }

    _disconnectOnClose(options) {
        this.api.disconnect(options, (payload) => {
            if(hasError(payload)) {
                console.error('Error on closing the connection ' + options.path);

            } else {
                console.info('Closed path ' + options.path);
            }
        });
    }

    _getDevicePathsConnectedToWebSocketClient(ws): Array<String> {
        let paths: Array<String> = [];
        for(let key in this.connectedClients) {
            if(this.connectedClients.hasOwnProperty(key)) {
                if(ws.id === this.connectedClients[key].id) {
                    paths.push(key);
                }
            }
        }
        return paths;
    }

    _cleanUpOnWebSocketConnectionClosed(ws) {
        let paths: Array<String> = this._getDevicePathsConnectedToWebSocketClient(ws);

        for(let i=0; i<paths.length; i++) {
            let options = {
                'path': stringUtils.constructSerialPath(paths[i])
            };
            this._disconnectOnClose(options);
        }
    }
}

export function websocketSetup(wss, store) {

    console.log('Setting up Websocket API');
    let connectedUsers = {};

    function publishDataToConnectedSockets(publishedData) {
        console.log('Sending data');
        wss.clients.map((sock) => {
            sock.send(publishedData);
        });
    }

    let webSocketAPI = new WebsocketAPI(store, publishDataToConnectedSockets);

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
                webSocketAPI.getDevices(ws);
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

            opts[constants.AX_DEVICE_ATTRIBUTE_PUBLISH] = function() {
                webSocketAPI.publish(ws, msg.data);
            };

            opts[constants.AX_CLIENT_REGISTER] = function() {
                // NB: Important, this is the only way to map an anonymous client to web socket!
                ws.id = msg.data.token;
                ws.send(JSON.stringify({
                    event: constants.AX_CLIENT_REGISTER,
                    data: {
                        data: {
                            status: 'SUCCESS'
                        }
                    }
                }));
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
            webSocketAPI._cleanUpOnWebSocketConnectionClosed(ws);
        });
    });

}
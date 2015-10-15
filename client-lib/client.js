/**
 * Created by Praveen on 08/09/2015.
 */

import DeviceAPI from './device-api';
import ConnectionAPI from './connection-api';
import WebSocketConnection from './websocket-connection';
import * as constants from '../lib/services/event-name-constants';

var AX = window.AX || {};

class API {
    constructor(onDeviceAdded,
                onDeviceRemoved,
                onConnected,
                onDisconnected,
                onDataReceived,
                clientKey) {
        this.onDeviceAdded = onDeviceAdded;
        this.onDeviceRemoved = onDeviceRemoved;
        this.onConnected = onConnected;
        this.onDisconnected = onDisconnected;
        this.onDataReceived = onDataReceived;
        this.conn = new WebSocketConnection(clientKey);
        this.connectedDevices = {};
        this.__init();
    }

    __init() {
        new ConnectionAPI(
            this.onDeviceAdded,
            this.onDeviceRemoved,
            this.onConnected,
            this.onDisconnected,
            this.conn
        ).init();

    }

    connect(options, callbackpath) {
        let conn = new DeviceAPI(this.onDataReceived, this.conn);
        this.connectedDevices[path] = conn;
        conn.connect(options, callback);
    }

    write(options, callback) {

    }






}

// export API
AX.API = API;

// attach it to global window
window.AX = AX;


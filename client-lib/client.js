/**
 * Created by Praveen on 08/09/2015.
 */

import * as io from 'socket.io-client';

import { hasError, getData, getError } from '../lib/api/payload';
import * as constants from '../lib/services/event-name-constants';
import * as binUtils from '../lib/utils/binary';

var AX = window.AX || {};

function API(onDeviceAdded,
             onDeviceRemoved,
             onConnected,
             onDisconnected,
             onDataReceived,
             clientKey) {

    clientKey = clientKey || "Booo";

    var sock = io.connect("http://localhost:9693");

    /*
    * */
    this.getDevices = (callback) => {
        sock.emit(constants.AX_CLIENT_DEVICES_GET_ALL, (payload) => {
            if(!hasError(payload)) {
                let devices = getData(payload);
                callback(devices);
            }
        });
    };

    this.connect = (options, callback) => {
        sock.emit(constants.AX_DEVICE_CONNECT, options, (payload) => {
            if(!hasError(payload)) {
                let data = getData(payload);
                callback(null, data);

            } else {
                let error = getError(payload);
                callback(error, null);
            }
        });
    };

    this.write = (options, callback) => {
        sock.emit(constants.AX_DEVICE_WRITE, options, (payload) => {
           if(!hasError(payload)) {
               let data = getData(payload);
               callback(null, data);
           } else {
               let error = getError(payload);
               callback(error, null);
           }
        });
    };

    this.disconnect = (options, callback) => {
        sock.emit(constants.AX_DEVICE_DISCONNECT, options, (payload) => {
            if(!hasError(payload)) {
                let data = getData(payload);
                callback(null, data);
            } else {
                let error = getError(payload);
                callback(error, null);
            }
        });

    };

    this.init = () => {
        // TODO: Find a sensible place to put key (may be a config file?)
        sock.emit(constants.AX_CLIENT_REGISTER, { "key": clientKey } );

        sock.on(constants.AX_DEVICE_ADDED, (payload) => {
            console.log(payload);
            if(!hasError(payload)) {
                let data = getData(payload);
                onDeviceAdded(data);
            }
        });

        sock.on(constants.AX_DEVICE_REMOVED, (payload) => {
            console.log(payload);
            if(!hasError(payload)) {
                let data = getData(payload);
                onDeviceRemoved(data);
            }
        });

        sock.on(constants.AX_CLIENT_OR_SERVER_DISCONNECT, () => {
            console.log('Disconnected');
            onDisconnected();
        });

        sock.on(constants.AX_CLIENT_OR_SERVER_CONNECT, () => {
            console.log('Connection established');
            onConnected();
        });

        sock.on(constants.AX_ON_DATA, (payload) => {
            console.log('I have data');
            console.log(payload);
        });

        console.log('Setting up data listener');
        sock.on(constants.AX_CLIENT_DATA, (payload) => {
            console.log('Got some data');
            console.log(payload.buffer);
            //console.log(payload.toString());
            let dataReceived = binUtils.bufferToString(payload.buffer);
            payload['dataString'] = dataReceived;
            console.log(dataReceived);
            onDataReceived(payload);
        });
    };

    this.init();

}

// export API
AX.API = API;

// attach it to global window
window.AX = AX;



/**
 * Created by Praveen on 08/09/2015.
 */

import * as io from 'socket.io-client';
import * as constants from '../lib/services/event-name-constants';

var AX = window.AX || {};

function API(onDeviceAdded,
             onDeviceRemoved,
             onConnected,
             onDisconnected,
             clientKey) {

    clientKey = clientKey || "Booo";

    var sock = io.connect("http://localhost:9693");

    /*
    * */
    this.getDevices = (callback) => {
        sock.emit(constants.AX_CLIENT_DEVICES_GET_ALL, (devices) => {
            callback(devices);
        });
    };

    this.init = () => {
        // TODO: Find a sensible place to put key (may be a config file?)
        sock.emit(constants.AX_CLIENT_REGISTER, { "key": clientKey } );

        sock.on(constants.AX_DEVICE_ADDED, (payload) => {
            console.log(payload);
            onDeviceAdded(payload);

        });

        sock.on(constants.AX_DEVICE_REMOVED, (payload) => {
            console.log(payload);
            onDeviceRemoved(payload);

        });

        sock.on(constants.AX_CLIENT_OR_SERVER_DISCONNECT, () => {
            console.log('Disconnected');
            onDisconnected();
        });

        sock.on(constants.AX_CLIENT_OR_SERVER_CONNECT, () => {
            console.log('Connection established');
            onConnected();
        });
    };

    this.init();

}

// export API
AX.API = API;

// attach it to global window
window.AX = AX;



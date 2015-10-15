/**
 * Created by Praveen on 08/09/2015.
 */

import DeviceAPI from './device-api';
import ConnectionAPI from './connection-api';
import WebSocketConnection from './websocket-connection';
import * as constants from '../lib/services/event-name-constants';

var AX = window.AX || {};

function WebSocketConnection(onConnected, clientKey) {

    var ws = new WebSocket('ws://localhost:9693/');
    ws.binaryType = "arraybuffer";

    var self = this;

    self.clientKey = clientKey || "default-key";

    self.callbacks = {};

    ws.onopen = function() {
        onConnected();
    };

    ws.onmessage = function(event) {
        let msg = JSON.parse(event.data);
        console.log(msg);

        if(msg) {
            let eventName = msg.event;
            console.log(eventName);

            let fns = self.callbacks[eventName];

            if(fns) {
                let payload = msg.data;
                console.log(payload);

                fns.forEach((fn) => {
                    if(!hasError(payload)) {
                        fn(getData(payload));

                    }
                    // TODO: How should the error be propagated??
                    //else {
                    //    fn(new Error(), null);
                    //}

                } );

            } else {
                console.warn('No callbacks registered for event ' + eventName );
            }

        }

    };


 }

function API(onDeviceAdded,
             onDeviceRemoved,
             onConnected,
             onDisconnected,
             onDataReceived,
             clientKey) {

    var conn = new WebSocketConnection(onConnected, clientKey);
    console.log(conn);

    /*
    *
    * */
    this.getDevices = (callback) => {
        conn.send(constants.AX_CLIENT_DEVICES_GET_ALL, {}, callback);
    };


    /*
     * */
    this.connect = (options, callback) => {
        conn.send(constants.AX_DEVICE_CONNECT, options, callback);

    };

    /*
     * */
    this.write = (options, callback) => {
        conn.send(constants.AX_DEVICE_WRITE, options, callback);
    };

    /*
     * */
    this.disconnect = (options, callback) => {
        conn.send(constants.AX_DEVICE_DISCONNECT, options, callback);
    };

    /*
     *  Internal Only - called to register any global event handlers
     **/
    this.init = () => {
        // Add a data listener
        conn.addCallbackForEvent(constants.AX_CLIENT_DATA, (payload) => {
            // TODO: We could manipulate array buffer here??
            onDataReceived(payload);
        });
    };

    this.init();

}

// export API
AX.API = API;

// attach it to global window
window.AX = AX;


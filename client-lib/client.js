/**
 * Created by Praveen on 08/09/2015.
 */

import * as io from 'socket.io-client';

import { hasError, getData, getError } from '../lib/api/payload';
import * as constants from '../lib/services/event-name-constants';
import * as binUtils from '../lib/utils/binary';

var AX = window.AX || {};


function WebSocketConnection(onConnected, clientKey) {

    var ws = new WebSocket('ws://localhost:9693/');
    ws.binaryType = "arraybuffer";

    var self = this;

    self.clientKey = clientKey || "default-key";

    self.callbacks = {};

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

    ws.onopen = function () {
        onConnected();
    };


    function addCallbackForEvent(event, callback) {
        console.log(event);
        console.log(callback);

        console.log(self.callbacks);
        if(self.callbacks[event] === undefined) {
            self.callbacks[event] = [];
        }
        self.callbacks[event].push(callback);
    }

    function send(event, data, callback) {
        var msg = {
            'event': event,
            'data': data
        };

        // assumes event name for both sending and receiving data is same
        addCallbackForEvent(event, callback);
        ws.send(JSON.stringify(msg));
    }

    return {
        'addCallbackForEvent': addCallbackForEvent,
        'send': send
    }

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



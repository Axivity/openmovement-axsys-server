/**
 * Created by Praveen on 08/09/2015.
 */

import { hasError, getData, getError } from '../lib/api/payload';
import * as constants from '../lib/services/event-name-constants';
import * as binUtils from '../lib/utils/binary';

var AX = window.AX || {};

function WebSocketConnection(onDeviceAdded,
                             onDeviceRemoved,
                             onConnected,
                             onDisconnected,
                             onDataReceived,
                             clientKey) {

    var ws = new WebSocket('ws://localhost:9693/');
    ws.binaryType = "arraybuffer";

    var self = this;

    self.clientKey = clientKey || "default-key";

    self.callbacks = {};

    self.dataListener = onDataReceived;

    ws.onopen = function() {
        onConnected();
    };

    ws.onclose = function() {
        onDisconnected();
    };


    ws.onmessage = function(event) {
        var fn;
        let msg = JSON.parse(event.data);
        console.log(msg);

        if(msg) {
            let eventName = msg.event;
            console.log(eventName);
            console.log(self.callbacks);
            let devicePath = msg.data.path;
            console.log(devicePath);

            // For AX_CLIENT_DATA there's a global data listener. It's
            // up to the call site to decide what to do with it.
            if(devicePath && eventName !== constants.AX_CLIENT_DATA) {
                // Only device specific event callbacks are handled
                let devCallbackObj = self.callbacks[devicePath];

                if(devCallbackObj) {
                    fn = devCallbackObj[eventName];
                }

            } else {
                // Global callbacks are handled here, along with
                // AX_CLIENT_DATA though it has device path
                fn = self.callbacks[eventName];

            }

            if(fn) {
                let payload = msg.data;
                if(!hasError(payload)) {
                    // Amend data with path
                    let data = getData(payload);
                    data.path = devicePath;
                    fn(data);

                } else {
                    // Hmm error goes same way?
                    let data = getError(payload);
                    data.path = devicePath;
                    fn(data);
                }
            } else {
                console.warn('Cannot find callback for ' + eventName);
            }
        }

    };

    function init() {
        // Add a data listener
        addCallbackForEvent(constants.AX_CLIENT_DATA, (payload) => {
            // TODO: We could manipulate array buffer here??
            self.dataListener(payload);
        });

        addCallbackForEvent(constants.AX_DEVICE_ADDED, (payload) => {
            onDeviceAdded(payload);
        });

        addCallbackForEvent(constants.AX_DEVICE_REMOVED, (payload) => {
            onDeviceRemoved(payload);
        });
    }

    function addCallbackForEvent(event, callback, pathForDevice) {
        console.log(event);
        console.log(callback);

        console.log(self.callbacks);

        if(pathForDevice) {
            // per device callback setup
            if(self.callbacks[pathForDevice] === undefined) {
                self.callbacks[pathForDevice] = {};
            }
            self.callbacks[pathForDevice][event] = callback;

        } else {
            // global callback setup
            self.callbacks[event] = callback;
        }
    }

    function replaceDataListener(callback) {
        self.dataListener = callback;
    }

    function send(event, data, callback) {
        var msg = {
            'event': event,
            'data': data
        };
        let path = data.path;

        // assumes event name for both sending and receiving data is same
        addCallbackForEvent(event, callback, path);
        ws.send(JSON.stringify(msg));
    }

    init();

    // API for this object
    return {
        'addCallbackForEvent': addCallbackForEvent,
        'send': send,
        'replaceDataListener': replaceDataListener
    };

 }

function API(onDeviceAdded,
             onDeviceRemoved,
             onConnected,
             onDisconnected,
             // default data listener - you can replace it later too
             onDataReceived,
             clientKey) {

    var conn = new WebSocketConnection(onDeviceAdded,
                        onDeviceRemoved,
                        onConnected,
                        onDisconnected,
                        onDataReceived,
                        clientKey);

    /**
     *
     * @param callback
     */
    this.getDevices = (callback) => {
        conn.send(constants.AX_CLIENT_DEVICES_GET_ALL, {}, callback);
    };


    /**
     *
     * @param options
     * @param callback
     */
    this.connect = (options, callback) => {
        conn.send(constants.AX_DEVICE_CONNECT, options, callback);

    };

    /**
     *
     * @param options
     * @param callback
     */
    this.write = (options, callback) => {
        conn.send(constants.AX_DEVICE_WRITE, options, callback);
    };

    /**
     *
     * @param options
     * @param callback
     */
    this.disconnect = (options, callback) => {
        conn.send(constants.AX_DEVICE_DISCONNECT, options, callback);
    };

    /**
     *
     * @param callback
     */
    this.replaceDataListener = (callback) => {
        conn.replaceDataListener(callback);
    };

}

// export API
AX.API = API;

// attach it to global window
window.AX = AX;


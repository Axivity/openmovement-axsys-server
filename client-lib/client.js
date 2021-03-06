/**
 * Created by Praveen on 08/09/2015.
 */

import { hasError, getData, getError } from '../lib/api/payload';
import * as constants from '../lib/constants/event-name-constants';
import * as binUtils from '../lib/utils/binary';
// TODO: THIS ISN'T WORKING AT THE MOMENT - WORK AROUND IS TO DYNAMICALLY CREATE A SCRIPT TAG
// WHEN TIME PERMITS I'LL MOVE THIS CODE TO WEB SOCKET.
//import * as timeSync from 'timesync';


const SERVER_HTTP_PROTOCOL = "http://";
const SERVER_WS_PROTOCOL = "ws://";
const SERVER = "localhost:9693";

var AX = window.AX || {};

function WebSocketConnection(onDeviceAdded,
                             onDeviceRemoved,
                             onConnected,
                             onDisconnected,
                             onAttributesDataPublished,
                             clientKey) {

    var ws = new WebSocket(SERVER_WS_PROTOCOL + SERVER + '/');
    ws.binaryType = "arraybuffer";

    var self = this;

    self.clientKey = clientKey || "default-key";

    self.callbacks = {};

    function register() {
        let msg = {};
        msg.event = constants.AX_CLIENT_REGISTER;

        msg.data = {};
        msg.data.token = clientKey;

        ws.send(JSON.stringify(msg));
    }

    ws.onopen = function() {
        register();
        addCallbackForEvent(constants.AX_CLIENT_REGISTER, (msg) => {
            let status = msg.status;
            if(status === 'SUCCESS') {
                onConnected();
            } else {
                console.error('Handshake failed with server - check registration token');
            }
        });
    };

    ws.onclose = function() {
        onDisconnected();
    };


    ws.onmessage = function(event) {
        var fn;
        let msg = JSON.parse(event.data);

        if(msg) {
            let eventName = msg.event;
            let devicePath = msg.data.path;

            if(devicePath) {
                // Only device specific event callbacks are handled
                let devCallbackObj = self.callbacks[devicePath];

                if(devCallbackObj) {
                    fn = devCallbackObj[eventName];
                }

            } else {
                // Global callbacks are handled here
                fn = self.callbacks[eventName];
            }

            if(fn) {
                let payload = msg.data;
                if(!hasError(payload)) {

                    let data = getData(payload);
                    if(devicePath) {
                        // Amend data with path if present
                        data.path = devicePath;
                    }
                    fn(data);

                } else {
                    let data = getError(payload);
                    console.error(data);
                    // Hmm error goes same way?
                    // data.path = devicePath;
                    // fn(data);
                }
            } else {
                console.warn('Cannot find callback for ' + eventName);
            }
        }

    };

    function init() {
        addCallbackForEvent(constants.AX_DEVICE_ADDED, (payload) => {
            onDeviceAdded(payload);
        });

        addCallbackForEvent(constants.AX_DEVICE_REMOVED, (payload) => {
            onDeviceRemoved(payload);
        });

        addCallbackForEvent(constants.AX_ATTRIBUTE_CACHE_PUBLISH, (payload) => {
            onAttributesDataPublished(payload);
        });
    }

    function addCallbackForEvent(event, callback, pathForDevice) {
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
        'send': send
    };
 }

function setupTimeSyncScriptTag(cb) {
    var tag = document.createElement('script');
    var ts = null;
    tag.onload = () => {
        cb();
    };
    tag.src = SERVER_HTTP_PROTOCOL + SERVER + '/timesync/timesync.min.js';
    document.body.appendChild(tag);
    return {
        'ts': ts
    };
}

function API(onDeviceAdded,
             onDeviceRemoved,
             onConnected,
             onDisconnected,
             // default data listener - you can replace it later too
             onAttributesDataPublished,
             clientKey) {

    var server = null;

    setupTimeSyncScriptTag(() => {
        server = timesync.create({
            server: SERVER_HTTP_PROTOCOL + SERVER + '/timesync',
            interval: 10000
        });
    });

    var conn = new WebSocketConnection(onDeviceAdded,
                        onDeviceRemoved,
                        onConnected,
                        onDisconnected,
                        onAttributesDataPublished,
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
     * @param callback
     */
    this.getFiles = (callback) => {
        conn.send(constants.AX_CLIENT_FILES_GET_ALL, {}, callback);
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
     * @param options
     * @param callback
     */
    this.publish = (options, callback) => {
        conn.send(constants.AX_DEVICE_ATTRIBUTE_PUBLISH, options, callback);
    };

    /**
     *
     * @param options
     * @param callback
     */
    this.createProcess = (options, callback) => {
        conn.send(constants.AX_CREATE_PROCESS, options, callback);
    };

    /**
     *
     * @param devicePath
     * @param cb
     */
    this.addDataListenerForDevice = (devicePath, cb) => {
        // This will replace any existing listeners as well
        conn.addCallbackForEvent(constants.AX_CLIENT_DATA, cb, devicePath);
    };

    /**
     *
     * @returns Current server time compatible in millis
     */
    this.getCurrentTime = () => {
        if(server !== null) {
            return server.now();
        } else {
            console.warn('Time sync server not loaded');
        }
    }
}

// export API
AX.API = API;

// attach it to global window
window.AX = AX;


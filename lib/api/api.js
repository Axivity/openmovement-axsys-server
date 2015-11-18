/**
 * Created by Praveen on 09/09/2015.
 *
 * @flow
 */

import * as events from 'events';

import moment from 'moment';

import { Payload, AxsysError } from './payload';
import * as serial from '../comms/serial';
import * as stringUtils from '../utils/string-utils';
import { AX_ON_DATA } from '../constants/event-name-constants';
import { AttributesAPI } from './attributes-api';

export class APIInterface {

    // TODO: Decide on how to refactor it to have same interface as client
    //       Possibly create an index.js file that exposes APIInterface class,
    //       and instantiate this class and proxy all the methods of this
    //       class.

    //constructor(onDeviceAdded,
    //            onDeviceRemoved,
    //            onConnected,
    //            onDisconnected,
    //            onDataReceived,
    //            clientKey) {
    //
    //}

    constructor(dbService, db, store, dataHandler, attributesPublishHandler) {
        // TODO: Clean up DB service, it's probably not needed for now
        this.dbService = dbService;
        this.db = db;
        this.ports = {};
        this.attributesCacheApi = new AttributesAPI(store, this._onDataPublished.bind(this));
        this.dataHandler = dataHandler;
        this.attributesPublishHandler = attributesPublishHandler;
    }

    _onDataPublished(changedState) {
        let payload = new Payload(null, changedState, null);
        this.attributesPublishHandler(payload);
    }

    getDevices() {
        let devices = this.attributesCacheApi.getAll();
        let payload = new Payload(null, devices, null);
        return payload;
    };

    connect(options, callback) {
        let path = stringUtils.parseSerialPath(options.path);
        let emitter = new events.EventEmitter();
        options.emitter = emitter;

        let serialPort = new serial.SerialComms(options);
        emitter.on(AX_ON_DATA, this.onWritten.bind(this));

        serialPort.openPath((err) => {
            if(err) {
                let axErr = new AxsysError(err.name, err.message, '');
                let payload = new Payload(axErr, null, options.path);
                callback(payload);

            } else {
                let payload = new Payload(null, {}, options.path);
                callback(payload);
            }
        });

        this.ports[path] = serialPort;
    };

    disconnect(options, callback) {
        let path = stringUtils.parseSerialPath(options.path);
        let serialPort = this.ports[path];
        serialPort.closePath(path, (err) => {
            if(err) {
                let axErr = new AxsysError(err.name, err.message, '');
                let payload = new Payload(axErr, null, options.path);
                callback(payload);

            } else {
                let payload = new Payload(null, {}, options.path);
                callback(payload);
            }
        });
    };

    onWritten(response) {
        console.log('Same event raised');
        console.log(response);

        let data = response.data;
        //let path = stringUtils.parseSerialPath(response.options.path);
        let payload = new Payload(null, {
            'buffer': data,
            'dateTime': moment().format()
        }, response.options.path);
        this.dataHandler(payload);
    };

    write(options, callback) {
        let path = stringUtils.parseSerialPath(options.path);
        let serialPort = this.ports[path];
        serialPort.write(options, (err, response) => {

            if(err) {
                let axErr = new AxsysError(err.name, err.message, '');
                let payload = new Payload(axErr, null, options.path);
                callback(payload);

            } else {
                let payload = new Payload(null, response, options.path);
                callback(payload);
            }
        });
    }

    publish(devicePath, attributeKey, attributeVal) {
        this.attributesCacheApi.publish(devicePath, attributeKey, attributeVal);
        let payload = new Payload(null, {}, null);
        return payload;
    }

}
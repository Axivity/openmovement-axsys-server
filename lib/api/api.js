/**
 * Created by Praveen on 09/09/2015.
 */

import * as events from 'events';

import moment from 'moment';

import { Payload, AxsysError } from './payload';
import * as serial from '../comms/serial';
import * as stringUtils from '../utils/string-utils';
import { AX_ON_DATA } from '../services/event-name-constants';

export class APIInterface {

    constructor(dbService, db, dataHandler) {
        this.dbService = dbService;
        this.db = db;
        this.ports = {};
        this.dataHandler = dataHandler;
        //this.serialPort = null;

    }

    getDevices() {
        return this.dbService.getAllDevices(this.db).then((result) => {
            console.log(result);
            let results = [];
            result.rows.map((device) => {
               results.push(device.doc);
            });
            console.log(results);
            let payload = new Payload(null, results);
            return payload;

        })
        .catch((err) => {
            let axErr = new AxsysError(err.name, err.message, '');
            let payload = new Payload(axErr, null);
            return payload;
        });
    };

    connect(options, callback) {
        let emitter = new events.EventEmitter();
        options.emitter = emitter;
        let path = stringUtils.parseSerialPath(options.path);

        let serialPort = new serial.SerialComms(options);
        emitter.on(AX_ON_DATA, this.onWritten.bind(this));

        serialPort.openPath((err) => {
            if(err) {
                let axErr = new AxsysError(err.name, err.message, '');
                let payload = new Payload(axErr, null);
                callback(payload);

            } else {
                let payload = new Payload(null, {});
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
                let payload = new Payload(axErr, null);
                callback(payload);

            } else {
                let payload = new Payload(null, {});
                callback(payload);
            }
        });
    };

    onWritten(response) {
        console.log('Same event raised');
        console.log(response);

        let data = response.data;
        let path = stringUtils.parseSerialPath(response.options.path);

        let payload = {
            'path': path,
            'buffer': data,
            'dateTime': moment().format()
        };
        this.dataHandler(payload);
    };

    write(options, callback) {
        let path = stringUtils.parseSerialPath(options.path);
        let serialPort = this.ports[path];
        serialPort.write(options, (err, response) => {
            if(err) {
                let axErr = new AxsysError(err.name, err.message, '');
                let payload = new Payload(axErr, null);
                callback(payload);

            } else {
                let payload = new Payload(null, response);
                callback(payload);
            }
        });
    }

}
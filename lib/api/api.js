/**
 * Created by Praveen on 09/09/2015.
 */

import { Payload, AxsysError } from './payload';
import * as serial from '../comms/serial';

export class APIInterface {

    constructor(dbService, db) {
        this.dbService = dbService;
        this.db = db;
        this.serialPort = null;
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
        this.serialPort = new serial.SerialComms(options);
        this.serialPort.openPath((err) => {
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

    write(options, callback) {

    }



}
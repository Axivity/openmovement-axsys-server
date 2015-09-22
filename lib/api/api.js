/**
 * Created by Praveen on 09/09/2015.
 */

import { Payload, AxsysError } from './payload';

export class APIInterface {

    constructor(dbService, db) {
        this.dbService = dbService;
        this.db = db;
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

    connect(options) {
        let path = options.path;

    }

}
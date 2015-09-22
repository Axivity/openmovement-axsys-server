/**
 * Created by Praveen on 09/09/2015.
 */

import { APIInterface } from './api';


export class WebsocketAPI {
    constructor(dbService, db) {
        this.api = new APIInterface(dbService, db);
    }

    getDevices(req) {
        console.log('Getting devices');
        return this.api.getDevices().then((payload) => {
            req.io.respond(payload);
        });
    }

    connect (req) {
        console.log("connecting to a device");
        let options = req.data;
        this.api.connect(options, (payload) => {
            req.io.respond(payload);
        });
    }

}

export function websocketSetup(app, dbService, db) {
    let webSocketAPI = new WebsocketAPI(dbService, db);
    app.io.route('ax-devices', {
        getAll: (req) => {
            console.log('Setup getAll route');
            return webSocketAPI.getDevices(req);
        }
    });

    app.io.route('ax-device-connect', (req) => {
        console.log('Setup connect route');
        return webSocketAPI.connect(req);
    });
}
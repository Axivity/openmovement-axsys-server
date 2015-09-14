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
        return this.api.getDevices().then((devices) => {
            req.io.respond(devices);
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
}
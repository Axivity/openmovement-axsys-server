/* System imports */
import path from 'path';

/* Third party imports */
import eio from 'express.io';

/* Internal imports */
import * as register_module from './lib/register-client';
import * as dbService from './lib/services/pouchdb-service';
import * as discoveryService from './lib/services/devicediscovery-service';
import * as websocketFacade from './lib/api/websocket';

/* Global constants */
const DEVICES_DATABASE_NAME = 'axsys-devices';
let DEVICES_DB;


/* main */
function main() {
    let app = eio();
    app.http().io();

    register_module.register(app);

    // setup db service and device discovery
    createDBAndStartDeviceDiscovery().then((db) => {
        // setup routes for client
        websocketFacade.websocketSetup(app, dbService, db);
    });

    // setup static route for client.min.js
    setUpRouteForClientLibrary(app);

    app.listen(9693);
}

function createDBAndStartDeviceDiscovery() {
    // create db and start device discovery
    return dbService.createDatabase(DEVICES_DATABASE_NAME).then((db) => {
        let deviceDiscoverer = new discoveryService.DeviceDiscovery({
            dbService: dbService,
            db: db,
            vidPids: [
                0x04D80057
            ]
        });

        deviceDiscoverer.start();
        return db;

    }).catch((err) => {
        console.error(err);
    });
}

function secureOriginsToServe(app) {
    // setup origins - TODO: this list should be externalized
    app.io.set('origins', 'http://localhost:9692');
}

function setUpRouteForClientLibrary(app) {
    // setup route for serving client
    app.get('/client.min.js', (req, res) => {
        res.sendfile(path.join(__dirname, 'dist-client/client.min.js'));
    });
}

/* Init app */
main();

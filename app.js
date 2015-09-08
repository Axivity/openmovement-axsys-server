/* System imports */

/* Third party imports */
import eio from 'express.io';

/* Internal imports */
import * as register_module from './lib/register-client';
import * as dbService from './lib/services/pouchdb-service';
import * as discoveryService from './lib/services/devicediscovery-service';

/* Global constants */
const DEVICES_DATABASE_NAME = 'axsys-devices';

/* main */
function main() {
    let app = eio();
    app.http().io();
    createDBAndStartDeviceDiscovery();
    // setup routes for client
    register_module.register(app);
    app.listen(9693);
}

function createDBAndStartDeviceDiscovery() {
    // create db and start device discovery
    dbService.createDatabase(DEVICES_DATABASE_NAME).then((db) => {
        let deviceDiscoverer = new discoveryService.DeviceDiscovery({
            dbService: dbService,
            db: db,
            vidPids: [
                0x04D80057
            ]
        });

        deviceDiscoverer.start();
    });
}

main();

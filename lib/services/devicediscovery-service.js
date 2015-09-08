/**
 * Created by Praveen on 08/09/2015.
 */

import * as deviceFinderBinding from '../devicefinder';

export class DeviceDiscovery {

    constructor (options) {
        this.dbService = options.dbService;
        this.devicesDb = options.db;
        // TODO: This should be an array of vidpids to pass on
        this.vidPids = options.vidPids;
        this.deviceFinder = new deviceFinderBinding.DeviceFinder({
            // TODO: This should support all device types - NOT JUST AX3
            idToMonitor: this.vidPids[0], // AX3
            addedCallback: onDeviceAdded(this.dbService, this.devicesDb),
            removedCallback: onDeviceRemoved(this.dbService, this.devicesDb)
        });
    }

    start() {
        this.deviceFinder.start();
    }

    stop() {
        this.deviceFinder.stop();
    }

    static _generateId(device) {
        // TODO: Check with Dan about creating this on the fly
        // TODO: In linux you need to parse the string to get the port
        return "serial://" + device.port + '/';
    }
}

function onDeviceRemoved(dbService, devicesDb) {
    return (device) => {
        console.log('Device removed');
        device._id = DeviceDiscovery._generateId(device);
        dbService.removeDevice(devicesDb, device).then((result) => {
            console.log('Device removed from database');
        })
        .catch((err) => {
            console.error(err);
            console.error("Device could not be removed from database");
        });
    }
}

function onDeviceAdded(dbService, devicesDb) {
    return (device) => {
        console.log('Device discovered');
        device._id = DeviceDiscovery._generateId(device);
        dbService.addDevice(devicesDb, device).then((result) => {
            console.log('Device added to database');
        })
        .catch((err) => {
            console.error(err);
            console.error("Device could not be added to database");
        });

    }
}
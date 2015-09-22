/**
 * Created by Praveen on 08/09/2015.
 */

import PouchDB from 'pouchdb';
import * as deviceUtils from '../utils/device-props-utils';

export function createDatabase(db_name) {
    let db = new PouchDB(db_name);
    return db.destroy().then(()=> {
        console.log("Any existing database cleared");
        return new PouchDB(db_name);

    }).catch((err) => {
        console.error(err);
        console.error('Cannot destroy database to create new one');
        throw err;
    });
}

export function addDevice(db, device) {
    return db.put(device)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            console.error(err);
            console.error('Cannot add a device');
            throw err;

        });
}

export function getAllDevices(db) {
    return db.allDocs({include_docs: 'true'})
        .then((result) => {
            return result;
        })
        .catch((err) => {
            console.error(err);
            console.error('Cannot get all devices');
            throw err;
        });
}

export function removeDevice(db, device) {
    return db.get(device._id).then((doc) => {
        db.remove(doc)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.error(err);
                console.error('Cannot delete device');
                throw err;
            });

    }).catch((err) => {
        console.error(err);
        console.error('Cannot find device to delete');
        throw err;
    });
}


export function onDeviceRemoved(devicesDb) {
    return (device) => {
        console.log('Device removed');
        device._id = deviceUtils.generateId(device);
        removeDevice(devicesDb, device).then((result) => {
            console.log('Device removed from database');
        })
        .catch((err) => {
            console.error(err);
            console.error('Device could not be removed from database');
        });
    }
}

export function onDeviceAdded(devicesDb) {
    return (device) => {
        console.log('Device discovered');
        device._id = deviceUtils.generateId(device);
        addDevice(devicesDb, device).then((result) => {
            console.log('Device added to database');
        })
        .catch((err) => {
            console.error(err);
            console.error('Device could not be added to database');
        });
    }
}
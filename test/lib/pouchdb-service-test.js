/**
 * Created by Praveen on 08/09/2015.
 */

import { expect } from 'chai';

import * as pouchdbService from '../../lib/services/pouchdb-service';

const MOCK_DB = 'axsys_sample_db';

describe('PouchDB service', () => {
    let db;
    const dummyDevice = {
        _id: 'dummy1',
        name: 'dummyName'
    };

    it('should have created database', (done) => {
        pouchdbService.createDatabase(MOCK_DB).then((result) => {
            console.log(result);
            db = result;
            expect(db).to.not.be.undefined;
            done();
        });


    });

    it('should add a device to the database', (done) => {
        pouchdbService.addDevice(db, dummyDevice).then((result) => {
            console.log("Successfully inserted doc");
            console.log(result);
            done();
        });

    });

    it('should retrieve all devices in database', (done) => {
        pouchdbService.getAllDevices(db).then((devices) => {
            console.log(devices);
            expect(devices.rows).to.have.length(1);
            done();
        });

    });

    it('should remove a device in database', (done) => {
        pouchdbService.removeDevice(db, dummyDevice).then((result) => {
            console.log(result);
            done();
        });

    });



});
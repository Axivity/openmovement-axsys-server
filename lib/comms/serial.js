/**
 * Created by Praveen on 16/09/2015.
 */

import * as serialPort from 'serialport';
import * as lockUtils from '../lock';
import * as stringUtils from '../utils/string-utils';
import * as events from 'events';
import { AX_ON_DATA } from '../services/event-name-constants';


export class SerialComms {
    constructor(options) {
        this.options = options;
        this.conn = null;
        this.emitter = options.emitter;
    }

    openPath (callback) {
        let connOptions = {};
        let path = stringUtils.parseSerialPath(this.options.path);
        let lockedById = this.options.lockedById;

        console.log('Trying to open path: ' + path);

        // check locked
        if(lockUtils.hasLock(path)) {

            // if locked - check who locked it
            if(lockUtils.lockedBySameClient(path, lockedById)) {

                // locked by same client so already connected to device
                callback();

            } else {

                // locked by different client so send back an error message
                let err = new lockUtils.LockError('Device not available - locked by another user');
                callback(err);
            }

        } else {

            // not locked so lock it and start the transaction with device
            lockUtils.lock(path, lockedById);
            console.log('Path: ' + path);
            this.conn = new serialPort.SerialPort(path,
                        connOptions,
                        // we don't want to open it by default - no big rationale,
                        // it just seems to work better if we open connection ourself.
                        false);

            this.conn.open((err) => {
                if(err) {
                    lockUtils.unlock(path);
                    console.log(err);
                    console.log('There is an error');
                    callback(err);

                } else {
                    callback();
                }
            });
        }
    }

    write(options, callback) {
        this.conn.once('data', (responseData) => {
            var response = {
                options: options,
                data: responseData
            };
            console.log('Got response running command');
            console.log(responseData);
            this.emitter.emit(AX_ON_DATA, response);
        });

        let command = options.command;
        console.log(command);
        this.conn.write(command, (err, response) => {
            console.log(response);
            if(err) {
                callback(err, null);
            }
        });
    }

    closePath(path, callback) {
        console.log('Closing the path: ' + path );
        this.conn.close((err) => {
            if(err) {
                callback(err);

            } else {
                lockUtils.unlock(path);
                callback();
            }
        });
    }
}
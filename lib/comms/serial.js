/**
 * Created by Praveen on 16/09/2015.
 */

import * as serialPort from 'serialport';
import * as stringUtils from '../utils/string-utils';
import * as lockUtils from '../lock';
import * as events from 'events';
import { AX_ON_DATA } from '../constants/event-name-constants';


export class SerialComms {
    constructor(options) {
        this.options = options;
        this.conn = null;
        this.emitter = options.emitter;
    }

    openPath (callback) {
        let connOptions = {};
        let path = stringUtils.parseSerialPath(this.options.path);

        console.log('Trying to open path: ' + path);

        // NB: This lock is for making sure when data file is downloaded from a device,
        //     another client cannot configure it there by formatting file system.
        if(this.options.writeLock) {
            // we don't know who's locked it for now so null
            lockUtils.lock(path, null)
        }

        this.conn = new serialPort.SerialPort(path,
                    connOptions,
                    // we don't want to open it by default - no big rationale,
                    // it just seems to work better if we open connection ourself.
                    false);

        this.conn.open((err) => {
            if(err) {
                console.error(err);
                callback(err);

            } else {
                callback();
                this.conn.on('data', this._dataListener.bind(this));
            }
        });

    }

    write(options, callback) {
        let command = options.command;
        console.log(command);

        this.conn.write(command, (err, response) => {
            console.log(response);
            if(err) {
                callback(err, null);
            }
            let responseObj = {
                writtenDataLength: response
            };
            callback(null, responseObj);
        });
    }

    closePath(path, callback) {
        console.log('Closing the path: ' + path );
        this.conn.close((err) => {
            if(err) {
                callback(err);

            } else {

                callback();
            }
        });
    }

    _dataListener(responseData) {
        var response = {
            options: {
                'path': this.options.path
            },
            data: responseData
        };
        console.log('Got response running command');
        console.log(responseData);
        this.emitter.emit(AX_ON_DATA, response);
    }
}
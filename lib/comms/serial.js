/**
 * Created by Praveen on 16/09/2015.
 */

import * as serialPort from 'serialport';
import * as lockUtils from '../lock';
import * as stringUtils from '../utils/string-utils';

export class SerialComms {
    constructor(options) {
        this.options = options;
        this.conn = null;
    }

    openPath (callback) {
        let connOptions = {};
        let path = stringUtils.parseSerialPath(this.options.path);

        if(lockUtils.hasLock(path)) {
            let err = new lockUtils.LockError('Device not available - locked by another user');
            callback(err);

        } else {
            lockUtils.lock(path);
            console.log(serialPort);
            this.conn = new serialPort.SerialPort(path,
                        connOptions,
                        // we don't want to open it by default - no big rationale,
                        // it just seems to work better if we open connection ourself.
                        false);

            this.conn.open((err) => {
                if(err) {
                    lockUtils.unlock(path);
                    callback(err);

                } else {
                    callback();
                }
            });
        }

    }


}
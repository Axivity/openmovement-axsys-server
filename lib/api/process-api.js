/**
 * Created by Praveen on 13/12/2015.
 */

import path from 'path';

import * as cp from 'child_process';
import * as downloadConfig from '../plugins/internal/download-data-file.json';

import * as actionCreators from '../action-creators/cache-action-creator';

const FILES_STORE = 'files-store';

export class ProcessAPI {
    constructor(store) {
        this.store = store;

    }

    create(options) {
        let self = this;

        if(options.name === 'download-file') {
            let devicePath = options.path;
            let attributeKey = 'STATUS';

            let destination = path.join(__dirname, '/../../', FILES_STORE, options.args[1]);
            console.log('The destination is ' + destination);

            options.args[1] = destination;
            let child = cp.fork(__dirname + '/../plugins/internal/download-data-file.js');

            child.on('message', function(m) {
                let percentage = Math.round(m.percentage * 100) / 100;
                console.log('In parent ' + percentage);

                let attributeVal = 'Downloading - ' + percentage + '%';
                self.store.dispatch(actionCreators.updateCacheAttribute({
                    devicePath: devicePath,
                    attributeKey: attributeKey,
                    attributeValue: attributeVal
                }));

            });

            child.send(options);

            return true;

        } else {
            return false;
        }

    }
}
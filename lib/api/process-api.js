/**
 * Created by Praveen on 13/12/2015.
 */

import path from 'path';

import * as cp from 'child_process';
import * as downloadConfig from '../plugins/internal/download-data-file.json';

const FILES_STORE = 'files-store';

export class ProcessAPI {
    constructor() {

    }

    create(options) {

        if(options.name === 'download-file') {
            let destination = path.join(__dirname, '/../../', FILES_STORE, options.args[1]);
            console.log('The destination is ' + destination);
            options.args[1] = destination;
            let child = cp.fork(__dirname + '/../plugins/internal/download-data-file.js');

            child.on('message', function(m) {
                console.log('In parent ');
                console.log(m);
            });

            child.send(options);

            return true;

        } else {
            return false;
        }

    }
}
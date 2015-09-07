/**
 * Created by Praveen on 07/09/2015.
 */

import * as console from 'console';
import * as deviceFinderBinding from './devicefinder';

export function register(app) {
    'use strict';
    app.io.route('ax-register', function(req){
        let data    = req.data;
        let key     = data.key;
        console.log(key);
        console.log(deviceFinderBinding);
        let deviceFinder = new deviceFinderBinding.DeviceFinder({
            idToMonitor: 0x04D80057,
            addedCallback: (device) => { console.log(device); },
            removedCallback: (device) => { console.log(device); }
        });

        deviceFinder.start();
    });

}

/**
 * Created by Praveen on 27/08/2015.
 */
import * as deviceFinderBinding from '../build/Release/devicefinder';

export class DeviceFinder {
    constructor(options) {
        'use strict';
        if (!options.hasOwnProperty('idToMonitor')) {
            throw Error('Need an id (vid+pid) to monitor');
        }

        if (!options.hasOwnProperty('addedCallback')) {
            throw Error('Need a callback function to call when device is added');
        }

        if (!options.hasOwnProperty('removedCallback')) {
            throw Error('Need a callback function to call when device is removed');
        }

        this.idToMonitor = options.idToMonitor;
        this.addedCallback = options.addedCallback;
        this.removedCallback = options.removedCallback;
        this.binding = deviceFinderBinding;

    }

    start() {
        'use strict';
        this.binding.StartDeviceDiscovery(
            this.idToMonitor,
            this.addedCallback,
            this.removedCallback);
    }

    stop() {
        'use strict';
        this.binding.StopDeviceDiscovery();
    }

}





/**
 * Created by Praveen on 08/09/2015.
 */

import * as deviceFinderBinding from '../devicefinder';
import * as constants from './event-name-constants';


export class DeviceDiscovery {

    constructor (options) {
        this.eventBus = options.eventBus;
        // TODO: This should be an array of vidpids to pass on
        this.vidPids = options.vidPids;
        this.deviceFinder = new deviceFinderBinding.DeviceFinder({
            // TODO: This should support all device types - NOT JUST AX3
            idToMonitor: this.vidPids[0], // AX3
            addedCallback: onDeviceAdded(this.eventBus),
            removedCallback: onDeviceRemoved(this.eventBus)
        });
    }

    start() {
        this.deviceFinder.start();
    }

    stop() {
        this.deviceFinder.stop();
    }

}

function onDeviceAdded(eventBus) {
    return (error, device) => {
        if(error === undefined) {
            eventBus.publish(constants.AX_DEVICE_ADDED, device);
        } else {
            console.error('Device addition failed', error);
        }
    }
}


function onDeviceRemoved(eventBus) {
    return (error, device) => {
        if(error === undefined) {
            eventBus.publish(constants.AX_DEVICE_REMOVED, device);
        } else {
            console.error('Device addition failed', error);
        }
    }

}
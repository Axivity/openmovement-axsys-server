/**
 * Created by Praveen on 14/09/2015.
 */

import { Payload, AxsysError } from '../api/payload';
import * as constants from './event-name-constants';

export function onDeviceAdded(app) {
    return (device) => {
        let payload = new Payload(null, device);
        app.io.broadcast(constants.AX_DEVICE_ADDED, payload);
        console.log('device addition pushed to sockets');
    }
}

export function onDeviceRemoved(app) {
    return (device) => {
        let payload = new Payload(null, device);
        app.io.broadcast(constants.AX_DEVICE_REMOVED, payload);
        console.log('device removal pushed to sockets');
    }
}
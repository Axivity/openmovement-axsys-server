/**
 * Created by Praveen on 14/09/2015.
 */

import * as constants from './event-name-constants';

export function onDeviceAdded(app) {
    return (payload) => {
        app.io.broadcast(constants.AX_DEVICE_ADDED, payload);
        console.log('device addition pushed to socket');
    }
}

export function onDeviceRemoved(app) {
    return (payload) => {
        app.io.broadcast(constants.AX_DEVICE_REMOVED, payload);
        console.log('device removal pushed to socket');
    }
}
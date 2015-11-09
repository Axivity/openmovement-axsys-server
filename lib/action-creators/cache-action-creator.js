/**
 * Created by Praveen on 09/11/2015.
 */

import * as actionTypes from '../constants/action-types';


export function updateCacheAttribute(deviceWithAttribute) {
    return {
        type: actionTypes.UPDATE_CACHE,
        msg: deviceWithAttribute
    }
}


export function removeDeviceWithAttributes(deviceWithPath) {
    return {
        type: actionTypes.REMOVE_DEVICE_FROM_CACHE,
        msg: deviceWithPath
    }
}

export function createDeviceWithAttributes(deviceWithPath) {
    return {
        type: actionTypes.CREATE_DEVICE_IN_CACHE,
        msg: deviceWithPath
    }
}
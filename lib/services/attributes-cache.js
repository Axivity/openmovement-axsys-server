/**
 * Created by Praveen on 14/10/2015.
 *
 * @flow
 */

import T from 'immutable';

export type device_id_t = string;

export type attributes_t = T.Map<string, string>;
export type device_attributes_t = T.Map<device_id_t, attributes_t>;

export const INITIAL_STATE:device_attributes_t = T.Map({});

/**
 *
 * @param currentState
 * @param devicePath
 * @param deviceAttributes
 * @returns {*}
 * @description This is a convenience function to set device attributes all at once.
 */
export function createDeviceWithAttributesInCache(
    currentState: device_attributes_t,
    devicePath: device_id_t,
    deviceAttributes: T.Map<string, any>) : device_attributes_t {
    return currentState.set(devicePath, deviceAttributes);
}

/**
 *
 * @param currentState
 * @param devicePath
 * @param attrKey
 * @param attrVal
 * @returns device_attributes_t
 * @description This function will insert/update attribute for given device path
 */
export function upsertAttribute(
    currentState: device_attributes_t,
    devicePath: device_id_t,
    attrKey: string,
    attrVal: number | string | T.Map<string, any>) : device_attributes_t {

    if(currentState.has(devicePath)) {
        let attributes: attributes_t = currentState.get(devicePath);
        let attributesSet = attributes.set(attrKey, attrVal);
        return currentState.merge(T.Map({ [devicePath]: attributesSet }));

    } else {
        return currentState.merge(T.Map({
            [devicePath]: T.Map({
                [attrKey]: attrVal
            })
        }));
    }
}

/**
 *
 * @param currentState
 * @param devicePath
 * @returns device_attributes_t
 * @description This function will remove device with all its attributes from current state.
 */
export function removeDeviceWithAttributes(currentState: device_attributes_t,
                                           devicePath: device_id_t) : device_attributes_t {
    return currentState.delete(devicePath);
}



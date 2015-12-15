/**
 * Created by Praveen on 06/11/2015.
 */


import { combineReducers } from 'redux';

import {fromJS} from 'immutable';
import {INITIAL_STATE, createDeviceWithAttributesInCache,
    upsertAttribute, removeDeviceWithAttributes} from '../services/attributes-cache';

import * as actionTypes from '../constants/action-types';


const WIRING = {
    [actionTypes.UPDATE_CACHE]: (state, action) => {
        let {devicePath, attributeKey, attributeValue} = action.msg;
        return upsertAttribute(state, devicePath, attributeKey, fromJS(attributeValue));
    },

    [actionTypes.REMOVE_DEVICE_FROM_CACHE]: (state, action) => {
        let {devicePath} = action.msg;
        return removeDeviceWithAttributes(state, devicePath);
    },

    [actionTypes.CREATE_DEVICE_IN_CACHE]: (state, action) => {
        let {devicePath, deviceAttributes} = action.msg;
        return createDeviceWithAttributesInCache(state, devicePath, fromJS(deviceAttributes));
    }

};

export default function deviceAttributes(state = INITIAL_STATE, action) {
    if(WIRING[action.type]) {
        let fn = WIRING[action.type];
        return fn(state, action);

    } else {
        return state;
    }
}

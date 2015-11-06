/**
 * Created by Praveen on 06/11/2015.
 */

import {fromJS} from 'immutable';
import {INITIAL_STATE, upsertAttribute} from '../services/attributes-cache';

import * as actionTypes from '../constants/action-types';

export function reducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case (actionTypes.UPDATE_CACHE):
            let {devicePath, attributeKey, attributeValue} = action.msg;
            return upsertAttribute(state, devicePath, attributeKey, fromJS(attributeValue));

        default:
            return state;
    }
}
/**
 * Created by Praveen on 15/12/2015.
 */

import {fromJS} from 'immutable';

import * as actionTypes from '../constants/action-types';

const WIRING = {
    [actionTypes.ADD_PROCESS_FOR_USER]: () => {

    },

    [actionTypes.UPDATE_PROCESS_PROGRESS]: () => {

    },

    [actionTypes.MARK_PROCESS_COMPLETE]: () => {

    }

};

export default function users(state = Map({}), action = null)  {
    switch (action.type) {
        default:
            return state;
    }
}
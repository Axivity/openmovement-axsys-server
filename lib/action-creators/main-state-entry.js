/**
 * Created by Praveen on 06/01/2016.
 */

import * as actionTypes from '../constants/action-types';


export function modifyPersistent(msg) {
    return {
        type: actionTypes.MODIFY_PERSISTENT,
        msg
    }
}

export function modifyTransient(msg) {
    return {
        type: actionTypes.MODIFY_TRANSIENT,
        msg
    }
}
/**
 * Created by Praveen on 06/01/2016.
 */

import T from 'immutable';
import * as actionTypes from '../constants/action-types';
import * as globalConstants from '../constants/global-constants';

function userSessionHelper(path, data, clientId, state) {
    return state.mergeDeepIn(path.push(clientId), data);
}

function socketSessionHelper(path, data, socketId, state) {
    return state.mergeDeepIn(path.push(socketId), data);

}

function globalHelper(path, data, state) {
    //console.log(path);
    return state.mergeDeepIn(path, T.fromJS(data));

}

function handleChanges(state, type, msg) {
    let scope = msg.scope;
    let dataKey = msg.dataKey;
    if(scope === globalConstants.STATE_TREE_USER_SESSION_KEY) {
        let path = [type, globalConstants.STATE_TREE_USER_SESSION_KEY].concat(dataKey);
        return userSessionHelper(path, msg.data, msg.scopeId, state);

    } else if(scope === globalConstants.STATE_TREE_SOCKET_SESSION_KEY) {
        let path = [type, globalConstants.STATE_TREE_SOCKET_SESSION_KEY].concat(dataKey);
        return socketSessionHelper(path, msg.data, msg.scopeId, state);

    } else if(scope === globalConstants.STATE_TREE_GLOBAL_KEY) {
        let path = [type, globalConstants.STATE_TREE_GLOBAL_KEY].concat(dataKey);
        return globalHelper(path, msg.data, state);

    } else {
        return state;
    }

}

function handleTransientChanges(state, msg) {
    return handleChanges(state, globalConstants.STATE_TREE_TRANSIENT_KEY, msg);

}

function handlePersistentChanges(state, msg) {
    return handleChanges(state, globalConstants.STATE_TREE_PERSISTENT_KEY, msg);

}

export default function stateTreeEntryReducer(state, action) {
    let msg = action.msg;

    switch(action.type) {
        case actionTypes.MODIFY_PERSISTENT:
            return handlePersistentChanges(state, msg);

        case actionTypes.MODIFY_TRANSIENT:
            return handleTransientChanges(state, msg);

        default:
            return state;
    }

}
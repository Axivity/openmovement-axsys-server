/**
 * Created by Praveen on 09/11/2015.
 */

import diff from 'immutablediff';
import * as T from 'immutable';

const PATH_SEPARATOR = '/';
const INTERNAL_PATH_SEPARATOR_REGEX = /~1/g;

import {device_attributes_t} from '../services/attributes-cache';

/**
 *
 * @param store
 * @param select
 * @param onChange
 * @returns {Function|*}
 */
export function observeStore(store, select, onChange) {
    let currentState;

    function handleChange() {
        let nextState = select(store.getState());
        console.log('State changed: ' + nextState !== currentState);
        if (nextState !== currentState) {
            let changes = diff(currentState, nextState);
            currentState = nextState;

            // NB: The following call to buildChangesListTillPreviousNonLeafNode is
            // only there as the client is currently not using immutable js,
            // so one cannot apply changes directly to client side state - this will
            // not be necessary once we move to immutable js for client side state.
            let changesAtNodeThatAreNotLeaf = buildChangesListTillPreviousNonLeafNode(changes, currentState);
            onChange(changesAtNodeThatAreNotLeaf);

        }
    }

    let unsubscribe = store.subscribe(handleChange);
    // Initial state is default empty Map so we don't need to handle it
    //handleChange();
    return unsubscribe;
}

/**
 *
 * @param detectedChanges List<Map>
 * @param currentState
 * @returns {List<Map>}
 */
export function buildChangesListTillPreviousNonLeafNode(detectedChanges,
                                                        currentState: device_attributes_t) {

    return detectedChanges.map((change) => {
        let treePath = change.get('path');

        if(treePath.split(PATH_SEPARATOR).length > 3) {
            let op = change.get('op');
            let changedObjKeysList = getParentForLeafNode(treePath);
            let fixedPathCharacterList = changedObjKeysList.map(path => path.replace(INTERNAL_PATH_SEPARATOR_REGEX,
                                                    PATH_SEPARATOR));
            let newValue = currentState.getIn(fixedPathCharacterList);
            return T.Map({
                'op': op,
                'path': PATH_SEPARATOR + changedObjKeysList.join(PATH_SEPARATOR),
                'value': newValue
            });

        } else {
            return change;
        }
    });
}


/**
 * This function will send back nodes of the tree path except for leaf node
 *   For eg. /serial:~1~1123COM~1/a/att2 will be converted to ['serial:~1~1123COM~1', 'a'] leaving out leaf 'att2'
 * @param treePath
 */
export function getParentForLeafNode(treePath) {
    let nonLeafNodes = [];

    let keysList = treePath.split(PATH_SEPARATOR);
    let keyLengthUptoParent = keysList.length - 1;

    for(let i=0; i<keyLengthUptoParent; i++) {
        let node = keysList[i];
        // if path starts with '/', then splitting on '/' will result in an empty node path
        // > var c = '/serial:~1~1123COM~1/a/att2'
        // > c.split('/');
        // [ '', 'serial:~1~1123COM~1', 'a', 'att2' ]
        if(node !== '') {
            nonLeafNodes.push(keysList[i]);
        }
    }
    return nonLeafNodes;
}
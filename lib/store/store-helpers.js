/**
 * Created by Praveen on 09/11/2015.
 */

import diff from 'immutablediff';

export function observeStore(store, select, onChange) {
    let currentState;

    function handleChange() {
        let nextState = select(store.getState());
        if (nextState !== currentState) {
            let changes = diff(currentState, nextState);
            currentState = nextState;
            onChange(changes);
        }
    }

    let unsubscribe = store.subscribe(handleChange);
    // Initial state is default empty Map so we don't need to handle it
    //handleChange();
    return unsubscribe;
}

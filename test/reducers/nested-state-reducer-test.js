/**
 * Created by Praveen on 06/01/2016.
 */
import { combineReducers, createStore } from 'redux';
import T, { Map } from 'immutable';
import diff from 'immutablediff';

const PERSISTENT = 'PERSISTENT';
const TRANSIENT = 'TRANSIENT';

const initialState = T.fromJS({
    'persistent': { 'global': {}, 'userSessions': {} },
    'transient': { 'global': { 'deviceAttributes' : {} }, 'userSessions': {}, 'socketSessions': {} }
});


function modifyPersistent(data) {
    return {
        type: PERSISTENT,
        msg: {
            data
        }
    }
}

function modifyTransient(data) {
    return {
        type: TRANSIENT,
        msg: {
            data
        }
    }
}

function userSessionHelper(path, data, clientId, state) {
    return state.mergeDeepIn(path.push(clientId), data);
}

function socketSessionHelper(path, data, socketId, state) {
    return state.mergeDeepIn(path.push(socketId), data);

}

function globalHelper(path, data, state) {
    console.log(path);

    return state.mergeDeepIn(path, T.fromJS(data));

}

function reducer1(state, action) {
    switch(action.type) {
        case PERSISTENT:
            let msg1 = action.msg.data;
            return msg1;

        case TRANSIENT:
            let msg2 = action.msg.data;

            let scope = msg2.scope;
            let dataKey = msg2.dataKey;
            if(scope === 'userSession') {
                let path = ['transient', 'userSession'].concat(dataKey);
                return userSessionHelper(path, msg2.data, msg2.scopeId, state);

            } else if(scope === 'socketSession') {
                return state;

            } else if(scope === 'global' ) {
                let path = ['transient', 'global'].concat(dataKey);
                return globalHelper(path, msg2.data, state);


            } else {
                return state;
            }

        default:
            return state;
    }

}



const store = createStore(reducer1, initialState);


describe('Reducers', () => {
    describe('when nested or used with helpers', () => {
        it('should get/set the correct state in the hierarchy', () => {

            function observe(s, selector, handler) {
                let cState;

                function handleChange() {
                    let nextState = selector(s.getState());
                    if(cState !== nextState) {
                        console.log('Next state');
                        console.log(nextState);

                        let changes = diff(cState, nextState);
                        console.log(changes);
                        cState = nextState;
                        handler(changes);
                    }
                }
                return s.subscribe(handleChange);
            }

            let globalTransientDeviceAttributesObserver = observe(store,
                (state) => {
                    console.log(state);
                    return state.getIn(['transient', 'global', 'deviceAttributes']);

                }, (newChanges) => {
                    console.log('New changes');
                    console.log(newChanges);
                });


            //let globalTransientDeviceAttributesObserver = observe(store,
            //    (state) => {
            //        console.log(state);
            //        return state.getIn(['transient', 'global', 'deviceAttributes']);
            //
            //    }, (newChanges) => {
            //        console.log('New changes');
            //        console.log(newChanges);
            //    });

            store.dispatch(modifyTransient({
                'scope': 'global',
                'dataKey': ['deviceAttributes'],
                'data': {
                    'serial://path1': {
                        'BATTERY': '100%'
                    }
                }
            }));

        });
    })

});
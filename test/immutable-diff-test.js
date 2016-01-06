/**
 * Created by Praveen on 23/11/2015.
 */
import util from 'util';

import {List, Map} from 'immutable';
import diff from 'immutablediff';
import patch from 'immutablepatch';
import jsonPatch from 'fast-json-patch';

const deviceId = 'serial://123COM/';

describe('When immutable state data structure is diff\'d', () => {

    it('should return only the changes in new state compared to old state', () => {
        let currentState = Map({
            [deviceId]: Map({
                'a': Map({
                    'batt1': 'dev1',
                    'att2': 'dev2'
                })
            })

        });

        let newState1 = currentState.setIn([deviceId, 'a'], Map({
            'batt1': 'dev1',
            'att2': 'dev3'
        }));

        let changes = diff(currentState, newState1);

        console.log(changes);
        console.log(newState1.get(deviceId));

    });

    it('should be able to patch the diffd state to create new state', () => {
        let cState = Map({});
        let myState = Map({});

        let state1 = cState.setIn([deviceId], Map({
            'a': Map({
                'batt1': 'dev1',
                'att2': 'dev2'
            })
        }));

        console.log(state1);

        let changes = diff(myState, state1);
        console.log(changes);

        let newState = patch(myState, changes);
        console.log(newState);

    });

    it('should be possible to patch the diffd state to create pure JSON state', () => {
        let cState = Map({});
        let myState = Map({});

        let state1 = cState.setIn([deviceId], Map({
            'a': Map({
                'batt1': 'dev1',
                'att2': 'dev2'
            })
        }));

        console.log(state1);

        let result = {};

        let changes = diff(myState, state1);
        console.log(util.inspect(changes.toJS(), false, null));
        jsonPatch.apply(result, changes.toJS());
        console.log(util.inspect(result, false, null));


    });


});
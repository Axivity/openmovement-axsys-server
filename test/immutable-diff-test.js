/**
 * Created by Praveen on 23/11/2015.
 */

import {List, Map} from 'immutable';
import diff from 'immutablediff';


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

        console.log(diff(currentState, newState1));

        console.log(newState1.get(deviceId));

    });

});
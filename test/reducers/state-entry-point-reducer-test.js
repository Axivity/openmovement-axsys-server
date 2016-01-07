/**
 * Created by Praveen on 06/01/2016.
 */

import {expect} from 'chai';
import T, {Map} from 'immutable';

import stateEntryPointReducer from '../../lib/reducers/state-entry-point-reducer';
import * as mainActionCreators from '../../lib/action-creators/main-state-entry';


describe('State entry reducer', () => {

    describe('when transient branch is modified deeply', () => {

        it('should return new state tree with transient branch updated', () => {
            const currentState = T.Map({});
            let expectedState = Map(
                {
                    "transient": Map (
                        {
                            "global": Map(
                                {
                                    "deviceAttributes": Map(
                                        {
                                            "serial://path1": Map (
                                                    {
                                                        "BATTERY": "100%"
                                                    })
                                        } )
                                } )
                        } )
                }
            );

            let nextState = stateEntryPointReducer(currentState, mainActionCreators.modifyTransient({
                'scope': 'global',
                'dataKey': ['deviceAttributes'],
                'data': {
                    'serial://path1': {
                        'BATTERY': '100%'
                    }
                }
            }));
            console.log(nextState);
            expect(nextState).to.not.equal(currentState);
            expect(nextState).to.equal(expectedState);

        });

    });


});

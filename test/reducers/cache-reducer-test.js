/**
 * Created by Praveen on 06/11/2015.
 */

import {expect} from 'chai';
import {List, Map} from 'immutable';

import * as actionTypes from '../../lib/constants/action-types';
import { reducer as cacheReducer} from '../../lib/reducers/cache-reducer';

const deviceId = 'serial://COM31';

describe('Cache reducer', () => {

    describe('when UPDATE_CACHE action is dispatched', () => {

        it('should update cache with attribute value for a device', () => {
            let initialState = Map({});

            let action = {
                type: actionTypes.UPDATE_CACHE,
                msg: {
                    devicePath: deviceId,
                    attributeKey: 'attribute',
                    attributeValue: {
                        A: 'A',
                        B: 'B'
                    }
                }
            };

            let expectedState = Map({
                [deviceId]: Map({
                    attribute: Map({
                        A: 'A',
                        B: 'B'
                    })
                })
            });

            let newState = cacheReducer(initialState, action);
            expect(newState).to.equal(expectedState);

        });

    });

});
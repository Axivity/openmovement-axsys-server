/**
 * Created by Praveen on 06/11/2015.
 */

import {expect} from 'chai';
import {List, Map} from 'immutable';

import * as actionCreators from '../../lib/action-creators/cache-action-creator';
import * as actionTypes from '../../lib/constants/action-types';
import cacheReducer from '../../lib/reducers/cache-reducer';


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

            //let expectedState = Map({
            //    [deviceId]: Map({
            //        attribute: Map({
            //            A: 'A',
            //            B: 'B'
            //        })
            //    })
            //});

            let newState = cacheReducer(initialState, action);
            // deep checks - done this way to avoid dynamic time addition, another option is to mock it!
            expect(newState.hasIn([deviceId, 'attribute', 'timeUpdatedInMillis'])).to.be.true;
            expect(newState.hasIn([deviceId, 'attribute', 'value'])).to.be.true;
            expect(newState.hasIn([deviceId, 'attribute', 'value', 'A'])).to.be.true;
            expect(newState.hasIn([deviceId, 'attribute', 'value', 'B'])).to.be.true;

        });

    });

    describe('when CREATE_DEVICE_IN_CACHE event is dispatched', () => {

        it('creates device in cache', () => {
            let action = actionCreators.createDeviceWithAttributes({
                devicePath: 'path1',
                deviceAttributes: {
                    path: 'path1',
                    attr: 'attr'
                }
            });

            let expectedState = Map({
                'path1': Map({
                    path: 'path1',
                    attr: 'attr'
                })
            });

            let initialState = Map({});
            let newState = cacheReducer(initialState, action);
            expect(newState).to.equal(expectedState);

        })

    });

    describe('when REMOVE_DEVICE_FROM_CACHE event is dispatched', () => {

        it('removes device from cache', () => {

            let action = {
                type: actionTypes.REMOVE_DEVICE_FROM_CACHE,
                msg: {
                    devicePath: deviceId
                }
            };

            let initialState = Map({
                [deviceId]: Map({
                    attribute: Map({
                        A: 'A',
                        B: 'B'
                    })
                })
            });

            let expectedState = Map({});

            let newState = cacheReducer(initialState, action);
            expect(newState).to.equal(expectedState);

        });

    });

});
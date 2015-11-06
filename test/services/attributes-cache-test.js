/**
 * Created by Praveen on 06/11/2015.
 */

import {expect} from 'chai';
import {List, Map} from 'immutable';

import {device_id_t, upsertAttribute, removeDeviceWithAttributes} from '../../lib/services/attributes-cache';

const BATTERY_ATTRIBUTE_NAME = 'battery';
const HARDWARE_VERSION = 'hardware';
const SOFTWARE_VERSION = 'software';

let deviceId: device_id_t = "serial://COM31";
let deviceId2: device_id_t = "serial://COM32";


describe('Cache service', () => {
    describe('when attribute is updated', () => {
        it('should update the attribute for right device', () => {
            let initialState = Map({});

            let expectedState = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: 100
                })
            });

            let nextState = upsertAttribute(initialState, deviceId, BATTERY_ATTRIBUTE_NAME, 100);
            expect(nextState).to.equal(expectedState);

        });

        it('should update the attribute for device if device already exists', () => {
            let initialState = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: 100
                })
            });

            let expectedState1 = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: 100,
                    [HARDWARE_VERSION]: 17
                })
            });

            let nextState1 = upsertAttribute(initialState, deviceId, HARDWARE_VERSION, 17);
            expect(nextState1).to.equal(expectedState1);

            let expectedState2 = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: 100,
                    [HARDWARE_VERSION]: 17,
                    [SOFTWARE_VERSION]: 45
                })
            });

            let nextState2 = upsertAttribute(nextState1, deviceId, SOFTWARE_VERSION, 45);
            expect(nextState2).to.equal(expectedState2);
        });

        it('should update the attribute itself when attribute already exists for device', () => {
            let initialState = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: 100
                })
            });

            let expectedState1 = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: 97
                })
            });

            let nextState1 = upsertAttribute(initialState, deviceId, BATTERY_ATTRIBUTE_NAME, 97);
            expect(nextState1).to.equal(expectedState1);


        });

        it('should update the attribute with object when attribute value is a complex type', () => {
            let initialState = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: Map({
                        'timeUpdated': '2015-11-12T23:00:00Z',
                        'frequencyInSecs': 60,
                        'value': 85
                    })
                })
            });

            let expectedState1 = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: Map({
                        'timeUpdated': '2015-11-12T23:01:00Z',
                        'frequencyInSecs': 60,
                        'value': 94
                    })
                })
            });

            let complexAttrValue = Map({
                'timeUpdated': '2015-11-12T23:01:00Z',
                'frequencyInSecs': 60,
                'value': 94
            });

            let nextState1 = upsertAttribute(initialState, deviceId, BATTERY_ATTRIBUTE_NAME, complexAttrValue);
            expect(nextState1).to.equal(expectedState1);


        });

    });

    describe('when device is removed', () => {
        it('should remove the key from the current state', () => {
            let initialState = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: Map({
                        'timeUpdated': '2015-11-12T23:00:00Z',
                        'frequencyInSecs': 60,
                        'value': 85
                    })
                }),
                [deviceId2]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: Map({
                        'timeUpdated': '2015-11-12T23:00:00Z',
                        'frequencyInSecs': 60,
                        'value': 85
                    })
                })

            });

            let expectedState = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: Map({
                        'timeUpdated': '2015-11-12T23:00:00Z',
                        'frequencyInSecs': 60,
                        'value': 85
                    })
                })
            });

            let nextState = removeDeviceWithAttributes(initialState, deviceId2);
            expect(nextState).to.equal(expectedState);

        });

    });
} );

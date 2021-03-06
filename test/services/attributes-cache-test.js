/**
 * Created by Praveen on 06/11/2015.
 */

import {expect} from 'chai';
import {List, Map} from 'immutable';

import {device_id_t,
    createDeviceWithAttributesInCache,
    upsertAttribute,
    removeDeviceWithAttributes,
    TIME_IN_MILLIS_KEY,
    ATTRIBUTE_VALUE_KEY} from '../../lib/services/attributes-cache';

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
                    [BATTERY_ATTRIBUTE_NAME]:  Map({
                        [TIME_IN_MILLIS_KEY]: 1234567890000,
                        [ATTRIBUTE_VALUE_KEY]: 100
                    })
                })
            });

            let nextState = upsertAttribute(initialState,
                                            deviceId,
                                            BATTERY_ATTRIBUTE_NAME,
                                            100,
                                            () => {return 1234567890000;});
            expect(nextState).to.equal(expectedState);

        });

        it('should update the attribute for device if device already exists', () => {
            let initialState = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: Map({
                        [TIME_IN_MILLIS_KEY]: 1234567890000,
                        [ATTRIBUTE_VALUE_KEY]: 100
                    })
                })
            });

            let expectedState1 = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: Map({
                        [TIME_IN_MILLIS_KEY]: 1234567890000,
                        [ATTRIBUTE_VALUE_KEY]: 100
                    }),
                    [HARDWARE_VERSION]: Map({
                        [TIME_IN_MILLIS_KEY]: 1234567890000,
                        [ATTRIBUTE_VALUE_KEY]: 17
                    })
                })
            });

            let nextState1 = upsertAttribute(initialState,
                                            deviceId,
                                            HARDWARE_VERSION,
                                            17,
                                            () => {return 1234567890000;});
            expect(nextState1).to.equal(expectedState1);

            let expectedState2 = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: Map({
                        [TIME_IN_MILLIS_KEY]: 1234567890000,
                        [ATTRIBUTE_VALUE_KEY]: 100
                    }),
                    [HARDWARE_VERSION]: Map({
                        [TIME_IN_MILLIS_KEY]: 1234567890000,
                        [ATTRIBUTE_VALUE_KEY]: 17
                    }),
                    [SOFTWARE_VERSION]: Map({
                        [TIME_IN_MILLIS_KEY]: 1234567890000,
                        [ATTRIBUTE_VALUE_KEY]: 45
                    })
                })
            });

            let nextState2 = upsertAttribute(nextState1,
                                            deviceId,
                                            SOFTWARE_VERSION,
                                            45,
                                            () => {return 1234567890000;});
            expect(nextState2).to.equal(expectedState2);
        });

        it('should update the attribute itself when attribute already exists for device', () => {
            let initialState = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: Map({
                        [TIME_IN_MILLIS_KEY]: 1234567890000,
                        [ATTRIBUTE_VALUE_KEY]: 100
                    })
                })
            });

            let expectedState1 = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: Map({
                        [TIME_IN_MILLIS_KEY]: 1234567890000,
                        [ATTRIBUTE_VALUE_KEY]: 97
                    })
                })
            });
            let nextState1 = upsertAttribute(initialState,
                                            deviceId,
                                            BATTERY_ATTRIBUTE_NAME,
                                            97,
                                            () => {return 1234567890000;});
            expect(nextState1).to.equal(expectedState1);


        });

        it('should update the attribute with object when attribute value is a complex type', () => {
            let initialState = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: Map({
                        [TIME_IN_MILLIS_KEY]: 1234567890000,
                        [ATTRIBUTE_VALUE_KEY]: Map({
                            'frequencyInSecs': 60,
                            'complexValue': 85
                        })
                    })
                })
            });

            let expectedState1 = Map({
                [deviceId]: Map({
                    [BATTERY_ATTRIBUTE_NAME]: Map({
                        [TIME_IN_MILLIS_KEY]: 1234567890000,
                        [ATTRIBUTE_VALUE_KEY]: Map({
                            'frequencyInSecs': 60,
                            'complexValue': 94
                        })
                    })
                })
            });

            let complexAttrValue = Map({
                'frequencyInSecs': 60,
                'complexValue': 94
            });

            let nextState1 = upsertAttribute(initialState,
                                            deviceId,
                                            BATTERY_ATTRIBUTE_NAME,
                                            complexAttrValue,
                                            () => {return 1234567890000});
            expect(nextState1).to.equal(expectedState1);


        });

    });

    describe('when device is added', () => {
        it('should create all attributes at once', () => {
            let initialState = Map({});

            let newDeviceAttrbs = Map({
                path: 'path1',
                attr1: 'attr1',
                attr2: 'attr2'
            });

            let expectedState = Map({
                [deviceId]: newDeviceAttrbs
            });

            let newState = createDeviceWithAttributesInCache(initialState, deviceId, newDeviceAttrbs);
            expect(newState).to.equal(expectedState);

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

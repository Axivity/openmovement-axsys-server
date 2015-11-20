/**
 * Created by Praveen on 09/11/2015.
 */

import {createStore} from 'redux';

import * as actionCreators from '../../lib/action-creators/cache-action-creator';
import * as storeHelpers from '../../lib/store/store-helpers';
import reducer from '../../lib/reducers/cache-reducer';


const store = createStore(reducer);

let DEVICE_ID = 'serial://path1';
let DEVICE_ID_2 = 'serial://path2';

describe('Store', () => {

    describe('when observed for state changes', () => {

        it('should not push whole state rather should push changes only', () => {

            let localState =

            storeHelpers.observeStore(store,
                // state selector
                (state) => {
                    return state;
                },
                // callback for changed state
                (changedState)=> {
                    console.log(changedState);
                }
            );

            store.dispatch(actionCreators.createDeviceWithAttributes({
                devicePath: DEVICE_ID,
                deviceAttributes: {
                    attr1: 'attr1V'
                }
            }));

            store.dispatch(actionCreators.createDeviceWithAttributes({
                devicePath: DEVICE_ID_2,
                deviceAttributes: {
                    attr1: 'attr1V',
                    attr2: 'attr2V',
                    attr3: 'attr3V'
                }
            }));

            store.dispatch(actionCreators.updateCacheAttribute({
                devicePath: DEVICE_ID,
                attributeKey: 'attr2',
                attributeValue: 'attr2V'
            }));

            store.dispatch(actionCreators.updateCacheAttribute({
                devicePath: DEVICE_ID,
                attributeKey: 'attr1',
                attributeValue: {
                    'time': 'boo',
                    'date': 'foo'
                }
            }));


        });

    })

});

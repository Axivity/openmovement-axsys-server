/**
 * Created by Praveen on 09/11/2015.
 */

import {createStore} from 'redux';

import * as actionCreators from '../../lib/action-creators/cache-action-creator';
import * as storeHelpers from '../../lib/store/store-helpers';
import reducer from '../../lib/reducers/cache-reducer';


const store = createStore(reducer);

describe('Store', () => {

    describe('when observed for state changes', () => {

        it('should not push whole state rather should push changes only', () => {
            storeHelpers.observeStore(store,
                (state) => {
                    //console.log(state.get('path1'));
                    return state;
                },
                (changedState)=> {
                    console.log(changedState);
                }
            );

            store.dispatch(actionCreators.createDeviceWithAttributes({
                devicePath: 'path1',
                deviceAttributes: {
                    attr1: 'attr1V'
                }
            }));

            store.dispatch(actionCreators.createDeviceWithAttributes({
                devicePath: 'path2',
                deviceAttributes: {
                    attr1: 'attr1V',
                    attr2: 'attr2V',
                    attr3: 'attr3V'
                }
            }));

            store.dispatch(actionCreators.updateCacheAttribute({
                devicePath: 'path1',
                attributeKey: 'attr2',
                attributeValue: 'attr2V'
            }));

            store.dispatch(actionCreators.updateCacheAttribute({
                devicePath: 'path1',
                attributeKey: 'attr1',
                attributeValue: {
                    'time': 'boo',
                    'date': 'foo'
                }
            }));


        });

    })

});

/**
 * Created by Praveen on 09/11/2015.
 */

import {List, Map} from 'immutable';
import {createStore} from 'redux';
import {expect} from 'chai';

import * as actionCreators from '../../lib/action-creators/cache-action-creator';
import * as storeHelpers from '../../lib/store/store-helpers';
import reducer from '../../lib/reducers/cache-reducer';


const store = createStore(reducer);

let DEVICE_ID = 'serial://path1';
let DEVICE_ID_2 = 'serial://path2';

describe('Store', () => {

    describe('when observed for state changes', () => {

        it('should not push whole state rather should push changes only', () => {

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

    });

    describe('When getParentForLeafNode is called ', () => {
        it('should find the immediate parent node for that leaf node', () => {
            let expected = [ 'foo:abc', '1'];
            let nodesUptoLeaf = storeHelpers.getParentForLeafNode('foo:abc/1/boo');
            expect(nodesUptoLeaf).to.deep.equal(expected);
        });

        it('should find the immediate parent node for that leaf node even when path starts with /', () => {
            let expected = [ 'serial:~1~1123COM~1', 'a'];
            let nodesUptoLeaf = storeHelpers.getParentForLeafNode('/serial:~1~1123COM~1/a/att2');
            expect(nodesUptoLeaf).to.deep.equal(expected);
        })

    });

    describe('When buildChangesListTillLastParentNode is called ', () => {
        it('should build new objects list up to parent node', () => {

            let currentState = Map({
               'serial://path1': Map({
                   'attr1': Map({
                       'timeUpdatedInMillis': 1234567890,
                       'value': 'boo'
                   }),
                   'attr2': Map({
                       "timeUpdatedInMillis": 1448364318685,
                       "value": "attr2V"
                   })
               })
            });

            let changesList = List( [
                Map(
                    {
                        "op": "add",
                        "path": "/serial:~1~1path1/attr2/timeUpdatedInMillis",
                        "value": 1448364318685
                    }
                )
            ]);

            let expectedChangesList = List( [
                Map(
                    {
                        "op": "add",
                        "path": "/serial:~1~1path1/attr2",
                        "value": Map({
                            "timeUpdatedInMillis": 1448364318685,
                            "value": "attr2V"
                        })
                    }
                )

            ]);


            let newChangesList = storeHelpers.buildChangesListTillLastParentNode(
                                        changesList,
                                        currentState);
            expect(newChangesList).to.equal(expectedChangesList);


        });

    });



});

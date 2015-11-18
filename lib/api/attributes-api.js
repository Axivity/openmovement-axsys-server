/**
 * Created by Praveen on 11/11/2015.
 * @flow
 */
import * as actionCreators from '../action-creators/cache-action-creator';
import * as helper from '../store/store-helpers';


export class AttributesAPI {

    constructor(store, publishedDataListener) {
        this.store = store;
        this.listener = publishedDataListener;
        helper.observeStore(this.store, (state) => {
            return state;
        }, (changedState) => {
            // this is only the diff'd state not the whole state tree
            this.listener(changedState);
        });
    }

    publish(devicePath: string, attributeKey: string, attributeVal: Map<string, any>) : void {
        this.store.dispatch(actionCreators.updateCacheAttribute({
            devicePath: devicePath,
            attributeKey: attributeKey,
            attributeValue: attributeVal
        }));
    }

    getAll() {
        let stateTree = this.store.getState();
        console.log(stateTree);
        return stateTree;
    }

}
/**
 * Created by Praveen on 06/01/2016.
 */

import * as actionCreators from '../action-creators/main-state-entry';
import * as helper from '../state/store-helpers';

export class StateAPI {

    constructor(store, publishedDataListener) {
        this.store = store;
        this.listener = publishedDataListener;
        helper.observeStore(this.store, this._selector.bind(this), this._onChangedState.bind(this));
    }

    // This could be much more complex selector though - nice to have it separately passed to state observer
    _selector(state) {
        return state.deviceAttributes;
    }

    _onChangedState(changedState) {
        // this is only the diff'd state not the whole state tree
        this.listener(changedState);
    }

    publish(devicePath: string, attributeKey: string, attributeVal: Map<string, any>) : void {
        this.store.dispatch();
    }

    getAll() {
        // TODO: THIS NEEDS TO BE A MERGE OF PERSISTENT, TRANSIENT FOR CONNECTED USER.
        //let stateTree = this.store.getState();
        //console.log(stateTree);
        //return stateTree.deviceAttributes;
    }

}
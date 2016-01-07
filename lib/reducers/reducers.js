/**
 * Created by Praveen on 15/12/2015.
 */

import {combineReducers} from 'redux';
//import deviceAttributes from './cache-reducer';
import stateEntryPoint from './state-entry-point-reducer';

// Not sure if we need to combine reducers, we may ever have just one core reducer... hmm
export default combineReducers({
    stateEntryPoint
});


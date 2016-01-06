/**
 * Created by Praveen on 06/01/2016.
 */
import { combineReducers } from 'redux';

const actionType1 = 'ACTION_TYPE_1';
const actionType2 = 'ACTION_TYPE_2';

function actionCreator1() {
    return {
        type: actionType1,
        msg: {
            a: 'a'
        }
    }
}

function actionCreator2() {
    return {
        type: actionType2,
        msg: {
            b: 'b'
        }
    }
}

function reducer1(state, action) {
    switch(action.type) {
        case actionType1:
            let msg1 = action.msg;
            return {};

        case actionType2:
            let msg2 = action.msg;
            return {};

        default:
            return state;
    }

}




describe('', () => {
    describe('', () => {
        it('', () => {

        });
    })

});
/**
 * Created by Praveen on 09/11/2015.
 */

import {expect} from 'chai';

import * as stringUtils from '../../lib/utils/string-utils';

describe('String utils', () => {

    describe('when raw windows COM port is passed', () => {

        it('should remove windows prefix', () => {
            let expectedPath = "COM98";
            let newPath = stringUtils.removeWindowsPrefixToSerialPath("\\\\.\\COM98");
            expect(newPath).to.equal(expectedPath);
        });

    });

});

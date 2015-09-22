/**
 * Created by Praveen on 22/09/2015.
 */

import { expect } from 'chai';

import * as lockModule from '../../lib/lock';


describe('Lock module', () => {

    let path = 'serial://COM123/';

    describe('when there is no lock', () => {
        it('should return false when hasLock function is invoked', () => {
            let locked = lockModule.hasLock(path);
            expect(locked).to.be.false;
        });
    });

    describe('check if a path can be locked', () => {
       it('when lock function is invoked', () => {
            let locked = lockModule.lock(path);
            expect(locked).to.be.true;
       });
    });

    describe('when there is a lock', () => {
        it('should return false when hasLock function is invoked', () => {
            let locked = lockModule.hasLock(path);
            expect(locked).to.be.true;
        });
    });

    describe('when locked already', () => {
        it('cannot lock it again', () => {
            let lockTriedAgain = lockModule.lock(path);
            expect(lockTriedAgain).to.be.false;
        });

        it('can unlock a path', () => {
            let unlocked = lockModule.unlock(path);
            expect(unlocked).to.be.true;
        });

    });

    describe('when unlocked already', () => {
        it('cannot be unlocked again', () => {
            let unlockTriedAgain = lockModule.unlock(path);
            expect(unlockTriedAgain).to.be.false;
        });
    });

});
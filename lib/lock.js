/**
 * Created by Praveen on 16/09/2015.
 */

var lockRegistry = {};


export function hasLock(path) {
    return (lockRegistry[path] !== undefined && lockRegistry[path] === 1);
}

export function lock(path) {
    if (!hasLock(path)) {
        lockRegistry[path] = 1;
        return true;

    } else {
        return false;
    }
}

export function unlock(path) {
    if(hasLock(path)) {
        delete lockRegistry[path];
        return true;

    } else {
        return false;
    }
}


export class LockError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'LockError';
    }
}
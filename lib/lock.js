/**
 * Created by Praveen on 16/09/2015.
 */

var lockRegistry = {};


export function hasLock(path) {
    return (lockRegistry[path] !== undefined);
}


export function lock(path, lockedBy) {
    if (!hasLock(path)) {
        lockRegistry[path] = lockedBy;
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


export function lockedBySameClient(path, clientId) {
    let alreadyConnectedClientId = getLockedBy(path);
    return clientId === alreadyConnectedClientId;
}


export function getLockedBy(path) {
    let lockedById = null;
    if (hasLock(path)) {
        lockedById = lockRegistry[path];
    }
    return lockedById;
}


export class LockError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'LockError';
    }
}
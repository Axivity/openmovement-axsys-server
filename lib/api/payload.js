/**
 * Created by Praveen on 21/09/2015.
 */

export class Payload {
    constructor(axsys_error, data, path) {
        this.error = axsys_error;
        this.data = data;
        this.path = path;
    }

}

export class AxsysError {
    constructor(name, msg, code) {
        this.name = name;
        this.message = msg;
        this.errorCode = code;
    }
}

export function hasError(payload) {
    return payload.error !== null;
}

export function getData(payload) {
    return payload.data;
}

export function getError(payload) {
    return payload.error;
}
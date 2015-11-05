/**
 * Created by Praveen on 22/09/2015.
 *
 * @flow
 */

const pathPrefix = 'serial://';

const pathSuffix = '/';


export function parseSerialPath(path: ?string): ?string {
    if(path !== null) {
        return path.split(pathPrefix)[1].split(pathSuffix)[0];

    } else {
        return null;
    }

}


export function constructSerialPath(portName: ?string): ?string {
    // portName === COM28
    if(portName !== null) {
        return pathPrefix + portName + pathSuffix;

    } else {
        return null;
    }

}
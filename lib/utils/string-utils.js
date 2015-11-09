/**
 * Created by Praveen on 22/09/2015.
 *
 * @flow
 */

const PATH_PREFIX = 'serial://';

const PATH_SUFFIX = '/';

// "\\.\COM98"
const WINDOWS_SERIAL_PREFIX = '\\\\.\\';


export function parseSerialPath(path: ?string): ?string {
    if(path !== null) {
        return path.split(PATH_PREFIX)[1].split(PATH_SUFFIX)[0];

    } else {
        return null;
    }

}


export function constructSerialPath(portName: ?string): ?string {
    // portName === COM28
    if(portName !== null) {
        return PATH_PREFIX + portName + PATH_SUFFIX;

    } else {
        return null;
    }

}


export function removeWindowsPrefixToSerialPath(rawWindowsPortName: ?string): ?string {

    if(rawWindowsPortName !== null) {
        return rawWindowsPortName.replace(WINDOWS_SERIAL_PREFIX, '');

    } else {
        return null;
    }

}
/**
 * Created by Praveen on 22/09/2015.
 */

export function parseSerialPath(path) {
    let pathPrefix = 'serial://';
    return path.split(pathPrefix)[1].split('/')[0];
}

/**
 * Created by Praveen on 06/10/2015.
 */

export function stringToBuffer() {

}

export function bufferToString(buff) {
    return String.fromCharCode.apply(null, new Uint8Array(buff));
}

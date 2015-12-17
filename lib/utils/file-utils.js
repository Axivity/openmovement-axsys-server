/**
 * Created by Praveen on 16/12/2015.
 */

import fs from 'fs';
import path from 'path';

export const AX3_DATA_FILE_NAME = 'CWA-DATA.CWA';

export function hasFile(directory) {
    if(directory !== undefined) {
        let absolutePath = path.join(directory, AX3_DATA_FILE_NAME);
        console.log("Checking file " + absolutePath);
        return fs.existsSync(absolutePath);
    }
    return false;
}
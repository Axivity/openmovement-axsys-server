/**
 * Created by Praveen on 16/12/2015.
 */

import fs from 'fs';
import path from 'path';

import * as actionCreators from '../action-creators/cache-action-creator';
import * as helper from '../store/store-helpers';

import {FILES_STORE} from '../constants/global-config';

export class File {
    constructor(name, size, modifiedTime) {
        this.name = name;
        this.sizeInBytes = size;
        this.modifiedTime = modifiedTime;
    }
}


export class FilesAPI {

    constructor(store) {
        this.store = store;
    }

    getAll() {
        let filesList = [];
        //let stateTree = this.store.getState();
        //console.log(stateTree);
        //return stateTree.files;
        let absolutePath = path.join(__dirname, '/../../', FILES_STORE);
        let files = fs.readdirSync(absolutePath);
        for (let i in files) {
            let fileName = files[i];
            if(fileName !== '.gitignore'){
                let allFileAttribs = fs.statSync(path.join(absolutePath, files[i]));
                let file = new File(fileName, allFileAttribs.size, allFileAttribs.mtime);
                filesList.push(file);
            }
        }
        return filesList;

    }

}
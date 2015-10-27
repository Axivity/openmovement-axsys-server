/**
 * Created by Praveen on 23/10/2015.
 */

import fs from 'fs';
import path from 'path';

const METADATA_SIZE_IN_BYTES = 448; // 14 chunks of 32 bytes
const BLOCK_SIZE_IN_BYTES = 512;
const HEADER_SIZE_IN_BYTES = 65535;

describe('CWA file', () => {

    describe('when header is loaded', () => {

        it('should be possible to read metadata', () => {
            const fullFileName = path.join(__dirname, 'LochanWeekend.CWA');
            fs.open(fullFileName, 'r', (err, fd) => {
                if(err) {
                    console.log('Cannot read file');
                    console.log(err);
                } else {
                    let buffer = new Buffer(HEADER_SIZE_IN_BYTES);
                    fs.read(fd, buffer, 0, HEADER_SIZE_IN_BYTES, null, (err, chunksRead, buff) => {
                        if(err) {
                            console.log(err);

                        } else {
                            console.log(chunksRead);
                            if(buff.length < BLOCK_SIZE_IN_BYTES) {
                                console.log('Doesnt have enough data to read');
                            }
                            console.log(buff[0]);
                            console.log(buff[1]);
                            console.log(buff[2]);
                            console.log(buff[3]);
                            console.log(buff[4]);
                            console.log(buff[5]);
                            console.log(buff[6]);
                            console.log(buff[7]);
                            console.log(buff[8]);
                            console.log(buff[9]);
                            console.log(buff[10]);
                        }

                    });
                }
            });




        });

    });

});

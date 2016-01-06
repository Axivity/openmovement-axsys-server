/**
 * Created by Praveen on 05/01/2016.
 */

import jsonPatch from 'fast-json-patch';
import util from 'util';
import {expect} from 'chai';

class Node {
    constructor(value) {
        this.value = value;
        this.children = [];
    }

    add(node) {
        this.children.push(node);
        return node;
    }
}


describe('JSON-Patch', () => {
    describe('when used to observe state tree', () => {
        it('should only report on changes to the tree', (done) => {
            let root = new Node('root');
            let testObj = new Node('root');
            let observer = jsonPatch.observe(root, (changes) => {
                console.log('Changes - ' + new Date());
                console.log(util.inspect(changes, false, null));
                jsonPatch.apply(testObj, changes);
                console.log(util.inspect(testObj, false, null));

            });

            let persistent = new Node('persistent');
            let transient = new Node('transient');
            root.add(persistent);
            root.add(transient);
            console.log('Plain changes - ' + new Date());

            setTimeout(() => {
                let globalPersistent = new Node('global');
                persistent.add(globalPersistent);

                let usr1 = new Node('usr1');
                persistent.add(usr1);

                let sessionCache = new Node('session-cache');
                transient.add(sessionCache);

                let connectionCache = new Node('connection-cache');
                transient.add(connectionCache);
                //console.log(util.inspect(root, false, null));
                console.log('Timed changes - ' + new Date());

                done();

            }, 1500);



        });

    })

});

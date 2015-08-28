/**
 * Created by Praveen on 28/08/2015.
 */

describe('babel', function() {
    it('will parse this es6 code', function() {
        function f() {
            {
                let x;
                {
                    // okay, block scoped name
                    const x = "sneaky";
                }

            }
        }
    })
});



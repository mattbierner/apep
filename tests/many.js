"use strict";

const pep = require('../index');
const assert = require('assert');

describe('many', () => {

    it('Should yield nothing with zero percent chance', () => {
        const p = pep.begin(pep.many(pep.str(4), 0.0));
        assert.deepStrictEqual([], Array.from(p));
    });
    
    it('Should wrap generator.', () => {
        const p = pep.many(4, 1.0);
        assert.deepStrictEqual('4', p.begin().next().value);
    });

    it('Should run for ever with 100% change', () => {
        const p = pep.many(pep.str(4), 1.0);
        let i = 0;
        let x;
        for (let z of pep.begin(p)) {
            if (++i >= 500)  {
                x = z;
                break
            }
        }
        assert.strictEqual(500, i);
        assert.strictEqual('4', x);
    });

});
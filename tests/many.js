"use strict";

const pep = require('../index');
const assert = require('assert');

describe('Many', () => {

    it('Zero chance many returns nothing', () => {
        const p = pep.exec(pep.many(pep.str(4), 0.0));
        const n = Array.from(p);
        assert.strictEqual(0, n.length);
    });

    it('100% chance returns infinite', () => {
        const p = pep.many(pep.str(4), 1.0);
        var i = 0;
        let x;
        for (let z of pep.exec(p)) {
            if (++i >= 500)  {
                x = z;
                break
            }
        }
        assert.strictEqual(500, i);
        assert.strictEqual('4', x);
    });

});
"use strict";
const pep = require('../index');
const assert = require('assert');

describe('lit', () => {

    it('should yield input value', () => {
        const p = pep.lit(5);
        assert.deepEqual([5], Array.from(p.begin()));
    });
    
    it('should yield complex values without transform', () => {
        const myObj = {};
        const p = pep.begin(pep.lit(myObj));
        assert.strictEqual(myObj, p.next().value);
    });
});
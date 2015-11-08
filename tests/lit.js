"use strict";
const pep = require('../index');
const assert = require('assert');

describe('lit', () => {

    it('should yield input value', () => {
        const p = pep.begin(pep.lit(5));
        const n = Array.from(p);
        assert.deepEqual([5], n);
    });
});
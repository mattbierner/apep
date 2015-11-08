"use strict";
const pep = require('../index');
const assert = require('assert');

describe('seq', () => {

    it('Should output single value with one parameter', () => {
        const p = pep.begin(pep.seq(pep.str(4)));
        assert.deepEqual(['4'], Array.from(p));
    });

    it('Should yield all values with multiple parameters', () => {
        const p = pep.begin(pep.seq(pep.str(1), pep.str(2), pep.str(3)));
        assert.deepEqual(['1', '2', '3'], Array.from(p));
    });


    it('Should wrap no function parameters as strings', () => {
        const p = pep.begin(pep.seq(1, "abc", false));
        assert.deepEqual(['1', 'abc', 'false'], Array.from(p));
    });

});
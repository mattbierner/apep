"use strict";
const pep = require('../index');
const assert = require('assert');

describe('lit', () => {
    it('should yield input value', () => {
        const p = pep.lit(5);
        assert.deepStrictEqual([5], Array.from(p.begin()));
    });
    
    it('should yield empty strings', () => {
        assert.deepStrictEqual([''], Array.from(pep.lit('').begin()));
    });
    
    it('should yield falsy values', () => {
        assert.deepStrictEqual([null], Array.from(pep.lit(null).begin()));
        assert.deepStrictEqual([false], Array.from(pep.lit(false).begin()));
        assert.deepStrictEqual([undefined], Array.from(pep.lit().begin()));
    });
    
    it('should yield complex values without transform', () => {
        const myObj = {};
        const p = pep.begin(pep.lit(myObj));
        assert.strictEqual(myObj, p.next().value);
    });
});

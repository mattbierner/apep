"use strict";
const pep = require('../index');
const assert = require('assert');

describe('choice', () => {

    it('Single input always returns that value', () => {
        const p = pep.begin(pep.choice(pep.str(4)));
        const n = Array.from(p);
        assert.strictEqual(1, n.length);
        assert.strictEqual('4', n[0]);
    });

    it('Should wrap non generator arguments', () => {
        const p = pep.run(pep.choice('a', 'b', 'c'), null, () => 0.1);
        assert.strictEqual('a', p);
    });
    
    it('Should wrap arrays as sequences', () => {
        const p = pep.choice(['a', 3], ['c', 'd'], ['e', 'f']);
        assert.deepStrictEqual(
            ['a', '3'],
            Array.from(p.begin(null, () => 0.1)));
    });

    it('Multiple choice is split around 0.5', () => {
        const p = pep.choice(pep.str(1), pep.str(2));
        {
            const n = Array.from(pep.begin(p, null, () => 0.49));
            assert.strictEqual(1, n.length);
            assert.strictEqual('1', n[0]);
        }    
        {
            const n = Array.from(pep.begin(p, null, () => 0.51));
            assert.strictEqual(1, n.length);
            assert.strictEqual('2', n[0]);
        }
    });

    it('Many choices have equal probability', () => {
        const p = pep.choice(pep.str(0), pep.str(1), pep.str(2), pep.str(3));
    
        for (var i = 0; i < 4; ++i)
        {
            const n = Array.from(pep.run(p, null, () => i * 0.25));
            assert.strictEqual(1, n.length);
            assert.strictEqual('' + i, n[0]);
        }    
    });

});
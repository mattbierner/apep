require("babel-polyfill");
const gen = require('../index');
const assert = require('assert');

describe('map', () => {

    it('Should output same value with identity function', () => {
        const p = gen.exec(
            gen.map(gen.str(4), (x) =>  x));
        const n = Array.from(p);
        assert.strictEqual(1, n.length);
        assert.strictEqual('4', n[0]);
    });


    it('Should map over every element in a sequence', () => {
        const p = gen.exec(
            gen.map(gen.seq(gen.lit(1), gen.lit(2), gen.lit(3)),
            (x) => x * x));
        const n = Array.from(p);
        assert.deepEqual([1, 4, 9], n);
    });
    
    it('Should map over every element in a sequence without leaking', () => {
        const p = gen.exec(
            gen.seq(
                gen.lit(5),
                gen.map(
                    gen.seq(gen.lit(1), gen.lit(2), gen.lit(3)),
                    (x) => x * x),
                gen.lit(4)));
        const n = Array.from(p);
        assert.deepEqual([5, 1, 4, 9, 4], n);
    });
});
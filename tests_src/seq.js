require("babel-polyfill");

const gen = require('../index');
const assert = require('assert');

describe('seq', () => {

it('Should output single value with one parameter', () => {
    const p = gen.run(gen.seq(gen.str(4)));
    const n = Array.from(p);
    assert.strictEqual(1, n.length);
    assert.strictEqual('4', n[0]);
});

it('Should yield all values with multiple parameters', () => {
    const p = gen.run(gen.seq(gen.str(1), gen.str(2), gen.str(3)));
    const n = Array.from(p)
    assert.deepEqual(['1', '2', '3'], n);
});


it('Should wrap no function parameters as strings', () => {
    const p = gen.run(gen.seq(1, "abc", false));
    const n = Array.from(p)
    assert.deepEqual(['1', 'abc', 'false'], n);
});

});
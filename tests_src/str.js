require("babel-polyfill");
const gen = require('../index');
const assert = require('assert');

describe('str', () => {

it('Should output empty string with no parameters', () => {
    const p = gen.exec(gen.str());
    const n = Array.from(p);
    assert.strictEqual(1, n.length);
    assert.strictEqual('', n[0]);
});

it('Should convert input to string', () => {
    const p = gen.exec(gen.str(5));
    const n = Array.from(p);
    assert.strictEqual(1, n.length);
    assert.strictEqual('5', n[0]);
});

it('Should convert custom object to string', () => {
    const o = { toString: () => 'abc' }

    const p = gen.run(gen.str(o));
    assert.strictEqual('abc', p);
});

});
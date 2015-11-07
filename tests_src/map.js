require("babel-polyfill");
const gen = require('../index');
const assert = require('assert');

describe('map', () => {

it('Should output same value with identity function', () => {
    const p = gen.run(
        gen.map(gen.str(4), (x) => x));
    const n = Array.from(p);
    assert.strictEqual(1, n.length);
    assert.strictEqual('4', n[0]);
});



});
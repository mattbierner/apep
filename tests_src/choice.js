require("babel-polyfill");

const gen = require('../index');
const assert = require('assert');

describe('choice', () => {

it('Single input always returns that value', () => {
    const p = gen.exec(gen.choice(gen.str(4)));
    const n = Array.from(p);
    assert.strictEqual(1, n.length);
    assert.strictEqual('4', n[0]);
});

it('Multiple choice is split around 0.5', () => {
    const p = gen.choice(gen.str(1), gen.str(2));
    {
        const n = Array.from(gen.exec(p, null, () => 0.49));
        assert.strictEqual(1, n.length);
        assert.strictEqual('1', n[0]);
    }    
    {
        const n = Array.from(gen.exec(p, null, () => 0.51));
        assert.strictEqual(1, n.length);
        assert.strictEqual('2', n[0]);
    }
});


it('Many choices have equal probability', () => {
    const p = gen.choice(gen.str(0), gen.str(1), gen.str(2), gen.str(3));
    
    for (var i = 0; i < 4; ++i)
    {
        const n = Array.from(gen.exec(p, null, () => i * 0.25));
        assert.strictEqual(1, n.length);
        assert.strictEqual('' + i, n[0]);
    }    
});

});
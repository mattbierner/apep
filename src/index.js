require("babel-polyfill");

const randomInt = (min, max, r) =>
    Math.floor(r() * (max - min)) + min;

/**
    Walker's alias method for random objects with different probabilities.
    http://code.activestate.com/recipes/576564-walkers-alias-method-for-random-objects-with-diffe/
*/
const buildWalkerTable = exports.random = (weightMap) => {
    const n = weightMap.length;
    const sum = weightMap.reduce((p, c) => p + c[0], 0);    
    const weights = weightMap.map((x) => (x[0] * n) / sum);

    const shorts = weights.filter(x => x < 1);
    const longs =  weights.filter(x => x > 1);
    const inx = (Array.from(Array(n))).map(_ => -1);
    while (shorts.length && longs.length) {
        const j = shorts.pop();
        const k = longs[longs.length - 1];
        inx[j] = k;
        weights[k] -= (1 - weights[j]);
        if (weights[k] < 1) {
            shorts.push(k);
            longs.pop();
        }
    }

    return (r) => {
        const u = r();
        const j = randomInt(0, n, r);
        const k = (u <= weights[j] ? j : inx[j]);
        console.log(k, weightMap[k]);
        return weightMap[k][1];
    };
};

/**
    Pac
*/
const Pair = (x, s) => ({
    'x': x,
    's': s
});

/**
*/
export const execute = function*(p, s, r) {
    return yield* p()(s, r);
};

/**
    Declare a generator for self reference or for forward references.
    
    @param def Function that takes a reference to generator being defined and
        returns the generator's definition.
*/
export const declare = (def) =>
    function* self(s, r) {
        yield* execute(def(self), s, r);
    };

/**
    Generate a literal value without any transformations applied
*/
export const lit = (x) => () =>
    function*(s, _) {
        const v = Pair(x, s);
        yield v;
        return v;
    };
 
/**
    Generate a literal string value. Attempts to convert the input value to 
    a string.
*/
export const str = function(x) {
    return lit('' + (arguments.length === 0 ? '' : x));
};

/**
    Ensure value is inside a generator.
    
    Convert any literals into string literals.
*/
export const wrap = (x) =>
    typeof x === 'function' ? x : str(x);

/**
*/
export const next = (a, b) => {
    a = wrap(a);
    b = wrap(b);
    return () => function*(s1, r)  {
        const {s} = yield* execute(a, s1, r);
        return yield* execute(b, s, r);
    };
};

/**
*/
export const seq = (...elements) =>
    elements.map(wrap).reduceRight((p, c) => next(c, p));

/**
*/
export const map = (p, f) => () =>
    function*(s1, r) {
        let s = s1;
        for (let v of execute(p, s, r)) {
            s = v.s
            yield Pair(f(v.x), s);
        }
    };

/**
    Choose from along one or more generators, each with its own custom weight.
*/
export const weightedChoice = (weightMap) => {
    const walker = buildWalkerTable(weightMap);
    return () => function*(s, r) {
        const selected = walker(r);
        return yield* execute(selected, s, r);
    };
};

/**
     Choose from along one or more generators, each with the same weight.
*/
export const choice = (...elements) =>
    weightedChoice(elements.map((x, i) => [1, x]));

/**
*/
export const exec = function*(p, ud, r = Math.random) {
    yield* execute(p, { data: ud }, r);
};

/**
*/
export const run = function*(p, ud, r = Math.random) {
    for (let x of exec(p, ud, r))
        yield x.x;
};


    
 
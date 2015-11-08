/**
    APEN
    
    Dada engine inspired library for random text generation.
*/
require("babel-polyfill");
const walker = require('walker-sample');

const arrayMap = Function.prototype.call.bind(Array.prototype.map);

const defaultRandom = Math.random;

/**
    Value state pair
*/
const Pair = (x, s) => ({
    'x': x,
    's': s
});

/**
*/
const Generador = function(run) {
    this.run = run;
};

/**
    Internal state object.
*/
const State = (random, vars, ud) => ({
    'random': random,
    'vars': vars,
    'ud': ud
});

State.empty = State(defaultRandom, {}, null);

State.setUd = (s, ud) =>
    State(s.random, s.vars, ud);

State.setVars = (s, vars) =>
    State(s.random, vars, s.ud);

State.setRandom = (s, random) =>
    State(random, s.vars, s.ud);

State.getVar = (s, name, def) =>
    s.vars.hasOwnProperty(name)
        ? s.vars[name]
        : def;

State.setVar = (s, name, value) => {
    const newVars = Object.create(s.vars);
    newVars[name] = value;
    return State.setVars(s, newVars);
};

/**
    Run a given generator.
*/
export const execute = (p, s) => {
    return p.run(s);
};

/**
    Declare a generator for self reference or late bindings.
        
    @param def Function that takes a reference to generator being defined and
        returns the generator's definition.
        
    Anonymous self reference:
    
        gen.declare((self) =>
            gen.seq(m, self));
            
    Use of forward declarations:
    
        // Use `m` before it is declared or defined.
        const ms = gen.declare(() =>
            gen.seq(m, self));
            
        const m = gen.lit('n');
    
    Later declaration: 
    
        // Declare that the some generator `ms` will exist.
        let ms = gen.declare(() => ms);
        
        // Use `ms` in any expression.
        const p = gen.seq('a', ms);
        
        ...
        
        // Actually define `ms` sometime later.
        ms = gen.str('abc');

    Also can be used to introduce simple, scoped state:
        
        const counter = gen.declare(() => {
            // declare some variables local to this block.
            let sum = 0;

            return gen.seq(
                gen.seq(gen.str(1), gen.str(2), gen.str(3))
                    .map(x => {
                        // Update the state in an expression.
                        sum += i;
                        return x;
                    }),
                // and use the state sometime later.
                // Declare is used to make sure the current value of `i` is
                // always returned.
                gen.declare(() => gen.lit(i)));
        });
            
    For performance reasons, use declare around the smallest possible generator
    since declare evaluates it's body every time the generator is invoked. 
*/
export const declare = (def) => {
    let self;
    return self = new Generador(s =>
        execute(def(self), s));
};

const Yield = (first, rest) => ({
    first: first,
    rest: rest,
    '_yield': true
});

const Done = (first) => ({
    'first': first,
    'rest': null,
    '_yield': true
});

/**
    Generate a literal value without any transformations applied.
*/
export const lit = (x) =>
    new Generador(s =>
        Yield(Pair(x, s), _ => Done(s)))
 
/**
    Empty value generator.
*/
export const empty = new Generador(Done);

/**
    Generate a literal string value.
    
    Attempts to convert the input value to a string.
*/
export const str = function(x) {
    return arguments.length === 0 ? lit('') : lit('' +  x);
};

/**
    Ensure value is inside a generator.
    
    Convert any literals into string literals.
*/
export const wrap = (x) =>
    x instanceof Generador ? x : str(x);

/**
    Run `a` and then `run b`.
*/
export const next = (a, b) => {
    a = wrap(a);
    b = wrap(b);
    const loop = (r) => {
        if (r && r.rest)
            return Yield(r.first, () => loop(r.rest()));
        return execute(b, r.first);
    };

    return new Generador(s =>
        loop(execute(a, s)));
};

/**
    Run a sequence of generators left to right.
    
    Literal values are wrapped and converted to strings:
    
        gen.seq('a', g1, 3) === gen.seq(gen.str('a'), g1, gen.str(3))
*/
export const seq = (...elements) =>
    elements.reduceRight((p, c) => next(c, p));

/**
    Map function `f` over each element produced by `p`.
*/
export const chain = (p, f) => {
    const loop = (r) => {
        if (r && r.rest) {
            const r2 = execute(f(r.first.x), r.first.s);
            if (r2 && r2.rest)
                return Yield(r2.first, () => loopInner(r2.rest(), r));
            return loop(r.rest(), k);
        }
        return r;
    };
    
    const loopInner = (r, r2) => {
        if (r && r.rest)
            return Yield(r.first, () => loopInner(r.rest(), r2));
        return loop(r2.rest());
    };

    return new Generador(s =>
        loop(execute(p, s)));
}

/**
    Map function `f` over each element produced by `p`.
*/
export const map = (p, f) =>
    chain(p, x => lit(f(x)));
        
/* Choice
 ******************************************************************************/
/**
    Choose from along one or more generators, each with its own custom weight.
*/
export const weightedChoice = (weightMap) => {
    const table = walker(arrayMap(weightMap, x => [x[0], wrap(x[1])]));
    return new Generador(s =>
        execute(table(s.random), s));
}; 

/**
     Choose from along one or more generators.
     
     Each element has the same weight.
     
     @param elements Array of elements
*/
export const choicea = (elements) =>
    weightedChoice(arrayMap(elements, x => [1, x]));

/**
     Choose from along one or more generators taken as arguments.
     
     @see choicea
*/
export const choice = (...elements) =>
    choicea(elements);

/**
    Generator that optionally produces a value.
*/
export const opt = choice.bind(null, empty);

/* Iteration
 ******************************************************************************/

/**
    Run a generator zero or more times.

    @param g Generator
    @param prob At each step, what is the probability that `g` is run.
        1 means that `g` is run infinity, while 0 means that `g` is never run.
*/
export const many = (g, prob = 0.5) => {
    if (prob > 1 || prob < 0) {
        throw {
            'name': "ManyRangeError",
            'message': "Probability must be between [0, 1]"
        };
    }
    if (prob === 0)
        return empty;
    else if (prob === 1) {
        let self;
        return self = seq(g, declare(() => self));
    }
    let self;
    return self = weightedChoice([
        [prob, seq(g, declare(() => self))],
        [1 - prob, empty]]);
};

/**
    Run a generator 1 or more times.
    
    @see many
*/
export const many1 = (g, prob = 0.5) =>
    seq(g, many(g, prob));

/* State
 ******************************************************************************/
const getState = new Generador(s =>
    Yield(Pair(s, s), _ => Done(s)));

const modifyState = f =>
    new Generador(s => Done(f(s)));

/**
    Lookup a stored variable.
    
    @param name Key of the var.
    @param def Value returned if the variable does not exist.
*/
export const get = (name, def = '') =>
    map(getState, s => State.getVar(s, name, def));

/**
    Lookup a stored variable.
    
    @param name Key of the var.
    @param def Value returned if the variable does not exist.
*/
export const set = (name, value) => 
    modifyState(s =>
        State.setVar(s, name, value));
        
/**
    Return the current user data.
*/
export const getUd = map(getState, s => s.ud);

/**
    Update the user data with function `f`.
    
    Does not yield any value.
*/
export const modifyUd = f =>
    modifyState(s => State.setUd(s, f(s.ud)));

/**
    Set the current user data.
    
    Does not yield any value.
*/
export const setUd = ud =>
    modifyUd(_ => ud);

/* Execution
 ******************************************************************************/
/**
    Begin the execution of a generator.
    
    @param g Generator.
    @param ud Optional user data threaded through the generator's states.
    @param r Random number generator.
    
    Returns a Javascript iterator.
*/
export const begin = function*(g, ud, random = defaultRandom) {
    const state = State.setRandom(State.setUd(State.empty, ud), random);
    for (let r = execute(g, state); r.rest; r = r.rest()) 
        yield r.first.x;
};

Generador.prototype.begin = function*(ud, random = defaultRandom) {
    yield* begin(this, ud, random);
};

/**
    Left fold over a generator.
    
    @param f Function taking accumulated value and current value.
    @param z Initial value.
    @param g Generator.
    @param ud Optional user data threaded through the generator's states.
    @param r Random number generator.
*/
export const fold = (f, z, g, ud, random = defaultRandom) => {
    for (const x of begin(g, ud, random))
        z = f(z, x);
    return z;
};

Generador.prototype.fold = (f, z, ud, random = defaultRandom) =>
    fold(f, z, this, ud, random);

/**
    Run a generator to completion, combining results into a string.
    
    @see exec
*/
export const run = fold.bind(null, (p, c) => p + c, '');

Generador.prototype.run = (ud, random = defaultRandom) =>
    run(this, ud, random);
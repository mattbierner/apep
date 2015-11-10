/**
    APEP
    
    Dada engine inspired library for random text generation.
*/
"use strict";
const walker = require('walker-sample');

const arrayMap = Function.prototype.call.bind(Array.prototype.map);

const add = (p, c) => p + c;

const id = x => x;

const EOF = _ => null;

const defaultRandom = Math.random;

/**
    Value state pair
*/
const Pair = (x, s) => ({ x: x, s: s });

/**
*/
const Generador = function(impl) {
    this._impl = impl;
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

const Yield = (first, rest) => ({
    first: first,
    rest: rest
});

/**
    Run a given generator.
*/
const execute = (p, s, k) =>
    p._impl(s, k);

/**
    Declare a generator for self reference or late bindings.
        
    @param def Function that takes a reference to generator being defined and
        returns the generator's definition.
        
    Anonymous self reference:
    
        pep.declare((self) =>
            pep.seq(m, self));
            
    Use of forward declarations:
    
        // Use `m` before it is declared or defined.
        const ms = pep.declare(() =>
            pep.seq(m, self));
            
        const m = pep.lit('n');
    
    Later declaration: 
    
        // Declare that the some generator `ms` will exist.
        let ms = pep.declare(() => ms);
        
        // Use `ms` in any expression.
        const p = pep.seq('a', ms);
        
        ...
        
        // Actually define `ms` sometime later.
        ms = pep.str('abc');

    Also can be used to introduce simple, scoped state:
        
        const counter = pep.declare(() => {
            // declare some variables local to this block.
            let sum = 0;

            return pep.seq(
                pep.seq(pep.str(1), pep.str(2), pep.str(3))
                    .map(x => {
                        // Update the state in an expression.
                        sum += i;
                        return x;
                    }),
                // and use the state sometime later.
                // Declare is used to make sure the current value of `i` is
                // always returned.
                pep.declare(() => pep.lit(i)));
        });
            
    For performance reasons, use declare around the smallest possible generator
    since declare evaluates it's body every time the generator is invoked. 
*/
export const declare = (def) => {
    let self;
    return self = new Generador((s, k) =>
        execute(def(self), s, k));
};
        
/* Value Generators
 ******************************************************************************/
/**
    Generate a literal value without any transformations applied.
*/
export const lit = (x) =>
    new Generador((s, k) =>
        Yield(Pair(x, s), k));
 
/**
    Empty value generator.
*/
export const empty = new Generador((s, k) =>
    k(s));

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
    x instanceof Generador
        ?x
        :Array.isArray(x) ? seqa(x) : str(x);  
      
/* Basic Combinators
 ******************************************************************************/
/**
    Run `a` and then `run b`.
*/
const next = (a, b) => {
    a = wrap(a);
    b = wrap(b);
    return new Generador((s, k) =>
        execute(a, s, s => execute(b, s, k)));
};

/**
    Run a sequence of generators left to right.
    
    Literal values are wrapped and converted to strings:
    
        seq('a', g1, 3) === seq(str('a'), g1, str(3))
*/
export const seqa = (generators) =>
    generators.reduceRight((p, c) => next(c, p), empty);

/**
    Same as `seqa` but takes values as arguments.
*/
export const seq = (...generators) => seqa(generators);

Generador.prototype.seq = function(...generators) {
    return seq(this, ...generators);
};

/**
    Map function `f` over each element produced by `p`.
*/
export const chain = (p, f) => {  
    p = wrap(p);
    
    const loop = (r, k) =>
        r && r.rest 
            ?execute(f(r.first.x), r.first.s, s => loop(r.rest(s), k))
            :k(r);
    
    return new Generador((s, k) =>
        loop(execute(p, s, id), k));
};

Generador.prototype.chain = function(f) {
    return chain(this, f);
};

/**
    Map function `f` over each element produced by `p`.
*/
export const map = (p, f) =>
    chain(p, x => lit(f(x)));
    
Generador.prototype.map = function(f) {
    return map(this, f);
};

/**
    Combine the yield results of 1 or more generators.
    
    @param f Accumulate function. Takes accumulated value and current value.
    @param z Initial value.
    @param generators One or more generators to combine.
*/
export const combine = (f, z, ...generators) => {
    const g = seq(...generators);
    return declare(() => {
        let sum = z;
        return seq(
            noop(g.map(x => {
                sum = f(sum, x);
                return x;
            })),
            declare(() => lit(sum)));
    });
};

Generador.prototype.combine = function(f, z, ...generators) {
    return combine(f, z, this, ...generators);
};

/**
    Combine the yielded results of generators into a single string result.
*/
export const join = combine.bind(null, add, '');

Generador.prototype.join = function(...generators) {
    return join(this, ...generators);
};

/**
    Combinator that consumes all yielded values.
    
    Still useful for updating state.
*/
export const noop = (...generators) =>
    chain(seq(...generators), _ => empty);

/* Choice
 ******************************************************************************/
/**
    Choose from along one or more generators, each with its own custom weight.
*/
export const weightedChoice = (weightMap) => {
    const table = walker(arrayMap(weightMap, x => [x[0], wrap(x[1])]));
    return new Generador((s, k) =>
        execute(table(s.random), s, k));
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
export const opt = (g, prob = 0.5) => {
    if (prob > 1 || prob < 0) {
        throw {
            'name': "ManyRangeError",
            'message': "Probability must be between [0, 1]"
        };
    }
    if (prob === 0)
        return empty;
    else if (prob === 1) 
        return g;
    return weightedChoice([[prob, g], [1 - prob, empty]]);
};
    
/* Iteration
 ******************************************************************************/
/**
    Run a generator zero or more times.

    @param g Generator
    @param prob At each step, what is the probability that `g` is run.
        1 means that `g` is run infinity, while 0 means that `g` is never run.
*/
export const many = (g, prob = 0.5) => {
    let self; 
    return self = opt(seq(g, declare(() => self)), prob);
};

/**
    Run a generator one or more times.
    
    @see many
*/
export const many1 = (g, prob = 0.5) =>
    seq(g, many(g, prob));

/* State
 ******************************************************************************/
const getState = new Generador((s, k) =>
    Yield(Pair(s, s), k));

const modifyState = f =>
    new Generador((s, k) => 
        k(f(s)));

/**
    Lookup a stored variable.
    
    @param name Key of the var.
    @param def Value returned if the variable does not exist.
*/
export const get = (name, def) =>
    map(getState, s => State.getVar(s, name, def === undefined ? '' : def));

/**
    Store the value of a variable.
    
    @param name Key of the var.
    @param value New value.
*/
export const set = (name, value) => 
    modify(name, _ => value);

/**
    Update the value of a variable.
    
    @param name Key of the var.
    @param f Map old value to new value value.
*/
export const modify = (name, f) => 
    modifyState(s =>
        State.setVar(s, name, f(State.getVar(s, name))));
      
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
export const begin = (g, ud, random = defaultRandom) => {
    let state = State.setRandom(State.setUd(State.empty, ud), random);
    let r = execute(g, state, EOF);
    var z = { 
        next: () => {
            if (r && r.rest) {
                const x = r.first.x;
                state = r.first.s;
                r = r.rest(state);
                return { value: x };
            }
            return { done: true };
        }
    };
    z[Symbol.iterator] = () => z;
    return z;
};

Generador.prototype.begin = function(ud, random = defaultRandom) {
    return begin(this, ud, random);
};

Generador.prototype[Symbol.iterator] = function() {
    return begin(this);
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
    let state = State.setRandom(State.setUd(State.empty, ud), random);
    for (let r = execute(g, state, EOF); r && r.rest; r = r.rest(state)) {
        z = f(z, r.first.x);
        state = r.first.s;
    }
    return z;
};

Generador.prototype.fold = function(f, z, ud, random = defaultRandom) {
    return fold(f, z, this, ud, random);
};

/**
    Run a generator to completion, combining results into a string.
    
    @see exec
*/
export const run = (g, ud, random = defaultRandom) =>
    fold(add, '', g, ud, random);

Generador.prototype.run = function(ud, random = defaultRandom) {
    return run(this, ud, random);
};
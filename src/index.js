/**
    APEN
    
    Dada engine inspired library.
*/
require("babel-polyfill");
const walker = require('walker-sample');

const randomInt = (min, max, r) =>
    Math.floor(r() * (max - min)) + min;

/**
    Pac
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
const State = (vars, ud) => ({
    'vars': vars,
    'ud': ud
});

State.empty = State({}, null);

State.setUd = (s, ud) =>
    State(s.vars, ud);

State.setVars = (s, vars) =>
    State(vars, s.ud);

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
export const execute = function*(p, s, r) {
    return yield* p.run()(s, r);
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
    return self = new Generador(() =>
        function*(s, r) {
            yield* execute(def(self), s, r);
        });
};

/**
    Generate a literal value without any transformations applied.
*/
export const lit = (x) =>
    new Generador(() =>
        function*(s, _) {
            const v = Pair(x, s);
            yield v;
            return v;
        });

/**
    Generate an empty value.
*/
export const empty = lit('');

/**
    Generate a literal string value.
    
    Attempts to convert the input value to a string.
*/
export const str = function(x) {
    return arguments.length === 0 ? empty : lit('' +  x);
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
    return new Generador(() =>
        function*(s1, r) {
            const {s} = yield* execute(a, s1, r);
            return yield* execute(b, s, r);
        });
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
export const map = (p, f) =>
    new Generador(() =>
        function*(s1, r) {
            let s = s1;
            for (let v of execute(p, s, r)) {
                s = v.s
                yield Pair(f(v.x), s);
            }
        });

/**
    Choose from along one or more generators, each with its own custom weight.
*/
export const weightedChoice = (weightMap) => {
    const table = walker(weightMap.map(x => [x[0], wrap(x[1])]));
    return new Generador(() =>
        function*(s, r) {
            const selected = table(r);
            return yield* execute(selected, s, r);
        });
};

/**
     Choose from along one or more generators, each with the same weight.
     
     @param elements Array of elements
*/
export const choicea = (elements) =>
    weightedChoice(elements.map(x => [1, x]));

/**
     Choose from along one or more generators taken as arguments.
*/
export const choice = (...elements) =>
    choicea(elements);

/**
    Begin the execution of a generator.
    
    @param g Generator.
    @param ud Optional user data threaded through the generator's states.
    @param r Random number generator.
*/
export const exec = function*(g, ud, r = Math.random) {
    for (let x of execute(g, State.setUd(State.empty, ud), r))
        yield x.x;
};

/**
    Left fold over a generator.
    
    @param f Function taking accumulated value and current value.
    @param z Initial value.
    @param g Generator.
    @param ud Optional user data threaded through the generator's states.
    @param r Random number generator.
*/
export const fold = (f, z, g, ud, r = Math.random) => {
    for (const x of exec(g, ud, r))
        z = f(z, x);
    return z;
};

/**
    Run a generator to completion, combining results into a string.
    
    @see exec
*/
export const run = fold.bind(null, (p, c) => p + c, '');
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/**
    APEN
    
    Dada engine inspired library for random text generation.
*/
require("babel-polyfill");
var walker = require('walker-sample');

var arrayMap = Function.prototype.call.bind(Array.prototype.map);

var defaultRandom = Math.random;

/**
    Value state pair
*/
var Pair = function Pair(x, s) {
    return {
        'x': x,
        's': s
    };
};

/**
*/
var Generador = function Generador(run) {
    this.run = run;
};

/**
    Internal state object.
*/
var State = function State(random, vars, ud) {
    return {
        'random': random,
        'vars': vars,
        'ud': ud
    };
};

State.empty = State(defaultRandom, {}, null);

State.setUd = function (s, ud) {
    return State(s.random, s.vars, ud);
};

State.setVars = function (s, vars) {
    return State(s.random, vars, s.ud);
};

State.setRandom = function (s, random) {
    return State(random, s.vars, s.ud);
};

State.getVar = function (s, name, def) {
    return s.vars.hasOwnProperty(name) ? s.vars[name] : def;
};

State.setVar = function (s, name, value) {
    var newVars = Object.create(s.vars);
    newVars[name] = value;
    return State.setVars(s, newVars);
};

/**
    Run a given generator.
*/
var execute = exports.execute = function execute(p, s) {
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
var declare = exports.declare = function declare(def) {
    var self = undefined;
    return self = new Generador(function (s) {
        return execute(def(self), s);
    });
};

var Yield = function Yield(first, rest) {
    return {
        first: first,
        rest: rest,
        '_yield': true
    };
};

var Done = function Done(first) {
    return {
        'first': first,
        'rest': null,
        '_yield': true
    };
};

/**
    Generate a literal value without any transformations applied.
*/
var lit = exports.lit = function lit(x) {
    return new Generador(function (s) {
        return Yield(Pair(x, s), function (_) {
            return Done(s);
        });
    });
};

/**
    Empty value generator.
*/
var empty = exports.empty = new Generador(Done);

/**
    Generate a literal string value.
    
    Attempts to convert the input value to a string.
*/
var str = exports.str = function str(x) {
    return arguments.length === 0 ? lit('') : lit('' + x);
};

/**
    Ensure value is inside a generator.
    
    Convert any literals into string literals.
*/
var wrap = exports.wrap = function wrap(x) {
    return x instanceof Generador ? x : str(x);
};

/**
    Run `a` and then `run b`.
*/
var next = exports.next = function next(a, b) {
    a = wrap(a);
    b = wrap(b);
    var loop = function loop(r) {
        if (r && r.rest) return Yield(r.first, function () {
            return loop(r.rest());
        });
        return execute(b, r.first);
    };

    return new Generador(function (s) {
        return loop(execute(a, s));
    });
};

/**
    Run a sequence of generators left to right.
    
    Literal values are wrapped and converted to strings:
    
        gen.seq('a', g1, 3) === gen.seq(gen.str('a'), g1, gen.str(3))
*/
var seq = exports.seq = function seq() {
    for (var _len = arguments.length, elements = Array(_len), _key = 0; _key < _len; _key++) {
        elements[_key] = arguments[_key];
    }

    return elements.reduceRight(function (p, c) {
        return next(c, p);
    });
};

/**
    Map function `f` over each element produced by `p`.
*/
var chain = exports.chain = function chain(p, f) {
    var loop = function loop(r) {
        if (r && r.rest) {
            var _ret = (function () {
                var r2 = execute(f(r.first.x), r.first.s);
                if (r2 && r2.rest) return {
                        v: Yield(r2.first, function () {
                            return loopInner(r2.rest(), r);
                        })
                    };
                return {
                    v: loop(r.rest(), k)
                };
            })();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
        return r;
    };

    var loopInner = function loopInner(r, r2) {
        if (r && r.rest) return Yield(r.first, function () {
            return loopInner(r.rest(), r2);
        });
        return loop(r2.rest());
    };

    return new Generador(function (s) {
        return loop(execute(p, s));
    });
};

/**
    Map function `f` over each element produced by `p`.
*/
var map = exports.map = function map(p, f) {
    return chain(p, function (x) {
        return lit(f(x));
    });
};

/* Choice
 ******************************************************************************/
/**
    Choose from along one or more generators, each with its own custom weight.
*/
var weightedChoice = exports.weightedChoice = function weightedChoice(weightMap) {
    var table = walker(arrayMap(weightMap, function (x) {
        return [x[0], wrap(x[1])];
    }));
    return new Generador(function (s) {
        return execute(table(s.random), s);
    });
};

/**
     Choose from along one or more generators.
     
     Each element has the same weight.
     
     @param elements Array of elements
*/
var choicea = exports.choicea = function choicea(elements) {
    return weightedChoice(arrayMap(elements, function (x) {
        return [1, x];
    }));
};

/**
     Choose from along one or more generators taken as arguments.
     
     @see choicea
*/
var choice = exports.choice = function choice() {
    for (var _len2 = arguments.length, elements = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        elements[_key2] = arguments[_key2];
    }

    return choicea(elements);
};

/**
    Generator that optionally produces a value.
*/
var opt = exports.opt = choice.bind(null, empty);

/* Iteration
 ******************************************************************************/

/**
    Run a generator zero or more times.

    @param g Generator
    @param prob At each step, what is the probability that `g` is run.
        1 means that `g` is run infinity, while 0 means that `g` is never run.
*/
var many = exports.many = function many(g) {
    var prob = arguments.length <= 1 || arguments[1] === undefined ? 0.5 : arguments[1];

    if (prob > 1 || prob < 0) {
        throw {
            'name': "ManyRangeError",
            'message': "Probability must be between [0, 1]"
        };
    }
    if (prob === 0) return empty;else if (prob === 1) {
        var _ret2 = (function () {
            var self = undefined;
            return {
                v: self = seq(g, declare(function () {
                    return self;
                }))
            };
        })();

        if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
    }
    var self = undefined;
    return self = weightedChoice([[prob, seq(g, declare(function () {
        return self;
    }))], [1 - prob, empty]]);
};

/**
    Run a generator 1 or more times.
    
    @see many
*/
var many1 = exports.many1 = function many1(g) {
    var prob = arguments.length <= 1 || arguments[1] === undefined ? 0.5 : arguments[1];
    return seq(g, many(g, prob));
};

/* State
 ******************************************************************************/
var getState = new Generador(function (s) {
    return Yield(Pair(s, s), function (_) {
        return Done(s);
    });
});

var modifyState = function modifyState(f) {
    return new Generador(function (s) {
        return Done(f(s));
    });
};

/**
    Lookup a stored variable.
    
    @param name Key of the var.
    @param def Value returned if the variable does not exist.
*/
var get = exports.get = function get(name) {
    var def = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
    return map(getState, function (s) {
        return State.getVar(s, name, def);
    });
};

/**
    Lookup a stored variable.
    
    @param name Key of the var.
    @param def Value returned if the variable does not exist.
*/
var set = exports.set = function set(name, value) {
    return modifyState(function (s) {
        return State.setVar(s, name, value);
    });
};

/**
    Return the current user data.
*/
var getUd = exports.getUd = map(getState, function (s) {
    return s.ud;
});

/**
    Update the user data with function `f`.
    
    Does not yield any value.
*/
var modifyUd = exports.modifyUd = function modifyUd(f) {
    return modifyState(function (s) {
        return State.setUd(s, f(s.ud));
    });
};

/**
    Set the current user data.
    
    Does not yield any value.
*/
var setUd = exports.setUd = function setUd(ud) {
    return modifyUd(function (_) {
        return ud;
    });
};

/* Execution
 ******************************************************************************/
/**
    Begin the execution of a generator.
    
    @param g Generator.
    @param ud Optional user data threaded through the generator's states.
    @param r Random number generator.
    
    Returns a Javascript iterator.
*/
var begin = exports.begin = regeneratorRuntime.mark(function begin(g, ud) {
    var random = arguments.length <= 2 || arguments[2] === undefined ? defaultRandom : arguments[2];
    var state, r;
    return regeneratorRuntime.wrap(function begin$(_context) {
        while (1) switch (_context.prev = _context.next) {
            case 0:
                state = State.setRandom(State.setUd(State.empty, ud), random);
                r = execute(g, state);

            case 2:
                if (!r.rest) {
                    _context.next = 8;
                    break;
                }

                _context.next = 5;
                return r.first.x;

            case 5:
                r = r.rest();
                _context.next = 2;
                break;

            case 8:
            case 'end':
                return _context.stop();
        }
    }, begin, this);
});

Generador.prototype.begin = regeneratorRuntime.mark(function _callee(ud) {
    var random = arguments.length <= 1 || arguments[1] === undefined ? defaultRandom : arguments[1];
    return regeneratorRuntime.wrap(function _callee$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
            case 0:
                return _context2.delegateYield(begin(this, ud, random), 't0', 1);

            case 1:
            case 'end':
                return _context2.stop();
        }
    }, _callee, this);
});

/**
    Left fold over a generator.
    
    @param f Function taking accumulated value and current value.
    @param z Initial value.
    @param g Generator.
    @param ud Optional user data threaded through the generator's states.
    @param r Random number generator.
*/
var fold = exports.fold = function fold(f, z, g, ud) {
    var random = arguments.length <= 4 || arguments[4] === undefined ? defaultRandom : arguments[4];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = begin(g, ud, random)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var x = _step.value;

            z = f(z, x);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return z;
};

Generador.prototype.fold = function (f, z, ud) {
    var random = arguments.length <= 3 || arguments[3] === undefined ? defaultRandom : arguments[3];
    return fold(f, z, undefined, ud, random);
};

/**
    Run a generator to completion, combining results into a string.
    
    @see exec
*/
var run = exports.run = fold.bind(null, function (p, c) {
    return p + c;
}, '');

Generador.prototype.run = function (ud) {
    var random = arguments.length <= 1 || arguments[1] === undefined ? defaultRandom : arguments[1];
    return run(undefined, ud, random);
};
//# sourceMappingURL=index.js.map

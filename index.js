'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
    APEN
    
    Dada engine inspired library.
*/
require("babel-polyfill");
var walker = require('walker-sample');

var randomInt = function randomInt(min, max, r) {
    return Math.floor(r() * (max - min)) + min;
};

/**
    Pac
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
var State = function State(vars, ud) {
    return {
        'vars': vars,
        'ud': ud
    };
};

State.empty = State({}, null);

State.setUd = function (s, ud) {
    return State(s.vars, ud);
};

State.setVars = function (s, vars) {
    return State(vars, s.ud);
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
var execute = exports.execute = regeneratorRuntime.mark(function execute(p, s, r) {
    return regeneratorRuntime.wrap(function execute$(_context) {
        while (1) switch (_context.prev = _context.next) {
            case 0:
                return _context.delegateYield(p.run()(s, r), 't0', 1);

            case 1:
                return _context.abrupt('return', _context.t0);

            case 2:
            case 'end':
                return _context.stop();
        }
    }, execute, this);
});

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
    return self = new Generador(function () {
        return regeneratorRuntime.mark(function _callee(s, r) {
            return regeneratorRuntime.wrap(function _callee$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                        return _context2.delegateYield(execute(def(self), s, r), 't0', 1);

                    case 1:
                    case 'end':
                        return _context2.stop();
                }
            }, _callee, this);
        });
    });
};

/**
    Generate a literal value without any transformations applied.
*/
var lit = exports.lit = function lit(x) {
    return new Generador(function () {
        return regeneratorRuntime.mark(function _callee2(s, _) {
            var v;
            return regeneratorRuntime.wrap(function _callee2$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                    case 0:
                        v = Pair(x, s);
                        _context3.next = 3;
                        return v;

                    case 3:
                        return _context3.abrupt('return', v);

                    case 4:
                    case 'end':
                        return _context3.stop();
                }
            }, _callee2, this);
        });
    });
};

/**
    Generate an empty value.
*/
var empty = exports.empty = lit('');

/**
    Generate a literal string value.
    
    Attempts to convert the input value to a string.
*/
var str = exports.str = function str(x) {
    return arguments.length === 0 ? empty : lit('' + x);
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
    return new Generador(function () {
        return regeneratorRuntime.mark(function _callee3(s1, r) {
            var _ref, s;

            return regeneratorRuntime.wrap(function _callee3$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                        return _context4.delegateYield(execute(a, s1, r), 't0', 1);

                    case 1:
                        _ref = _context4.t0;
                        s = _ref.s;
                        return _context4.delegateYield(execute(b, s, r), 't1', 4);

                    case 4:
                        return _context4.abrupt('return', _context4.t1);

                    case 5:
                    case 'end':
                        return _context4.stop();
                }
            }, _callee3, this);
        });
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
*/
var map = exports.map = function map(p, f) {
    return new Generador(function () {
        return regeneratorRuntime.mark(function _callee4(s1, r) {
            var s, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, v;

            return regeneratorRuntime.wrap(function _callee4$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                    case 0:
                        s = s1;
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context5.prev = 4;
                        _iterator = execute(p, s, r)[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context5.next = 14;
                            break;
                        }

                        v = _step.value;

                        s = v.s;
                        _context5.next = 11;
                        return Pair(f(v.x), s);

                    case 11:
                        _iteratorNormalCompletion = true;
                        _context5.next = 6;
                        break;

                    case 14:
                        _context5.next = 20;
                        break;

                    case 16:
                        _context5.prev = 16;
                        _context5.t0 = _context5['catch'](4);
                        _didIteratorError = true;
                        _iteratorError = _context5.t0;

                    case 20:
                        _context5.prev = 20;
                        _context5.prev = 21;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 23:
                        _context5.prev = 23;

                        if (!_didIteratorError) {
                            _context5.next = 26;
                            break;
                        }

                        throw _iteratorError;

                    case 26:
                        return _context5.finish(23);

                    case 27:
                        return _context5.finish(20);

                    case 28:
                    case 'end':
                        return _context5.stop();
                }
            }, _callee4, this, [[4, 16, 20, 28], [21,, 23, 27]]);
        });
    });
};

/**
    Choose from along one or more generators, each with its own custom weight.
*/
var weightedChoice = exports.weightedChoice = function weightedChoice(weightMap) {
    var table = walker(weightMap);
    return new Generador(function () {
        return regeneratorRuntime.mark(function _callee5(s, r) {
            var selected;
            return regeneratorRuntime.wrap(function _callee5$(_context6) {
                while (1) switch (_context6.prev = _context6.next) {
                    case 0:
                        selected = table(r);
                        return _context6.delegateYield(execute(selected, s, r), 't0', 2);

                    case 2:
                        return _context6.abrupt('return', _context6.t0);

                    case 3:
                    case 'end':
                        return _context6.stop();
                }
            }, _callee5, this);
        });
    });
};

/**
     Choose from along one or more generators, each with the same weight.
*/
var choice = exports.choice = function choice() {
    for (var _len2 = arguments.length, elements = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        elements[_key2] = arguments[_key2];
    }

    return weightedChoice(elements.map(function (x) {
        return [1, x];
    }));
};

/**
    Begin the execution of a generator.
    
    @param g Generator.
    @param ud Optional user data threaded through the generator's states.
    @param r Random number generator.
*/
var exec = exports.exec = regeneratorRuntime.mark(function exec(g, ud) {
    var r = arguments.length <= 2 || arguments[2] === undefined ? Math.random : arguments[2];

    var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, x;

    return regeneratorRuntime.wrap(function exec$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
            case 0:
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context7.prev = 3;
                _iterator2 = execute(g, State.setUd(State.empty, ud), r)[Symbol.iterator]();

            case 5:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                    _context7.next = 12;
                    break;
                }

                x = _step2.value;
                _context7.next = 9;
                return x.x;

            case 9:
                _iteratorNormalCompletion2 = true;
                _context7.next = 5;
                break;

            case 12:
                _context7.next = 18;
                break;

            case 14:
                _context7.prev = 14;
                _context7.t0 = _context7['catch'](3);
                _didIteratorError2 = true;
                _iteratorError2 = _context7.t0;

            case 18:
                _context7.prev = 18;
                _context7.prev = 19;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }

            case 21:
                _context7.prev = 21;

                if (!_didIteratorError2) {
                    _context7.next = 24;
                    break;
                }

                throw _iteratorError2;

            case 24:
                return _context7.finish(21);

            case 25:
                return _context7.finish(18);

            case 26:
            case 'end':
                return _context7.stop();
        }
    }, exec, this, [[3, 14, 18, 26], [19,, 21, 25]]);
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
    var r = arguments.length <= 4 || arguments[4] === undefined ? Math.random : arguments[4];
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = exec(g, ud, r)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var x = _step3.value;

            z = f(z, x);
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return z;
};

/**
    Run a generator to completion, combining results into a string.
    
    @see exec
*/
var run = exports.run = fold.bind(null, function (p, c) {
    return p + c;
}, '');
//# sourceMappingURL=index.js.map

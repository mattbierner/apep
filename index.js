'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
require("babel-polyfill");

var randomInt = function randomInt(min, max, r) {
    return Math.floor(r() * (max - min)) + min;
};

/**
    Walker's alias method for random objects with different probabilities.
    http://code.activestate.com/recipes/576564-walkers-alias-method-for-random-objects-with-diffe/
*/
var buildWalkerTable = exports.random = function (weightMap) {
    var n = weightMap.length;
    var sum = weightMap.reduce(function (p, c) {
        return p + c[0];
    }, 0);
    var weights = weightMap.map(function (x) {
        return x[0] * n / sum;
    });

    var shorts = weights.filter(function (x) {
        return x < 1;
    });
    var longs = weights.filter(function (x) {
        return x > 1;
    });
    var inx = Array.from(Array(n)).map(function (_) {
        return -1;
    });
    while (shorts.length && longs.length) {
        var j = shorts.pop();
        var k = longs[longs.length - 1];
        inx[j] = k;
        weights[k] -= 1 - weights[j];
        if (weights[k] < 1) {
            shorts.push(k);
            longs.pop();
        }
    }

    return function (r) {
        var u = r();
        var j = randomInt(0, n, r);
        var k = u <= weights[j] ? j : inx[j];
        console.log(k, weightMap[k]);
        return weightMap[k][1];
    };
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
var execute = exports.execute = regeneratorRuntime.mark(function execute(p, s, r) {
    return regeneratorRuntime.wrap(function execute$(_context) {
        while (1) switch (_context.prev = _context.next) {
            case 0:
                return _context.delegateYield(p()(s, r), 't0', 1);

            case 1:
                return _context.abrupt('return', _context.t0);

            case 2:
            case 'end':
                return _context.stop();
        }
    }, execute, this);
});

/**
    Declare a generator for self reference or for forward references.
    
    @param def Function that takes a reference to generator being defined and
        returns the generator's definition.
*/
var declare = exports.declare = function declare(def) {
    return regeneratorRuntime.mark(function self(s, r) {
        return regeneratorRuntime.wrap(function self$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
                case 0:
                    return _context2.delegateYield(execute(def(self), s, r), 't0', 1);

                case 1:
                case 'end':
                    return _context2.stop();
            }
        }, self, this);
    });
};

/**
    Generate a literal value without any transformations applied
*/
var lit = exports.lit = function lit(x) {
    return function () {
        return regeneratorRuntime.mark(function _callee(s, _) {
            var v;
            return regeneratorRuntime.wrap(function _callee$(_context3) {
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
            }, _callee, this);
        });
    };
};

/**
    Generate a literal string value. Attempts to convert the input value to 
    a string.
*/
var str = exports.str = function str(x) {
    return lit('' + (arguments.length === 0 ? '' : x));
};

/**
    Ensure value is inside a generator.
    
    Convert any literals into string literals.
*/
var wrap = exports.wrap = function wrap(x) {
    return typeof x === 'function' ? x : str(x);
};

/**
*/
var next = exports.next = function next(a, b) {
    a = wrap(a);
    b = wrap(b);
    return function () {
        return regeneratorRuntime.mark(function _callee2(s1, r) {
            var _ref, s;

            return regeneratorRuntime.wrap(function _callee2$(_context4) {
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
            }, _callee2, this);
        });
    };
};

/**
*/
var seq = exports.seq = function seq() {
    for (var _len = arguments.length, elements = Array(_len), _key = 0; _key < _len; _key++) {
        elements[_key] = arguments[_key];
    }

    return elements.map(wrap).reduceRight(function (p, c) {
        return next(c, p);
    });
};

/**
*/
var map = exports.map = function map(p, f) {
    return function () {
        return regeneratorRuntime.mark(function _callee3(s1, r) {
            var s, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, v;

            return regeneratorRuntime.wrap(function _callee3$(_context5) {
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
            }, _callee3, this, [[4, 16, 20, 28], [21,, 23, 27]]);
        });
    };
};

/**
    Choose from along one or more generators, each with its own custom weight.
*/
var weightedChoice = exports.weightedChoice = function weightedChoice(weightMap) {
    var walker = buildWalkerTable(weightMap);
    return function () {
        return regeneratorRuntime.mark(function _callee4(s, r) {
            var selected;
            return regeneratorRuntime.wrap(function _callee4$(_context6) {
                while (1) switch (_context6.prev = _context6.next) {
                    case 0:
                        selected = walker(r);
                        return _context6.delegateYield(execute(selected, s, r), 't0', 2);

                    case 2:
                        return _context6.abrupt('return', _context6.t0);

                    case 3:
                    case 'end':
                        return _context6.stop();
                }
            }, _callee4, this);
        });
    };
};

/**
     Choose from along one or more generators, each with the same weight.
*/
var choice = exports.choice = function choice() {
    for (var _len2 = arguments.length, elements = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        elements[_key2] = arguments[_key2];
    }

    return weightedChoice(elements.map(function (x, i) {
        return [1, x];
    }));
};

/**
*/
var exec = exports.exec = regeneratorRuntime.mark(function exec(p, ud) {
    var r = arguments.length <= 2 || arguments[2] === undefined ? Math.random : arguments[2];
    return regeneratorRuntime.wrap(function exec$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
            case 0:
                return _context7.delegateYield(execute(p, { data: ud }, r), 't0', 1);

            case 1:
            case 'end':
                return _context7.stop();
        }
    }, exec, this);
});

/**
*/
var run = exports.run = regeneratorRuntime.mark(function run(p, ud) {
    var r = arguments.length <= 2 || arguments[2] === undefined ? Math.random : arguments[2];

    var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, x;

    return regeneratorRuntime.wrap(function run$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
            case 0:
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context8.prev = 3;
                _iterator2 = exec(p, ud, r)[Symbol.iterator]();

            case 5:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                    _context8.next = 12;
                    break;
                }

                x = _step2.value;
                _context8.next = 9;
                return x.x;

            case 9:
                _iteratorNormalCompletion2 = true;
                _context8.next = 5;
                break;

            case 12:
                _context8.next = 18;
                break;

            case 14:
                _context8.prev = 14;
                _context8.t0 = _context8['catch'](3);
                _didIteratorError2 = true;
                _iteratorError2 = _context8.t0;

            case 18:
                _context8.prev = 18;
                _context8.prev = 19;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }

            case 21:
                _context8.prev = 21;

                if (!_didIteratorError2) {
                    _context8.next = 24;
                    break;
                }

                throw _iteratorError2;

            case 24:
                return _context8.finish(21);

            case 25:
                return _context8.finish(18);

            case 26:
            case 'end':
                return _context8.stop();
        }
    }, run, this, [[3, 14, 18, 26], [19,, 21, 25]]);
});
//# sourceMappingURL=index.js.map

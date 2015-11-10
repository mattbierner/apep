# ChangeLog #

## 1.1.0 - Nov 10, 2015
* Added `seqa` generator.
** Same as `seq` but takes an array of generators.
* Use array literals to express sequences in grammars:
** `pep.choice(['a', 3], ['b', 4])` Yields either 'a' then '3', or 'b' then '4'.

## 1.0.3 - Nov 9, 2015
* Further perf improvements for `run`.

## 1.0.2 - Nov 9, 2015
* Perf improvements and internal cleanup.
* Remove need for babel-polyfill dep.
* Allow generators to be directly as iterators.
** `Array.from(pep.seq(1, 2, 3)) === ['1', '2', '3']

## 1.0.1 - Nov 8, 2015
* Corrected babel-polyfill being listed as a dev dep.

## 1.0.0 - Nov 8, 2015
* Real initial release.

## 0.0.0 - Nov 7, 2015
* Initial Release

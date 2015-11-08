<div align="center" >
    <img src="" alt="Apep" />
</div>

Apep is a Javascript text generation library influenced by the [Dada Engine][dada].

```javascript
// Generate quips for hacker on a TV show.
// Said hacker should be frantically mashing keys while saying these.
const pep = require('apep');

// declare allows for forward references
const tvHackerQuip = pep.declare(() =>
    pep.seq(exlaimation, ' ',
        pep.choice(
            pep.seq('The ' , subject, " is ", somethingBad, "!"),
            pep.seq(evilDoer, ' ', doingSomthingBad, " the ", target, "!"))));

const evilDoer = pep.choice("She's", "He's", "They're");

const subject = pep.choice('CPU', 'internet', 'GUI', 'IPv6', 'file system', 'access control list');

const somethingBad = pep.choice('on fire', 'doxxed', 'SQL injected', 'double encrypted');

const doingSomthingBad = pep.choice('pinging', 'ROT13ing', 'seg faulting', 'doxxing', 'DDOSing');

const target = pep.choice('NSA', 'CIA', 'FBI', 'mainframe', 'shell', 'cloud');

const exlaimation = pep.choice('BLARK!', 'ARG!', 'BARF!', 'GROK!', 'ACK!')

// Regnerate some output
for (var i = 0; i < 10; ++i)
    console.log(pep.run(tvHackerQuip))
```

Which outputs:

```
BLARK! The GUI is double encrypted!
BLARK! They're seg faulting the NSA!
ACK! The file system is double encrypted!
GROK! He's pinging the mainframe!
BLARK! The GUI is on fire!
GROK! She's seg faulting the CIA!
BARF! He's ROT13ing the mainframe!
ACK! She's DDOSing the cloud!
GROK! He's seg faulting the NSA!
ACK! The internet is doxxed!
```

Apep provides a small set of combinators, from which fairly complex grammers can be constructed. All grammers are specified directly in Javascript.

### Links
* [Documentation][documentation]


# Usage


```
$ npm install apep
```

[documentation]: https://github.com/mattbierner/bennu/wiki
[CombinatorialParsers]: http://en.wikipedia.org/wiki/Parser_combinator
[Parsatron]: https://github.com/youngnh/parsatron
[Parsec]: http://legacy.cs.uu.nl/daan/parsec.html
[parse-ecma]: https://github.com/mattbierner/parse-ecma
[parse-re]: https://github.com/mattbierner/parse-re
[parse-pn]: https://github.com/mattbierner/parse-pn
[parse-ecma-incremental]: https://github.com/mattbierner/parse-ecma-incremental
[khepri]: https://github.com/mattbierner/khepri
[seshet]: https://github.com/mattbierner/seshet

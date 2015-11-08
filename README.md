<div align="center" >
    <img src="https://raw.githubusercontent.com/mattbierner/apep/master/documentation/apep.png" alt="Apep" />
</div>

Javascript text generation library influenced by the [Dada Engine][dada].

```javascript
// Generate quips for a hacker on a TV show.
const pep = require('apep');

// Declare allows for forward references
const tvHackerQuip = pep.declare(() =>
    pep.seq(exlaimation, ' ',
        pep.choice(
            pep.seq('The ' , subject, " is ", somethingBad, "!"),
            pep.seq(evilDoer, ' ', doingSomthingBad, " the ", target, "!"))));

const evilDoer = pep.choice("She's", "He's", "They're");

const subject = pep.choice('CPU', 'HTML', 'GUI', 'IPv6', 'file system', 'ACL');

const somethingBad = pep.choice('on fire', 'doxxed', 'SQL injected', 'double encrypted');

const doingSomthingBad = pep.choice('pinging', 'ROT13ing', 'seg faulting', 'doxxing', 'DDOSing');

const target = pep.choice('NSA', 'CIA', 'FBI', 'mainframe', 'shell', 'cloud');

const exlaimation = pep.seq(
    pep.choice('BLARK', 'ARG', 'BARF', 'GROK', 'ACK'),
    pep.many1('!'));

// Generate some output
for (var i = 0; i < 10; ++i)
    console.log(pep.run(tvHackerQuip))
```

Which outputs:

```
ACK! The CPU is double encrypted!
GROK! She's pinging the FBI!
ARG!! They're doxxing the mainframe!
ARG!!! They're ROT13ing the shell!
BARF!! He's doxxing the mainframe!
BARF! The HTML is SQL injected!
ACK!!! The file system is on fire!
BLARK!!! He's DDOSing the shell!
ARG!!!! The IPv6 is on fire!
GROK! He's seg faulting the NSA!
```

Apep provides a small set of combinators, from which fairly complex grammers can be constructed. All grammers are specified directly in Javascript.

### Links

```sh
$ npm install apep
```

* [Documentation][documentation]



### Contributing



[documentation]: https://github.com/mattbierner/apep/wiki
[dada]: http://dev.null.org/dadaengine/

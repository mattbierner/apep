/**
    Example test generator ported from the Dada engine examples 
*/
"use strict";
const pep = require('../index');


const question = pep.declare(() =>
    pep.choice(
        question2,
        pep.seq(question2, "Be sure to refer to ", issue, " in your answer. "),
        pep.seq(question2, "Include ", evidenceType)));
 
const question2 = pep.declare(() =>
    pep.choice(
        pep.seq("Compute the ", somethingOf, " of ", something, ". "),
        pep.seq("Are ", plural, " ", classification, "? Discuss. "),
        pep.seq("Is ", singular, " ", classification, "? Discuss. "),
        pep.seq("Express ", something, " in ", expressInWhat, ". "),
        pep.seq("Show that the ", somethingOf, " of ", something, " is ", result, ". ")));

const issue = pep.declare(() =>
    pep.choice(
        pep.seq(theoremSource, "'s Theorem"),
        pep.seq(theoryType, " theory"),
        pep.seq("Plutonium Atom Totality"),
        pep.seq("the ", ordinal, " law of ", lawOfThis)));

const theoremSource = pep.choice("Godel", "Wibbel", "Abian", "Turing", "Euler", "Fermat", "Bell");

const theoryType = pep.choice("game", "set", "match", "interstice", "information", "ring", "group", "graph");

const lawOfThis = pep.choice("thermodynamics", "conservation of matter", "gravity");

const expressInWhat = pep.declare(() =>
    pep.choice(
        "canonical form",
        "normal form",
        pep.seq("the ", tag, " domain")));

const somethingOf = pep.declare(() =>
    pep.choice(
        somethingOf2,
        pep.seq(adjective, " ", somethingOf2),
        pep.seq(tag, "-", somethingOf2))) ;

const adjective = pep.choice("canonical", "minimal", "maximal", "inverse");

const somethingOf2 = pep.choice("closure",  "determinant", "matrix", "path", "correlation");

const plural = pep.declare(() =>
    pep.seq(adjective, " ", plural2));

const plural2 = pep.choice("trees", "matrices");

const singular = pep.declare(() =>
    pep.seq(adjective, " ", singular2));

const singular2 = pep.choice("search", "factorisation");

const result = pep.declare(() =>
    pep.choice(
        number,
        "{ }",
        "infinity",
        "uncomputable",
        "the null set"));

const evidenceType = pep.choice("flowcharts", "Feynman diagrams", "Venn diagrams");

const something = pep.declare(() =>
    pep.choice(number, setOfNumbers));

const setOfNumbers = pep.declare(() =>
    pep.seq("{ ", numbers, " } "));

const numbers = pep.declare(() =>
    pep.choice(
        pep.seq(number, " ", numbers),
        number));

const number = pep.declare(() =>
    pep.choice(
        pep.seq(digit, number),
        digit));

const digit = pep.choicea("0123456789");

const classification = pep.declare(() =>
    pep.seq(tag, "-complete"));

// a tag, used to make concepts seem more intimidating

const tag = pep.declare(() =>
    pep.choice(
        greekLetter,
        romanLetter,
        pep.seq(romanLetter, romanLetter)));

const romanLetter = pep.choicea("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

const greekLetter = pep.choice("alpha", "beta", "gamma", "delta", "epsilon",
    "lambda", "sigma", "theta", "phi", "rho", "omega");

const ordinal = pep.choice("first", "second", "third", "fourth", "fifth");




console.log(pep.run(question))
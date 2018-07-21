# @phenomnomnominal/parameterised

[![npm version](https://img.shields.io/npm/v/@phenomnomnominal/parameterised.svg)](https://img.shields.io/npm/v/@phenomnomnominal/parameterised.svg)
[![Code Climate](https://codeclimate.com/github/phenomnomnominal/parameterised/badges/gpa.svg)](https://codeclimate.com/github/phenomnomnominal/parameterised)
[![Test Coverage](https://codeclimate.com/github/phenomnomnominal/parameterised/coverage.svg)](https://codeclimate.com/github/phenomnomnominal/parameterised/coverage)

A little tool to create parameterised tests from [Markdown(ish) tables](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#tables)!

## Installation

```zsh
npm install @phenomnomnominal/parameterised --save-dev
```

## Parameterised testing

When writing unit tests, sometimes it is useful to do something like the following:

```javascript
[
    { a: 1, b: 2, expected: 3 },
    { a: -1, b: 1, expected: 0 },
    { a: 2.5, b: 2.5, expected: 5 }
].forEach(test => {
    const { a, b, expected } = test;
    assert(a + b === expected);
});
```

That works well, but wouldn't it be nice to be able to format that in a slightly more readable way? Enter **`parameterised`**!

```javascript
import { parameterised } from '@phenomnomnominal/parameterised';

parameterised`

    |  a  |  b  | expected |
    |  1  |  2  |    3     |
    |  -1 |  1  |    0     |
    | 2.5 | 2.5 |    5     |

`.forEach(test => {
    const { a, b, expected } = test;
    assert(a + b === expected);
});
```

## Examples:

**`parameterised`** can handle a bunch of different values:

```javascript
parameterised`

    |      param1       |   param2    |   param3  |
    | 1                 | 2           | 3         |
    | "hello"           | a string    | ""        |
    | {"foo":"bar"}     | undefined   | NaN       |
    | ${{ baz: 'qux' }} | Infinity    | [0,1,2]   |
    | ${new Date()}     | ${'string'} | 2e2       |
    | null              | 0.00000001  | ${9**9}   |

`;
```
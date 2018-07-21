// Test Utilities:
import * as chai from 'chai';

// Test setup:
let { expect } = chai;

// Under test:
import { parameterised } from './index';

describe('parameterised:', () => {
    describe('parameterised - headers:', () => {
        it('should parse headers', () => {
            const [test] = parameterised`
                | param1 | param2 | param3 | param4 |
                | 1      | 2      | 3      | 6      |
            `;

            expect(Object.keys(test)).to.deep.equal(['param1', 'param2', 'param3', 'param4']);
        });

        it('should parse interpolated headers', () => {
            const header = 'param4';
            const [test] = parameterised`
                | param1 | param2 | param3 | ${header} |
                | 1      | 2      | 3      | 6         |
            `;

            expect(Object.keys(test)).to.deep.equal(['param1', 'param2', 'param3', 'param4']);
        });
    });

    describe('parameterised - test parameters:', () => {
        it('should parse valid JSON values', () => {
            const [test1, test2, test3, test4] = parameterised`
                |     param1    |   param2  |  param3  |
                | 1             | 2e2       | 0.000001 |
                | "hello"       | ""        | \'\'     |
                | true          | false     | null     |
                | {"foo":"bar"} | [0,1,2]   | null     |
            `;

            expect(Object.values(test1)).to.deep.equal([1, 200, 0.000001]);
            expect(Object.values(test2)).to.deep.equal(['hello', '', '\'\'']);
            expect(Object.values(test3)).to.deep.equal([true, false, null]);
            expect(Object.values(test4)).to.deep.equal([{ foo: 'bar' }, [0, 1, 2], null]);
        });

        it('should parse other special non-JSON values', () => {
            const [test] = parameterised`
                |   param1  |   param2  |   param3  |   param4  |
                | Infinity  | -Infinity | undefined | NaN       |
            `;

            expect(Object.values(test)).to.deep.equal([Infinity, -Infinity, undefined, NaN]);
        });

        it('should parse raw strings', () => {
            const [test] = parameterised`
                |     param1    |
                | look a string |
            `;

            expect(Object.values(test)).to.deep.equal(['look a string']);
        });

        it('should  parse interpolated params', () => {
            const param = {};
            const [test] = parameterised`
                |  param1  |
                | ${param} |
            `;

            expect(test.param1).to.equal(param);
        });
    });

    describe('parameterised - formatting:', () => {
        it('should parse with compact formatting', () => {
            const [test] = parameterised`
                param1 | param2 | param3 | param4
                1      | 2      | 3      | 6
            `;

            expect(test).to.deep.equal({
                param1: 1,
                param2: 2,
                param3: 3,
                param4: 6
            });
        });

        it('should parse with verbose formatting', () => {
            const [test] = parameterised`

                | param1 | param2 | param3 | param4 |
                | 1      | 2      | 3      | 6      |

            `;

            expect(test).to.deep.equal({
                param1: 1,
                param2: 2,
                param3: 3,
                param4: 6
            });
        });
    });

    describe('parameterised - errors:', () => {
        it('should throw if there are more parameters than values', () => {
            expect(() => {
                return parameterised`
                    | param1 | param2 | param3 | param4 |
                    | 1      | 2      | 3      |
                `;
            }).to.throw(

`
🔥 Expected "4" values but got "3" at:

    | param1 | param2 | param3 | param4 |
    | 1      | 2      | 3      |
`

            );
        });

        it('should throw if there are less parameters than values', () => {
            expect(() => {
                return parameterised`
                    | param1 | param2 | param3 |
                    | 1      | 2      | 3      | 4      |
                `;
            }).to.throw(

`
🔥 Expected "3" values but got "4" at:

    | param1 | param2 | param3 |
    | 1      | 2      | 3      | 4      |
`

            );
        });
    });
});

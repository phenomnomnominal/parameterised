// Constants:
const ALLOWED_SEPARATOR_CHARACTERS = /\||\s|-/g;
const NEW_LINE = /\n/;
const TABLE_SEPARATOR = /\|/;
const TEMPLATE_ARG_PLACEHOLDER = '___';

const PARSED_VALUES_MAP: Record<string, any> = {
    '-Infinity': -Infinity,
    'Infinity': Infinity,
    'NaN': NaN,
    'undefined': undefined
};

export function parameterised (templateStrings: TemplateStringsArray, ...templateArgs: Array<any>): Array<Record<string, any>> {
    const lines = clean(templateStrings.join(TEMPLATE_ARG_PLACEHOLDER).split(NEW_LINE));
    const [header, ...tests] = lines;

    const keys = clean(header.split(TABLE_SEPARATOR))
        .map(key => key === TEMPLATE_ARG_PLACEHOLDER ? templateArgs.shift() : key);

    return tests.map(test => {
        const parsedParams: Record<string, any> = {};
        const testParams = clean(test.split(TABLE_SEPARATOR));
        validateParams(header, test, keys, testParams);
        testParams.forEach((param, index) => {
            parsedParams[keys[index]] = parseParam(param, templateArgs);
        });
        return parsedParams;
    });
}

function parseParam (param: string, templateArgs: Array<any>): any {
    try {
        return JSON.parse(param);
    } catch (e) {
        const trimmed = param.trim();
        if (Object.hasOwnProperty.call(PARSED_VALUES_MAP, trimmed)) {
            return PARSED_VALUES_MAP[trimmed];
        }
        if (trimmed === TEMPLATE_ARG_PLACEHOLDER) {
            return templateArgs.shift();
        }
        return trimmed;
    }
}

function clean (chunks: Array<string>): Array<string> {
    return chunks.map(c => c.trim()).filter(c => c.length > 0);
}

function validateParams (header: string, test: string, params: Array<string>, keys: Array<string>): void {
    if (params.length > keys.length || params.length < keys.length) {
        throw new Error(

`
🔥 Expected "${params.length}" values but got "${keys.length}" at:

    ${header}
    ${test}
`

        );
    }
}

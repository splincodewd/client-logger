import { JsonStringifyConfigImpl } from './json-stringify.impl';
import { BaseType } from './json-stringify.impl';

export const SearchPattern = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

export const JsonStringifyConfig: JsonStringifyConfigImpl = {
    enableColor: false, // bug chrome 65+, default: false
    spaces: '\t',
    replacer: null,
    styles: {
        [BaseType.STRING]: 'color:green;',
        [BaseType.NUMBER]: 'color:darkorange;',
        [BaseType.BOOLEAN]: 'color:blue;',
        [BaseType.NULL]: 'color:magenta;',
        [BaseType.KEY]: 'color:red;'
    }
};

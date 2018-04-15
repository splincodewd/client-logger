import { LoggerConfigImpl } from '../../logger.impl';
import { config } from '../../logger.config';
import { BaseType, JSONKeyValue, JsonStringifyConfigImpl } from './json-stringify.impl';

export class JsonStringify {

    private readonly searchPattern: RegExp;
    private readonly options: LoggerConfigImpl;

    constructor(options: Partial<LoggerConfigImpl> = {}) {
        this.options = { ...config, ...options };
        this.searchPattern = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;
    }

    public stringify = (json: JSONKeyValue, options: Partial<JsonStringifyConfigImpl> = {}): string[] => {
        const stringifyConfig = { ...this.options.stringify, ...options };
        const { spaces, styles, enableColor, replacer } = stringifyConfig;

        if (typeof json !== 'string') {
            json = JSON.stringify(json, replacer, spaces);
        }

        const arr: string[] = [];

        if (enableColor) {
            const _string = styles[BaseType.STRING];
            const _number = styles[BaseType.NUMBER];
            const _boolean = styles[BaseType.BOOLEAN];
            const _null = styles[BaseType.NULL];
            const _key = styles[BaseType.KEY];

            json = json.replace(this.searchPattern, function (match: any) {
                let style = _number;
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        style = _key;
                    } else {
                        style = _string;
                    }
                } else if (/true|false/.test(match)) {
                    style = _boolean;
                } else if (/null/.test(match)) {
                    style = _null;
                }

                arr.push(style);
                arr.push('');

                return '%c' + match + '%c';
            });
        }

        arr.unshift(json);

        return arr;

    }

}

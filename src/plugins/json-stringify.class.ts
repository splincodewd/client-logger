import { LoggerConfigImpl } from '../logger.interfaces';
import { config } from '../logger.config';

export enum BaseType {
    STRING,
    NUMBER,
    BOOLEAN,
    NULL,
    KEY
}

export interface JsonParseConfig {
    enableColor: boolean;
    styles: { [key: number]: string };
}

export interface JsonStringifyImpl {
    stringify(json: object | string, color?: boolean): string[];
}

export const JsonStringifyConfig = {
    enableColor: false,
    styles: {
        [BaseType.STRING]: 'color:green;',
        [BaseType.NUMBER]: 'color:darkorange;',
        [BaseType.BOOLEAN]: 'color:blue;',
        [BaseType.NULL]: 'color:magenta;',
        [BaseType.KEY]: 'color:red;'
    }
};

export class JsonStringify {

    private readonly searchPattern: RegExp;
    private options: LoggerConfigImpl;

    constructor(options: Partial<LoggerConfigImpl> = {}) {
        this.options = {...config, ...options};
        this.searchPattern = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;
    }

    public stringify = (json: object | string, color: boolean = true): string[] => {

        if (typeof json !== 'string') {
            json = JSON.stringify(json, null, '\t');
        }

        const arr: string[] = [];

        if (color) {
            const styles = this.options.stringify.styles;
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

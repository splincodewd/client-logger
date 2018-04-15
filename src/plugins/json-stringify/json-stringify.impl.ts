export enum BaseType {
    STRING,
    NUMBER,
    BOOLEAN,
    NULL,
    KEY
}

export interface JsonStringifyConfigImpl {
    enableColor: boolean;
    spaces: string | number;
    replacer: () => void;
    styles: { [key: number]: string };
}

export type JSONKeyValue = object | string;

export interface JsonStringifyImpl {
    stringify(json: JSONKeyValue, options?: Partial<JsonStringifyConfigImpl>): string[];
}

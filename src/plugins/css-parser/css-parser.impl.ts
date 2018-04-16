export enum FormatLine {
    STRING = '%s',
    INT = '%d',
    FLOAT = '%f',
    OBJECT = '%O',
    DOM = '%o'
}

export interface LineStyle {
    style: string;
    format: FormatLine;
}

export interface StringMap {
    [s: string]: string;
}

export type StyleKeyValue = object | string;

export interface CssParserImpl {
    css(styleFormat: StyleKeyValue, format: FormatLine): this;
    cssClass(classes: string): this;
    clearCssCurrentLine(): void;
    getCurrentLineStyle(): LineStyle;
}

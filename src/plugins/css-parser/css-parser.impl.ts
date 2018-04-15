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

export type StyleKeyValue = object | string;

export interface CssParserImpl {
    css(styleFormat: StyleKeyValue, format: FormatLine): this;
    clearCssCurrentLine(): void;
    getCurrentLineStyle(): LineStyle;
}

import { config } from '../../logger.config';
import { LoggerConfigImpl } from '../../logger.impl';
import { FormatLine, LineStyle, StyleKeyValue } from './css-parser.impl';

export class CssParser {

    private globalLineStyle: Partial<LineStyle> = {};
    private lineStyle: Partial<LineStyle> = {};
    private readonly options: LoggerConfigImpl;

    constructor(options: Partial<LoggerConfigImpl> = {}) {
        this.options = {...config, ...options};
        const {style, format} = this.options.lineStyle;
        const newStyle = style && style.length ? `${style};` : '';
        this.globalLineStyle = {style: newStyle, format};
    }

    private static generatePropName(propName: string): string {
        return propName.split(/(?=[A-Z])/g).map(function (value: string) {
            return value.charAt(0).toLowerCase() + value.substring(1);
        }).join('-');
    }

    private static stylesToString(styles: StyleKeyValue): string {
        let result = '';

        if (typeof styles !== 'string') {
            const keys = Object.keys(styles);
            if (keys.length) {
                const len = keys.length;
                for (let i = 0; i < len; i++) {
                    const key = keys[i];
                    const val = styles[key];
                    result += `${CssParser.generatePropName(key)}:${val};`;
                }
            }
        } else {
            result = styles;
        }

        return result;
    }

    public css(styleFormat: StyleKeyValue, format: FormatLine): this {
        const style = CssParser.stylesToString(styleFormat);
        this.lineStyle = {style, format};
        return this;
    }

    public getCurrentLineStyle(): LineStyle {
        const globalLineStyle = this.globalLineStyle.style || '';
        const localLineStyle = this.lineStyle.style || '';
        const lineStyle = `${globalLineStyle}${localLineStyle}` || null;
        const lineFormat = this.lineStyle.format || this.globalLineStyle.format;
        return {style: lineStyle, format: lineFormat};
    }

    public clearCssCurrentLine(): void {
        this.lineStyle = {};
    }

}

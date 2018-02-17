import { CallbackGroupFn, ClientLoggerImpl, LineStyle, LoggerColors, LoggerConfigImpl, LoggerLabels } from './logger.interfaces';
import { config, FormatLine, LoggerLevel } from './logger.config';
import { CssParser } from './logger.style';

export class ClientLogger implements ClientLoggerImpl {

    private options: LoggerConfigImpl;
    private lineStyle: Partial<LineStyle> = {};
    private countOpenGroup: number = 0;

    constructor(options: Partial<LoggerConfigImpl> = {}) {
        this.options = { ...config, ...options };
    }

    public get level(): LoggerLevel {
        return this.options.minLevel;
    }

    public set level(logLevel: LoggerLevel) {
        this.options.minLevel = logLevel;
    }

    public get console(): Console {
        return this.options.consoleInstance;
    }

    public set console(console: Console) {
        this.options.consoleInstance = console;
    }

    public get table() {
        return this.console.table.bind(this.console);
    }

    public get assert() {
        return this.console.assert.bind(this.console);
    }

    public get trace() {
        return this.loggerMethodsFactory(LoggerLevel.TRACE);
    }

    public get debug() {
        return this.loggerMethodsFactory(LoggerLevel.DEBUG);
    }

    public get info() {
        return this.loggerMethodsFactory(LoggerLevel.INFO);
    }

    public get warn() {
        return this.loggerMethodsFactory(LoggerLevel.WARN);
    }

    public get error() {
        return this.loggerMethodsFactory(LoggerLevel.ERROR);
    }

    public get clear() {
        return this.console.clear.bind(this.console);
    }

    public setLabels(labels: LoggerLabels) {
        const configLabel = this.options.configLabel;
        this.options.configLabel = { ...configLabel, ...labels };
    }

    public setColors(colors: LoggerColors) {
        const configColor = this.options.configColor;
        this.options.configColor = { ...configColor, ...colors };
    }

    public css(styleFormat: object | string, format: FormatLine = FormatLine.STRING): ClientLogger {
        const style = (typeof styleFormat === 'string') ? styleFormat : CssParser.toString(styleFormat);
        this.lineStyle = { style, format };
        return this;
    }

    public pipe(...stream: CallbackGroupFn[]): ClientLogger {
        stream.forEach((line) => line(this));
        return this;
    }

    public close(): ClientLogger {
        this.countOpenGroup--;
        this.options.consoleInstance.groupEnd();
        return this;
    }

    public closeAll(): ClientLogger {
        for (let i = this.countOpenGroup; i--; i > 0) {
            this.countOpenGroup = i;
            this.options.consoleInstance.groupEnd();
        }
        return this;
    }

    public group(label: string, stream?: CallbackGroupFn): ClientLogger {
        this.countOpenGroup++;
        const labelText = this.getLabelText(LoggerLevel.INFO, ` ${label}`);
        const style = this.getStyleForLabel(LoggerLevel.INFO);
        const consoleInstance = this.options.consoleInstance;

        if (this.options.minLevel !== LoggerLevel.OFF) {
            consoleInstance.group.call(consoleInstance, labelText, style);
            if (stream) {
                stream(this);
                this.close();
            }
        }

        return this;
    }

    public groupCollapsed(label: string, stream?: CallbackGroupFn): ClientLogger {
        this.countOpenGroup++;
        const labelText = this.getLabelText(LoggerLevel.INFO, ` ${label}`);
        const style = this.getStyleForLabel(LoggerLevel.INFO);
        const consoleInstance = this.options.consoleInstance;

        if (this.options.minLevel !== LoggerLevel.OFF) {
            consoleInstance.groupCollapsed.call(consoleInstance, labelText, style);
            if (stream) {
                stream(this);
                this.close();
            }
        }

        return this;
    }

    private clearCssCurrentLine() {
        this.lineStyle = {};
    }

    private loggerMethodsFactory(level: LoggerLevel) {
        const canExecute = !(this.options.minLevel > level);
        let operation = this.options.noop;

        if (canExecute) {
            const label = this.getLabelText(level);
            const style = this.getStyleForLabel(level);
            const methodName = this.getConsoleMethodName(level);
            const consoleInstance = this.options.consoleInstance;
            const consoleMethod = consoleInstance[methodName] || operation;
            const { style: lineStyle, format: lineFormat } = this.getCurrentLineStyle();

            if (lineStyle) {
                this.clearCssCurrentLine();
                const labelLine = `${label} %c${lineFormat}`;
                operation = consoleMethod.bind(consoleInstance, labelLine, style, lineStyle);
            } else {
                operation = consoleMethod.bind(consoleInstance, label, style);
            }
        }

        return operation;
    }

    private getCurrentLineStyle(): LineStyle {
        const defaultLineStyle = this.options.lineStyle;
        const currentLineOption = this.lineStyle || defaultLineStyle;
        const lineStyle = currentLineOption.style;
        const lineFormat = currentLineOption.format;
        return { style: lineStyle, format: lineFormat };
    }

    private getConsoleMethodName(level: LoggerLevel): string {
        return this.options.configMethods[level];
    }

    private getLabelText(level: LoggerLevel, customLabel: string = ''): string {
        const text = `${this.options.configLabel[level]}${customLabel}`;
        const toUpperCase = this.options.labelUpperCase;
        const labelText = toUpperCase ? text.toLocaleUpperCase() : text;
        return `%c${labelText}`;
    }

    private getStyleForLabel(level: LoggerLevel): string {
        return `color: ${this.options.configColor[level]}; font-weight: bold;`;
    }

}

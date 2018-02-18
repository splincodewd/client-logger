import { PipelineFn, ClientLoggerImpl, ConsoleOperationFn, GroupParams, LineStyle, LoggerColors, LoggerConfigImpl, LoggerLabels } from './logger.interfaces';
import { config, FormatLine, LoggerGroupType, LoggerLevel } from './logger.config';
import { CssParser } from './css-parser.class';
import { ParseJson } from './parse-json.class';

export class ClientLogger implements ClientLoggerImpl {

    private options: LoggerConfigImpl;
    private lineStyle: Partial<LineStyle> = {};
    private countOpenGroup: number = 0;
    private executePipesGroup: boolean = true;

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

    public get log() {
        let operation = this.options.noop;
        const canExecute: boolean = !(this.options.minLevel > LoggerLevel.INFO);
        if (canExecute) {
            operation = this.console.log.bind(this.console);
        }

        return operation;
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

    public setLabels(labels: LoggerLabels): void {
        const configLabel = this.options.configLabel;
        this.options.configLabel = { ...configLabel, ...labels };
    }

    public setColors(colors: LoggerColors): void {
        const configColor = this.options.configColor;
        this.options.configColor = { ...configColor, ...colors };
    }

    public css(styleFormat: object | string, format: FormatLine = FormatLine.STRING): ClientLogger {
        const style = (typeof styleFormat === 'string') ? styleFormat : CssParser.toString(styleFormat);
        this.lineStyle = { style, format };
        return this;
    }

    public printJSON(json: any): void {
        this.console.log.apply(this.console, this.stringify(json));
    }

    public stringify(json: any): string[] {
        return ParseJson.stringify(json);
    }

    public pipe(...pipelines: PipelineFn[]): ClientLogger {
        if (this.executePipesGroup) {
            pipelines.forEach((line) => line(this));
        }

        return this;
    }

    public close(): ClientLogger {
        if (this.executePipesGroup) {
            this.countOpenGroup--;
            this.options.consoleInstance.groupEnd();
        }

        return this;
    }

    public closeAll(): ClientLogger {
        for (let i = this.countOpenGroup; i--; i > 0) {
            this.countOpenGroup = i;
            this.options.consoleInstance.groupEnd();
        }
        return this;
    }

    public group(options: string | Partial<GroupParams>, pipeline?: PipelineFn): ClientLogger {
        const configuration = this.getGroupParams(options, LoggerGroupType.OPENED);
        return this.generateGroup(configuration, pipeline);
    }

    public groupCollapsed(options: string | Partial<GroupParams>, pipeline?: PipelineFn): ClientLogger {
        const configuration = this.getGroupParams(options, LoggerGroupType.CLOSED);
        return this.generateGroup(configuration, pipeline);
    }

    private getGroupParams(options: string | Partial<GroupParams>, type: LoggerGroupType): GroupParams {
        let configuration: GroupParams = this.options.configGroups[type];

        if (typeof options === 'string') {
            configuration.label = options;
        } else {
            configuration = { ...configuration, ...options };
        }

        return configuration;
    }

    private generateGroup(configuration: GroupParams, pipeLine?: PipelineFn) {
        const { label, level, type } = configuration;
        const canExecute = !(this.options.minLevel > level);

        if (canExecute) {
            this.executePipesGroup = true;
            this.countOpenGroup++;
            const labelText = this.getLabelText(level, ` ${label}`);
            const style = this.getStyleForLabel(level);
            const consoleInstance = this.options.consoleInstance;
            consoleInstance[type].call(consoleInstance, labelText, style);

            if (pipeLine) {
                pipeLine(this);
                this.close();
            }
        } else {
            this.executePipesGroup = false;
        }

        return this;
    }

    private clearCssCurrentLine(): void {
        this.lineStyle = {};
    }

    private loggerMethodsFactory(level: LoggerLevel): ConsoleOperationFn {
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

import { ConsoleOperation, ConsoleOperationPipe, GroupParams, LoggerColors, LoggerConfigImpl, LoggerLabels, PipelineFn } from './logger.impl';
import { config, LoggerGroupType, LoggerLevel } from './logger.config';
import { CssParser} from './plugins/css-parser/css-parser.class';
import { Clipboard } from './plugins/clipboard.class';
import { PluginMixin } from './logger.mixins';
import { JsonStringify } from './plugins/json-stringify/json-stringify.class';
import { JSONKeyValue, JsonStringifyConfigImpl, JsonStringifyImpl } from './plugins/json-stringify/json-stringify.impl';
import { CssParserImpl, FormatLine, LineStyle, StyleKeyValue } from './plugins/css-parser/css-parser.impl';

@PluginMixin([
    JsonStringify,
    CssParser
])
export class ClientLogger implements JsonStringifyImpl, CssParserImpl {

    /**
     * @param {JSONKeyValue} json - JSON by string or object structure
     * @param {Partial<JsonStringifyConfigImpl>} options - option for print
     * @return {string[]} - the method returns an array of strings to output to the console.
     * @description - improved JSON.stringify with color palette
     */
    public stringify: (json: JSONKeyValue, options?: Partial<JsonStringifyConfigImpl>) => string[];

    /**
     * @param {StyleKeyValue} styleFormat - css structure as an object or string
     * @param {FormatLine} format - way to format the string (%s, %d, %f, %o, %O)
     * @return {this} - returns the current instance
     * @description - Setting styles for the current output line
     */
    public css: (styleFormat: StyleKeyValue, format?: FormatLine) => this;

    /**
     * @description - clearing Styles for the current output line
     * @return {void}
     */
    public clearCssCurrentLine: () => void;

    /**
     * @description - getting local string styles
     * @return {LineStyle} - current line style and format
     */
    public getCurrentLineStyle: () => LineStyle;

    public clipboard: Clipboard = new Clipboard();
    private options: LoggerConfigImpl;

    private countOpenGroup: number = 0;
    private executePipesGroup: boolean = true;

    constructor(options: Partial<LoggerConfigImpl> = {}) {
        this.options = {...config, ...options};
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

    public get trace(): ConsoleOperationPipe {
        return this.loggerMethodsFactory(LoggerLevel.TRACE);
    }

    public get debug(): ConsoleOperationPipe {
        return this.loggerMethodsFactory<ConsoleOperationPipe>(LoggerLevel.DEBUG);
    }

    public get log(): ConsoleOperation {
        let operation = this.options.noop;
        const canExecute: boolean = !(this.options.minLevel > LoggerLevel.INFO);
        if (canExecute) {
            operation = this.console.log.bind(this.console);
        }

        return operation;
    }

    public get info(): ConsoleOperationPipe {
        return this.loggerMethodsFactory<ConsoleOperationPipe>(LoggerLevel.INFO);
    }

    public get warn(): ConsoleOperationPipe {
        return this.loggerMethodsFactory<ConsoleOperationPipe>(LoggerLevel.WARN);
    }

    public get error(): ConsoleOperationPipe {
        return this.loggerMethodsFactory<ConsoleOperationPipe>(LoggerLevel.ERROR);
    }

    public get clear() {
        return this.console.clear.bind(this.console);
    }

    public setLabels(labels: LoggerLabels): void {
        const configLabel = this.options.configLabel;
        this.options.configLabel = {...configLabel, ...labels};
    }

    public setColors(colors: LoggerColors): void {
        const configColor = this.options.configColor;
        this.options.configColor = {...configColor, ...colors};
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
            configuration = {...configuration, ...options};
        }

        return configuration;
    }

    private generateGroup(configuration: GroupParams, pipeLine?: PipelineFn) {
        const {label, level, type} = configuration;
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

    private loggerMethodsFactory<T>(level: LoggerLevel): T {
        const canExecute = !(this.options.minLevel > level);
        let operation = this.options.noop;

        if (canExecute) {
            const label = this.getLabelText(level);
            const style = this.getStyleForLabel(level);
            const methodName = this.getConsoleMethodName(level);
            const consoleInstance = this.console;
            const consoleMethod = consoleInstance[methodName] || operation;
            const {style: lineStyle, format: lineFormat} = this.getCurrentLineStyle();

            if (lineStyle) {
                this.clearCssCurrentLine();
                const labelLine = `${label} %c${lineFormat}`;
                operation = consoleMethod.bind(consoleInstance, labelLine, style, lineStyle);
            } else {
                operation = consoleMethod.bind(consoleInstance, label, style);
            }
        }

        return this.defineProperties(level, operation);
    }

    private defineProperties<T>(level: LoggerLevel, operation: T): T {
        const configGroups = this.options.configGroups;
        for (const index in configGroups) {
            if (configGroups.hasOwnProperty(index)) {
                const group = configGroups[index];
                const type = group.type;

                Object.defineProperty(operation, type, {
                    enumerable: true,
                    configurable: true,
                    value: (label: string, pipeLine?: PipelineFn) => {
                        return this.generateGroup({label, level, type}, pipeLine);
                    }
                });
            }
        }

        return operation;
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

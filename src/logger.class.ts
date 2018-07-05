import { ConsoleOperationPipe, GroupParams, LoggerColors, LoggerConfigImpl, LoggerLabels, PipelineFn } from './logger.impl';
import { config as GlobalConfig, LoggerGroupType, LoggerLevel } from './logger.config';
import { CssParser } from './plugins/css-parser/css-parser.class';
import { Clipboard } from './plugins/clipboard.class';
import { JsonStringify } from './plugins/json-stringify/json-stringify.class';
import { JSONKeyValue, JsonStringifyConfigImpl, JsonStringifyImpl } from './plugins/json-stringify/json-stringify.impl';
import { CssParserImpl, FormatLine, LineStyle, StyleKeyValue } from './plugins/css-parser/css-parser.impl';
import { ConsoleBaseAPI } from './plugins/console-base-api/console-base-api.class';
import { aggregation } from './utils/aggregation';
import { ConsoleBaseApiImpl } from './plugins/console-base-api/console-base-api.impl';

export class ClientLogger
    extends aggregation(ConsoleBaseAPI, JsonStringify, CssParser)
    implements JsonStringifyImpl, CssParserImpl, ConsoleBaseApiImpl {

    /**
     * @description - initial runtime static configuration
     */
    public static config: LoggerConfigImpl;

    /**
     * @description - improved JSON.stringify with color palette
     * @external JsonStringify
     * @param {JSONKeyValue} json - JSON by string or object structure
     * @param {Partial<JsonStringifyConfigImpl>} options - option for print
     * @return {string[]} - the method returns an array of strings to output to the console.
     */
    public stringify: (json: JSONKeyValue, options?: Partial<JsonStringifyConfigImpl>) => string[];
    /**
     * @description - setting styles for the current output line
     * @external CssParser
     * @this ClientLogger
     * @param {StyleKeyValue} styleFormat - css structure as an object or string
     * @param {FormatLine} format - way to format the string (%s, %d, %f, %o, %O)
     * @return {this} - returns the current instance
     */
    public css: (styleFormat: StyleKeyValue, format?: FormatLine) => this;
    /**
     * @description - simplified work with styling a console line
     * @external CssParser
     * @this ClientLogger
     * @param {string} classes - class list, example: class1 class2
     * @return {this} - returns the current instance
     */
    public cssClass: (classes: string) => this;
    /**
     * @description - clearing styles for the current output line
     * @external CssParser
     * @return {void}
     */
    public clearCssCurrentLine: () => void;
    /**
     * @description - getting local string styles
     * @external CssParser
     * @return {LineStyle} - current line style and format
     */
    public getCurrentLineStyle: () => LineStyle;

    public clipboard: Clipboard = new Clipboard();
    public readonly level: LoggerLevel;
    public readonly config: LoggerConfigImpl;
    private countOpenGroup: number = 0;
    private executePipesGroup: boolean = true;

    constructor(options: Partial<LoggerConfigImpl> = {}) {
        super(ClientLogger.initConfiguration(options));
    }

    public get console(): Console {
        return this.config.consoleInstance;
    }

    public set console(console: Console) {
        this.config.consoleInstance = console;
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

    public get log(): ConsoleOperationPipe {
        return this.loggerMethodsFactory<ConsoleOperationPipe>(LoggerLevel.INFO, true);
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

    private static initConfiguration(options: Partial<LoggerConfigImpl> = {}): LoggerConfigImpl {
        this.config = { ...GlobalConfig, ...options };
        return this.config;
    }

    public setLabels(labels: LoggerLabels): void {
        const configLabel = this.config.configLabel;
        this.config.configLabel = {...configLabel, ...labels};
    }

    public setColors(colors: LoggerColors): void {
        const configColor = this.config.configColor;
        this.config.configColor = {...configColor, ...colors};
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
            this.config.consoleInstance.groupEnd();
        }

        return this;
    }

    public closeAll(): ClientLogger {
        for (let i = this.countOpenGroup; i--; i > 0) {
            this.countOpenGroup = i;
            this.config.consoleInstance.groupEnd();
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
        let configuration: GroupParams = this.config.configGroups[type];

        if (typeof options === 'string') {
            configuration.label = options;
        } else {
            configuration = {...configuration, ...options};
        }

        return configuration;
    }

    private generateGroup(configuration: GroupParams, pipeLine?: PipelineFn) {
        const {label, level, type} = configuration;
        const canExecute = !(this.config.minLevel > level);

        if (canExecute) {
            this.executePipesGroup = true;
            this.countOpenGroup++;
            const labelText = this.getLabelText(level, ` ${label}`);
            const style = this.getStyleForLabel(level);
            const consoleInstance = this.config.consoleInstance;
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

    private loggerMethodsFactory<T>(level: LoggerLevel, withoutLabel: boolean = false): T {
        const canExecute = !(this.config.minLevel > level);
        let operation = this.config.noop;

        if (canExecute) {
            const label = this.getLabelText(level);
            const style = this.getStyleForLabel(level);
            const methodName: string = withoutLabel ? 'log' : this.getConsoleMethodName(level);
            const consoleInstance = this.console;
            const consoleMethod = consoleInstance[methodName] || operation;
            const {style: lineStyle, format: lineFormat} = this.getCurrentLineStyle();

            if (lineStyle) {
                this.clearCssCurrentLine();

                if (withoutLabel) {
                    operation = consoleMethod.bind(consoleInstance, '%c%s', lineStyle);
                } else {
                    const labelLine = `${label} %c${lineFormat}`;
                    operation = consoleMethod.bind(consoleInstance, labelLine, style, lineStyle);
                }

            } else if (withoutLabel) {
                operation = consoleMethod.bind(consoleInstance);
            } else {
                operation = consoleMethod.bind(consoleInstance, label, style);
            }

        }

        return this.defineProperties(level, operation);
    }

    private defineProperties<T>(level: LoggerLevel, operation: T): T {
        const configGroups = this.config.configGroups;
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
        return this.config.configMethods[level];
    }

    private getLabelText(level: LoggerLevel, customLabel: string = ''): string {
        const text = `${this.config.configLabel[level]}${customLabel}`;
        const toUpperCase = this.config.labelUpperCase;
        const labelText = toUpperCase ? text.toLocaleUpperCase() : text;
        return `%c${labelText}`;
    }

    private getStyleForLabel(level: LoggerLevel): string {
        return `color: ${this.config.configColor[level]}; font-weight: bold;`;
    }

}

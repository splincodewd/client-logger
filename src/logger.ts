import { CallbackGroupFn, ClientLoggerImpl, config, LoggerColors, LoggerConfigImpl, LoggerLabels, LoggerLevel } from './logger.interfaces';

export class ClientLogger implements ClientLoggerImpl {

    private options: LoggerConfigImpl;
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

    private loggerMethodsFactory(level: LoggerLevel) {
        const noop = this.options.noop;
        if (this.options.minLevel > level) {
            return noop;
        }

        const consoleInstance = this.options.consoleInstance;
        const label = this.getLabelText(level);
        const style = this.getStyleForLabel(level);
        const methodName = this.getConsoleMethodName(level);
        const consoleMethod = consoleInstance[methodName] || noop;

        return consoleMethod.bind(consoleInstance, label, style);
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

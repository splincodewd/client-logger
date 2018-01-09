import {
    CallbackGroupFn,
    ConsoleGroupOptions,
    DEFAULT_COLORS,
    DEFAULT_LABELS,
    LoggerColors,
    LoggerConfig,
    LoggerLabels,
    LoggerLevel,
    NoOperationFn
} from './logger.interfaces';

export class ClientLogger {

    private minLevel: LoggerLevel;
    private consoleInstance: Console;
    private configColors: LoggerColors;
    private configLabels: LoggerLabels;
    private readonly noop: NoOperationFn;

    public static getReferenceConsole(): Console {
        return { ...{}, ...console };
    }

    constructor(options: Partial<LoggerConfig> = {}) {
        this.noop = (): any => null;
        this.configColors = { ...DEFAULT_COLORS, ...options.colors };
        this.configLabels = { ...DEFAULT_LABELS, ...options.labels };
        this.minLevel = options.level || LoggerLevel.ALL;
        this.consoleInstance = options.console || ClientLogger.getReferenceConsole();
    }

    public get level(): LoggerLevel {
        return this.minLevel;
    }

    public set level(logLevel: LoggerLevel) {
        this.minLevel = logLevel;
    }

    public get console(): Console {
        return this.consoleInstance;
    }

    public set console(console: Console) {
        this.consoleInstance = console;
    }

    public get assert() {
        return this.consoleInstance.assert.bind(this.consoleInstance);
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

    public get table() {
        if (this.minLevel > LoggerLevel.DEBUG) return this.noop;
        return this.consoleInstance.table.bind(this.consoleInstance);
    }

    public get clear() {
        return this.consoleInstance.clear.bind(this.consoleInstance);
    }

    public setLabels(labels: LoggerLabels) {
        this.configLabels = { ...this.configLabels, ...labels };
    }

    public setColors(colors: LoggerColors) {
        this.configColors = { ...this.configColors, ...colors };
    }

    public group(label: string, callback: CallbackGroupFn, open: boolean = false, prefix: string = this.configLabels[LoggerLevel.INFO]) {
        if (this.minLevel === LoggerLevel.OFF) return this.noop;
        if (!this.consoleInstance.hasOwnProperty('groupEnd')) return callback();
        const title = `${(prefix) ? (`${prefix} `) : ('')}${String(label).toUpperCase()}`;
        this.showConsoleGroup({ title, open, callback });
    }

    private loggerMethodsFactory(level: LoggerLevel) {
        if (this.minLevel > level) {
            return this.noop;
        }

        const consoleInstance = this.consoleInstance;
        const label = `%c${this.configLabels[level]}`;
        const style = this.getStyleForLabel(level);
        const consoleMethods = {
            [LoggerLevel.TRACE]: 'debug',
            [LoggerLevel.DEBUG]: 'info',
            [LoggerLevel.INFO]: 'info',
            [LoggerLevel.WARN]: 'warn',
            [LoggerLevel.ERROR]: 'error'
        };

        const consoleWorker = consoleInstance[consoleMethods[level]] || this.noop;
        return consoleWorker.bind(consoleInstance, label, style);
    }

    private showConsoleGroup(options: ConsoleGroupOptions): void {
        const { title, open, callback } = options;
        const typeGroup = !open ? 'groupCollapsed' : 'group';
        this.consoleInstance[typeGroup](title);
        callback();
        this.consoleInstance.groupEnd();
    }

    private getStyleForLabel(level: LoggerLevel): string {
        return `color: ${this.configColors[level]}; font-weight: bold;`;
    }

}

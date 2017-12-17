import {
    ConsoleGroupOptions,
    DEFAULT_COLORS,
    DEFAULT_LABELS,
    LoggerColors,
    LoggerConfig,
    LoggerLabels,
    LoggerLevel
} from "./logger.interfaces";

export class ClientLogger {

    private minLevel: LoggerLevel;
    private stream: Console;
    private noop = (): any => undefined;
    private colorLabel: LoggerColors = DEFAULT_COLORS;
    private configLabel: LoggerLabels = DEFAULT_LABELS;

    constructor(options: Partial<LoggerConfig> = {}) {
        this.stream = options.consoleStream || (<any>Object).assign({}, console);
        this.colorLabel = {...this.colorLabel, ...options.colorConfig};
        this.configLabel = {...this.configLabel, ...options.labelConfig};
        this.minLevel = options.logLevel || LoggerLevel.ALL;
    }

    public get level() {
        return <any>LoggerLevel[this.minLevel];
    }

    public set level(logLevel: LoggerLevel) {
        this.minLevel = logLevel;
    }

    public get console(): Console {
        return this.stream;
    }

    public set console(console: Console) {
        this.stream = console;
    }

    public get assert() {
        return this.stream.assert.bind(this.stream);
    }

    public get trace() {
        if (this.minLevel > LoggerLevel.TRACE) return this.noop;
        return this.stream.debug.bind(this.stream, `%c${this.configLabel[LoggerLevel.TRACE]}`, this.getStyleForLabel(LoggerLevel.TRACE));
    }

    public get debug() {
        if (this.minLevel > LoggerLevel.DEBUG) return this.noop;
        return this.stream.info.bind(this.stream, `%c${this.configLabel[LoggerLevel.DEBUG]}`, this.getStyleForLabel(LoggerLevel.DEBUG));
    }

    public get info() {
        if (this.minLevel > LoggerLevel.INFO) return this.noop;
        return this.stream.info.bind(this.stream, `%c${this.configLabel[LoggerLevel.INFO]}`, this.getStyleForLabel(LoggerLevel.INFO));
    }

    public get warn() {
        if (this.minLevel > LoggerLevel.WARN) return this.noop;
        return this.stream.warn.bind(this.stream, `%c${this.configLabel[LoggerLevel.WARN]}`, this.getStyleForLabel(LoggerLevel.WARN));
    }

    public get error() {
        if (this.minLevel > LoggerLevel.ERROR) return this.noop;
        return this.stream.error.bind(this.stream, `%c${this.configLabel[LoggerLevel.ERROR]}`, this.getStyleForLabel(LoggerLevel.ERROR));
    }

    public get table() {
        if (this.minLevel > LoggerLevel.DEBUG) return this.noop;
        return this.stream.table.bind(this.stream);
    }

    public get clear() {
        return this.stream.clear.bind(this.stream);
    }

    public setLabels(labelConfig: LoggerLabels) {
        this.configLabel = {...this.configLabel, ...labelConfig};
    }

    public setColors(colorConfig: LoggerColors) {
        this.colorLabel = {...this.colorLabel, ...colorConfig};
    }

    public group(label: string, callback: Function, open: boolean = false, prefix: string = this.configLabel[LoggerLevel.INFO]) {
        if (this.minLevel === LoggerLevel.OFF) return this.noop;
        if (!this.stream.hasOwnProperty("groupEnd")) return callback();
        const title = `${(prefix) ? (prefix + ' ') : ('')}${String(label).toUpperCase()}`;
        this.showConsoleGroup({title, open, callback});
    }

    private showConsoleGroup(options: ConsoleGroupOptions) {
        let {title, open, callback} = options;
        let typeGroup = !open ? "groupCollapsed" : "group";
        this.stream[typeGroup](title);
        callback();
        this.stream.groupEnd();
    }

    private getStyleForLabel(level: LoggerLevel) {
        return `color: ${this.colorLabel[level]}; font-weight: bold;`;
    }

}

export const logger = new ClientLogger();
export {LoggerLevel, LoggerColors, LoggerConfig, LoggerLabels} from "./logger.interfaces";
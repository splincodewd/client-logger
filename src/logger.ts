import {
    DEFAULT_COLORS,
    DEFAULT_LABELS,
    LoggerColor,
    LoggerConfig,
    LoggerLabels,
    LoggerLevel
} from "./logger.interfaces";

export class ClientLogger {

    private minLevel: LoggerLevel;
    private stream: Console;
    private noop = (): any => undefined;
    private colorLabel: LoggerColor = DEFAULT_COLORS;
    private configLabel: LoggerLabels = DEFAULT_LABELS;

    constructor(options: LoggerConfig = {}) {
        this.stream = options.consoleStream || (<any>Object).assign({}, console);
        this.colorLabel = <LoggerColor>{...this.colorLabel, ...options.colorConfig};
        this.minLevel = options.logLevel || LoggerLevel.ALL;
        if (options.showLevel) this.debug("Logging levels: ", LoggerLevel[this.minLevel]);
    }

    public get level() {
        return this.minLevel;
    }

    public set level(logLevel: LoggerLevel) {
        this.minLevel = logLevel;
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

    public group(label: string, callback: Function, customTitle: string = this.configLabel[LoggerLevel.INFO]) {
        if (this.minLevel === LoggerLevel.OFF) return this.noop;
        this.groupCollapsed(label, callback, customTitle);
    }

    private groupCollapsed(label: string, callback: Function, customTitle: string) {
        if (!this.stream.hasOwnProperty("groupCollapsed")) callback();
        this.stream.groupCollapsed(`[${customTitle}]: ${label.toUpperCase()}`);
        callback();
        this.stream.groupEnd();
    }

    private getStyleForLabel(level: LoggerLevel) {
        return `color: ${this.colorLabel[level]}; font-weight: bold;`;
    }

}

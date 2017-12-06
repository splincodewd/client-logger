export enum LoggerLevel {
    ALL = 1,
    TRACE,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    OFF
}

export interface LoggerConfig {
    logLevel?: LoggerLevel;
    colorConfig?: LoggerColor;
    showLevel?: boolean;
}

export interface LoggerColor {
    [loggerLevel: number]: string;
}

export const DEFAULT_COLORS: LoggerColor = {
    [LoggerLevel.TRACE]: "#000080",
    [LoggerLevel.DEBUG]: "#00BFFE",
    [LoggerLevel.INFO]: "#000000",
    [LoggerLevel.WARN]: "#FF6419",
    [LoggerLevel.ERROR]: "#F1062D"
};

export class ClientLogger {

    private minLevel: LoggerLevel;
    private noop = (): any => undefined;
    private colorLabel: LoggerColor = DEFAULT_COLORS;

    constructor(options: LoggerConfig = {}) {
        this.colorLabel = <LoggerColor>{...this.colorLabel, ...options.colorConfig};
        this.minLevel = options.logLevel || LoggerLevel.DEBUG;
        if (options.showLevel) this.debug("Logging levels: ", LoggerLevel[this.minLevel]);
    }

    public get assert() {
        return console.assert.bind(console);
    }

    public get trace() {
        if (this.minLevel > LoggerLevel.TRACE) return this.noop;
        return console.debug.bind(console, "%c[TRACE]:", this.getStyleForLabel(LoggerLevel.TRACE));
    }

    public get debug() {
        if (this.minLevel > LoggerLevel.DEBUG) return this.noop;
        return console.log.bind(console, "%c[DEBUG]:", this.getStyleForLabel(LoggerLevel.DEBUG));
    }

    public get info() {
        if (this.minLevel > LoggerLevel.INFO) return this.noop;
        return console.info.bind(console, "%c[INFO]:", this.getStyleForLabel(LoggerLevel.INFO));
    }

    public get warn() {
        if (this.minLevel > LoggerLevel.WARN) return this.noop;
        return console.warn.bind(console, "%c[WARNING]:", this.getStyleForLabel(LoggerLevel.WARN));
    }

    public get error() {
        if (this.minLevel > LoggerLevel.ERROR) return this.noop;
        return console.error.bind(console, "%c[ERROR]:", this.getStyleForLabel(LoggerLevel.ERROR));
    }

    public get table() {
        if (this.minLevel > LoggerLevel.DEBUG) return this.noop;
        return console.table.bind(console);
    }

    public group(label: string, callback: Function, customTitle: string = "INFO") {
        if (this.minLevel === LoggerLevel.OFF) return this.noop;
        this.groupCollapsed(label, callback, customTitle);
    }

    public get clear() {
        return console.clear.bind(console);
    }

    private groupCollapsed(label: string, callback: Function, customTitle: string) {
        if (!console.hasOwnProperty("groupCollapsed")) callback();
        console.groupCollapsed(`[${customTitle}]: ${label.toUpperCase()}`);
        callback();
        console.groupEnd();
    }

    private getStyleForLabel(level: LoggerLevel) {
        return `color: ${this.colorLabel[level]}; font-weight: bold;`;
    }

}






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
    labelConfig?: LoggerLabels;
    consoleStream?: Console;
    showLevel?: boolean;
}

export interface LoggerLabels {
    [loggerLevel: number]: string;
}

export interface LoggerColor {
    [loggerLevel: number]: string;
}

export const DEFAULT_LABELS: LoggerLabels = {
    [LoggerLevel.TRACE]: "[TRACE]:",
    [LoggerLevel.DEBUG]: "[DEBUG]:",
    [LoggerLevel.INFO]: "[INFO]:",
    [LoggerLevel.WARN]: "[WARN]:",
    [LoggerLevel.ERROR]: "[ERROR]:"
};

export const DEFAULT_COLORS: LoggerColor = {
    [LoggerLevel.TRACE]: "#000080",
    [LoggerLevel.DEBUG]: "#00BFFE",
    [LoggerLevel.INFO]: "#000000",
    [LoggerLevel.WARN]: "#FF6419",
    [LoggerLevel.ERROR]: "#F1062D"
};

export interface ConsoleGroupOptions {
    title: string;
    open: boolean;
    callback: Function;
}
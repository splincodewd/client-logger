export enum LABELS {
    TRACE = '[TRACE]:',
    DEBUG = '[DEBUG]:',
    INFO = '[INFO]:',
    WARN = '[WARN]:',
    ERROR = '[ERROR]:'
}

export enum COLORS {
    TRACE = '#000080',
    DEBUG = '#00BFFE',
    INFO = '#000000',
    WARN = '#FF6419',
    ERROR = '#F1062D'
}

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
    level: LoggerLevel,
    colors: LoggerColors,
    labels: LoggerLabels,
    console: Console
}

export interface LoggerLabels {
    [level: number]: string
}

export interface LoggerColors {
    [level: number]: string
}

export type CallbackGroupFn = (() => void);
export type NoOperationFn = (() => void);

export interface ConsoleGroupOptions {
    title: string,
    open: boolean,
    callback: CallbackGroupFn
}

export const DEFAULT_LABELS: LoggerLabels = {
    [LoggerLevel.TRACE]: LABELS.TRACE,
    [LoggerLevel.DEBUG]: LABELS.DEBUG,
    [LoggerLevel.INFO]: LABELS.INFO,
    [LoggerLevel.WARN]: LABELS.WARN,
    [LoggerLevel.ERROR]: LABELS.ERROR
};

export const DEFAULT_COLORS: LoggerColors = {
    [LoggerLevel.TRACE]: COLORS.TRACE,
    [LoggerLevel.DEBUG]: COLORS.DEBUG,
    [LoggerLevel.INFO]: COLORS.INFO,
    [LoggerLevel.WARN]: COLORS.WARN,
    [LoggerLevel.ERROR]: COLORS.ERROR
};

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

export interface LoggerLabels {
    [level: number]: string;
}

export interface LoggerColors {
    [level: number]: string;
}

export interface LoggerMethods {
    [level: number]: string;
}

export interface ClientLoggerImpl {
    trace(message?: any, ...optionalParams: any[]): void;
    debug(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}

export type CallbackGroupFn = ((params: ClientLoggerImpl) => void);
export type NoOperationFn = (() => void);

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

export const DEFAULT_METHODS: LoggerMethods = {
    [LoggerLevel.TRACE]: 'debug',
    [LoggerLevel.DEBUG]: 'info',
    [LoggerLevel.INFO]: 'info',
    [LoggerLevel.WARN]: 'warn',
    [LoggerLevel.ERROR]: 'error'
};

export interface LoggerConfigImpl {
    minLevel: LoggerLevel;
    consoleInstance: Console;
    noop: NoOperationFn;
    labelUpperCase: boolean;
    configLabel: LoggerLabels;
    configColor: LoggerColors;
    configMethods: LoggerMethods;
}

export const config: LoggerConfigImpl = {
    minLevel: LoggerLevel.ALL,
    consoleInstance: {...{}, ...(console || {})} as Console,
    noop: () => {},
    labelUpperCase: true,
    configLabel: DEFAULT_LABELS,
    configColor: DEFAULT_COLORS,
    configMethods: DEFAULT_METHODS
};

import { FormatLine, LoggerLevel } from './logger.config';

export interface LoggerConfigImpl {
    minLevel: LoggerLevel;
    consoleInstance: Console;
    noop: NoOperationFn;
    labelUpperCase: boolean;
    lineStyle: LineStyle;
    configLabel: LoggerLabels;
    configColor: LoggerColors;
    configMethods: LoggerMethods;
}

export interface LineStyle {
    style: string;
    format: FormatLine;
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
export type NoOperationFn = ((...params: any[]) => void);

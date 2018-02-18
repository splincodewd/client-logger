import { FormatLine, LoggerGroupType, LoggerLevel } from './logger.config';

export interface LoggerConfigImpl {
    minLevel: LoggerLevel;
    consoleInstance: Console;
    noop: ConsoleOperationFn;
    labelUpperCase: boolean;
    lineStyle: LineStyle;
    configLabel: LoggerLabels;
    configColor: LoggerColors;
    configMethods: LoggerMethods;
    configGroups: LoggerGroupsMethods;
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

export interface LoggerGroupsMethods {
    [name: string]: GroupParams;
}

export interface ClientLoggerImpl {
    stringify(message?: any, ...optionalParams: any[]): string[];
    trace(message?: any, ...optionalParams: any[]): void;
    debug(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}

export interface GroupParams {
    label: string;
    level: LoggerLevel;
    type?: LoggerGroupType;
}

export type PipelineFn = ((instance: ClientLoggerImpl) => void);
export type ConsoleOperationFn = ((...params: any[]) => void);

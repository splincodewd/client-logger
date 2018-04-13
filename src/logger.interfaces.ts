import { FormatLine, LoggerGroupType, LoggerLevel } from './logger.config';
import { ClientLogger } from './logger.class';
import { JsonParseConfig } from './plugins/json-stringify.class';

export interface LoggerConfigImpl {
    minLevel: LoggerLevel;
    consoleInstance: Console;
    noop: ConsoleOperationPipe | ConsoleOperation | any;
    labelUpperCase: boolean;
    lineStyle: LineStyle;
    configLabel: LoggerLabels;
    configColor: LoggerColors;
    configMethods: LoggerMethods;
    configGroups: LoggerGroupsMethods;
    stringify: JsonParseConfig;
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

export interface GroupParams {
    label: string;
    level: LoggerLevel;
    type?: LoggerGroupType;
}

export interface LoggerGroupsPipeImpl extends Function {
    group(label: string, pipeline?: PipelineFn): ClientLogger;
    groupCollapsed(label: string, pipeline?: PipelineFn): ClientLogger;
}

export type PipelineFn = ((instance: ClientLogger) => void);
export type ConsoleOperation = ((...params: any[]) => void);
export type ConsoleOperationPipe = LoggerGroupsPipeImpl;

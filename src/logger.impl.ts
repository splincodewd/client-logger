import { LoggerGroupType, LoggerLevel } from '@logger/config';
import { ClientLogger } from '@logger/class';
import { JsonStringifyConfigImpl } from '@logger/plugins.impl';
import { LineStyle, StringMap } from '@logger/plugins.impl';
import { PluginImpl } from '@logger/plugins.impl';

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
    stringify: JsonStringifyConfigImpl;
    cssClassMap: StringMap;
    plugins: PluginImpl[];
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

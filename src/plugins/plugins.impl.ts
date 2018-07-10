import { LoggerConfigImpl } from '@logger/impl';

export interface PluginImpl {
    new(config: LoggerConfigImpl | Partial<LoggerConfigImpl>): {};
}

export type PluginType = {
    new(config: Partial<LoggerConfigImpl>): {}
};

export * from './console-base-api/console-base-api.impl';
export * from './css-parser/css-parser.impl';
export * from './json-stringify/json-stringify.impl';

import { LoggerConfigImpl } from '../logger.impl';

export interface PluginImpl {
    new(config: LoggerConfigImpl | Partial<LoggerConfigImpl>): {};
}

export type Plugin = {
    new(config: Partial<LoggerConfigImpl>): {}
};

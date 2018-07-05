import { LoggerConfigImpl } from '../../logger.impl';
import { LoggerLevel } from '../../logger.config';

export class ConsoleBaseAPI {

    constructor(public readonly config: LoggerConfigImpl) {
    }

    public get level(): LoggerLevel {
        return this.config.minLevel;
    }

    public set level(logLevel: LoggerLevel) {
        this.config.minLevel = logLevel;
    }

}

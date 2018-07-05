import { LoggerConfigImpl } from '../logger.impl';

export enum ConfigurableKeys {
    LOGGER_CONFIGURABLE_VALUE = 'LOGGER_CONFIGURABLE_VALUE'
}

export interface LoggerConfigurableImpl {
    readonly config: LoggerConfigImpl;
}

export function LoggerConfigurable(config: LoggerConfigImpl) {
    return (target) => {
        const original = target;

        function construct(constructor: any, args: any[]) {
            const configConstuctor: any = function () {
                return constructor.apply(this, args);
            };
            configConstuctor.prototype = constructor.prototype;
            return new configConstuctor();
        }

        const newConstructor: any = function (...args: any[]) {
            const options: Partial<LoggerConfigImpl> = args[0] || {};
            original.prototype[ConfigurableKeys.LOGGER_CONFIGURABLE_VALUE] = {...config, ...options};
            return construct(original, args);
        };

        newConstructor.prototype = original.prototype;
        return newConstructor;
    };
}

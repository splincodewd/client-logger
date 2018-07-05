import { LoggerConfigImpl } from './../logger.impl';
import { ConfigurableKeys } from './configurable';

export interface PluginClass<T extends object> {
    new(options: Partial<LoggerConfigImpl>): any;
}

export type PluginConstructor = PluginClass<() => void>;

export function PluginConnect<T>(plugins: PluginConstructor[]) {
    return (target: PluginConstructor) => {
        const original = target;

        // a utility function to generate instances of a class
        function construct(constructor: PluginConstructor, args: any[]) {
            let newInstance: T = null;

            // new reference for current instance
            const targetPrototypeConfig = getConfigurableValue(target, ConfigurableKeys.LOGGER_CONFIGURABLE_VALUE);
            const config: LoggerConfigImpl = {...targetPrototypeConfig};

            if (!config) {
                throw new Error('Does not found full configuration for logger');
            }

            const utilityConstruct: any = function () {
                plugins.forEach((plugin: PluginConstructor) => {
                    const pluginInstance = new plugin(config);
                    const targetPrototype = target.prototype;
                    const pluginPrototype = plugin.prototype;

                    Object.getOwnPropertyNames(pluginPrototype).forEach((name) => {
                        const descriptor = Object.getOwnPropertyDescriptor(pluginPrototype, name);
                        if (typeof descriptor.get === 'function') {
                            // TODO: need fixed copy getter/setter
                            Object.defineProperty(targetPrototype, name, {
                                get() {
                                    pluginInstance['config'] = this['config'];
                                    return pluginInstance[name];
                                },
                                set(value) {
                                    pluginInstance['config'] = this['config'];
                                    return pluginInstance[name] = value;
                                },
                                configurable: true
                            });
                        } else if (name !== 'constructor') {
                            targetPrototype[name] = pluginPrototype[name];
                        }
                    });

                    newInstance = Object.assign(this, pluginInstance);
                });

                return constructor.apply(newInstance, args);
            };

            utilityConstruct.prototype = constructor.prototype;
            return new utilityConstruct();
        }

        // the new constructor behaviour
        const f: any = function (...args: any[]) {
            return construct(original, args);
        };

        // copy prototype so instanceof operator still works
        f.prototype = original.prototype;

        // return new constructor (will override original)
        return f;

    };
}

function getConfigurableValue(target, key: ConfigurableKeys) {
    const value = target.prototype[key];
    target.prototype[key] = null;
    return value;
}

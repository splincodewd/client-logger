import { LoggerConfigImpl } from '@logger/impl';
import { PluginImpl, PluginType } from '@logger/plugins.impl';

export function aggregation(BaseClass: PluginImpl, ...plugins: PluginImpl[]): PluginType {
    class Base extends BaseClass {
        constructor(public readonly config: LoggerConfigImpl) {
            super(config);
            const commonPlugins = [...plugins, ...config.plugins];
            commonPlugins.forEach((mixin: PluginImpl) => {
                copyProps(this, (new mixin(config)));
            });
        }
    }

    const copyProps = (target: object, source: object) => {
        const iterableSymbolsKeys: symbol[] = Object.getOwnPropertySymbols(source);
        const iterableKeys: string[] = Object.getOwnPropertyNames(source);
        const keyList: Array<string | symbol> = [...iterableKeys, ...iterableSymbolsKeys];

        keyList.forEach((prop: string | symbol) => {
            if (!prop.toString().match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
                Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
            }
        });
    };

    plugins.forEach((mixin: PluginImpl) => {
        copyProps(Base.prototype, mixin.prototype);
        copyProps(Base, mixin);
    });

    return Base;
}

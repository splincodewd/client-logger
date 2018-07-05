import { LoggerConfigImpl } from '../logger.impl';

export type Class = { new(...args: any[]): any; };

export function ClassAggregation(baseClass: Class, ...mixins: any[]): Class {
    class Base extends baseClass {
        constructor(...args) {
            super(...args);
            mixins.forEach((mixin) => {
                copyProps(this, (new mixin(...args)));
            });
        }
    }

    let copyProps = (target: any, source: any) => {
        const a: any = Object.getOwnPropertyNames(source)
            .concat(Object.getOwnPropertySymbols(source) as any) as any;


            a.forEach((prop) => {
                if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                    Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
            });
    };

    mixins.forEach((mixin) => {
        copyProps(Base.prototype, mixin.prototype);
        copyProps(Base, mixin);
    });

    return Base;
};

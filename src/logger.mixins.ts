export interface Class<T extends object> {
    new(...args: any[]): any;
}

export type Constructor = Class<() => void>;

export function PluginMixin<T>(plugins: Constructor[]) {
    return (target: Constructor) => {

        // save a reference to the original constructor
        const original = target;

        // a utility function to generate instances of a class
        function construct(constructor: Constructor, args: any[]) {
            let newInstance: T = null;
            const c: any = function () {
                plugins.forEach((plugin: Constructor) => {
                    const pluginInstance = new plugin(...args);
                    Object.getOwnPropertyNames(plugin.prototype).forEach((name) => {
                        target.prototype[name] = plugin.prototype[name];
                    });
                    newInstance = Object.assign(this, pluginInstance);
                });
                return constructor.apply(newInstance, args);
            };

            c.prototype = constructor.prototype;
            return new c();
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

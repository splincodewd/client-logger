enum LoggerLineType {
    TRACE = "debug",
    DEBUG = "info",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
}

const LoggerInjector = {

    referenceConsole: {},

    patch: function () {

        const that = this;
        const consoleForTest = (<any>Object).assign({}, console);
        this.referenceConsole = consoleForTest;
        consoleForTest["history"] = [];

        consoleForTest.debug = function( ){
            const args = Array.prototype.slice.call(arguments);
            that.referenceConsole["history"].push({[LoggerLineType.TRACE]: args});
        };

        consoleForTest.info = function( ){
            const args = Array.prototype.slice.call(arguments);
            that.referenceConsole["history"].push({[LoggerLineType.INFO]: args});
        };

        consoleForTest.warn = function( ){
            const args = Array.prototype.slice.call(arguments);
            that.referenceConsole["history"].push({[LoggerLineType.WARN]: args});
        };

        consoleForTest.error = function( ){
            const args = Array.prototype.slice.call(arguments);
            that.referenceConsole["history"].push({[LoggerLineType.ERROR]: args});
        };

        consoleForTest.clear = function( ){
            that.referenceConsole["history"] = [];
        };

        return that.referenceConsole;

    },

    createStack: function (...args: any[]) {
        return JSON.stringify(args);
    },

    stack: function (withoutLabel: number = 2) {
        let history = (<any>Object).assign([], this.referenceConsole["history"]);
        history.forEach((line: Object, index: number) => {
            for (let arg in line) {
                if (line.hasOwnProperty(arg)) {
                    history[index] = {[arg]: line[arg].slice(withoutLabel)};
                }
            }
        });

        return JSON.stringify(history);
    }

};

export {LoggerInjector, LoggerLineType};
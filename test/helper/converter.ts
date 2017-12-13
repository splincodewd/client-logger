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

        consoleForTest.debug = function () {
            const args = Array.prototype.slice.call(arguments);
            that.referenceConsole["history"].push({[LoggerLineType.TRACE]: args});
        };

        consoleForTest.info = function () {
            const args = Array.prototype.slice.call(arguments);
            that.referenceConsole["history"].push({[LoggerLineType.INFO]: args});
        };

        consoleForTest.warn = function () {
            const args = Array.prototype.slice.call(arguments);
            that.referenceConsole["history"].push({[LoggerLineType.WARN]: args});
        };

        consoleForTest.error = function () {
            const args = Array.prototype.slice.call(arguments);
            that.referenceConsole["history"].push({[LoggerLineType.ERROR]: args});
        };

        consoleForTest.clear = function () {
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
    },

    stackList: function (stack: string) {
        const stackObject = JSON.parse(stack);
        const stackList = [];

        stackObject.forEach(line => {
            for (let levelLog in line) {
                if (line.hasOwnProperty(levelLog)) {
                    stackList.push(line[levelLog]);
                }
            }
        });

        return stackList;
    },

    stackOptionsList: function () {
        const stackList = this.stackList(this.stack(0));
        const stackOptionsList = [];

        stackList.forEach(line => {
            stackOptionsList.push({
                label: String(line[0]).replace("%c", ""),
                styles: this.parseCssString(line[1])
            });
        });

        return stackOptionsList;
    },

    parseCssString: function (css: string) {
        const result = {}, attributes = css.split(';');

        for (let i = 0; i < attributes.length; i++) {
            let entry = attributes[i].split(':');
            let property = String(entry.splice(0, 1)[0]).trim();
            let options = entry.join(':').trim();
            if (property.length) result[property] = options;
        }

        return result;
    }

};

export {LoggerInjector, LoggerLineType};
import {LoggerInjector, LoggerLineType} from "../helpers/converter";
import {ClientLogger, LoggerLevel} from "../src/logger";
import {expect} from 'chai';
import 'mocha';

const myConsoleStream: Console = LoggerInjector.patch();

enum CUSTOM_COLORS {
    TRACE = "BlueViolet",
    DEBUG = "CornflowerBlue",
    INFO = "DarkGreen",
    WARN = "Coral",
    ERROR = "Crimson"
}

enum CUSTOM_LABELS {
    TRACE = "trace:",
    DEBUG = "debug:",
    INFO = "info:",
    WARN = "warning:",
    ERROR = "error:"
}

const clientLogger = new ClientLogger({

    // Since we are emulating the console
    // and do not want the data to be output
    // during testing, we make the monkey patching
    console: myConsoleStream,

    // If we want to set text our own label
    labels: {
        [LoggerLevel.TRACE]: CUSTOM_LABELS.TRACE,
        [LoggerLevel.DEBUG]: CUSTOM_LABELS.DEBUG,
        [LoggerLevel.INFO]: CUSTOM_LABELS.INFO,
        [LoggerLevel.WARN]: CUSTOM_LABELS.WARN,
        [LoggerLevel.ERROR]: CUSTOM_LABELS.ERROR
    },

    // Also you can set the color for your label
    colors: {
        [LoggerLevel.TRACE]: CUSTOM_COLORS.TRACE,
        [LoggerLevel.DEBUG]: CUSTOM_COLORS.DEBUG,
        [LoggerLevel.INFO]: CUSTOM_COLORS.INFO,
        [LoggerLevel.WARN]: CUSTOM_COLORS.WARN,
        [LoggerLevel.ERROR]: CUSTOM_COLORS.ERROR
    }

});

describe('[TEST]: class initialization new ClientLogger({ .. })', () => {

    it(`Clear console stack is worked`, () => {
        clientLogger.clear();
        clientLogger.level = LoggerLevel.ALL;
        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack());
    });

    it(`Set minimal level: INFO`, () => {
        clientLogger.level = LoggerLevel.INFO;
        expect(clientLogger.level).to.equal(LoggerLevel.INFO);
    });

    it(`All data must go to the console, minimal level: TRACE`, () => {

        clientLogger.level = LoggerLevel.TRACE;
        clientLogger.clear();

        clientLogger.trace("trace is worked", 1, {a: 1});
        clientLogger.debug("debug is worked", 2, console);
        clientLogger.info("info is worked", 3, Object);
        clientLogger.warn("warn is worked", 4, String);
        clientLogger.error("error is worked", 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {[LoggerLineType.TRACE]: ["trace is worked", 1, {a: 1}]},
            {[LoggerLineType.DEBUG]: ["debug is worked", 2, console]},
            {[LoggerLineType.INFO]: ["info is worked", 3, Object]},
            {[LoggerLineType.WARN]: ["warn is worked", 4, String]},
            {[LoggerLineType.ERROR]: ["error is worked", 5, (2.55).toFixed()]}
        ));

    });

    it(`Show console stack when minimal level: DEBUG`, () => {

        clientLogger.level = LoggerLevel.DEBUG;
        clientLogger.clear();

        clientLogger.trace("trace is worked", 1, {a: 1});
        clientLogger.debug("debug is worked", 2, console);
        clientLogger.info("info is worked", 3, Object);
        clientLogger.warn("warn is worked", 4, String);
        clientLogger.error("error is worked", 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {[LoggerLineType.DEBUG]: ["debug is worked", 2, console]},
            {[LoggerLineType.INFO]: ["info is worked", 3, Object]},
            {[LoggerLineType.WARN]: ["warn is worked", 4, String]},
            {[LoggerLineType.ERROR]: ["error is worked", 5, (2.55).toFixed()]}
        ));

    });

    it(`Show console stack when minimal level: INFO`, () => {

        clientLogger.level = LoggerLevel.INFO;
        clientLogger.clear();

        clientLogger.trace("trace is worked", 1, {a: 1});
        clientLogger.debug("debug is worked", 2, console);
        clientLogger.info("info is worked", 3, Object);
        clientLogger.warn("warn is worked", 4, String);
        clientLogger.error("error is worked", 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {[LoggerLineType.INFO]: ["info is worked", 3, Object]},
            {[LoggerLineType.WARN]: ["warn is worked", 4, String]},
            {[LoggerLineType.ERROR]: ["error is worked", 5, (2.55).toFixed()]}
        ));

    });

    it(`Show console stack when minimal level: WARNING`, () => {

        clientLogger.level = LoggerLevel.WARN;
        clientLogger.clear();

        clientLogger.trace("trace is worked", 1, {a: 1});
        clientLogger.debug("debug is worked", 2, console);
        clientLogger.info("info is worked", 3, Object);
        clientLogger.warn("warn is worked", 4, String);
        clientLogger.error("error is worked", 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {[LoggerLineType.WARN]: ["warn is worked", 4, String]},
            {[LoggerLineType.ERROR]: ["error is worked", 5, (2.55).toFixed()]}
        ));

    });

    it(`Show console stack when minimal level: ERROR`, () => {

        clientLogger.level = LoggerLevel.ERROR;
        clientLogger.clear();

        clientLogger.trace("trace is worked", 1, {a: 1});
        clientLogger.debug("debug is worked", 2, console);
        clientLogger.info("info is worked", 3, Object);
        clientLogger.warn("warn is worked", 4, String);
        clientLogger.error("error is worked", 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {[LoggerLineType.ERROR]: ["error is worked", 5, (2.55).toFixed()]}
        ));

    });

    it(`Not showing data in console, level: OFF`, () => {

        clientLogger.level = LoggerLevel.OFF;
        clientLogger.clear();

        clientLogger.trace("trace is worked", 1, {a: 1});
        clientLogger.debug("debug is worked", 2, console);
        clientLogger.info("info is worked", 3, Object);
        clientLogger.warn("warn is worked", 4, String);
        clientLogger.error("error is worked", 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack());

    });

    it(`Set new text for labels: [trace, debug, info, warn, error]`, () => {

        clientLogger.level = LoggerLevel.ALL;
        clientLogger.clear();

        const traceLine = 0;
        clientLogger.trace("trace is worked", 1, {a: 1});

        const debugLine = 1;
        clientLogger.debug("debug is worked", 2, console);

        const infoLine = 2;
        clientLogger.info("info is worked", 3, Object);

        const warnLine = 3;
        clientLogger.warn("warn is worked", 4, String);

        const errorLine = 4;
        clientLogger.error("error is worked", 5, (2.55).toFixed());

        const stackOptionsList = LoggerInjector.stackOptionsList();

        const {label:traceLabel} = stackOptionsList[traceLine];
        const {label:debugLabel} = stackOptionsList[debugLine];
        const {label:infoLabel} = stackOptionsList[infoLine];
        const {label:warnLabel} = stackOptionsList[warnLine];
        const {label:errorLabel} = stackOptionsList[errorLine];

        expect(traceLabel).to.equal(CUSTOM_LABELS.TRACE);
        expect(debugLabel).to.equal(CUSTOM_LABELS.DEBUG);
        expect(infoLabel).to.equal(CUSTOM_LABELS.INFO);
        expect(warnLabel).to.equal(CUSTOM_LABELS.WARN);
        expect(errorLabel).to.equal(CUSTOM_LABELS.ERROR);

    });

    it(`Set new colors for labels`, () => {

        clientLogger.level = LoggerLevel.ALL;
        clientLogger.clear();

        const traceLine = 0;
        clientLogger.trace("trace is worked", 1, {a: 1});

        const debugLine = 1;
        clientLogger.debug("debug is worked", 2, console);

        const infoLine = 2;
        clientLogger.info("info is worked", 3, Object);

        const warnLine = 3;
        clientLogger.warn("warn is worked", 4, String);

        const errorLine = 4;
        clientLogger.error("error is worked", 5, (2.55).toFixed());

        const stackOptionsList = LoggerInjector.stackOptionsList();
        const {styles:traceStyle} = stackOptionsList[traceLine];
        const {styles:debugStyle} = stackOptionsList[debugLine];
        const {styles:infoStyle} = stackOptionsList[infoLine];
        const {styles:warnStyle} = stackOptionsList[warnLine];
        const {styles:errorStyle} = stackOptionsList[errorLine];

        expect(traceStyle.color).to.equal(CUSTOM_COLORS.TRACE);
        expect(debugStyle.color).to.equal(CUSTOM_COLORS.DEBUG);
        expect(infoStyle.color).to.equal(CUSTOM_COLORS.INFO);
        expect(warnStyle.color).to.equal(CUSTOM_COLORS.WARN);
        expect(errorStyle.color).to.equal(CUSTOM_COLORS.ERROR);

    });

});


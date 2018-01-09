import {LoggerInjector, LoggerLineType} from "../helpers/converter";
import {logger, LoggerLevel} from "../index";
import {COLORS, LABELS} from "../src/logger.interfaces";
import {expect} from 'chai';
import 'mocha';

const myConsoleStream: Console = LoggerInjector.patch();
logger.console = myConsoleStream;

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

describe('[TEST]: invoke default instance logger', () => {

    it(`Clear console stack is worked`, () => {
        logger.clear();
        logger.level = LoggerLevel.ALL;
        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack());
    });

    it(`Default minimal level is: ALL`, () => {
        expect(logger.level).to.equal(LoggerLevel.ALL);
    });

    it(`Set minimal level: INFO`, () => {
        logger.level = LoggerLevel.INFO;
        expect(logger.level).to.equal(LoggerLevel.INFO);
    });

    it(`All data must go to the console, minimal level: TRACE`, () => {

        logger.level = LoggerLevel.TRACE;
        logger.clear();

        logger.trace("trace is worked", 1, {a: 1});
        logger.debug("debug is worked", 2, console);
        logger.info("info is worked", 3, Object);
        logger.warn("warn is worked", 4, String);
        logger.error("error is worked", 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {[LoggerLineType.TRACE]: ["trace is worked", 1, {a: 1}]},
            {[LoggerLineType.DEBUG]: ["debug is worked", 2, console]},
            {[LoggerLineType.INFO]: ["info is worked", 3, Object]},
            {[LoggerLineType.WARN]: ["warn is worked", 4, String]},
            {[LoggerLineType.ERROR]: ["error is worked", 5, (2.55).toFixed()]}
        ));

    });

    it(`Show console stack when minimal level: DEBUG`, () => {

        logger.level = LoggerLevel.DEBUG;
        logger.clear();

        logger.trace("trace is worked", 1, {a: 1});
        logger.debug("debug is worked", 2, console);
        logger.info("info is worked", 3, Object);
        logger.warn("warn is worked", 4, String);
        logger.error("error is worked", 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {[LoggerLineType.DEBUG]: ["debug is worked", 2, console]},
            {[LoggerLineType.INFO]: ["info is worked", 3, Object]},
            {[LoggerLineType.WARN]: ["warn is worked", 4, String]},
            {[LoggerLineType.ERROR]: ["error is worked", 5, (2.55).toFixed()]}
        ));

    });

    it(`Show console stack when minimal level: INFO`, () => {

        logger.level = LoggerLevel.INFO;
        logger.clear();

        logger.trace("trace is worked", 1, {a: 1});
        logger.debug("debug is worked", 2, console);
        logger.info("info is worked", 3, Object);
        logger.warn("warn is worked", 4, String);
        logger.error("error is worked", 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {[LoggerLineType.INFO]: ["info is worked", 3, Object]},
            {[LoggerLineType.WARN]: ["warn is worked", 4, String]},
            {[LoggerLineType.ERROR]: ["error is worked", 5, (2.55).toFixed()]}
        ));

    });

    it(`Show console stack when minimal level: WARNING`, () => {

        logger.level = LoggerLevel.WARN;
        logger.clear();

        logger.trace("trace is worked", 1, {a: 1});
        logger.debug("debug is worked", 2, console);
        logger.info("info is worked", 3, Object);
        logger.warn("warn is worked", 4, String);
        logger.error("error is worked", 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {[LoggerLineType.WARN]: ["warn is worked", 4, String]},
            {[LoggerLineType.ERROR]: ["error is worked", 5, (2.55).toFixed()]}
        ));

    });

    it(`Show console stack when minimal level: ERROR`, () => {

        logger.level = LoggerLevel.ERROR;
        logger.clear();

        logger.trace("trace is worked", 1, {a: 1});
        logger.debug("debug is worked", 2, console);
        logger.info("info is worked", 3, Object);
        logger.warn("warn is worked", 4, String);
        logger.error("error is worked", 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {[LoggerLineType.ERROR]: ["error is worked", 5, (2.55).toFixed()]}
        ));

    });

    it(`Not showing data in console, level: OFF`, () => {

        logger.level = LoggerLevel.OFF;
        logger.clear();

        logger.trace("trace is worked", 1, {a: 1});
        logger.debug("debug is worked", 2, console);
        logger.info("info is worked", 3, Object);
        logger.warn("warn is worked", 4, String);
        logger.error("error is worked", 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack());

    });

    it(`Detect default labels: [TRACE, DEBUG, INFO, WARN, ERROR]`, () => {

        logger.level = LoggerLevel.ALL;
        logger.clear();

        const traceLine = 0;
        logger.trace("trace is worked", 1, {a: 1});

        const debugLine = 1;
        logger.debug("debug is worked", 2, console);

        const infoLine = 2;
        logger.info("info is worked", 3, Object);

        const warnLine = 3;
        logger.warn("warn is worked", 4, String);

        const errorLine = 4;
        logger.error("error is worked", 5, (2.55).toFixed());

        const stackOptionsList = LoggerInjector.stackOptionsList();

        const {label: traceLabel} = stackOptionsList[traceLine];
        const {label: debugLabel} = stackOptionsList[debugLine];
        const {label: infoLabel} = stackOptionsList[infoLine];
        const {label: warnLabel} = stackOptionsList[warnLine];
        const {label: errorLabel} = stackOptionsList[errorLine];

        expect(traceLabel).to.equal(LABELS.TRACE);
        expect(debugLabel).to.equal(LABELS.DEBUG);
        expect(infoLabel).to.equal(LABELS.INFO);
        expect(warnLabel).to.equal(LABELS.WARN);
        expect(errorLabel).to.equal(LABELS.ERROR);

    });

    it(`Set new text for labels: [trace, debug, info, warn, error]`, () => {

        logger.level = LoggerLevel.ALL;
        logger.clear();

        logger.setLabels({
            [LoggerLevel.TRACE]: CUSTOM_LABELS.TRACE,
            [LoggerLevel.DEBUG]: CUSTOM_LABELS.DEBUG,
            [LoggerLevel.INFO]: CUSTOM_LABELS.INFO,
            [LoggerLevel.WARN]: CUSTOM_LABELS.WARN,
            [LoggerLevel.ERROR]: CUSTOM_LABELS.ERROR
        });

        const traceLine = 0;
        logger.trace("trace is worked", 1, {a: 1});

        const debugLine = 1;
        logger.debug("debug is worked", 2, console);

        const infoLine = 2;
        logger.info("info is worked", 3, Object);

        const warnLine = 3;
        logger.warn("warn is worked", 4, String);

        const errorLine = 4;
        logger.error("error is worked", 5, (2.55).toFixed());

        const stackOptionsList = LoggerInjector.stackOptionsList();

        const {label: traceLabel} = stackOptionsList[traceLine];
        const {label: debugLabel} = stackOptionsList[debugLine];
        const {label: infoLabel} = stackOptionsList[infoLine];
        const {label: warnLabel} = stackOptionsList[warnLine];
        const {label: errorLabel} = stackOptionsList[errorLine];

        expect(traceLabel).to.equal(CUSTOM_LABELS.TRACE);
        expect(debugLabel).to.equal(CUSTOM_LABELS.DEBUG);
        expect(infoLabel).to.equal(CUSTOM_LABELS.INFO);
        expect(warnLabel).to.equal(CUSTOM_LABELS.WARN);
        expect(errorLabel).to.equal(CUSTOM_LABELS.ERROR);

    });

    it(`Detect default colors`, () => {

        logger.level = LoggerLevel.ALL;
        logger.clear();

        const traceLine = 0;
        logger.trace("trace is worked", 1, {a: 1});

        const debugLine = 1;
        logger.debug("debug is worked", 2, console);

        const infoLine = 2;
        logger.info("info is worked", 3, Object);

        const warnLine = 3;
        logger.warn("warn is worked", 4, String);

        const errorLine = 4;
        logger.error("error is worked", 5, (2.55).toFixed());

        const stackOptionsList = LoggerInjector.stackOptionsList();
        const {styles: traceStyle} = stackOptionsList[traceLine];
        const {styles: debugStyle} = stackOptionsList[debugLine];
        const {styles: infoStyle} = stackOptionsList[infoLine];
        const {styles: warnStyle} = stackOptionsList[warnLine];
        const {styles: errorStyle} = stackOptionsList[errorLine];

        expect(traceStyle.color).to.equal(COLORS.TRACE);
        expect(debugStyle.color).to.equal(COLORS.DEBUG);
        expect(infoStyle.color).to.equal(COLORS.INFO);
        expect(warnStyle.color).to.equal(COLORS.WARN);
        expect(errorStyle.color).to.equal(COLORS.ERROR);

    });

    it(`Set new colors for labels`, () => {

        logger.level = LoggerLevel.ALL;
        logger.clear();

        logger.setColors({
            [LoggerLevel.TRACE]: CUSTOM_COLORS.TRACE,
            [LoggerLevel.DEBUG]: CUSTOM_COLORS.DEBUG,
            [LoggerLevel.INFO]: CUSTOM_COLORS.INFO,
            [LoggerLevel.WARN]: CUSTOM_COLORS.WARN,
            [LoggerLevel.ERROR]: CUSTOM_COLORS.ERROR
        });

        const traceLine = 0;
        logger.trace("trace is worked", 1, {a: 1});

        const debugLine = 1;
        logger.debug("debug is worked", 2, console);

        const infoLine = 2;
        logger.info("info is worked", 3, Object);

        const warnLine = 3;
        logger.warn("warn is worked", 4, String);

        const errorLine = 4;
        logger.error("error is worked", 5, (2.55).toFixed());

        const stackOptionsList = LoggerInjector.stackOptionsList();
        const {styles: traceStyle} = stackOptionsList[traceLine];
        const {styles: debugStyle} = stackOptionsList[debugLine];
        const {styles: infoStyle} = stackOptionsList[infoLine];
        const {styles: warnStyle} = stackOptionsList[warnLine];
        const {styles: errorStyle} = stackOptionsList[errorLine];

        expect(traceStyle.color).to.equal(CUSTOM_COLORS.TRACE);
        expect(debugStyle.color).to.equal(CUSTOM_COLORS.DEBUG);
        expect(infoStyle.color).to.equal(CUSTOM_COLORS.INFO);
        expect(warnStyle.color).to.equal(CUSTOM_COLORS.WARN);
        expect(errorStyle.color).to.equal(CUSTOM_COLORS.ERROR);

    });

});


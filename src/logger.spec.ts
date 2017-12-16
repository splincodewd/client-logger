import {LoggerInjector, LoggerLineType} from "../helpers/converter";
import {ClientLogger, LoggerLevel} from "./logger";
import {expect} from 'chai';
import 'mocha';

const myConsoleStream = LoggerInjector.patch();
const logger = new ClientLogger({

    // Since we are emulating the console
    // and do not want the data to be output
    // during testing, we make the monkey patching
    consoleStream: myConsoleStream,

    // The logging level is displayed in the console
    showLevel: true,

    // If we want to set text our own label
    labelConfig: {
        [LoggerLevel.TRACE]: "trace:",
        [LoggerLevel.DEBUG]: "debug:",
        [LoggerLevel.INFO]: "info:",
        [LoggerLevel.WARN]: "warning:",
        [LoggerLevel.ERROR]: "error:",
    },

    // Also you can set the color for your label
    colorConfig: {
        [LoggerLevel.TRACE]: "BlueViolet",
        [LoggerLevel.DEBUG]: "CornflowerBlue",
        [LoggerLevel.INFO]: "DarkGreen",
        [LoggerLevel.WARN]: "Coral",
        [LoggerLevel.ERROR]: "Crimson"
    }

});

describe('[TEST]: ClientLogger', () => {

    it(`Default minimal level is: ALL`, () => {
        expect(logger.level).to.equal(LoggerLevel[LoggerLevel.ALL]);
    });

    it(`The logging level is displayed in the console`, () => {
        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {[LoggerLineType.DEBUG]: ["Logging levels: ", LoggerLevel[LoggerLevel.ALL]]}
        ));
    });

    it(`Clear console stack is worked`, () => {
        logger.clear();
        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack());
    });

    it(`Set minimal level: ALL`, () => {
        logger.level = LoggerLevel.ALL;
        expect(logger.level).to.equal(LoggerLevel[LoggerLevel.ALL]);
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

    it(`Set new text for labels: [trace, debug, info, warn, error]`, () => {

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

        const {label:traceLabel} = stackOptionsList[traceLine];
        const {label:debugLabel} = stackOptionsList[debugLine];
        const {label:infoLabel} = stackOptionsList[infoLine];
        const {label:warnLabel} = stackOptionsList[warnLine];
        const {label:errorLabel} = stackOptionsList[errorLine];

        expect(traceLabel).to.equal("trace:");
        expect(debugLabel).to.equal("debug:");
        expect(infoLabel).to.equal("info:");
        expect(warnLabel).to.equal("warning:");
        expect(errorLabel).to.equal("error:");

    });

    it(`Set new colors for labels`, () => {

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
        const {styles:traceStyle} = stackOptionsList[traceLine];
        const {styles:debugStyle} = stackOptionsList[debugLine];
        const {styles:infoStyle} = stackOptionsList[infoLine];
        const {styles:warnStyle} = stackOptionsList[warnLine];
        const {styles:errorStyle} = stackOptionsList[errorLine];

        expect(traceStyle.color).to.equal("BlueViolet");
        expect(debugStyle.color).to.equal("CornflowerBlue");
        expect(infoStyle.color).to.equal("DarkGreen");
        expect(warnStyle.color).to.equal("Coral");
        expect(errorStyle.color).to.equal("Crimson");

    });



});


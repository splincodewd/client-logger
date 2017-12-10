import {LoggerInjector, LoggerLineType} from "./helper/converter";
import {LoggerLevel} from "../src/logger.interfaces";
import {ClientLogger} from "../src/logger";
import {expect} from 'chai';
import 'mocha';

const myConsoleStream = LoggerInjector.patch();
const logger = new ClientLogger({

    // Since we are emulating the console
    // and do not want the data to be output
    // during testing, we make the monkey patching
    consoleStream: myConsoleStream,

    // The logging level is displayed in the console
    showLevel: true

});

describe('[TEST]: ClientLogger', () => {

    it(`Default minimal level is: ALL`, () => {
        expect(logger.level).to.equal(LoggerLevel.ALL);
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
        expect(logger.level).to.equal(LoggerLevel.ALL);
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

});


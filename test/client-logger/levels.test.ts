import { LoggerInjector, LoggerLineType } from '../helpers/converter';
import { ClientLogger, LoggerLevel } from '../../index';
import { expect } from 'chai';
import 'mocha';

const myConsoleStream: Console = LoggerInjector.patch();

const clientLogger = new ClientLogger({

    // Since we are emulating the console
    // and do not want the data to be output
    // during testing, we make the monkey patching
    consoleInstance: myConsoleStream

});

describe('[TEST]: Execute method by Level', () => {

    it(`All data must go to the console, minimal level: TRACE`, () => {

        clientLogger.level = LoggerLevel.TRACE;
        clientLogger.clear();

        clientLogger.trace('trace is worked', 1, { a: 1 });
        clientLogger.debug('debug is worked', 2, console);
        clientLogger.info('info is worked', 3, Object);
        clientLogger.warn('warn is worked', 4, String);
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [LoggerLineType.TRACE]: ['trace is worked', 1, { a: 1 }] },
            { [LoggerLineType.DEBUG]: ['debug is worked', 2, console] },
            { [LoggerLineType.INFO]: ['info is worked', 3, Object] },
            { [LoggerLineType.WARN]: ['warn is worked', 4, String] },
            { [LoggerLineType.ERROR]: ['error is worked', 5, (2.55).toFixed()] }
        ));

    });

    it(`Show console stack when minimal level: DEBUG`, () => {

        clientLogger.level = LoggerLevel.DEBUG;
        clientLogger.clear();

        clientLogger.trace('trace is worked', 1, { a: 1 });
        clientLogger.debug('debug is worked', 2, console);
        clientLogger.info('info is worked', 3, Object);
        clientLogger.warn('warn is worked', 4, String);
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [LoggerLineType.DEBUG]: ['debug is worked', 2, console] },
            { [LoggerLineType.INFO]: ['info is worked', 3, Object] },
            { [LoggerLineType.WARN]: ['warn is worked', 4, String] },
            { [LoggerLineType.ERROR]: ['error is worked', 5, (2.55).toFixed()] }
        ));

    });

    it(`Show console stack when minimal level: INFO`, () => {

        clientLogger.level = LoggerLevel.INFO;
        clientLogger.clear();

        clientLogger.trace('trace is worked', 1, { a: 1 });
        clientLogger.debug('debug is worked', 2, console);
        clientLogger.info('info is worked', 3, Object);
        clientLogger.warn('warn is worked', 4, String);
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [LoggerLineType.INFO]: ['info is worked', 3, Object] },
            { [LoggerLineType.WARN]: ['warn is worked', 4, String] },
            { [LoggerLineType.ERROR]: ['error is worked', 5, (2.55).toFixed()] }
        ));

    });

    it(`Show console stack when minimal level: WARNING`, () => {

        clientLogger.level = LoggerLevel.WARN;
        clientLogger.clear();

        clientLogger.trace('trace is worked', 1, { a: 1 });
        clientLogger.debug('debug is worked', 2, console);
        clientLogger.info('info is worked', 3, Object);
        clientLogger.warn('warn is worked', 4, String);
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [LoggerLineType.WARN]: ['warn is worked', 4, String] },
            { [LoggerLineType.ERROR]: ['error is worked', 5, (2.55).toFixed()] }
        ));

    });

    it(`Show console stack when minimal level: ERROR`, () => {

        clientLogger.level = LoggerLevel.ERROR;
        clientLogger.clear();

        clientLogger.trace('trace is worked', 1, { a: 1 });
        clientLogger.debug('debug is worked', 2, console);
        clientLogger.info('info is worked', 3, Object);
        clientLogger.warn('warn is worked', 4, String);
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [LoggerLineType.ERROR]: ['error is worked', 5, (2.55).toFixed()] }
        ));

    });

    it(`Not showing data in console, level: OFF`, () => {

        clientLogger.level = LoggerLevel.OFF;
        clientLogger.clear();

        clientLogger.trace('trace is worked', 1, { a: 1 });
        clientLogger.debug('debug is worked', 2, console);
        clientLogger.info('info is worked', 3, Object);
        clientLogger.warn('warn is worked', 4, String);
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack());

    });

});

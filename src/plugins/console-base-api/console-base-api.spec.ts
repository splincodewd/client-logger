import { LoggerInjector, TestLoggerLineType } from '../../utils/spec-helpers/converter';
import { ClientLogger, LoggerLevel } from './../../../index';
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

        clientLogger.log('custom log output');
        clientLogger.trace('trace is worked', 1, { a: 1 });
        clientLogger.debug('debug is worked', 2, console);
        clientLogger.info('info is worked', 3, Object);
        clientLogger.warn('warn is worked', 4, String);
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [TestLoggerLineType.LOG]: ['custom log output'] },
            { [TestLoggerLineType.TRACE]: ['trace is worked', 1, { a: 1 }] },
            { [TestLoggerLineType.DEBUG]: ['debug is worked', 2, console] },
            { [TestLoggerLineType.INFO]: ['info is worked', 3, Object] },
            { [TestLoggerLineType.WARN]: ['warn is worked', 4, String] },
            { [TestLoggerLineType.ERROR]: ['error is worked', 5, (2.55).toFixed()] }
        ));

    });

    it(`Show console stack when minimal level: DEBUG`, () => {

        clientLogger.level = LoggerLevel.DEBUG;
        clientLogger.clear();

        clientLogger.log('custom log output');
        clientLogger.trace('trace is worked', 1, { a: 1 });
        clientLogger.debug('debug is worked', 2, console);
        clientLogger.info('info is worked', 3, Object);
        clientLogger.warn('warn is worked', 4, String);
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [TestLoggerLineType.LOG]: ['custom log output'] },
            { [TestLoggerLineType.DEBUG]: ['debug is worked', 2, console] },
            { [TestLoggerLineType.INFO]: ['info is worked', 3, Object] },
            { [TestLoggerLineType.WARN]: ['warn is worked', 4, String] },
            { [TestLoggerLineType.ERROR]: ['error is worked', 5, (2.55).toFixed()] }
        ));

    });

    it(`Show console stack when minimal level: INFO`, () => {

        clientLogger.level = LoggerLevel.INFO;
        clientLogger.clear();

        clientLogger.log('custom log output');
        clientLogger.trace('trace is worked', 1, { a: 1 });
        clientLogger.debug('debug is worked', 2, console);
        clientLogger.info('info is worked', 3, Object);
        clientLogger.warn('warn is worked', 4, String);
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [TestLoggerLineType.LOG]: ['custom log output'] },
            { [TestLoggerLineType.INFO]: ['info is worked', 3, Object] },
            { [TestLoggerLineType.WARN]: ['warn is worked', 4, String] },
            { [TestLoggerLineType.ERROR]: ['error is worked', 5, (2.55).toFixed()] }
        ));

    });

    it(`Show console stack when minimal level: WARNING`, () => {

        clientLogger.level = LoggerLevel.WARN;
        clientLogger.clear();

        clientLogger.log('custom log output');
        clientLogger.trace('trace is worked', 1, { a: 1 });
        clientLogger.debug('debug is worked', 2, console);
        clientLogger.info('info is worked', 3, Object);
        clientLogger.warn('warn is worked', 4, String);
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [TestLoggerLineType.WARN]: ['warn is worked', 4, String] },
            { [TestLoggerLineType.ERROR]: ['error is worked', 5, (2.55).toFixed()] }
        ));

    });

    it(`Show console stack when minimal level: ERROR`, () => {

        clientLogger.level = LoggerLevel.ERROR;
        clientLogger.clear();

        clientLogger.log('custom log output');
        clientLogger.trace('trace is worked', 1, { a: 1 });
        clientLogger.debug('debug is worked', 2, console);
        clientLogger.info('info is worked', 3, Object);
        clientLogger.warn('warn is worked', 4, String);
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [TestLoggerLineType.ERROR]: ['error is worked', 5, (2.55).toFixed()] }
        ));

    });

    it(`Not showing data in console, level: OFF`, () => {

        clientLogger.level = LoggerLevel.OFF;
        clientLogger.clear();

        clientLogger.log('custom log output');
        clientLogger.trace('trace is worked', 1, { a: 1 });
        clientLogger.debug('debug is worked', 2, console);
        clientLogger.info('info is worked', 3, Object);
        clientLogger.warn('warn is worked', 4, String);
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack());

    });

});

describe('[TEST]: Basic methods', () => {

    it(`Clear console stack is worked`, () => {
        clientLogger.clear();
        clientLogger.level = LoggerLevel.ALL;
        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack());
    });

    it(`Set minimal level: INFO`, () => {
        clientLogger.level = LoggerLevel.INFO;
        expect(clientLogger.level).to.equal(LoggerLevel.INFO);
    });

    it(`Assert: 5 is not grater than 6`, () => {
        clientLogger.clear();
        clientLogger.assert(5 > 6, '5 is not grater than 6');
        expect(LoggerInjector.stack(0)).to.equal(LoggerInjector.createStack(
            { [TestLoggerLineType.ASSERT]: ['5 is not grater than 6'] }
        ));
    });

    it(`Assert: 10 is grater than 6`, () => {
        clientLogger.clear();
        clientLogger.assert(10 > 6, '10 is not grater than 6');
        expect(LoggerInjector.stack(0)).to.equal(LoggerInjector.createStack());
    });

    it(`Table`, () => {

        clientLogger.clear();

        const data = [
            { name: 'Yusuf', age: 26 },
            { age: 34, name: 'Chen' }
        ];

        clientLogger.table(data);
        expect(LoggerInjector.stack(0)).to.equal(LoggerInjector.createStack(
            { [TestLoggerLineType.TABLE]: [data] }
        ));
    });

});

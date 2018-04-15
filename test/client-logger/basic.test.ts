import { ClientLogger, LoggerLevel } from '../../index';
import { LoggerInjector, TestLoggerLineType } from '../../helpers/4spec/converter';
import { expect } from 'chai';
import 'mocha';

const myConsoleStream: Console = LoggerInjector.patch();

const clientLogger = new ClientLogger({

    // Since we are emulating the console
    // and do not want the data to be output
    // during testing, we make the monkey patching
    consoleInstance: myConsoleStream

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

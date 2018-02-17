import { ClientLogger, LoggerLevel } from '../../index';
import { LoggerInjector } from '../helpers/converter';
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

});

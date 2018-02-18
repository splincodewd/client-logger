import { ClientLogger } from '../../index';
import { LoggerInjector, LoggerLineType } from '../helpers/converter';
import { expect } from 'chai';
import 'mocha';

const myConsoleStream: Console = LoggerInjector.patch();

const clientLogger = new ClientLogger({

    // Since we are emulating the console
    // and do not want the data to be output
    // during testing, we make the monkey patching
    consoleInstance: myConsoleStream

});

describe('[TEST]: Parse json', () => {

    it(`Pretty json (to string)`, () => {

        clientLogger.clear();

        const json = { a: 1, b: [1, 2] };

        // for pretty json usage logger.log method
        clientLogger.log(...clientLogger.stringify(json));

        // or minimal usage (but not working source map)
        clientLogger.printJSON(json);

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {
                [LoggerLineType.LOG]: [
                    '{\n\t%c"a":%c %c1%c,\n\t%c"b":%c [\n\t\t%c1%c,\n\t\t%c2%c\n\t]\n}',
                    'color:red', '', 'color:darkorange', '', 'color:red', '', 'color:darkorange', '', 'color:darkorange', ''
                ]
            },
            {
                [LoggerLineType.LOG]: [
                    '{\n\t%c"a":%c %c1%c,\n\t%c"b":%c [\n\t\t%c1%c,\n\t\t%c2%c\n\t]\n}',
                    'color:red', '', 'color:darkorange', '', 'color:red', '', 'color:darkorange', '', 'color:darkorange', ''
                ]
            }
        ));

    });

});

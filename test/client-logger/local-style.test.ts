import { LoggerInjector } from '../helpers/converter';
import { ClientLogger, LoggerLevel } from '../../index';
import { expect } from 'chai';
import 'mocha';

const myConsoleStream: Console = LoggerInjector.patch();

const clientLogger = new ClientLogger({

    // Since we are emulating the console
    // and do not want the data to be output
    // during testing, we make the monkey patching
    consoleInstance: myConsoleStream,

});

describe('[TEST]: Check local console line style', () => {

    it(`Set style another console line `, () => {

        clientLogger.level = LoggerLevel.ALL;
        clientLogger.clear();

        const logLineDebug = 0;
        const cssLineDebug = '{"text-transform":"uppercase","font-weight":"bold"}';
        clientLogger
            .css({ textTransform: 'uppercase', fontWeight: 'bold' })
            .debug('window current ');

        const logLineInfo = 1;
        const cssLineInfo = '{"color":"red","text-decoration":"underline","font-weight":"bold"}';
        clientLogger
            .css('color: red; text-decoration: underline; font-weight: bold')
            .info('It\'s awesome');

        const stackOptionsList = LoggerInjector.stackOptionsList(true);
        const { styles: debugStyle } = stackOptionsList[logLineDebug];
        const { styles: infoStyle } = stackOptionsList[logLineInfo];

        expect(JSON.stringify(debugStyle)).to.equal(cssLineDebug);
        expect(JSON.stringify(infoStyle)).to.equal(cssLineInfo);

    });

});

import { LoggerInjector, TestLoggerLineType } from '../../utils/spec-helpers/converter';
import { ClientLogger, LoggerLevel } from '../../../index';
import { expect } from 'chai';
import 'mocha';

const myConsoleStream: Console = LoggerInjector.patch();

describe('[TEST]: Check local console line style', () => {

    const clientLogger = new ClientLogger({

        // Since we are emulating the console
        // and do not want the data to be output
        // during testing, we make the monkey patching
        consoleInstance: myConsoleStream,

        cssClassMap: {
            'class-1': 'font-weight: bold',
            'class-2': 'text-decoration: line-through',
            'class-3': 'color: #666'
        }

    });

    it(`Set style another console line `, () => {

        clientLogger.level = LoggerLevel.ALL;
        clientLogger.clear();

        const logLineDebug = 0;
        const cssLineDebug = '{"text-transform":"uppercase","font-weight":"bold"}';
        clientLogger
            .css({textTransform: 'uppercase', fontWeight: 'bold'})
            .debug('window current ');

        const logLineInfo = 1;
        const cssLineInfo = '{"color":"red","text-decoration":"underline","font-weight":"bold"}';
        clientLogger
            .css('color: red; text-decoration: underline; font-weight: bold')
            .info('It\'s awesome');

        const stackOptionsList = LoggerInjector.stackOptionsList(true);
        const {styles: debugStyle} = stackOptionsList[logLineDebug];
        const {styles: infoStyle} = stackOptionsList[logLineInfo];

        expect(JSON.stringify(debugStyle)).to.equal(cssLineDebug);
        expect(JSON.stringify(infoStyle)).to.equal(cssLineInfo);

    });

    it('Get current line style', () => {

        clientLogger
            .css({
                textTransform: 'uppercase',
                fontWeight: 'bold',
                fontSize: '12px',
                margin: '10px',
                padding: '10px'
            });

        expect(clientLogger.getCurrentLineStyle()).to.deep.equal({
            style: 'text-transform:uppercase;font-weight:bold;font-size:12px;margin:10px;padding:10px;',
            format: '%s'
        });

    });

    it('Clear line style', () => {

        // with style
        clientLogger.css({fontWeight: 'bold'});
        expect(clientLogger.getCurrentLineStyle()).to.deep.equal({
            style: 'font-weight:bold;',
            format: '%s'
        });

        // without style
        clientLogger.css({fontWeight: 'bold'});
        clientLogger.clearCssCurrentLine();
        expect(clientLogger.getCurrentLineStyle()).to.deep.equal({
            style: null,
            format: '%s'
        });

    });

    it('Add css class', () => {

        clientLogger.clear();

        clientLogger.cssClass('class-1 class-3').log('Hello world');
        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {[TestLoggerLineType.LOG]: ['%c%s', 'font-weight: bold;color: #666', 'Hello world']},
        ));

        clientLogger.clear();

        clientLogger.cssClass('class-2').debug('Test 2');
        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {[TestLoggerLineType.DEBUG]: ['text-decoration: line-through', 'Test 2']},
        ));

    });

});

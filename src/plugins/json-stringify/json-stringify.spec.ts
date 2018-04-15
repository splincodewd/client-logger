import { ClientLogger } from '../../../index';
import { LoggerInjector, TestLoggerLineType } from '../../../helpers/converter';
import { expect } from 'chai';
import 'mocha';
import { BaseType } from './json-stringify.impl';
import { JsonStringifyConfig } from './json-stringify.config';

const KEY = JsonStringifyConfig.styles[BaseType.KEY];
const NUMBER = JsonStringifyConfig.styles[BaseType.NUMBER];
const myConsoleStream: Console = LoggerInjector.patch();

describe('[TEST]: JSON improved stringify', () => {

    it(`JSON with color`, () => {

        const clientLogger = new ClientLogger({
            consoleInstance: myConsoleStream,
            stringify: {...JsonStringifyConfig, ...{enableColor: true}}
        });

        clientLogger.clear();

        const json = {a: 1, b: [1, 2]};

        // for pretty json usage logger.log method
        clientLogger.log(...clientLogger.stringify(json));

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {
                [TestLoggerLineType.LOG]: [
                    '{\n\t%c"a":%c %c1%c,\n\t%c"b":%c [\n\t\t%c1%c,\n\t\t%c2%c\n\t]\n}',
                    KEY, '',
                    NUMBER, '',
                    KEY, '',
                    NUMBER, '',
                    NUMBER, ''
                ]
            }
        ));

    });

    it(`JSON without color`, () => {

        const clientLogger = new ClientLogger({
            consoleInstance: myConsoleStream,
            stringify: {...JsonStringifyConfig, ...{enableColor: false}}
        });

        clientLogger.clear();

        const json = {a: 1, b: [1, 2]};

        // for pretty json usage logger.log method
        clientLogger.log(...clientLogger.stringify(json));

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            {
                [TestLoggerLineType.LOG]: [
                    '{\n\t"a": 1,\n\t"b": [\n\t\t1,\n\t\t2\n\t]\n}'
                ]
            }
        ));

    });

});

import { LoggerInjector } from '../../utils/spec-helpers/converter';
import { CUSTOM_COLORS, CUSTOM_LABELS } from '../../utils/spec-helpers/custom-colors.enum';
import { ClientLogger, COLORS, LABELS, LoggerLevel } from './../../../index';
import { expect } from 'chai';
import 'mocha';

const myConsoleStream: Console = LoggerInjector.patch();

const clientLogger = new ClientLogger({

    // Since we are emulating the console
    // and do not want the data to be output
    // during testing, we make the monkey patching
    consoleInstance: myConsoleStream,

    // disable transform to upper case
    labelUpperCase: false,

    // If we want to set text our own label
    configLabel: {
        [LoggerLevel.TRACE]: CUSTOM_LABELS.TRACE,
        [LoggerLevel.DEBUG]: CUSTOM_LABELS.DEBUG,
        [LoggerLevel.INFO]: CUSTOM_LABELS.INFO,
        [LoggerLevel.WARN]: CUSTOM_LABELS.WARN,
        [LoggerLevel.ERROR]: CUSTOM_LABELS.ERROR
    },

    // Also you can set the color for your label
    configColor: {
        [LoggerLevel.TRACE]: CUSTOM_COLORS.TRACE,
        [LoggerLevel.DEBUG]: CUSTOM_COLORS.DEBUG,
        [LoggerLevel.INFO]: CUSTOM_COLORS.INFO,
        [LoggerLevel.WARN]: CUSTOM_COLORS.WARN,
        [LoggerLevel.ERROR]: CUSTOM_COLORS.ERROR
    }

});

describe('[TEST]: Check global style', () => {

    it(`Set new text for labels: [trace, debug, info, warn, error]`, () => {

        clientLogger.level = LoggerLevel.ALL;
        clientLogger.clear();

        const traceLine = 0;
        clientLogger.trace('trace is worked', 1, { a: 1 });

        const debugLine = 1;
        clientLogger.debug('debug is worked', 2, console);

        const infoLine = 2;
        clientLogger.info('info is worked', 3, Object);

        const warnLine = 3;
        clientLogger.warn('warn is worked', 4, String);

        const errorLine = 4;
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        const stackOptionsList = LoggerInjector.stackOptionsList();

        const { label: traceLabel } = stackOptionsList[traceLine];
        const { label: debugLabel } = stackOptionsList[debugLine];
        const { label: infoLabel } = stackOptionsList[infoLine];
        const { label: warnLabel } = stackOptionsList[warnLine];
        const { label: errorLabel } = stackOptionsList[errorLine];

        expect(traceLabel).to.equal(CUSTOM_LABELS.TRACE);
        expect(debugLabel).to.equal(CUSTOM_LABELS.DEBUG);
        expect(infoLabel).to.equal(CUSTOM_LABELS.INFO);
        expect(warnLabel).to.equal(CUSTOM_LABELS.WARN);
        expect(errorLabel).to.equal(CUSTOM_LABELS.ERROR);

    });

    it(`Detect custom colors for labels`, () => {

        clientLogger.level = LoggerLevel.ALL;
        clientLogger.clear();

        const traceLine = 0;
        clientLogger.trace('trace is worked', 1, { a: 1 });

        const debugLine = 1;
        clientLogger.debug('debug is worked', 2, console);

        const infoLine = 2;
        clientLogger.info('info is worked', 3, Object);

        const warnLine = 3;
        clientLogger.warn('warn is worked', 4, String);

        const errorLine = 4;
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        const stackOptionsList = LoggerInjector.stackOptionsList();
        const { styles: traceStyle } = stackOptionsList[traceLine];
        const { styles: debugStyle } = stackOptionsList[debugLine];
        const { styles: infoStyle } = stackOptionsList[infoLine];
        const { styles: warnStyle } = stackOptionsList[warnLine];
        const { styles: errorStyle } = stackOptionsList[errorLine];

        expect(traceStyle.color).to.equal(CUSTOM_COLORS.TRACE);
        expect(debugStyle.color).to.equal(CUSTOM_COLORS.DEBUG);
        expect(infoStyle.color).to.equal(CUSTOM_COLORS.INFO);
        expect(warnStyle.color).to.equal(CUSTOM_COLORS.WARN);
        expect(errorStyle.color).to.equal(CUSTOM_COLORS.ERROR);

    });

    it(`Clear custom labels: `, () => {

        clientLogger.clear();

        clientLogger.setLabels({
            [LoggerLevel.TRACE]: LABELS.TRACE,
            [LoggerLevel.DEBUG]: LABELS.DEBUG,
            [LoggerLevel.INFO]: LABELS.INFO,
            [LoggerLevel.WARN]: LABELS.WARN,
            [LoggerLevel.ERROR]: LABELS.ERROR
        });

        const traceLine = 0;
        clientLogger.trace('trace is worked', 1, { a: 1 });

        const debugLine = 1;
        clientLogger.debug('debug is worked', 2, console);

        const infoLine = 2;
        clientLogger.info('info is worked', 3, Object);

        const warnLine = 3;
        clientLogger.warn('warn is worked', 4, String);

        const errorLine = 4;
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        const stackOptionsList = LoggerInjector.stackOptionsList();

        const { label: traceLabel } = stackOptionsList[traceLine];
        const { label: debugLabel } = stackOptionsList[debugLine];
        const { label: infoLabel } = stackOptionsList[infoLine];
        const { label: warnLabel } = stackOptionsList[warnLine];
        const { label: errorLabel } = stackOptionsList[errorLine];

        expect(traceLabel).to.equal(LABELS.TRACE);
        expect(debugLabel).to.equal(LABELS.DEBUG);
        expect(infoLabel).to.equal(LABELS.INFO);
        expect(warnLabel).to.equal(LABELS.WARN);
        expect(errorLabel).to.equal(LABELS.ERROR);

    });

    it(`Set new colors for labels`, () => {

        clientLogger.level = LoggerLevel.ALL;
        clientLogger.clear();

        clientLogger.setColors({
            [LoggerLevel.TRACE]: COLORS.TRACE,
            [LoggerLevel.DEBUG]: COLORS.DEBUG,
            [LoggerLevel.INFO]: COLORS.INFO,
            [LoggerLevel.WARN]: COLORS.WARN,
            [LoggerLevel.ERROR]: COLORS.ERROR
        });

        const traceLine = 0;
        clientLogger.trace('trace is worked', 1, { a: 1 });

        const debugLine = 1;
        clientLogger.debug('debug is worked', 2, console);

        const infoLine = 2;
        clientLogger.info('info is worked', 3, Object);

        const warnLine = 3;
        clientLogger.warn('warn is worked', 4, String);

        const errorLine = 4;
        clientLogger.error('error is worked', 5, (2.55).toFixed());

        const stackOptionsList = LoggerInjector.stackOptionsList();
        const { styles: traceStyle } = stackOptionsList[traceLine];
        const { styles: debugStyle } = stackOptionsList[debugLine];
        const { styles: infoStyle } = stackOptionsList[infoLine];
        const { styles: warnStyle } = stackOptionsList[warnLine];
        const { styles: errorStyle } = stackOptionsList[errorLine];

        expect(traceStyle.color).to.equal(COLORS.TRACE);
        expect(debugStyle.color).to.equal(COLORS.DEBUG);
        expect(infoStyle.color).to.equal(COLORS.INFO);
        expect(warnStyle.color).to.equal(COLORS.WARN);
        expect(errorStyle.color).to.equal(COLORS.ERROR);

    });

});

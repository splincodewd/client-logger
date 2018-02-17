import { LoggerGroupType, LoggerInjector, LoggerLineType } from './helpers/converter';
import { ClientLogger, LoggerLevel, LABELS, COLORS } from '../index';
import { expect } from 'chai';
import 'mocha';

const myConsoleStream: Console = LoggerInjector.patch();

enum CUSTOM_COLORS {
    TRACE = 'BlueViolet',
    DEBUG = 'CornflowerBlue',
    INFO = 'DarkGreen',
    WARN = 'Coral',
    ERROR = 'Crimson'
}

enum CUSTOM_LABELS {
    TRACE = 'trace:',
    DEBUG = 'debug:',
    INFO = 'info:',
    WARN = 'warning:',
    ERROR = 'error:'
}

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

describe('[TEST]: ClientLogger', () => {

    it(`Clear console stack is worked`, () => {
        clientLogger.clear();
        clientLogger.level = LoggerLevel.ALL;
        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack());
    });

    it(`Set minimal level: INFO`, () => {
        clientLogger.level = LoggerLevel.INFO;
        expect(clientLogger.level).to.equal(LoggerLevel.INFO);
    });

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

    it(`Show classic group`, () => {

        clientLogger.clear();

        clientLogger.group('group label', ({ trace }) => {
            trace('trace is worked', 1, { a: 1 });
        });

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [LoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.INFO} group label` },
            { [LoggerLineType.TRACE]: ['trace is worked', 1, { a: 1 }] },
            { [LoggerGroupType.GROUP_END]: [] },
        ));

    });

    it(`Pipe group`, () => {

        clientLogger.clear();

        clientLogger
            .group('group name')
            .pipe(({ trace }) => trace('trace is worked'))
            .pipe(({ debug }) => debug('debug is worked'))
            .pipe(({ info }) => info('info is worked'))
            .pipe(({ warn }) => warn('warn is worked'))
            .pipe(({ error }) => error('error is worked'))
            .close();

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [LoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.INFO} group name` },
            { [LoggerLineType.TRACE]: ['trace is worked'] },
            { [LoggerLineType.DEBUG]: ['debug is worked'] },
            { [LoggerLineType.INFO]: ['info is worked'] },
            { [LoggerLineType.WARN]: ['warn is worked'] },
            { [LoggerLineType.ERROR]: ['error is worked'] },
            { [LoggerGroupType.GROUP_END]: [] },
        ));

    });

    it(`Pipe group-collapsed`, () => {

        clientLogger.clear();

        clientLogger
            .groupCollapsed('group collapsed name')
            .pipe(({ trace }) => trace('trace is worked'))
            .pipe(({ debug }) => debug('debug is worked'))
            .pipe(({ info }) => info('info is worked'))
            .pipe(({ warn }) => warn('warn is worked'))
            .pipe(({ error }) => error('error is worked'))
            .close();

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [LoggerGroupType.GROUP_COLLAPSED_OPEN]: `${CUSTOM_LABELS.INFO} group collapsed name` },
            { [LoggerLineType.TRACE]: ['trace is worked'] },
            { [LoggerLineType.DEBUG]: ['debug is worked'] },
            { [LoggerLineType.INFO]: ['info is worked'] },
            { [LoggerLineType.WARN]: ['warn is worked'] },
            { [LoggerLineType.ERROR]: ['error is worked'] },
            { [LoggerGroupType.GROUP_END]: [] },
        ));

    });

    it(`Pipe groups (with collapsed)`, () => {

        clientLogger.clear();

        clientLogger
            .groupCollapsed('group A')
            .pipe(({ trace }) => trace('trace is worked'))
            .close()
            .group('group B')
            .pipe(({ trace }) => trace('trace is worked'))
            .close();

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [LoggerGroupType.GROUP_COLLAPSED_OPEN]: `${CUSTOM_LABELS.INFO} group A` },
            { [LoggerLineType.TRACE]: ['trace is worked'] },
            { [LoggerGroupType.GROUP_END]: [] },
            { [LoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.INFO} group B` },
            { [LoggerLineType.TRACE]: ['trace is worked'] },
            { [LoggerGroupType.GROUP_END]: [] }
        ));

    });

    it(`Great groups with group`, () => {

        clientLogger.clear();

        clientLogger
            .group('A')
            .pipe(
                ({ trace }) => trace('trace is worked'),
                ({ debug }) => debug('debug is worked'),
                ({ info }) => info('info is worked'),
                ({ warn }) => warn('warn is worked'),
                ({ error }) => error('error is worked')
            )
            .groupCollapsed('B')
            .pipe(
                ({ trace }) => trace('trace is worked'),
                ({ debug }) => debug('debug is worked'),
                ({ info }) => info('info is worked'),
                ({ warn }) => warn('warn is worked'),
                ({ error }) => error('error is worked')
            )
            .group('C')
            .pipe(
                ({ trace }) => trace('trace is worked'),
                ({ debug }) => debug('debug is worked'),
                ({ info }) => info('info is worked'),
                ({ warn }) => warn('warn is worked'),
                ({ error }) => error('error is worked')
            )
            .closeAll();

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [LoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.INFO} A` },
            { [LoggerLineType.TRACE]: ['trace is worked'] },
            { [LoggerLineType.DEBUG]: ['debug is worked'] },
            { [LoggerLineType.INFO]: ['info is worked'] },
            { [LoggerLineType.WARN]: ['warn is worked'] },
            { [LoggerLineType.ERROR]: ['error is worked'] },
            { [LoggerGroupType.GROUP_COLLAPSED_OPEN]: `${CUSTOM_LABELS.INFO} B` },
            { [LoggerLineType.TRACE]: ['trace is worked'] },
            { [LoggerLineType.DEBUG]: ['debug is worked'] },
            { [LoggerLineType.INFO]: ['info is worked'] },
            { [LoggerLineType.WARN]: ['warn is worked'] },
            { [LoggerLineType.ERROR]: ['error is worked'] },
            { [LoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.INFO} C` },
            { [LoggerLineType.TRACE]: ['trace is worked'] },
            { [LoggerLineType.DEBUG]: ['debug is worked'] },
            { [LoggerLineType.INFO]: ['info is worked'] },
            { [LoggerLineType.WARN]: ['warn is worked'] },
            { [LoggerLineType.ERROR]: ['error is worked'] },
            { [LoggerGroupType.GROUP_END]: [] },
            { [LoggerGroupType.GROUP_END]: [] },
            { [LoggerGroupType.GROUP_END]: [] },
        ));

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

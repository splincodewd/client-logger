import { LoggerGroupType, LoggerInjector, LoggerLineType } from '../helpers/converter';
import { CUSTOM_COLORS, CUSTOM_LABELS } from '../helpers/custom-colors.enum';
import { ClientLogger, LoggerLevel } from '../../index';
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

describe('[TEST]: Correct work in groups', () => {

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

});

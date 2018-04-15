import { TestLoggerGroupType, LoggerInjector, TestLoggerLineType } from '../../helpers/converter';
import { CUSTOM_COLORS, CUSTOM_LABELS } from '../../helpers/custom-colors.enum';
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
            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.INFO} group label` },
            { [TestLoggerLineType.TRACE]: ['trace is worked', 1, { a: 1 }] },
            { [TestLoggerGroupType.GROUP_END]: [] },
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
            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.INFO} group name` },
            { [TestLoggerLineType.TRACE]: ['trace is worked'] },
            { [TestLoggerLineType.DEBUG]: ['debug is worked'] },
            { [TestLoggerLineType.INFO]: ['info is worked'] },
            { [TestLoggerLineType.WARN]: ['warn is worked'] },
            { [TestLoggerLineType.ERROR]: ['error is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },
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
            { [TestLoggerGroupType.GROUP_COLLAPSED_OPEN]: `${CUSTOM_LABELS.INFO} group collapsed name` },
            { [TestLoggerLineType.TRACE]: ['trace is worked'] },
            { [TestLoggerLineType.DEBUG]: ['debug is worked'] },
            { [TestLoggerLineType.INFO]: ['info is worked'] },
            { [TestLoggerLineType.WARN]: ['warn is worked'] },
            { [TestLoggerLineType.ERROR]: ['error is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },
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
            { [TestLoggerGroupType.GROUP_COLLAPSED_OPEN]: `${CUSTOM_LABELS.INFO} group A` },
            { [TestLoggerLineType.TRACE]: ['trace is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },
            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.INFO} group B` },
            { [TestLoggerLineType.TRACE]: ['trace is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] }
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
            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.INFO} A` },
            { [TestLoggerLineType.TRACE]: ['trace is worked'] },
            { [TestLoggerLineType.DEBUG]: ['debug is worked'] },
            { [TestLoggerLineType.INFO]: ['info is worked'] },
            { [TestLoggerLineType.WARN]: ['warn is worked'] },
            { [TestLoggerLineType.ERROR]: ['error is worked'] },
            { [TestLoggerGroupType.GROUP_COLLAPSED_OPEN]: `${CUSTOM_LABELS.INFO} B` },
            { [TestLoggerLineType.TRACE]: ['trace is worked'] },
            { [TestLoggerLineType.DEBUG]: ['debug is worked'] },
            { [TestLoggerLineType.INFO]: ['info is worked'] },
            { [TestLoggerLineType.WARN]: ['warn is worked'] },
            { [TestLoggerLineType.ERROR]: ['error is worked'] },
            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.INFO} C` },
            { [TestLoggerLineType.TRACE]: ['trace is worked'] },
            { [TestLoggerLineType.DEBUG]: ['debug is worked'] },
            { [TestLoggerLineType.INFO]: ['info is worked'] },
            { [TestLoggerLineType.WARN]: ['warn is worked'] },
            { [TestLoggerLineType.ERROR]: ['error is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },
            { [TestLoggerGroupType.GROUP_END]: [] },
            { [TestLoggerGroupType.GROUP_END]: [] },
        ));

    });

    it(`Level groups`, () => {

        clientLogger.clear();

        clientLogger.group({ label: 'A opened', level: LoggerLevel.TRACE }, ({ trace }) => {
            trace('trace group is worked');
        });

        clientLogger.group({ label: 'B opened', level: LoggerLevel.DEBUG }, ({ debug }) => {
            debug('debug group is worked');
        });

        clientLogger.group({ label: 'C opened', level: LoggerLevel.INFO }, ({ info }) => {
            info('info group is worked');
        });

        clientLogger.group({ label: 'D opened', level: LoggerLevel.WARN }, ({ warn }) => {
            warn('warn group is worked');
        });

        clientLogger.group({ label: 'E opened', level: LoggerLevel.ERROR }, ({ error }) => {
            error('error group is worked');
        });

        clientLogger.level = LoggerLevel.INFO;

        clientLogger.groupCollapsed({ label: 'A collapsed', level: LoggerLevel.TRACE }, ({ trace }) => {
            trace('trace group is worked');
        });

        clientLogger.groupCollapsed({ label: 'B collapsed', level: LoggerLevel.DEBUG }, ({ debug }) => {
            debug('debug group is worked');
        });

        clientLogger.groupCollapsed({ label: 'C collapsed', level: LoggerLevel.INFO }, ({ info }) => {
            info('info group is worked');
        });

        clientLogger.groupCollapsed({ label: 'D collapsed', level: LoggerLevel.WARN }, ({ warn }) => {
            warn('warn group is worked');
        });

        clientLogger.groupCollapsed({ label: 'E collapsed', level: LoggerLevel.ERROR }, ({ error }) => {
            error('error group is worked');
        });

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.TRACE} A opened` },
            { [TestLoggerLineType.TRACE]: ['trace group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.DEBUG} B opened` },
            { [TestLoggerLineType.DEBUG]: ['debug group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.INFO} C opened` },
            { [TestLoggerLineType.INFO]: ['info group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.WARN} D opened` },
            { [TestLoggerLineType.WARN]: ['warn group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.ERROR} E opened` },
            { [TestLoggerLineType.ERROR]: ['error group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_COLLAPSED_OPEN]: `${CUSTOM_LABELS.INFO} C collapsed` },
            { [TestLoggerLineType.INFO]: ['info group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_COLLAPSED_OPEN]: `${CUSTOM_LABELS.WARN} D collapsed` },
            { [TestLoggerLineType.WARN]: ['warn group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_COLLAPSED_OPEN]: `${CUSTOM_LABELS.ERROR} E collapsed` },
            { [TestLoggerLineType.ERROR]: ['error group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },
        ));

    });

    it(`Level pretty groups`, () => {

        clientLogger.clear();

        clientLogger.level = LoggerLevel.ALL;

        clientLogger.trace.group('A opened', ({ trace }) => trace('trace group is worked'));
        clientLogger.debug.group('B opened', ({ debug }) => debug('debug group is worked'));
        clientLogger.info.group('C opened', ({ info }) => info('info group is worked'));
        clientLogger.warn.group('D opened', ({ warn }) => warn('warn group is worked'));
        clientLogger.error.group('E opened', ({ error }) => error('error group is worked'));

        clientLogger.level = LoggerLevel.INFO;

        clientLogger.trace.groupCollapsed('A collapsed', ({ trace }) => trace('trace group is worked'));
        clientLogger.debug.groupCollapsed('B collapsed', ({ debug }) => debug('debug group is worked'));
        clientLogger.info.groupCollapsed('C collapsed', ({ info }) => info('info group is worked'));
        clientLogger.warn.groupCollapsed('D collapsed', ({ warn }) => warn('warn group is worked'));
        clientLogger.error.groupCollapsed('E collapsed', ({ error }) => error('error group is worked'));

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.TRACE} A opened` },
            { [TestLoggerLineType.TRACE]: ['trace group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.DEBUG} B opened` },
            { [TestLoggerLineType.DEBUG]: ['debug group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.INFO} C opened` },
            { [TestLoggerLineType.INFO]: ['info group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.WARN} D opened` },
            { [TestLoggerLineType.WARN]: ['warn group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.ERROR} E opened` },
            { [TestLoggerLineType.ERROR]: ['error group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_COLLAPSED_OPEN]: `${CUSTOM_LABELS.INFO} C collapsed` },
            { [TestLoggerLineType.INFO]: ['info group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_COLLAPSED_OPEN]: `${CUSTOM_LABELS.WARN} D collapsed` },
            { [TestLoggerLineType.WARN]: ['warn group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_COLLAPSED_OPEN]: `${CUSTOM_LABELS.ERROR} E collapsed` },
            { [TestLoggerLineType.ERROR]: ['error group is worked'] },
            { [TestLoggerGroupType.GROUP_END]: [] },
        ));

    });

    it(`Level groups with pipes`, () => {

        clientLogger.clear();
        clientLogger.level = LoggerLevel.INFO;

        clientLogger.group({ label: 'A', level: LoggerLevel.TRACE })
            .pipe(({ trace }) => trace('trace is worked from A'))
            .pipe(({ debug }) => debug('debug is worked from A'))
            .pipe(({ info }) => info('info is worked from A'))
            .pipe(({ warn }) => warn('warn is worked from A'))
            .pipe(({ error }) => error('error is worked from A'))
            .close()

            .group({ label: 'B', level: LoggerLevel.DEBUG })
            .pipe(({ trace }) => trace('trace is worked from B'))
            .pipe(({ debug }) => debug('debug is worked from B'))
            .pipe(({ info }) => info('info is worked from B'))
            .pipe(({ warn }) => warn('warn is worked from B'))
            .pipe(({ error }) => error('error is worked from B'))
            .close()

            .group({ label: 'C', level: LoggerLevel.INFO })
            .pipe(({ trace }) => trace('trace is worked from C'))
            .pipe(({ debug }) => debug('debug is worked from C'))
            .pipe(({ info }) => info('info is worked from C'))
            .pipe(({ warn }) => warn('warn is worked from C'))
            .pipe(({ error }) => error('error is worked from C'))
            .close()

            .group({ label: 'D', level: LoggerLevel.WARN })
            .pipe(({ trace }) => trace('trace is worked from D'))
            .pipe(({ debug }) => debug('debug is worked from D'))
            .pipe(({ info }) => info('info is worked from D'))
            .pipe(({ warn }) => warn('warn is worked from D'))
            .pipe(({ error }) => error('error is worked from D'))
            .close()

            .group({ label: 'E', level: LoggerLevel.ERROR })
            .pipe(({ trace }) => trace('trace is worked from E'))
            .pipe(({ debug }) => debug('debug is worked from E'))
            .pipe(({ info }) => info('info is worked from E'))
            .pipe(({ warn }) => warn('warn is worked from E'))
            .pipe(({ error }) => error('error is worked from E'))
            .close();

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.INFO} C` },
            { [TestLoggerLineType.INFO]: ['info is worked from C'] },
            { [TestLoggerLineType.WARN]: ['warn is worked from C'] },
            { [TestLoggerLineType.ERROR]: ['error is worked from C'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.WARN} D` },
            { [TestLoggerLineType.INFO]: ['info is worked from D'] },
            { [TestLoggerLineType.WARN]: ['warn is worked from D'] },
            { [TestLoggerLineType.ERROR]: ['error is worked from D'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.ERROR} E` },
            { [TestLoggerLineType.INFO]: ['info is worked from E'] },
            { [TestLoggerLineType.WARN]: ['warn is worked from E'] },
            { [TestLoggerLineType.ERROR]: ['error is worked from E'] },
            { [TestLoggerGroupType.GROUP_END]: [] },
        ));

    });

    it(`Level groups with pretty pipes`, () => {

        clientLogger.clear();
        clientLogger.level = LoggerLevel.INFO;

        clientLogger.trace.group('A')
            .pipe(({ trace }) => trace('trace is worked from A'))
            .pipe(({ debug }) => debug('debug is worked from A'))
            .pipe(({ info }) => info('info is worked from A'))
            .pipe(({ warn }) => warn('warn is worked from A'))
            .pipe(({ error }) => error('error is worked from A'))
            .close()

            .debug.group('B')
            .pipe(({ trace }) => trace('trace is worked from B'))
            .pipe(({ debug }) => debug('debug is worked from B'))
            .pipe(({ info }) => info('info is worked from B'))
            .pipe(({ warn }) => warn('warn is worked from B'))
            .pipe(({ error }) => error('error is worked from B'))
            .close()

            .info.group('C')
            .pipe(({ trace }) => trace('trace is worked from C'))
            .pipe(({ debug }) => debug('debug is worked from C'))
            .pipe(({ info }) => info('info is worked from C'))
            .pipe(({ warn }) => warn('warn is worked from C'))
            .pipe(({ error }) => error('error is worked from C'))
            .close()

            .warn.group('D')
            .pipe(({ trace }) => trace('trace is worked from D'))
            .pipe(({ debug }) => debug('debug is worked from D'))
            .pipe(({ info }) => info('info is worked from D'))
            .pipe(({ warn }) => warn('warn is worked from D'))
            .pipe(({ error }) => error('error is worked from D'))
            .close()

            .error.group('E')
            .pipe(({ trace }) => trace('trace is worked from E'))
            .pipe(({ debug }) => debug('debug is worked from E'))
            .pipe(({ info }) => info('info is worked from E'))
            .pipe(({ warn }) => warn('warn is worked from E'))
            .pipe(({ error }) => error('error is worked from E'))
            .close();

        expect(LoggerInjector.stack()).to.equal(LoggerInjector.createStack(
            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.INFO} C` },
            { [TestLoggerLineType.INFO]: ['info is worked from C'] },
            { [TestLoggerLineType.WARN]: ['warn is worked from C'] },
            { [TestLoggerLineType.ERROR]: ['error is worked from C'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.WARN} D` },
            { [TestLoggerLineType.INFO]: ['info is worked from D'] },
            { [TestLoggerLineType.WARN]: ['warn is worked from D'] },
            { [TestLoggerLineType.ERROR]: ['error is worked from D'] },
            { [TestLoggerGroupType.GROUP_END]: [] },

            { [TestLoggerGroupType.GROUP_OPEN]: `${CUSTOM_LABELS.ERROR} E` },
            { [TestLoggerLineType.INFO]: ['info is worked from E'] },
            { [TestLoggerLineType.WARN]: ['warn is worked from E'] },
            { [TestLoggerLineType.ERROR]: ['error is worked from E'] },
            { [TestLoggerGroupType.GROUP_END]: [] },
        ));

    });

});

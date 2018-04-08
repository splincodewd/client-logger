import { ClientLogger, LoggerLevel } from '../../index';
import { MyConsole } from './MyConsole';
import { greatBigJSON } from './big.json';

// for testable in console
window['testLogger'] = new ClientLogger();

// Basic method (trace, debug, info, ..)
window['showExample1'] = function showExample1() {

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-basic-methods';
    logger.log(`See how usage: ${urlDocumentation}`);

    logger.trace('trace is worked', 1, { a: 1 });
    logger.debug('debug is worked', 2, console);
    logger.info('info is worked', 3, Object);
    logger.warn('warn is worked', 4, String);
    logger.error('error is worked', 5, (2.55).toFixed());

};

// Example groups (closed, opened)
window['showExample2'] = function showExample2() {

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-groups';
    logger.log(`See how usage: ${urlDocumentation}`);

    logger.groupCollapsed('EXAMPLE 2: show stack', () => {
        logger.trace('trace is worked', 1, { a: 1 });
        logger.debug('debug is worked', 2, console);
        logger.info('info is worked', 3, Object);
        logger.warn('warn is worked', 4, String);
        logger.error('error is worked', 5, (2.55).toFixed());
    });

    logger.group('Show trace in opened group', ({ trace }) => {
        for (let i = 0; i < 20; i++) {
            trace('trace is worked', i);
        }
    });

    logger.groupCollapsed('Show trace in collapsed group', ({ trace }) => {
        for (let i = 0; i < 20; i++) {
            trace('trace is worked', i);
        }
    });

};

// Pipe groups (deep)
window['showExample3'] = function showExample3() {

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-nested-groups';
    logger.log(`See how usage: ${urlDocumentation}`);

    logger
        .groupCollapsed('GROUP TEST')
        .pipe(({ trace, debug, info, warn, error }) => {
            trace('trace is worked');
            debug('debug is worked');
            info('info is worked');
            warn('warn is worked');
            error('error is worked');
        })
        .close();

    logger
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
        .closeAll(); // closed all opened group

};

// Show only warnings and error
window['showExample4'] = function showExample4() {

    const production = true;
    const level = production ? LoggerLevel.WARN : LoggerLevel.ALL;

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-set-minimal-logging-level';
    logger.log(`See how usage: ${urlDocumentation}`);
    logger.log('Set current logger level: ', LoggerLevel[level]);
    logger.level = level;

    logger.log('custom output'); // not execute
    logger.trace('trace is worked'); // not execute
    logger.debug('debug is worked'); // not execute
    logger.info('info is worked'); // not execute
    logger.warn('warn is worked');
    logger.error('error is worked');

};

// Custom css styles for line
window['showExample5'] = function showExample5() {

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-set-style-line';
    logger.log(`See how usage: ${urlDocumentation}`);

    logger
        .css({ textTransform: 'uppercase', fontWeight: 'bold' })
        .debug('window current ', window);

    logger
        .css('color: red; text-decoration: underline; font-weight: bold')
        .info('It is awesome logger');

    logger.warn('logger.css(...) does not define a global format!');
    logger.info('For global configuration, use the constructor parameters');

};

// Pretty json output
window['showExample6'] = function showExample6() {

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-pretty-json';
    logger.log(`See how usage: ${urlDocumentation}`);

    logger
        .group('Classic output json:')
        .pipe(({ debug }) => debug('Classic output json: ', greatBigJSON))
        .close()
        .group('Pretty output json:')
        // TODO: stringify catch bug Chrome 65+
        .pipe(({ log, stringify }) => log(...stringify(greatBigJSON, false)))
        .close();

};

// Level groups
window['showExample7'] = function showExample7() {

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-level-groups';
    logger.log(`See how usage: ${urlDocumentation}`);

    const level = LoggerLevel.INFO;
    logger.log('Set new logger level', LoggerLevel[level]);
    logger.level = level;

    logger.trace.group('A')
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

};

// Clipboard
window['showExample8'] = function showExample8() {

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-clipboard';
    logger.log(`See how usage: ${urlDocumentation}`);
    logger.level = LoggerLevel.ALL;

    const JsonValue = { a: 1, b: [1, 2, 3] };

    logger.group('copy JSON', ({ log, stringify, clipboard }) => {
        log(...stringify(clipboard.copy(JsonValue)));
        log('The object you have on the clipboard ...');
    });

};

// Full configuration (change labels, colors)
window['showExampleEnd'] = function showExampleEnd() {

    const logger = new ClientLogger({

        // Drop-in replacement for console, if needed
        consoleInstance: <Console> new MyConsole(),

        // Minimal execute signature
        minLevel: LoggerLevel.INFO,

        // Custom color
        configColor: {
            [LoggerLevel.TRACE]: 'Grey',
            [LoggerLevel.DEBUG]: 'Blue',
            [LoggerLevel.INFO]: 'Green',
            [LoggerLevel.WARN]: 'Orange',
            [LoggerLevel.ERROR]: 'Red',
        },

        // Custom label
        configLabel: {
            [LoggerLevel.TRACE]: 'trace: ',
            [LoggerLevel.DEBUG]: 'debug: ',
            [LoggerLevel.INFO]: 'info: ',
            [LoggerLevel.WARN]: 'warn: ',
            [LoggerLevel.ERROR]: 'error: ',
        }

    });

    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-full-configurations';
    logger.log(`See how usage: ${urlDocumentation}`);

    logger.trace('trace is worked', 1, { a: 1 }); // not execute
    logger.debug('debug is worked', 2, console); // not execute
    logger.info('info is worked', 3, Object);
    logger.warn('warn is worked', 4, String);
    logger.error('error is worked', 5, (2.55).toFixed());

};



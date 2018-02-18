import { ClientLogger, LoggerLevel } from '../../index';
import { MyConsole } from './MyConsole';

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

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-pipe-groups';
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
    logger.log('Set current logger level: ', LoggerLevel[level]);

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-production';
    logger.log(`See how usage: ${urlDocumentation}`);
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
    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-set-style-line';
    logger.log(`See how usage: ${urlDocumentation}`);
    logger.clear();

    logger
        .css({ textTransform: 'uppercase', fontWeight: 'bold' })
        .debug('window current ', window);

    logger
        .css('color: red; text-decoration: underline; font-weight: bold')
        .info('It is awesome logger');

    logger.warn('logger.css(...) does not define a global format!');

    logger.info('For global configuration, use the constructor parameters');

};

// Full configuration (change labels, colors)
window['showExample6'] = function showExample6() {

    const logger = new ClientLogger({

        // Drop-in replacement for console, if needed
        consoleInstance: <Console> new MyConsole(),

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
    logger.level = LoggerLevel.ALL;

    logger.trace('trace is worked', 1, { a: 1 });
    logger.debug('debug is worked', 2, console);
    logger.info('info is worked', 3, Object);
    logger.warn('warn is worked', 4, String);
    logger.error('error is worked', 5, (2.55).toFixed());

};

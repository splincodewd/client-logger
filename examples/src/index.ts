import { ClientLogger, LoggerLevel } from '../../index';
import { MyConsole } from './MyConsole';

window['showExample1'] = function showExample1() {

    const logger = new ClientLogger();

    logger.clear();
    logger.level = LoggerLevel.ALL;

    logger.info('EXAMPLE 1 (you need set level Verbose in console)');
    logger.trace('trace is worked', 1, { a: 1 });
    logger.debug('debug is worked', 2, console);
    logger.info('info is worked', 3, Object);
    logger.warn('warn is worked', 4, String);
    logger.error('error is worked', 5, (2.55).toFixed());

};

window['showExample2'] = function showExample2() {

    const logger = new ClientLogger();

    logger.clear();
    logger.level = LoggerLevel.ALL;

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


window['showExample3'] = function showExample3() {

    const logger = new ClientLogger();

    logger.clear();
    logger.level = LoggerLevel.ALL;

    const isProd = process.env.production || true;
    logger.level = isProd ? LoggerLevel.INFO : LoggerLevel.ALL;

    logger.trace('trace is worked', 1, { a: 1 });
    logger.debug('debug is worked', 2, console);
    logger.info('info is worked', 'current logger level', logger.level);
    logger.warn('warn is worked', 4, String);
    logger.error('error is worked', 5, (2.55).toFixed());

};

window['showExample4'] = function showExample4() {

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


window['showExample5'] = function showExample4() {

    const logger = new ClientLogger();
    logger.clear();

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

window['showExample6'] = function showExample4() {

    const logger = new ClientLogger();
    logger.clear();

    logger
        .css({ textTransform: 'uppercase', fontWeight: 'bold' })
        .debug('window current ', window);

    logger
        .css('color: red; text-decoration: underline; font-weight: bold')
        .info('It\'s awesome');

    logger.warn('logger.css(...) does not define a global format!');

    logger.info('For global configuration, use the constructor parameters');

};

import { MyConsole } from './share/my-console';
import { greatBigJSON } from './share/entity';
import { LoggerBootstrapInit } from './share';

export class Examples {

  public static async showExample1() {
    const { ClientLogger } = await LoggerBootstrapInit();

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-basic-methods';
    logger.log(`See how usage: ${urlDocumentation}`);

    logger.trace('trace is worked', 1, {a: 1});
    logger.debug('debug is worked', 2, console);
    logger.info('info is worked', 3, Object);
    logger.warn('warn is worked', 4, String);
    logger.error('error is worked', 5, (2.55).toFixed());

  }

  public static async showExample2() {
    const { ClientLogger } = await LoggerBootstrapInit();

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-groups';
    logger.log(`See how usage: ${urlDocumentation}`);

    logger.groupCollapsed('EXAMPLE 2: show stack', () => {
      logger.trace('trace is worked', 1, {a: 1});
      logger.debug('debug is worked', 2, console);
      logger.info('info is worked', 3, Object);
      logger.warn('warn is worked', 4, String);
      logger.error('error is worked', 5, (2.55).toFixed());
    });

    logger.group('Show trace in opened group', ({trace}) => {
      for (let i = 0; i < 20; i++) {
        trace('trace is worked', i);
      }
    });

    logger.groupCollapsed('Show trace in collapsed group', ({trace}) => {
      for (let i = 0; i < 20; i++) {
        trace('trace is worked', i);
      }
    });

  }

  public static async showExample3() {
    const { ClientLogger } = await LoggerBootstrapInit();

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-nested-groups';
    logger.log(`See how usage: ${urlDocumentation}`);

    logger
      .groupCollapsed('GROUP TEST')
      .pipe(({trace, debug, info, warn, error}) => {
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
        ({trace}) => trace('trace is worked'),
        ({debug}) => debug('debug is worked'),
        ({info}) => info('info is worked'),
        ({warn}) => warn('warn is worked'),
        ({error}) => error('error is worked')
      )
      .groupCollapsed('B')
      .pipe(
        ({trace}) => trace('trace is worked'),
        ({debug}) => debug('debug is worked'),
        ({info}) => info('info is worked'),
        ({warn}) => warn('warn is worked'),
        ({error}) => error('error is worked')
      )
      .group('C')
      .pipe(
        ({trace}) => trace('trace is worked'),
        ({debug}) => debug('debug is worked'),
        ({info}) => info('info is worked'),
        ({warn}) => warn('warn is worked'),
        ({error}) => error('error is worked')
      )
      .closeAll(); // closed all opened group

  }

  public static async showExample4() {
    const { ClientLogger, LoggerLevel } = await LoggerBootstrapInit();

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

  }

  public static async showExample5() {
    const { ClientLogger } = await LoggerBootstrapInit();

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-set-style-line';
    logger.log(`See how usage: ${urlDocumentation}`);

    logger
      .css({textTransform: 'uppercase', fontWeight: 'bold'})
      .debug('window current ', window);

    logger
      .css('color: red; text-decoration: underline; font-weight: bold')
      .info('It is awesome logger');

    logger.warn('logger.css(...) does not define a global format!');
    logger.info('For global configuration, use the constructor parameters');

  }

  public static async showExample6() {
    const { ClientLogger } = await LoggerBootstrapInit();

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-pretty-json';
    logger.log(`See how usage: ${urlDocumentation}`);

    logger
      .group('Classic output json:')
      .pipe(
        ({debug}) => debug('Classic output json: ', greatBigJSON)
      )
      .close()
      .group('Pretty output json:')
      .pipe(
        ({log, stringify}) => log(...stringify(greatBigJSON))
      )
      .close();

  }

  public static async showExample7() {
    const { ClientLogger, LoggerLevel } = await LoggerBootstrapInit();

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-level-groups';
    logger.log(`See how usage: ${urlDocumentation}`);

    const level = LoggerLevel.INFO;
    logger.log('Set new logger level', LoggerLevel[level]);
    logger.level = level;

    logger.trace.group('A')
      .pipe(({trace}) => trace('trace is worked from A'))
      .pipe(({debug}) => debug('debug is worked from A'))
      .pipe(({info}) => info('info is worked from A'))
      .pipe(({warn}) => warn('warn is worked from A'))
      .pipe(({error}) => error('error is worked from A'))
      .close()

      .debug.group('B')
      .pipe(({trace}) => trace('trace is worked from B'))
      .pipe(({debug}) => debug('debug is worked from B'))
      .pipe(({info}) => info('info is worked from B'))
      .pipe(({warn}) => warn('warn is worked from B'))
      .pipe(({error}) => error('error is worked from B'))
      .close()

      .info.group('C')
      .pipe(({trace}) => trace('trace is worked from C'))
      .pipe(({debug}) => debug('debug is worked from C'))
      .pipe(({info}) => info('info is worked from C'))
      .pipe(({warn}) => warn('warn is worked from C'))
      .pipe(({error}) => error('error is worked from C'))
      .close()

      .warn.group('D')
      .pipe(({trace}) => trace('trace is worked from D'))
      .pipe(({debug}) => debug('debug is worked from D'))
      .pipe(({info}) => info('info is worked from D'))
      .pipe(({warn}) => warn('warn is worked from D'))
      .pipe(({error}) => error('error is worked from D'))
      .close()

      .error.group('E')
      .pipe(({trace}) => trace('trace is worked from E'))
      .pipe(({debug}) => debug('debug is worked from E'))
      .pipe(({info}) => info('info is worked from E'))
      .pipe(({warn}) => warn('warn is worked from E'))
      .pipe(({error}) => error('error is worked from E'))
      .close();

  }

  public static async showExample8() {
    const { ClientLogger, LoggerLevel } = await LoggerBootstrapInit();

    const logger = new ClientLogger();
    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-clipboard';
    logger.log(`See how usage: ${urlDocumentation}`);
    logger.level = LoggerLevel.ALL;

    const JsonValue = {a: 1, b: [1, 2, 3]};

    logger.group('copy JSON', ({log, stringify, clipboard}) => {
      log(...stringify(clipboard.copy(JsonValue)));
      log('The object you have on the clipboard ...');
    });

  }

  public static async showExample9() {
    const { ClientLogger, FormatLine } = await LoggerBootstrapInit();

    const logger = new ClientLogger({
      lineStyle: {
        style: 'color: red; text-decoration: underline; font-weight: bold; font-size: 15px',
        format: FormatLine.STRING
      }
    });

    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-set-global-style-line';
    logger.log(`See how usage: ${urlDocumentation}`);

    logger
      .css('font-weight: normal; text-decoration: none;', FormatLine.INT)
      .info(3.14); // 3

    logger
      .css('font-weight: normal;', FormatLine.FLOAT)
      .info(3.14); // 3.14

    logger.warn('global format with style!');

  }

  public static async showExample10() {
    const { ClientLogger } = await LoggerBootstrapInit();

    const logger = new ClientLogger({
      cssClassMap: {
        'bold': 'font-weight: bold',
        'line-through': 'text-decoration: line-through',
        'code-sandbox': `
                color: #666;
                background: #f4f4f4;
				border-left: 3px solid #f36d33;
                font-family: monospace;
                font-size: 15px;
            `
      }
    });

    logger.clear();

    const urlDocumentation = 'https://github.com/splincodewd/client-logger#example-css-classes';
    logger.log(`See how usage: ${urlDocumentation}`);

    logger.cssClass('bold line-through')
      .log('JavaScript sucks', 'JavaScript is the best');

    logger.cssClass('code-sandbox').log(
      '\n   @Component({ .. })' +
      '\n   export class AppComponent { .. }    \n\n'
    );

    logger.cssClass('bold line-through')
      .debug('JavaScript sucks', 'JavaScript is the best');

  }

  public static async showExampleEnd() {
    const { ClientLogger, LoggerLevel } = await LoggerBootstrapInit();

    const logger = new ClientLogger({

      // Drop-in replacement for console, if needed
      consoleInstance: new MyConsole() as Console,

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

    logger.trace('trace is worked', 1, {a: 1}); // not execute
    logger.debug('debug is worked', 2, console); // not execute
    logger.info('info is worked', 3, Object);
    logger.warn('warn is worked', 4, String);
    logger.error('error is worked', 5, (2.55).toFixed());

  }

}

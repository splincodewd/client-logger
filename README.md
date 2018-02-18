# ClientLogger [![Build Status](https://travis-ci.org/splincodewd/client-logger.svg?branch=master)](https://travis-ci.org/splincodewd/client-logger) [![npm version](https://badge.fury.io/js/%40splincode%2Fclient-logger.svg)](https://badge.fury.io/js/%40splincode%2Fclient-logger) [![dependencies Status](https://david-dm.org/splincodewd/client-logger/status.svg)](https://david-dm.org/splincodewd/client-logger) [![Coverage Status](https://coveralls.io/repos/github/splincodewd/client-logger/badge.svg?branch=master)](https://coveralls.io/github/splincodewd/client-logger?branch=master) [![Coverage Status](https://img.shields.io/npm/dt/@splincode/client-logger.svg)](https://npm-stat.com/charts.html?package=%40splincode%2Fclient-logger&from=2017-01-12)

> Lightweight and configurable JavaScript logger (written on TypeScript)

## Installation

```bash
npm i @splincode/client-logger --save-dev
```

### Todo

- [x] Override console
- [x] Logger method (trace, debug, info, warning, error)
- [x] Logger group + groupCollapsible (pipes)
- [x] Logger pretty write object
- [x] Set style by css
- [x] Logger level groups (trace, debug, info, warn, error)
- [ ] Set global style + add another css class
- [ ] Format output console
- [ ] Dependency Injection for Angular
- [ ] Switch enable/disable default console output
- [ ] Profiling (memory usage, sizeof, time execute)
- [ ] Timers (decorator)
- [ ] Pre process output
- [ ] Cross-browser fixing

## Usage

You could easily use this Logger in the browser. 
You only need to install the package and import it in your scripts before assembly.
To see how to use the Logger please 
[follow the link](https://stackblitz.com/edit/typescript-m8n8tj?file=index.ts) 
or follow that's [link](https://splincodewd.github.io/client-logger).

You can also run the examples on webpack:

```bash
$ git clone https://github.com/splincodewd/client-logger 
$ cd client-logger/examples/
$ npm install
$ npm start # open http://localhost:3000/
```

![](https://habrastorage.org/webt/jf/zn/_9/jfzn_9ir8zkns2gqhp6brzoztws.gif)

### Example: basic methods

```typescript
import { ClientLogger } from '@splincode/client-logger';

const logger = new ClientLogger();

logger.trace('trace is worked', 1, { a: 1 });
logger.debug('debug is worked', 2, console);
logger.info('info is worked', 3, Object);
logger.warn('warn is worked', 4, String);
logger.error('error is worked', 5, (2.55).toFixed());
```

* **Default level: All**

![](https://habrastorage.org/webt/x-/bc/3b/x-bc3bztgftwzvamekuffrxcilq.png)

* **Show time**

![](https://habrastorage.org/webt/1i/lj/rh/1iljrhzeiw_3mvbaji5gcx2adnm.gif)

* **Disable trace on console:**

```typescript
import { ClientLogger } from '@splincode/client-logger';

const logger = new ClientLogger();

for (let i = 0; i < 20; i++) {
    logger.trace('trace is worked', i);
}
```

![](https://habrastorage.org/webt/un/fl/81/unfl81h_wjnltr184of-vx1skio.gif)

### Example: groups

* **Logger groups with auto closed (usage callback):**

```typescript
import { ClientLogger } from '@splincode/client-logger';

const logger = new ClientLogger();

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
```

![](https://habrastorage.org/webt/zs/hv/fz/zshvfzrcslnsqo3dvyeiskrkwik.png)

### Example: nested groups

* **Logger nested groups (with pipe):**

```typescript
import { ClientLogger } from '@splincode/client-logger';

const logger = new ClientLogger();

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
```

![](https://habrastorage.org/webt/77/vi/gm/77vigmltfbdmxhiruv8xgxwjdrg.gif)

### Example: level groups

Basic parameterization

```typescript
import { ClientLogger, LoggerLevel } from '@splincode/client-logger';

const logger = new ClientLogger();

logger.group({ label: 'A opened', level: LoggerLevel.TRACE }, ({ trace }) => {
    trace('trace group is worked');
});

logger.group({ label: 'B opened', level: LoggerLevel.DEBUG }, ({ debug }) => {
    debug('debug group is worked');
});

logger.group({ label: 'C opened', level: LoggerLevel.INFO }, ({ info }) => {
    info('info group is worked');
});

logger.group({ label: 'D opened', level: LoggerLevel.WARN }, ({ warn }) => {
    warn('warn group is worked');
});

logger.group({ label: 'E opened', level: LoggerLevel.ERROR }, ({ error }) => {
    error('error group is worked');
});

const level = LoggerLevel.INFO;
logger.log('Set new logger level', LoggerLevel[level]);
logger.level = level;

logger.groupCollapsed({ label: 'A collapsed', level: LoggerLevel.TRACE }, ({ trace }) => {
    trace('trace group is worked');
});

logger.groupCollapsed({ label: 'B collapsed', level: LoggerLevel.DEBUG }, ({ debug }) => {
    debug('debug group is worked');
});

logger.groupCollapsed({ label: 'C collapsed', level: LoggerLevel.INFO }, ({ info }) => {
    info('info group is worked');
});

logger.groupCollapsed({ label: 'D collapsed', level: LoggerLevel.WARN }, ({ warn }) => {
    warn('warn group is worked');
});

logger.groupCollapsed({ label: 'E collapsed', level: LoggerLevel.ERROR }, ({ error }) => {
    error('error group is worked');
});

```

![](https://habrastorage.org/webt/bc/zc/dc/bczcdc_vicubrqr30jq3prg7no4.png)

* **Logger level groups (with pipe):**

```typescript
import { ClientLogger, LoggerLevel } from '@splincode/client-logger';

const logger = new ClientLogger();

const level = LoggerLevel.INFO;
logger.log('Set new logger level', LoggerLevel[level]);
logger.level = level;

logger.group({ label: 'A', level: LoggerLevel.TRACE })
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

```

![](https://habrastorage.org/webt/ca/rb/ub/carbube17g4h42ye2fjcvstcw_c.png)

### Example: production

Configuration by prod/dev:

```typescript
import { ClientLogger, LoggerLevel } from '@splincode/client-logger';

const production = true;
const level = production ? LoggerLevel.INFO : LoggerLevel.ALL;

const logger = new ClientLogger({ minLevel: level });
logger.log('Set current logger level: ', LoggerLevel[level]);

/**
 * OR:
 * const logger = new ClientLogger();
 * logger.level = minLevel;
 *
 */

logger.log('custom output'); // not execute
logger.trace('trace is worked'); // not execute
logger.debug('debug is worked'); // not execute
logger.info('info is worked'); // not execute
logger.warn('warn is worked');
logger.error('error is worked');
```

### Example: set style line

```typescript
import { ClientLogger } from '@splincode/client-logger';

const logger = new ClientLogger();

logger
    .css({ textTransform: 'uppercase', fontWeight: 'bold' })
    .debug('window current ', window);

logger
    .css('color: red; text-decoration: underline; font-weight: bold')
    .info('It is awesome logger');

logger.warn('logger.css(...) does not define a global format!');
logger.info('For global configuration, use the constructor parameters');
````

![](https://habrastorage.org/webt/4s/co/wh/4scowhxaxdl8ikcmxpyjtko269m.png)

### Example: pretty json

```typescript
import { ClientLogger } from '@splincode/client-logger';
const logger = new ClientLogger();

fetch("http://data.io").then((greatBigJSON) => {
    // default browser print json
    logger.debug("Classic output json", greatBigJSON);
    
    // for pretty json usage logger.log method
    logger.log(...logger.stringify(greatBigJSON));
    
    // or minimal usage (but does not work source map)
    logger.printJSON(greatBigJSON);
});
```

![](https://habrastorage.org/webt/zq/f9/wk/zqf9wkjej7gcpwmu-wa-nvpoosw.png)

```typescript
import { ClientLogger } from '@splincode/client-logger';
const logger = new ClientLogger();

fetch("http://data.io").then((greatBigJSON) => {
    
    logger
        .group('Classic output json:')
        .pipe(({ debug }) => debug('Classic output json: ', greatBigJSON))
        .close()
        .group('Pretty output json:')
        .pipe(({ log, stringify }) => log(...stringify(greatBigJSON)))
        .close();
    
});
```

![](https://habrastorage.org/webt/cp/yo/no/cpyonombmaemgbpdsqjallxjhuq.png)

### Example: full configurations

```typescript
import { ClientLogger, LoggerLevel } from '@splincode/client-logger';
import { MyConsole } from 'node_modules/custom-logger';
// ..

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

logger.trace('trace is worked', 1, { a: 1 }); // not execute
logger.debug('debug is worked', 2, console); // not execute
logger.info('info is worked', 3, Object);
logger.warn('warn is worked', 4, String);
logger.error('error is worked', 5, (2.55).toFixed());
```

## Development
Install the dependencies:

```bash
npm install
```

Run the dev server

```bash
npm start
```

Run the dev server

```bash
npm start
```

## Contributing 
Your commit messages have to be in this format:

```bash
type(category): description [flags]
```

Where type is one of the following:
* breaking
* build
* ci
* chore
* docs
* feat
* fix
* other
* perf
* refactor
* revert
* style
* test

## Run Tests
All logger tests are written with mocha, chai.

```bash
npm test
```

## About

Author: [Maxim Ivanov](https://github.com/splincode) <br>

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
- [ ] Logger level groups (trace, debug, info, warn, error)
- [ ] Format
- [ ] Pre process output
- [ ] Switch enable/disable default console output
- [ ] Profiling (memory usage, sizeof, time execute)
- [ ] Timers (decorator)
- [ ] Cross-browser fixing
- [ ] Dependency Injection for Angular

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

logger.log('log is worked', 'output without labels');
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

### Example: pipe groups

* **Logger groups (by pipe):**

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

logger
    .css('font-weight: bold')
    .warn('logger.css(...) does not define a global format!');

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
    
    // or minimal usage (but not working source map)
    logger.printJSON(greatBigJSON);
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
    
    minLevel: LoggerLevel.DEBUG,

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
logger.debug('debug is worked', 2, console);
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

```
breaking
build
ci
chore
docs
feat
fix
other
perf
refactor
revert
style
test
```

## Run Tests
All logger tests are written with mocha, chai.

```bash
npm test
```

## About

Author: [Maxim Ivanov](https://github.com/splincode) <br>

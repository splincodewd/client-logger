# ClientLogger

> Lightweight and configurable JavaScript logger (written on TypeScript)

 [![Build Status](https://travis-ci.org/splincodewd/client-logger.svg?branch=master)](https://travis-ci.org/splincodewd/client-logger) [![npm version](https://badge.fury.io/js/%40splincode%2Fclient-logger.svg)](https://badge.fury.io/js/%40splincode%2Fclient-logger) [![dependencies Status](https://david-dm.org/splincodewd/client-logger/status.svg)](https://david-dm.org/splincodewd/client-logger) [![Coverage Status](https://coveralls.io/repos/github/splincodewd/client-logger/badge.svg?branch=master)](https://coveralls.io/github/splincodewd/client-logger?branch=master) [![Coverage Status](https://img.shields.io/npm/dt/@splincode/client-logger.svg)](https://npm-stat.com/charts.html?package=%40splincode%2Fclient-logger&from=2017-01-12)

## Installation

```bash
npm i @splincode/client-logger --save-dev
```

## Motivation

This logger is a handy tool that can be useful 
in the design and development of the enterprise application level.
Easy setting of logging levels and convenient work with groups.
Among other things, you can use meta programming (decorators).

## Usage

You could easily use this Logger in the browser. 
You only need to install the package and import it in your scripts before assembly.
To see how to use the Logger please 
[follow the link](https://stackblitz.com/edit/typescript-m8n8tj?file=index.ts) 
or follow that's [link](https://splincodewd.github.io/client-logger).

You can also run the examples on webpack:

```ts
import { ClientLogger } from '@splincode/client-logger';

const logger = new ClientLogger();
```

## Table of contents

* [Logging](#)
  * [Basic usage API `trace`, `debug`, `info`, `warn`. `error`](#example-basic-methods)
  * [Groups, `groupCollapsed`, `collapsible`](#example-groups)
  * [Nested groups (usage pipe method)](#example-nested-groups)
  * [Set logging level (worked in single or groups)](#example-set-minimal-logging-level)
  * [Customization style line](#example-set-style-line)
  * [Customization global style line](#example-set-global-style-line)
  * [Output pretty json `stringify`](#example-pretty-json)
  * [Copy `json, object, text` to clipboard](#example-clipboard)
  * [Configuration `ClientLogger`](#example-full-configurations)
* [Development](#development)
* [Contributing](#contributing)
* [Run Tests](#run-tests)
* [Todo](#todo)

## Logging

![](https://habrastorage.org/webt/xi/ku/d9/xikud9fkxwng2ndu66f_c8yolag.gif)

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

* **Disable trace on console (filter):**

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

### Example: set minimal logging level

Basic parameterization

```typescript
import { ClientLogger, LoggerLevel } from '@splincode/client-logger';

const logger = new ClientLogger();

logger.trace.group('A opened', ({ trace }) => trace('trace group is worked'));
logger.debug.group('B opened', ({ debug }) => debug('debug group is worked'));
logger.info.group('C opened', ({ info }) => info('info group is worked'));
logger.warn.group('D opened', ({ warn }) =>  warn('warn group is worked'));
logger.error.group('E opened', ({ error }) => error('error group is worked'));

const level = LoggerLevel.INFO;
logger.log('Set new logger level', LoggerLevel[level]);
logger.level = level;

logger.trace.groupCollapsed('A collapsed', ({ trace }) => trace('trace group is worked'));
logger.debug.groupCollapsed('B collapsed', ({ debug }) => debug('debug group is worked'));
logger.info.groupCollapsed('C collapsed', ({ info }) => info('info group is worked'));
logger.warn.groupCollapsed('D collapsed', ({ warn }) => warn('warn group is worked'));
logger.error.groupCollapsed('E collapsed', ({ error }) => error('error group is worked'));

```

![](https://habrastorage.org/webt/bc/zc/dc/bczcdc_vicubrqr30jq3prg7no4.png)

* **Logger level groups (pretty usage API):**

```typescript
import { ClientLogger, LoggerLevel } from '@splincode/client-logger';

const logger = new ClientLogger();

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

```

![](https://habrastorage.org/webt/ca/rb/ub/carbube17g4h42ye2fjcvstcw_c.png)

Set level in constructor ClientLogger

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

### Example: set global style line

```typescript
import { ClientLogger } from '@splincode/client-logger';

const logger = new ClientLogger({
    lineStyle: {
        style: 'color: red; text-decoration: underline; font-weight: bold; font-size: 15px',
        format: FormatLine.STRING
    }
});

logger
    .css('font-weight: normal; text-decoration: none;', FormatLine.NUMBER)
    .info(3.14); // 3

logger
    .css('font-weight: normal;', FormatLine.FLOAT)
    .info(3.14); // 3.14

logger.warn('global format with style!');

````

![](https://habrastorage.org/webt/tt/mo/ki/ttmokit6fznu6-bce48wqsgmcys.png)

### Example: pretty json

```typescript
import { ClientLogger } from '@splincode/client-logger';
const logger = new ClientLogger();

fetch("http://data.io").then((greatBigJSON) => {

    // default browser print json
    logger.debug("Classic output json", greatBigJSON);
    
    // for pretty json usage logger.log method
    logger.log(...logger.stringify(greatBigJSON));

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

### Example: clipboard

```typescript

import { ClientLogger, LoggerLevel } from '@splincode/client-logger';

const logger = new ClientLogger();
const JsonValue = { a: 1, b: [1, 2, 3] };

logger.group('copy JSON', ({ log, stringify, clipboard }) => {
    log(...stringify(clipboard.copy(JsonValue)));
    log('The object you have on the clipboard ...');
});

````

![](https://habrastorage.org/webt/nq/uo/0z/nquo0zs2_tbvpxkaut4eavh-qeq.gif)

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

## Todo

- [x] Override console
- [x] Logger method (trace, debug, info, warning, error)
- [x] Logger group + groupCollapsible (pipes)
- [x] Logger pretty write object
- [x] Set style by css
- [x] Logger level groups (trace, debug, info, warn, error)
- [x] Clipboard data
- [x] Plugin system architecture (mixins)
- [x] Set global style
- [ ] Added css classes
- [ ] Format output console
- [ ] Dependency Injection for Angular
- [ ] Switch enable/disable default console output
- [ ] Profiling (memory usage, sizeof, time execute)
- [ ] Timers (decorator)
- [ ] Pre process output
- [ ] Cross-browser fixing

## About

Author: [Maxim Ivanov](https://github.com/splincode) <br>

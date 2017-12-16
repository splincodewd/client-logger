# ClientLogger [![Build Status](https://travis-ci.org/splincodewd/client-logger.svg?branch=master)](https://travis-ci.org/splincodewd/client-logger) [![npm version](https://badge.fury.io/js/%40splincode%2Fclient-logger.svg)](https://badge.fury.io/js/%40splincode%2Fclient-logger) [![dependencies Status](https://david-dm.org/splincodewd/client-logger/status.svg)](https://david-dm.org/splincodewd/client-logger) [![Coverage Status](https://coveralls.io/repos/github/splincodewd/client-logger/badge.svg?branch=master)](https://coveralls.io/github/splincodewd/client-logger?branch=master)

> Легковесное и легконастраиваемое логгирование на JavaScript (реализовано на TypeScript)

Перевод:
- [Русский](https://github.com/splincodewd/client-logger/blob/master/README-ru.md)
- [English](https://github.com/splincodewd/client-logger/blob/master/README.md)


## Установка

```bash
npm i @splincode/client-logger --save-dev
```

## Использование

Это достаточно легко использовать в своем браузер. Перед сборкой вам нужно установить пакет и импортировать
его в свой скрипт. Чтобы убедиться как работает логгирование, вы можете [перейти по ссылке](http://requirebin.com/?gist=a4b2a1b162037b736deaf0cbb2e886f8).
Также вы можете запустить примеры самостоятельно на webpack:

```bash
$ git clone https://github.com/splincodewd/client-logger 
$ cd client-logger/examples/
$ npm install
$ npm start # open http://localhost:3000/
```

![](https://habrastorage.org/webt/jf/zn/_9/jfzn_9ir8zkns2gqhp6brzoztws.gif)

### Пример 1: базовые методы, группировка

```typescript
import {logger} from "@splincode/client-logger";

logger.trace("trace is worked", 1, {a: 1});
logger.debug("debug is worked", 2, console);
logger.info("info is worked", 3, Object);
logger.warn("warn is worked", 4, String);
logger.error("error is worked", 5, (2.55).toFixed());
```

* **Уровень по умолчанию: отображать все**

![](https://habrastorage.org/webt/x-/bc/3b/x-bc3bztgftwzvamekuffrxcilq.png)

* **Отображение времени**

![](https://habrastorage.org/webt/1i/lj/rh/1iljrhzeiw_3mvbaji5gcx2adnm.gif)

* **Просмотр трассировки в браузере:**

```typescript
import {logger} from "@splincode/client-logger";

for (let i = 0; i < 20; i++) {
    logger.trace("trace is worked", i);
}
```

![](https://habrastorage.org/webt/un/fl/81/unfl81h_wjnltr184of-vx1skio.gif)

* **Группы:**

```typescript
import {logger} from "@splincode/client-logger";

logger.group("EXAMPLE 2: show stack", () => {
    logger.trace("trace is worked", 1, {a: 1});
    logger.debug("debug is worked", 2, console);
    logger.info("info is worked", 3, Object);
    logger.warn("warn is worked", 4, String);
    logger.error("error is worked", 5, (2.55).toFixed());
});

logger.group("Show trace", () => {
    for (let i = 0; i < 20; i++) {
        logger.trace("trace is worked", i);
    }
});

logger.group("Opened group", () => {
    logger.debug("Level logger:", logger.level);
}, true);

logger.group("Custom prefix group", () => {
    logger.assert(<any>1 === <any>"1", "Type check trusty");
}, true, "[TYPE CHECK]:");
```

![](https://habrastorage.org/webt/jg/ak/st/jgakstdrpkdyh02ml3akfxachcu.png)

### Пример 2: Сборка проекта с флагом (DEV|PROD)

```typescript
import {LoggerLevel} from "@splincode/client-logger/dist/logger.interfaces";
import {logger} from "@splincode/client-logger";

const isProd = process.env.production || true;
logger.level = isProd ? LoggerLevel.INFO : LoggerLevel.ALL;

logger.trace("trace is worked", 1, {a: 1});
logger.debug("debug is worked", 2, console);
logger.info("info is worked", 3, Object);
logger.warn("warn is worked", 4, String);
logger.error("error is worked", 5, (2.55).toFixed());
```

```typescript
import {LoggerLevel} from "@splincode/client-logger/dist/logger.interfaces";
import {ClientLogger} from "@splincode/client-logger";

const isProd = process.env.production || true;

const logger = new ClientLogger({
    logLevel: isProd ? LoggerLevel.INFO : LoggerLevel.ALL
});

logger.trace("trace is worked", 1, {a: 1});
logger.debug("debug is worked", 2, console);
logger.info("info is worked", 3, Object);
logger.warn("warn is worked", 4, String);
logger.error("error is worked", 5, (2.55).toFixed());
```

![](https://habrastorage.org/webt/63/er/en/63erenncr7taxfg8gl7jqmjcjr8.png)

### Пример 3: Дополнительные настройки

```typescript
import {LoggerLevel} from "@splincode/client-logger/dist/logger.interfaces";
import {ClientLogger} from "@splincode/client-logger";
import {MyConsole} from "./MyConsole";

const logger = new ClientLogger({

    // Если мы хотим использовать API консоли
    // мы можем использовать не console,
    // а любой другой объект
    consoleStream: <Console> new MyConsole(),
    
    // Отображать уровень логгирования при инициализации
    showLevel: true,
    
    // Установка цветовой палитры для меток
    colorConfig: {
        [LoggerLevel.TRACE]: "Grey",
        [LoggerLevel.DEBUG]: "Blue",
        [LoggerLevel.INFO]: "Green",
        [LoggerLevel.WARN]: "Orange",
        [LoggerLevel.ERROR]: "Red",
    },
    
    // Custom label
    labelConfig: {
        [LoggerLevel.TRACE]: "trace: ",
        [LoggerLevel.DEBUG]: "debug: ",
        [LoggerLevel.INFO]: "info: ",
        [LoggerLevel.WARN]: "warn: ",
        [LoggerLevel.ERROR]: "error: ",
    }

});

const _info = console.info;
console.info = function () {
    console.log("\n\n\n");
    console.log("before invoke method");
    _info.apply(console, arguments);
    console.log("after invoke method", "\n\n\n");
};

// Пример: переопределения консоли (monkey patching)
// при этом наш логгер в порядке
console.info("monkey patching doesn't break anything ");

logger.trace("trace is worked", 1, {a: 1});
logger.debug("debug is worked", 2, console);
logger.info("info is worked", 3, Object);
logger.warn("warn is worked", 4, String);
logger.error("error is worked", 5, (2.55).toFixed());
```

![](https://habrastorage.org/webt/-5/we/y7/-5wey7fsz_d9bumai6zxn_ujkv8.png)

## Запуск тестов
Все тесты работают на mocha, chai.

```bash
npm test
```

## О проекте

Автор: [Максим Иванов](https://github.com/splincode) <br>

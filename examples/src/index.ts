/******************************************************
 * EXAMPLE 1:
 */

import {logger} from "@splincode/client-logger";

logger.trace("trace is worked", 1, {a: 1});
logger.debug("debug is worked", 2, console);
logger.info("info is worked", 3, Object);
logger.warn("warn is worked", 4, String);
logger.error("error is worked", 5, (2.55).toFixed());

/*

logger.group("Default logger", () => {

    logger.group("EXAMPLE 1: show logger stack", () => {
        logger.trace("trace is worked", 1, {a: 1});
        logger.debug("debug is worked", 2, console);
        logger.info("info is worked", 3, Object);
        logger.warn("warn is worked", 4, String);
        logger.error("error is worked", 5, (2.55).toFixed());
    });

    logger.group("EXAMPLE 2: show trace", () => {
        for (let i = 0; i < 20; i++) {
            logger.trace("trace is worked", i);
        }
    });

    logger.group("EXAMPLE 3: show open group", () => {
        logger.debug("Level logger:", logger.level);
    }, true);

    logger.group("EXAMPLE 4: custom prefix group", () => {
        logger.assert(<any>1 === <any>"1", "Type check trusty");
    }, true, "");

});*/



/******************************************************
 * EXAMPLE 2:
 */

/*

import {LoggerLevel} from "@splincode/client-logger/dist/logger.interfaces";
import {ClientLogger} from "@splincode/client-logger";
import {MyConsole} from "./MyConsole";

const logger = new ClientLogger({

    // Drop-in replacement for console
    // a cross-environment fix for missing methods
    consoleStream: <Console> new MyConsole(),

    // The logging level is displayed in the console
    showLevel: true,

    // Custom color
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

// Example: monkey patching for detect problem in usage own method
const _info = console.info;
console.info = function () {
    console.log("\n\n\n");
    console.log("before invoke method");
    _info.apply(console, arguments);
    console.log("after invoke method", "\n\n\n");
};

console.info("[test monkey patching]");

// Own method
logger.trace("trace is worked", 1, {a: 1});
logger.debug("debug is worked", 2, console);
logger.info("info is worked", 3, Object);
logger.warn("warn is worked", 4, String);
logger.error("error is worked", 5, (2.55).toFixed());

 */

/******************************************************
 * EXAMPLE 3:
 */

/*import {LoggerLevel} from "@splincode/client-logger/dist/logger.interfaces";
import {logger} from "@splincode/client-logger";
declare const process: any;

const isProd = process.env.production || true;
logger.level = isProd ? LoggerLevel.INFO : LoggerLevel.ALL;

logger.trace("trace is worked", 1, {a: 1});
logger.debug("debug is worked", 2, console);
logger.info("info is worked", 3, Object);
logger.warn("warn is worked", 4, String);
logger.error("error is worked", 5, (2.55).toFixed());*/


/******************************************************
 * EXAMPLE 4:
 */

/*
import {LoggerLevel} from "@splincode/client-logger/dist/logger.interfaces";
import {ClientLogger} from "@splincode/client-logger";
declare const process: any;

const isProd = process.env.production || true;

const logger = new ClientLogger({
    logLevel: isProd ? LoggerLevel.INFO : LoggerLevel.ALL
});

logger.trace("trace is worked", 1, {a: 1});
logger.debug("debug is worked", 2, console);
logger.info("info is worked", 3, Object);
logger.warn("warn is worked", 4, String);
logger.error("error is worked", 5, (2.55).toFixed());*/

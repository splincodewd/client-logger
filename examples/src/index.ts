import {MyConsole} from "./MyConsole";
import {ClientLogger, logger, LoggerLevel} from "@splincode/client-logger";

// noinspection TypescriptExplicitMemberType
window["showExample1"] = function showExample1() {

    logger.clear();
    logger.level = LoggerLevel.ALL;

    logger.info("EXAMPLE 1 (you need set level Verbose in console)");
    logger.trace("trace is worked", 1, {a: 1});
    logger.debug("debug is worked", 2, console);
    logger.info("info is worked", 3, Object);
    logger.warn("warn is worked", 4, String);
    logger.error("error is worked", 5, (2.55).toFixed());
};

// noinspection TypescriptExplicitMemberType
window["showExample2"] = function showExample2() {

    logger.clear();
    logger.level = LoggerLevel.ALL;

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
};


// noinspection TypescriptExplicitMemberType
window["showExample3"] = function showExample3() {

    logger.clear();
    logger.level = LoggerLevel.ALL;

    const isProd = process.env.production || true;
    logger.level = isProd ? LoggerLevel.INFO : LoggerLevel.ALL;

    logger.trace("trace is worked", 1, {a: 1});
    logger.debug("debug is worked", 2, console);
    logger.info("info is worked", "current logger level", logger.level);
    logger.warn("warn is worked", 4, String);
    logger.error("error is worked", 5, (2.55).toFixed());
};

// noinspection TypescriptExplicitMemberType
window["showExample4"] = function showExample4() {

    logger.clear();
    logger.level = LoggerLevel.ALL;

    const newLogger = new ClientLogger({

        // Drop-in replacement for console, if needed
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

    const _info = console.info;
    console.info = function () {
        console.log("\n\n\n");
        console.log("before invoke method");
        _info.apply(console, arguments);
        console.log("after invoke method", "\n\n\n");
    };

    console.info("monkey patching doesn't break anything ");

    // Own method
    newLogger.trace("trace is worked", 1, {a: 1});
    newLogger.debug("debug is worked", 2, console);
    newLogger.info("info is worked", 3, Object);
    newLogger.warn("warn is worked", 4, String);
    newLogger.error("error is worked", 5, (2.55).toFixed());

};

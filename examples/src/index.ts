import {ClientLogger} from "@splincode/client-logger";
const logger = new ClientLogger();

logger.trace("trace is worked", 1, {a: 1});
logger.debug("debug is worked", 2, console);
logger.info("info is worked", 3, Object);
logger.warn("warn is worked", 4, String);
logger.error("error is worked", 5, (2.55).toFixed());
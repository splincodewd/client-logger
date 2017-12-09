import {ClientLogger as Logger} from "@splincode/client-logger";
const logger = new Logger();

logger.trace("Yes...");
logger.debug("I'm a debug message!");
logger.info("OMG! Check this window out!", window);
logger.warn("Purple Alert! Purple Alert!");
logger.error("HOLY SHI... no carrier.");
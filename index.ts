import { ClientLogger } from "./src/logger";

export { LoggerLevel, LoggerColors, LoggerConfig, LoggerLabels } from './src/logger.interfaces';
export { ClientLogger } from './src/logger';
export const logger = new ClientLogger();

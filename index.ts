import { ClientLogger } from "./src/logger";

export * from './src/logger.interfaces';
export * from './src/logger';
export const logger = new ClientLogger();

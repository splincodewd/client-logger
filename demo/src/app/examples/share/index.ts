import { environment } from '../../../environments/environment';
import { ClientLogger, LoggerLevel, FormatLine } from '@splincode/client-logger';

function windowLoggerInit(LoggerAPI) {
  const { ClientLogger: Logger } = LoggerAPI;
  window.ClientLogger = Logger;
}

export async function LoggerBootstrapInit() {
  let LoggerAPI;

  if (environment.production || environment.stackblitz) {
    LoggerAPI = { ClientLogger, LoggerLevel, FormatLine };
  } else {
    LoggerAPI = await import('./../../../../../lib/index');
  }

  windowLoggerInit(LoggerAPI);
  return LoggerAPI;
}

declare global {
  interface Window { ClientLogger: ClientLogger; }
}

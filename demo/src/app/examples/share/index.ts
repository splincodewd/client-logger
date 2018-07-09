import { environment } from '../../../environments/environment';
import { ClientLogger, FormatLine, LoggerLevel } from '@splincode/client-logger';

function windowLoggerInit(LoggerAPI) {
  const { ClientLogger: Logger } = LoggerAPI;
  window.ClientLogger = Logger;
}

export async function LoggerBootstrapInit() {
  let LoggerAPI;

  try {
    if (environment.production || environment.stackblitz) {
      LoggerAPI = { ClientLogger, LoggerLevel, FormatLine };
    } else {
      LoggerAPI = await import('./../../../../../lib/index');
    }
  } catch (e) {
    console.error(e);
  }

  windowLoggerInit(LoggerAPI);
  return LoggerAPI;
}

declare global {
  interface Window {
    ClientLogger: ClientLogger;
  }
}

import { environment } from '@env/environment';
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
      const devAPI = await import('./lib.dev');
      LoggerAPI = devAPI.default;
    }
  } catch (e) {
    console.log(e);
  }

  windowLoggerInit(LoggerAPI);
  return LoggerAPI;
}

declare global {
  interface Window {
    ClientLogger: ClientLogger;
  }
}

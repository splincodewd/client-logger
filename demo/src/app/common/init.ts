import { environment } from '../../environments/environment';

function windowLoggerInit(LoggerAPI) {
  const { ClientLogger } = LoggerAPI as any;
  window['ClientLogger'] = ClientLogger;
}

export async function LoggerInit() {
  let LoggerAPI: any;
  if (environment.production || environment.stackblitz) {
    LoggerAPI = await import('./../logger/lib.prod');
  } else {
    LoggerAPI = await import('./../logger/lib.dev');
  }

  windowLoggerInit(LoggerAPI.default);
  return LoggerAPI.default;
}

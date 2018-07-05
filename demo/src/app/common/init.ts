import { environment } from '../../environments/environment';

declare var require: any;

export interface WindowLogger {
  call: object;
}

let LoggerAPI;
if (environment.production) {
  LoggerAPI = require(`../logger/lib.prod`).default;
} else {
  LoggerAPI = require(`../logger/lib.dev`).default;
}

const { ClientLogger } = LoggerAPI as any;

export function windowLoggerInit(): WindowLogger {
  window['ClientLogger'] = ClientLogger;
  return window['testLogger'] = { call: new ClientLogger() };
}

export default LoggerAPI;

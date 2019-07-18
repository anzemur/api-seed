import * as logger from 'winston';
import { LoggerLevels } from './types';
import moment from 'moment';


/* Info level logging. */
const infoLogger = logger.createLogger({
  levels: {
    [LoggerLevels.info]: 0,
  },
  format: logger.format.json(),
  transports: [
    new logger.transports.File({ filename: `logs/${moment().format('MM-DD-YYYY')}-all.log`, level: LoggerLevels.info })
  ]
});

/* Http/access level logging. */
const httpLogger = logger.createLogger({
  levels: {
    [LoggerLevels.http]: 1,
  },
  format: logger.format.json(),
  transports: [
    new logger.transports.File({ filename: `logs/${moment().format('MM-DD-YYYY')}-access.log`, level: LoggerLevels.http }),
  ]
});

/* Error level logging. */
const errorLogger = logger.createLogger({
  levels: {
    [LoggerLevels.error]: 2,
  },
  format: logger.format.json(),
  transports: [
    new logger.transports.File({ filename: `logs/${moment().format('MM-DD-YYYY')}-error.log`, level: LoggerLevels.error }),
  ]
});

/**
 * Default loggers.
 */
export default {
  info: (msg: string, meta: any = {}) => {
    infoLogger.info(msg, meta);
  },
  http: (msg: string, meta: any = {}) => {
    httpLogger.http(msg, meta);
  },
  error: (msg: string, meta: any = {}) => {
    errorLogger.error(msg, meta);
  }
};
